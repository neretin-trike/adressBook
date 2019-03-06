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
  addRow(object) {
    let items = this.state.items;
    items.push(object);
    this.setState({items: items});

    this.props.onAddItem(null);

    let formData = new FormData;
    formData.append("item", object);
    fetch("http://localhost:22080/api/address/add", {method:"POST", body: formData})
      .then( res => res.json() )
      .then(
        (result) => {
          alert(result);
        },
        (error) => {
          alert(error);
        }
      )
  }
  render() {
    const { error, isLoaded, items, newItem } = this.state;
    if (error) {
      return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Загрузка...</div>;
    } else {
      if (this.props.newItem !== null) {
        this.addRow(this.props.newItem);
      }
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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: true,
      item: null,
    };

    this.onModalShow = this.onModalShow.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.onAddItem = this.onAddItem.bind(this);
  }

  onModalClose(){
    this.setState({showModal: false});
  }
  onModalShow(){
    this.setState({showModal: true});
  }
  onAddItem(object){
    this.setState({item: object});
  }

  render() {
    const { showModal, item } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h2>Адресная книга посетителей на ReactJS</h2>
        </header>
        <main className="App-main">
          <article className="Container">
              <section className="Address-List" >
                <AddressList onAddItem={this.onAddItem} newItem={item}/>
              </section>
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
    );
  }
}

export default App;
