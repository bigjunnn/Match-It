import React, { Component } from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation'

import loginScreen from './screens/login'
import registerScreen from './screens/register'
import homeScreen from './screens/home'
import createScreen from './screens/create'
import loadScreen from './screens/loading'
import profileScreen from './screens/profile'
import detailsScreen from './screens/details'

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
    },
    Create: {
      screen: createScreen,
      navigationOptions: () => ({
        headerTitle: "Add Listing",
        headerStyle: {
          backgroundColor: '#fffcfc'
        },
      })
    },
    Profile: {
      screen: profileScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    Details: {
      screen: detailsScreen,
      navigationOptions: () => ({
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
