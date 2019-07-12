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
import { Header, ListItem, Icon } from "react-native-elements"
import firebase from "firebase"

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class Home extends React.Component {
  // Define current state
  state = { listing: [] }

  keyExtractor = (item, index) => index.toString()

  handleSignOut = () => {
    firebase.auth().signOut().then(this.props.navigation.navigate("Login"))
  }

  componentDidMount() {
    this.renderListings()
  }

  renderListings() {
    //get all listings from db in array form
    window = undefined
    firebase.firestore().collection("Listing").get()
      .then(snapshot => {
        var items = []
        snapshot.forEach(doc => {
          items.push(doc.data())
        })
        this.setState({ listings: items})
      })
      .catch(err => {
        console.log('Error getting documents', err)
      })
  }

  render() {
    const user = firebase.auth().currentUser

    return (
      <View>
        <Header
          leftComponent={
            <Icon
              name="sc-telegram"
              type="evilicon"
              onPress={this.handleSignOut}
            />
          }
          centerComponent={{
            text: "Matchit",
            style: { fontSize: 30, fontFamily: "Lobster-Regular" }
          }}
          rightComponent={
            <Icon
              name="bookmark"
              onPress={() => this.props.navigation.navigate("Bookmark")}
            />
          }
          backgroundColor="#f7ccc3"
        />

        <ScrollView>
          <View style={styles.container}>
            <Text>
              Hi {user && user.email}!
            </Text>
            <Title>View All Listing</Title>

            <FlatList
              style={styles.fl}
              data={this.state.listings}
              keyExtractor={this.keyExtractor}
              renderItem={({ item }) =>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("Details", {
                      ref: item.id
                    })}
                >
                  <ListItem
                    leftAvatar={{
                      size: "large",
                      rounded: false,
                      source: { uri: item.photo[0] }
                    }}
                    title={item.title}
                    subtitle={`From SGD ${item.package[0].price} / ${item.package[0].price_type}`}
                    style={{ width: width * 0.9 }}
                  />
                </TouchableOpacity>}
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
