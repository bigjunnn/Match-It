import React from "react"
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  RefreshControl
} from "react-native"
import { Title } from "native-base"
import { Header, ListItem, Icon } from "react-native-elements"
import firebase from "firebase"
import { withNavigation } from "react-navigation"

var listingsub = ""
var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
class Home extends React.Component {
  // Define current state
  state = { 
    listing: [],
    refreshing: false 
  }

  keyExtractor = (item, index) => index.toString()

  handleSignOut = () => {
    firebase.auth().signOut().then(this.props.navigation.navigate("Login"))
  }

  componentDidMount() {
    const { navigation } = this.props
    this.focusListener = navigation.addListener("didFocus", () => this.renderListings())
  }

  componentWillUnmount() {
    this.focusListener.remove()
    listingsub()
  }

  renderListings() {
    //get all listings from db in array form
    window = undefined
    listingsub = firebase.firestore().collection("Listing").get()
      .then(snapshot => {
        var items = []
        snapshot.forEach(doc => {
          items.push(doc.data())
        })
        this.setState({ listings: items})
        this.setState({ refreshing: false }) // refresh completed
      }, err => {
        console.log('Error getting documents', err)
      })
  }

  onRefresh = () => {
    this.setState({refreshing: true})
    this.renderListings()
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

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
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
                </TouchableOpacity>
              }
            />
          </View>
        </ScrollView>
      </View>
    )
  }
}
export default withNavigation(Home)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
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
