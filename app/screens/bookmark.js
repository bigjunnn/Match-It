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
  state = { bookmarks: [] }

  componentDidMount() {
    let user = firebase.auth().currentUser
    let bookmark_ref = firebase.database().ref("Bookmarks").child(user.uid)

    // get user's bookmarks from firebase db in array form
    bookmark_ref.once("value").then(snapshot => {
      var items = []
      snapshot.forEach(child => {
        items.push({
          key: child.val().itemid,
          itemname: child.val().itemname,
          itempic: child.val().itempic,
          request_id: child.val().request_id,
          request_name: child.val().request_name,
          servicer_id: child.val().servicer_id,
          servicer_name: child.val().servicer_name,
          createdAt: child.val().createdAt,
          price: child.val().price,
          price_type: child.val().price_type
        })
      })
      this.setState({ bookmarks: items })
    })
  }

  render() {
    const user = firebase.auth().currentUser

    return (
      <View>
        <Header
          centerComponent={{
            text: "Bookmarks",
            style: { fontSize: 30, fontFamily: "Lobster-Regular" }
          }}
          // rightComponent={<Icon name='search' />}
          backgroundColor="#f7ccc3"
        />

        <ScrollView>
          <View style={styles.container}>
            <FlatList
              style={styles.fl}
              data={this.state.bookmarks}
              keyExtractor={this.keyExtractor}
              renderItem={({ item }) =>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("Details", {
                      ref: item.key
                    })}
                >
                  <ListItem
                    leftAvatar={{
                      size: "large",
                      rounded: false,
                      source: { uri: item.itempic }
                    }}
                    title={item.itemname}
                    subtitle={`SGD ${item.price} / ${item.price_type}`}
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
