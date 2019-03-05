import React, { Component } from 'react';
import * as ReactDOM from "react-dom";
// import logo from './logo.svg';
import './App.css';

class AddressItem extends Component {
  render() {
    const item = this.props.item;
    return (
      <tr className="Address-Item">
          <td>{item.index}</td>
          <td>{item.name}</td>
          <td>{item.surname}</td>
          <td>{item.middlename}</td>
          <td>{item.address}</td>
          <td>{item.phone}</td>
      </tr>
    )
  }
}

class AddressList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }
  componentDidMount() {
    fetch("http://localhost:22080/api/address/addresses", {method:"GET"})
      .then( res => res.json() )
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Загрузка...</div>;
    } else {
      return (
        <table className="Address-Table" >
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Отчество</th>
              <th>Адрес</th>
              <th>Номер</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <AddressItem key={item.index} item={item} />
            ))}
          </tbody>
        </table>
      );
    }
  }
}

class AddItemButton extends Component {
  render() {
    return (
      <button className="Add-Item Button" >{this.props.name}</button>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Адресная книга посетителей</h2>
        </header>
        <main className="App-main">
          <article className="Container">
            <section className="Address-List" >
                <AddressList />
              </section>
              <nav className="Item-nav">
                <AddItemButton name="Добавить"/>
              </nav>
          </article>
        </main>
      </div>
    );
  }
}

export default App;
