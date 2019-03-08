import React, { Component } from 'react';
import './App.css';
import * as ReactRouterDOM from "react-router-dom";

const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;

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
  render() {
      const filterText = this.props.filterText;
      const items = this.props.items;

      return (
        <section className="Address-List" >
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
              {items.map(item => {
                if (item.name.indexOf(filterText) === -1) {
                  return;
                }
                return <AddressItem key={item.index} item={item} />
              }
              )}
            </tbody>
          </table>
        </section>
      );
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
    this.onAddItem = this.onAddItem.bind(this);

    this.state = {
      index: Math.round(Math.random()*(1000-1)+1),
      name: "1",
      surname: "2",
      middlename: "3",
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
  onAddItem(e) {
    this.props.onAddItem(this.state);
    this.props.onModalClose();
    e.preventDefault();
  }
  render() {
    return (
      <section className="Modal-Window">
        <h3>Добавить новую запись</h3>
        <form>
          <label>Имя<input name="name" value={this.state.name} onChange={this.onInputChange}/></label>
          <label>Фамилия<input name="surname" value={this.state.surname} onChange={this.onInputChange}/></label>
          <label>Отчество<input name="middlename" value={this.state.middlename} onChange={this.onInputChange}/></label>
          <label>Адрес<input name="address" value={this.state.address} onChange={this.onInputChange}/></label>
          <label>Номер<input name="phone" value={this.state.phone} onChange={this.onInputChange}/></label>
          <nav className="ModalBtn-nav">
            <input className="Button" type="button" onClick={this.onClickHandle} value="Закрыть"/>
            <input className="Button" type="submit" onClick={this.onAddItem} value="Добавить"/>
          </nav>
        </form>
      </section>
    )
  }
}

class AppSearch extends Component {
  constructor(props) {
    super(props);

    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
  }

  handleFilterTextChange(e) {
    this.props.onFilterTextChange(e.target.value);
  }

  render() {
    return (
      <form className="Address-search">
        <input type="search" value={this.props.filterText} onChange={this.handleFilterTextChange} ></input>
      </form>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,

      error: null,
      isLoaded: false,
      items: [],

      filterText: ""
    };

    this.onModalShow = this.onModalShow.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.onAddItem = this.onAddItem.bind(this);
    this.onFilterTextChange = this.onFilterTextChange.bind(this);
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

  onModalClose(){
    this.setState({showModal: false});
  }
  onModalShow(){
    this.setState({showModal: true});
  }
  onAddItem(object){
    let formData = new FormData;
    formData.append("Index", object.index);
    formData.append("Name", object.name);
    formData.append("Surname", object.surname);
    formData.append("Middlename", object.middlename);
    formData.append("Address", object.address);
    formData.append("Phone", object.phone);

    fetch("http://localhost:22080/api/address/add", {method:"POST", body: formData})
      .then( res => res.json() )
      .then(
        (result) => {
          let items = this.state.items;
          items.push(object);
          this.setState({items: items});
        },
        (error) => {
          alert(error);
        }
      )
  }
  onFilterTextChange(filterText) {
    this.setState({
      filterText: filterText
    });
  }

  render() {
    const { showModal, filterText, error, isLoaded, items } = this.state;
    if (error) {
      return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Загрузка...</div>;
    } else {
      return (
      <div className="App">
        <header className="App-header">
          <h2>Адресная книга посетителей на ReactJS</h2>
        </header>
        <main className="App-main">
          <article className="Container">
              <h3>Поиск посетителей</h3>
              <AppSearch filterText={filterText} onFilterTextChange={this.onFilterTextChange}/>
              <h3>Таблица посетителей</h3>
              <AddressList items={items} filterText={filterText} />
              <nav className="Item-nav">
                <AddItemButton onModalShow={this.onModalShow} showModal={showModal} name="Добавить запись"/>
              </nav>
          </article>
        </main>
        {showModal &&
          <ModalDialog>
            <ModalWindow onAddItem={this.onAddItem} onModalClose={this.onModalClose} />
          </ModalDialog>}
      </div>
      )
    }
  }
}

export default App;
