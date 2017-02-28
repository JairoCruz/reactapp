import React, { Component } from 'react';
import firebase from 'firebase';
import FileUpload from './FileUpload';
import './App.css';

class App extends Component {

  constructor () {
    super();
    this.state = {
      user: null,
      uploadValue: 0,
      pictures: []
    }

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.renderLoginButton = this.renderLoginButton.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  // Metodo nuevo en EMACScript 2016 buscar informacion sobre el.
  componentWillMount () {
    firebase.auth().onAuthStateChanged(user => {
      // esto tambien se puede escribir this.setState( { user: user } )
      this.setState({ user });
    });

    firebase.database().ref('pictures').on('child_added', snapshot =>{
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      });
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


  handleUpload (event) {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/fotos/${file.name}`);
    const task = storageRef.put(file);

    task.on('state_changed', snapshot => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({
        uploadValue: percentage
      })
    }, error => {
      console.log(error.message)
    }, () => {
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL
      };

      const dbRef = firebase.database().ref('pictures');
      const newPicture = dbRef.push();
      newPicture.set(record);
    });
  }

  renderLoginButton () {
    // si el usuario esta logueado
    if (this.state.user) {
      return (
        <div>
          <img width="100" src={this.state.user.photoURL} alt={this.state.user.displayName} />
          <p>Hola {this.state.user.displayName}! </p>
          <button onClick={this.handleLogout}>Salir</button>
          <br/>
          <progress value={this.state.uploadValue} max="100"></progress>
          <FileUpload onUpload={this.handleUpload} />

          {
            this.state.pictures.map(picture => (
                <div>
                  <img src={picture.image} alt="" />
                  <br/>
                  <img width="48" src={picture.photoURL} alt={picture.displayName} />
                  <br/>
                  <span>{picture.displayName}</span>
                </div>
              )).reverse()
          }
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
        <div className="App-intro">
          { this.renderLoginButton() }
        </div>
      </div>
    );
  }
}

export default App;
