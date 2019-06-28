import React from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  ScrollView
} from 'react-native';
import { Card, Header, Button } from "react-native-elements";
import firebase from "firebase"

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class Rating extends React.Component {
    state = { 
        user: firebase.auth().currentUser, 
        item_key: this.props.navigation.state.params.ref //item id
    }

    render() {
    return (
    <View>
    <Header 
    centerComponent={{text: 'Rate Service', style:{ fontSize: 20, fontWeight: 'bold'}}}
    backgroundColor='white'
    />
    <ScrollView>


    </ScrollView>  
    </View> 
    )}
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    tabbar: { 
      justifyContent: 'center', 
      alignSelf: 'center',
      width: width * 0.9,
      marginTop: 10 
    }
  })