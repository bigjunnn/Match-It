import React, { Component } from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation'

import loginScreen from './screens/Login'
import registerScreen from './screens/Register'
import homeScreen from './screens/Home'
import loadScreen from './screens/Loading'

const AppStackNavigator = createStackNavigator(
  {
    Login: {
      screen: loginScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    Register: {
      screen: registerScreen,
      navigationOptions: () => ({
        headerStyle: {
          backgroundColor: '#fff6f5'
        }
      })
    },
    Home: {
      screen: homeScreen,
      navigationOptions: () => ({
        headerStyle: {
          backgroundColor: '#fffcfc'
        },
        header: null
      })
    }
  },
  {
    initialRouteName: 'Login'
  }
)

const app = createAppContainer(AppStackNavigator)
export default app
