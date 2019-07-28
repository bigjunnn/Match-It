import React, { Component } from 'react'
import { YellowBox } from 'react-native'
import Setup from './app/setup'
import firebase from 'firebase'
var algoliasearch = require('algoliasearch/reactnative');

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

var algolia = algoliasearch('8KZO6PN2AS', '895e84f4ba2a65f489107006009abc4f');
const index = algolia.initIndex('Listing')

export default class App extends Component {
  constructor () {
    super()
    YellowBox.ignoreWarnings(['Setting a timer'])
  }
  render () {
    return <Setup />
  }
}

