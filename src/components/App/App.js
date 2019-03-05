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

class ModalDialog extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {children} = this.props;
    console.dir(children);

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
            <section className="Modal-Window">
              <h3>Добавить новую запись</h3>
              <form>
                <label>Имя<input/></label>
                <label>Фамилия<input/></label>
                <label>Отчество<input/></label>
                <label>Адрес<input/></label>
                <label>Номер<input/></label>
                <nav className="ModalBtn-nav">
                  <input className="Button" type="button" onClick={this.onModalClose} value="Закрыть"/>
                  <input className="Button" type="submit" value="Добавить"/>
                </nav>
              </form>
            </section>
          </ModalDialog>}
      </div>
    );
  }
}

export default App;
