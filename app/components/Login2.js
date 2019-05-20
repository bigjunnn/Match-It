import React, { Component } from 'react'
import { Avatar, Text } from 'react-native-elements'
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity
} from 'react-native'

export default class Login2 extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Avatar
            containerStyle={{
              height: 100,
              width: 100,
              marginTop: 50,
              marginLeft: 25,
              backgroundColor: 'blue'
            }}
            source={require('/Users/junwe/MatchIt/app/images/logo.png')}
            showEditButton
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff176'
  },

  infoContainer: {
    height: '30%',
    backgroundColor: 'red'
  },

  profilepic: {
    height: 100,
    width: 100,
    translateY: 50,
    translateX: 30,
    borderRadius: 50,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    borderStyle: 'solid'
  },

  centered: {
    paddingVertical: 40,
    textAlign: 'center'
  }
})
