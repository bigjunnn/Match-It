import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import firebase from 'firebase'

export default class Loading extends React.Component {
  // Checking if user is authenticated
  componentDidMount () {
    firebase.auth().onAuthStateChanged(user => {
      user
        ? this.props.navigation.navigate('Home')
        : this.props.navigation.navigate('Register')
    })
  }
  render () {
    return (
      <View style={styles.container}>
        <Text
          style={{
            color: '#e93766',
            fontFamily: 'Lobster-Regular',
            fontSize: 40
          }}
        >
          Loading
        </Text>

        <ActivityIndicator color='#e93766' size='large' />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
