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
      items: [],
    };
  }
  componentDidMount() {
    fetch("http://localhost:22080/api/address/addresses", {method:"GET"})
      .then( res => res.json() )
      .then(
        (result) => {
          console.dir(result[0]);
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
  addRow() {
    let items = this.state.items;
    items.push();
    this.setState({items: items});
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

class ModalDialog extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {children} = this.props;
    return (
      <div className="Modal-Overlay">
        {children}
      </div>
      )
  }

}

class AddItemButton extends Component {
  constructor(props) {
    super(props);

    this.onClickHandle = this.onClickHandle.bind(this);
  }

  onClickHandle(e) {
    this.props.onModalShow();
  }

  render() {
    return (
      <button onClick={this.onClickHandle} className="Add-Item Button" >{this.props.name}</button>
    )
  }
}

class ModalWindow extends Component {
  constructor(props) {
    super(props);
    this.onClickHandle = this.onClickHandle.bind(this);
    this.onInputChange = this.onInputChange.bind(this);

    this.state = {
      firstName: "1",
      lastName: "2",
      patronymicName: "3",
      address: "4",
      phone: "5"
    }
  }
  onInputChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }
  onClickHandle(e) {
    this.props.onModalClose();
  }
  render() {
    return (
      <section className="Modal-Window">
        <h3>Добавить новую запись</h3>
        <form>
          <label>Имя<input name="firstName" value={this.state.firstName} onChange={this.onInputChange}/></label>
          <label>Фамилия<input name="lastName" value={this.state.lastName} onChange={this.onInputChange}/></label>
          <label>Отчество<input name="patronymicName" value={this.state.patronymicName} onChange={this.onInputChange}/></label>
          <label>Адрес<input name="address" value={this.state.address} onChange={this.onInputChange}/></label>
          <label>Номер<input name="phone" value={this.state.phone} onChange={this.onInputChange}/></label>
          <nav className="ModalBtn-nav">
            <input className="Button" type="button" onClick={this.onClickHandle} value="Закрыть"/>
            <input className="Button" type="submit" value="Добавить"/>
          </nav>
        </form>
      </section>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: true,
    };

    this.onModalShow = this.onModalShow.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
  }

  onModalClose(){
    this.setState({showModal: false});
  }
  onModalShow(){
    this.setState({showModal: true});
  }
  
  render() {
    const { showModal } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h2>Адресная книга посетителей на ReactJS</h2>
        </header>
        <main className="App-main">
          <article className="Container">
              <section className="Address-List" >
                <AddressList />
              </section>
              <nav className="Item-nav">
                <AddItemButton onModalShow={this.onModalShow} showModal={showModal} name="Добавить запись"/>
              </nav>
          </article>
        </main>
        {showModal &&
          <ModalDialog>
            <ModalWindow onModalClose={this.onModalClose} />
          </ModalDialog>}
      </div>
    );
  }
}

export default App;
