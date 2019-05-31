import React, {Component} from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';

import loginScreen from './screens/login';
import registerScreen from './screens/register';
import homeScreen from './screens/home';
import searchScreen from './screens/search';

const AppStackNavigator = createStackNavigator ({
  Login: {
    screen: loginScreen,
    navigationOptions: () => ({
      header: null
    }),
  },
  Register: {
    screen: registerScreen,
    navigationOptions: () => ({
      headerStyle: {
        backgroundColor: '#fff6f5',
      },
    })
  },
  Home: {
    screen: homeScreen,
    navigationOptions: () => ({
      headerStyle: {
        backgroundColor: '#fffcfc',
      },
      header: null
    }),
  },
  Search: {
    screen: searchScreen,
    navigationOptions: () => ({
      header: null
    })
  }
},
  {
    initialRouteName: 'Login'
  }
)

const app = createAppContainer(AppStackNavigator);
export default app;