import React from "react"
import { 
  StyleSheet,  
  Text, 
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView 
} from "react-native"
import { Title } from "native-base"
import { Header, ListItem, Icon } from "react-native-elements";
import firebase from "firebase"

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class Home extends React.Component {
  // Define current state
  state = { listing:[] }

  handleSignOut = () => {
    firebase.auth().signOut().then(this.props.navigation.navigate("Login"))
  }

  componentDidMount() {
    let listing_ref = firebase.database().ref('Listing')

    // get user's listings from firebase db in array form
    listing_ref.once('value').then(snapshot => {
         var items = []
         snapshot.forEach((child) => {
           items.push({
            key: child.key,
            title: child.val().title,
            price: child.val().price,
            price_type: child.val().price_type,
            photo: child.val().photo
           })
        })
        this.setState({ listings: items})
    })
  }

  render() {
    const user = firebase.auth().currentUser

    return (
      <View>
      <Header 
      leftComponent={<Icon name='sc-telegram' type='evilicon' onPress={this.handleSignOut}/>}
      centerComponent={{text: 'Matchit', style:{ fontSize: 30, fontFamily: "Lobster-Regular"}}}
      // rightComponent={<Icon name='search' />}
      backgroundColor='#f7ccc3'
      />

      <ScrollView>
      <View style={styles.container}>
        <Text>
          Hi {user && user.email}!
        </Text>
        <Title>View All Listing</Title>
      
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
      </ScrollView>

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
    marginTop: 20,
    paddingTop: 10,
    marginLeft: 90,
    marginRight: 90
  }
})
