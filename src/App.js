import React, { Component } from 'react';
import firebase from 'firebase';
import FileUpload from './FileUpload';
import './App.css';

class App extends Component {

  constructor () {
    super();
    this.state = {
      user: null
    }

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.renderLoginButton = this.renderLoginButton.bind(this);
  }

  // Metodo nuevo en EMACScript 2016 buscar informacion sobre el.
  componentWillMount () {
    firebase.auth().onAuthStateChanged(user => {
      // esto tambien se puede escribir this.setState( { user: user } )
      this.setState({ user });
    });
  }

  handleAuth () {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado session`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleLogout () {
    firebase.auth().signOut()
      .then(result => console.log(`${result.user.email} ha salido`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  renderLoginButton () {
    // si el usuario esta logueado
    if (this.state.user) {
      return (
        <div>
          <img width="100" src={this.state.user.photoURL} alt={this.state.user.displayName} />
          <p>Hola {this.state.user.displayName}! </p>
          <button onClick={this.handleLogout}>Salir</button>
          <FileUpload />
        </div>
        );
    } else { 
      // si no lo esta
      return (
        <button onClick={this.handleAuth}>Login con Google</button>
        );
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to PsGram</h2>
        </div>
        <p className="App-intro">
          { this.renderLoginButton() }
        </p>
      </div>
    );
  }
}

export default App;
