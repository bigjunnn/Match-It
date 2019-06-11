import React, { Component } from 'react'
import Setup from './app/Setup'
import firebase from 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyCeTPvZQ26zTVRfeuKdOR42X354WpGjDpQ',
  authDomain: 'matchit-nus2019.firebaseapp.com',
  databaseURL: 'https://matchit-nus2019.firebaseio.com',
  projectId: 'matchit-nus2019',
  storageBucket: 'matchit-nus2019.appspot.com',
  messagingSenderId: '305054251069',
  appId: '1:305054251069:web:a1fd702d886323ea'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default class App extends Component {
  render () {
    return <Setup />
  }
}
