import React, { Component } from 'react'
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator
} from 'react-navigation'
import { Icon } from 'react-native-elements'

import loginScreen from './screens/login'
import registerScreen from './screens/register'
import homeScreen from './screens/home'
import createScreen from './screens/create'
import loadScreen from './screens/loading'
import profileScreen from './screens/profile'
import detailsScreen from './screens/details'
import updateScreen from './screens/updateprofile'
import chatScreen from './screens/chat'
import inboxScreen from './screens/inbox'
import servicerScreen from './screens/svc_profile'
import reviewScreen from './screens/review'
import bookmarkScreen from './screens/bookmark'
import skillScreen from './screens/skills'
import adminScreen from './screens/admin'
import searchScreen from './screens/search'
import categoryScreen from './screens/category'
import listScreen from './screens/list'
import skillDetailsScreen from './screens/skill_details'
import reviewListScreen from './screens/review_list'

const BottomTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: homeScreen,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) =>
          <Icon name='home' color={tintColor} size={18} />
      }
    },
    Create: {
      screen: createScreen,
      navigationOptions: {
        tabBarLabel: 'Create',
        tabBarIcon: ({ tintColor }) =>
          <Icon name='form' type='antdesign' color={tintColor} size={18} />
      }
    },
    Inbox: {
      screen: inboxScreen,
      navigationOptions: {
        tabBarLabel: 'Inbox',
        tabBarIcon: ({ tintColor }) =>
          <Icon name='mail' color={tintColor} size={18} />
      }
    },
    Profile: {
      screen: profileScreen,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor }) =>
          <Icon name='idcard' type='antdesign' color={tintColor} size={18} />
      }
    }
  },
  {
    tabBarOptions: {
      activeTintColor: 'red',
      inactiveTintColor: 'grey',
      style: {
        backgroundColor: 'white',
        borderTopWidth: 0,
        shadowOffset: { width: 5, height: 3 },
        shadowColor: 'black',
        shadowOpacity: 0.5,
        elevation: 5
      },
      labelStyle: {
        fontSize: 15
      }
    }
  }
)

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
    Details: {
      screen: detailsScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    Update: {
      screen: updateScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    Chat: {
      screen: chatScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    Home: {
      screen: BottomTabNavigator,
      navigationOptions: () => ({
        header: null
      })
    },
    Bookmark: {
      screen: bookmarkScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    ServicerProfile: {
      screen: servicerScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    Skill: {
      screen: skillScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    Admin: {
      screen: adminScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    Review: {
      screen: reviewScreen,
      navigationOptions: () => ({
        title: 'Rate Service',
        headerStyle: {
          backgroundColor: 'white'
        }
      })
    },
    Search: {
      screen: searchScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    Category: {
      screen: categoryScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    List: {
      screen: listScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    SkillDetails: {
      screen: skillDetailsScreen,
      navigationOptions: () => ({
        header: null
      })
    },
    ReviewList: {
      screen: reviewListScreen,
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
