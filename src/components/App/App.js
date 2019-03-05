import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

class AddressItem extends Component {
  render() {
    const item = this.props.item;
    return (
      <tr>
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
        <table className="Address-List" >
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

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Адресная книга посетителей</h2>
        </header>
        <main className="App-main">
          <AddressList />
        </main>
      </div>
    );
  }
}

export default App;
