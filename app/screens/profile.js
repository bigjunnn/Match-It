import React from "react"
import { 
    StyleSheet, 
    Image, 
    Text, 
    View, 
    FlatList, 
    TouchableOpacity ,
    Dimensions
} from "react-native"
import { Button, Left, Right } from "native-base"
import { List, ListItem, SearchBar } from "react-native-elements";
import firebase from "firebase"

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class Profile extends React.Component {
    state = { user: '', listings: [] }
    
    keyExtractor = (item, index) => index.toString()

    componentDidMount() {
    let user = firebase.auth().currentUser
    let listing_ref = firebase.database().ref('Listing')
    let user_ref = firebase.database().ref('Users').child(user.uid)

    // get user's basic info from firebase db in array form
    user_ref.once('value').then(snapshot => {
        var items = {
            userid: snapshot.child('userid').val(),
            username: snapshot.child('username').val(),
            createdAt: snapshot.child('createdAt').val()
        }
        this.setState({ user: items})
    })

    // get user's listings from firebase db in array form
    var query = listing_ref.orderByChild("userid").equalTo(user.uid)
    query.once('value').then(snapshot => {
         var items = []
         snapshot.forEach((child) => {
           items.push({
            key: child.key,
            title: child.val().title,
            price: child.val().price,
            price_type: child.val().price_type,
            photo: child.val().photo
           })

           /** 
           let image_ref = firebase.storage().ref(user.uid + '/Listing')
           image_ref.child(child.key).getDownloadURL().then((url) => {
            items.push({ photo: url })
           })
           */
        })
        this.setState({ listings: items})
    })

    }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ marginTop: 50, fontSize: 30 }}>Hi {this.state.user.username} !!!</Text>
        
        <FlatList
        style={styles.fl}
        data={ this.state.listings }
        keyExtractor={this.keyExtractor}
        renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("Details", {ref: item.key})}>
            <ListItem
              leftAvatar={{ size:'large' , rounded: false, source: { uri: item.photo } }}
              title={item.title}
              subtitle={`${item.price} / ${item.price_type}`}
              style = {{width: width * 0.9}}
            />
            </TouchableOpacity>
        )} 
        />

      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  submit: {
    opacity: 0.8,
    marginTop: 120,
    paddingTop: 10,
    marginLeft: 90,
    marginRight: 90
  },
  fl: {
    marginTop: 30
  }
})
