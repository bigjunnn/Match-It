/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { Input } from 'react-native-elements'
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { SocialIcon } from 'react-native-elements'

import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity
} from 'react-native'

export default class Login extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <Image
            source={require('/Users/junwe/MatchIt/app/images/logo.png')}
            style={{ width: 100, height: 100 }}
          />

          <Text style={styles.header}>MatchIt!</Text>
        </View>

        <View style={styles.login}>
          <Input
            inputContainerStyle={{
              height: 40,
              width: 300,
              borderRadius: 25,
              marginTop: 15,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10
            }}
            placeholder='Username'
            leftIcon={{ type: 'font-awesome', name: 'user' }}
          />

          <Input
            inputContainerStyle={{
              height: 40,
              width: 300,
              borderRadius: 25,
              marginTop: 15,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10
            }}
            placeholder='Password'
            leftIcon={{ type: 'font-awesome', name: 'unlock-alt' }}
          />
        </View>

        <View style={styles.facebookLogin}>
          <SocialIcon
            style={{
              height: 40,
              width: 300,
              borderRadius: 25,
              marginTop: 15,
              alignSelf: 'center'
            }}
            title='Sign in with FaceBook'
            button
            type='facebook'
          />
        </View>

        <View style={styles.signup}>
          <Button
            buttonStyle={{
              width: 140,
              height: 40,
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            title='Login'
            type='outline'
            raised
          />

          <Button
            buttonStyle={{
              width: 140,
              height: 40,
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            title='Sign Up'
            type='outline'
            raised
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff176',
    flex: 1
  },

  top: {
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center'
  },

  header: {
    fontSize: 48,
    fontFamily: 'lobster'
  },

  login: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignSelf: 'center'
  },

  facebookLogin: {
    height: '10%'
  },

  signup: {
    height: '5%',
    marginLeft: 30,
    marginRight: 30,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
})
