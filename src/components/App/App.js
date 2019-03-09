import React, { Component } from 'react';
import './App.css';
import * as ReactRouterDOM from "react-router-dom";

const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;
const Link = ReactRouterDOM.Link;
const Redirect = ReactRouterDOM.Redirect;

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

class AddressItem extends Component {
  render() {
    const item = this.props.item;
    return (
        <tr className="Address-Item">
            <td><Link to={"/address/"+item.index}>{item.index}</Link></td>
            <td>{item.name}</td>
            <td>{item.surname}</td>
            <td>{item.middlename}</td>
            {/* <td>{item.address}</td>
            <td>{item.phone}</td> */}
        </tr>
    )
  }
}

class AddressList extends Component {
  render() {
      const {filterText, items, onFilterTextChange, onModalShow } = this.props;
      return (
        <section>
          <h3>Поиск посетителей</h3>
          <AppSearch filterText={filterText} onFilterTextChange={onFilterTextChange}/>
          <h3>Таблица посетителей</h3>
          <div className="Address-List" >
            <table className="Address-Table" >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя</th>
                  <th>Фамилия</th>
                  <th>Отчество</th>
                  {/* <th>Адрес</th>
                  <th>Номер</th> */}
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
          </div>
          <nav className="Item-nav">
            <AddItemButton onModalShow={onModalShow} name="Добавить"/>
          </nav>
        </section>
      );
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

class DeleteItemButton extends Component {
  constructor(props) {
    super(props);
    this.onClickHandle = this.onClickHandle.bind(this);

    this.state = {isDelete: false};
  }
  onClickHandle(e) {
    const index = this.props.index;
    this.props.onDeleteItem(index);
    this.setState( {isDelete: true});
  }
  render() {
    const isDelete = this.state.isDelete;

    if (isDelete) {
      return (
        <Redirect to="/address/" />
      )
    } else {
      return (
        <button onClick={this.onClickHandle} className="Add-Item Button" >{this.props.name}</button>
      )
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


class AddressItemCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    };
  }
  componentDidMount() {
    const index = this.props.match.params.index;
    fetch("http://localhost:22080/api/address/info?addressIndex="+index, {method:"GET"})
      .then( res => res.json() )
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            item: result
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
    const { error, isLoaded, item} = this.state;
    const {onModalShow, onDeleteItem} = this.props;
    const index = this.props.match.params.index;

    if (error) {
      return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Загрузка...</div>;
    } else {
      return (
        <section>
          <h3>Карточка посетителя</h3>
          <div className="App-AdreesItemCard">
            <article className="field">
                <header className="caption">Индекс</header>
                <p className="content">{item.index}</p> 
              </article>
              <article className="field">
                <header className="caption">Имя</header>
                <p className="content">{item.name}</p> 
              </article>
              <article className="field">
                <header className="caption">Фамилия</header>
                <p className="content">{item.surname}</p> 
              </article>
              <article className="field">
                <header className="caption">Отчество</header>
                <p className="content">{item.middlename}</p> 
              </article>
              <article className="field">
                <header className="caption">Адрес</header>
                <p className="content">{item.address}</p> 
              </article>
              <article className="field">
                <header className="caption">Телефон</header>
                <p className="content">{item.phone}</p> 
              </article>
          </div>
          <nav className="Item-nav">
            <Link className="Button" to={"/address/"}>Назад</Link>
            <DeleteItemButton index={index} onDeleteItem={onDeleteItem} name="Удалить"/>
            <AddItemButton  onModalShow={onModalShow} name="Редактировать"/>
          </nav>
        </section>
      )
    }
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
    this.onDeleteItem = this.onDeleteItem.bind(this);
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
  onDeleteItem(index) {
    // alert(index);
    fetch("http://localhost:22080/api/address/remove?index="+index, {method:"GET"})
      .then(
        (result) => {
          let items = this.state.items;
          let itemsArr = items.map( e => e.index);
          let indexFound = itemsArr.indexOf(+index);
          items.splice(indexFound, 1);
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
              <Router>
                <Switch>
                  <Route exact path="/address" render={()=> <AddressList items={items} onModalShow={this.onModalShow} onFilterTextChange={this.onFilterTextChange} filterText={filterText} /> } /> 
                  <Route exact path="/address/:index(\d+)" render={(props) => <AddressItemCard {...props} onDeleteItem={this.onDeleteItem} onModalShow={this.onModalShow}/>} />
                  <Route children={()=><h3>Адрес не найден</h3>} />
                </Switch>
              </Router>
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
