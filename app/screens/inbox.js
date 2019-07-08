import React from "react"
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  Dimensions
} from "react-native"
import {
  Header,
  ListItem,
  ButtonGroup,
  Icon,
  Button
} from "react-native-elements"
import firebase from "firebase"
import {
  TouchableOpacity,
  TouchableHighlight
} from "react-native-gesture-handler"

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class ChatLog extends React.Component {
  constructor() {
    super()
    this.state = {
      pending: [],
      bookings: [],
      selectedIndex: 0
    }
    this.updateIndex = this.updateIndex.bind(this)
  }

  keyExtractor = (item, index) => index.toString()

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex })
  }

  renderSection() {
    if (this.state.selectedIndex == 0) {
      //Bookings
      return (
        <FlatList
          data={this.state.bookings}
          keyExtractor={this.keyExtractor}
          renderItem={({ item }) =>
            <ListItem
              style={{ width: width * 0.9 }}
              leftAvatar={{
                size: "medium",
                rounded: false,
                source: { uri: item.itempic }
              }}
              title={`${item.itemname}`}
              subtitle={`Servicer: ${item.servicer_name}`}
              rightElement={
                <View style={{ flexDirection: "row", width: width * 0.18 }}>
                  {/* <Icon //PM servicer
	                    name="message"
	                    size={30}
	                    containerStyle={{ padding: 8 }}
	                    onPress={() =>
	                      this.props.navigation.navigate("Chat", {
	                        ref: item.servicer_id,
	                        ref_name: item.servicer_name
	                      })}
	                  /> */}

                  <Button
                    title="Rate"
                    type="outline"
                    onPress={() =>
                      this.props.navigation.navigate("Review", {
                        ref: item.itemid,
                        servicer_id: item.servicer_id
                      })}
                  />
                </View>
              }
            />}
        />
      )
    } else if (this.state.selectedIndex == 1) {
      //Pending
      return (
        <FlatList
          data={this.state.pending}
          keyExtractor={this.keyExtractor}
          renderItem={({ item }) =>
            <ListItem
              style={{ width: width * 0.9 }}
              leftAvatar={{
                size: "medium",
                rounded: false,
                source: { uri: item.itempic }
              }}
              title={`${item.itemname}`}
              subtitle={`Requester: ${item.request_name}`}
              rightIcon={
                <View style={{ flexDirection: "row", width: width * 0.15 }}>
                  <Icon //accept request
                    name="check"
                    type="antdesign"
                    color="green"
                    size={20}
                    containerStyle={{ padding: 5 }}
                    onPress={() => this.acceptBooking(item.key)}
                  />

                  <Icon //reject request
                    name="close"
                    type="antdesign"
                    color="red"
                    size={20}
                    containerStyle={{ padding: 5 }}
                    onPress={() => this.removePending(item.key)}
                  />

                  {/* <Icon //PM requester
                    name="message"
                    size={20}
                    containerStyle={{ padding: 5 }}
                    onPress={() =>
                        this.createChat(
                        item.servicer_id,
                        item.servicer_name,
                        item.request_id,
                        item.request_name
                        )}
                    /> */}
                </View>
              }
            />}
        />
      )
    } else if (this.state.selectedIndex == 2) {
      //Messages
      return (
        <FlatList
          data={this.state.chats}
          keyExtractor={this.keyExtractor}
          renderItem={({ item }) =>
            <ListItem
              style={{ width: width * 0.9 }}
              leftAvatar={{
                size: "medium",
                rounded: false,
                source: { uri: item.itempic }
              }}
              title={`${item.itemtitle}`}
              subtitle={`Chat with ${item.chateeName}`}
              rightIcon={
                <View style={{ flexDirection: "row", width: width * 0.15 }}>
                  <Icon //PM requester
                    name="message"
                    size={20}
                    containerStyle={{ padding: 5 }}
                    onPress={() =>
                      this.openMessages(item.chateeName, item.itemID)}
                  />
                </View>
              }
            />}
        />
      )
    }
  }

  // render pending requests for user's services
  showPending() {
    let user = firebase.auth().currentUser
    var query = firebase
      .database()
      .ref("Booking")
      .child("Pending")
      .orderByChild("servicer_id")
      .equalTo(user.uid)
    query.once("value").then(snapshot => {
      var items = []
      snapshot.forEach(child => {
        items.push({
          key: child.key,
          request_id: child.val().request_id,
          request_name: child.val().request_name,
          itempic: child.val().itempic,
          itemname: child.val().itemname,
          createdAt: child.val().createdAt
        })
      })
      this.setState({ pending: items })
    })
  }

  // render confirmed booking services made by user
  showBooking() {
    let user = firebase.auth().currentUser
    var query = firebase
      .database()
      .ref("Booking")
      .child("Confirmed")
      .orderByChild("request_id")
      .equalTo(user.uid)
    query.once("value").then(snapshot => {
      var items = []
      snapshot.forEach(child => {
        items.push({
          itemid: child.val().itemid,
          servicer_id: child.val().servicer_id,
          servicer_name: child.val().servicer_name,
          itempic: child.val().itempic,
          itemname: child.val().itemname,
          createdAt: child.val().createdAt
        })
      })
      this.setState({ bookings: items })
    })
  }

  //remove pending of service - upon accept/ reject
  removePending(key) {
    firebase.database().ref("Booking").child("Pending").child(key).remove()
  }

  // confirm booking of service - accept
  acceptBooking(key) {
    firebase
      .database()
      .ref("Booking")
      .child("Pending")
      .child(key)
      .once("value")
      .then(snapshot => {
        let book_ref = firebase.database().ref("Booking").child("Confirmed")
        book_ref
          .push(snapshot.val())
          .then(() => {
            this.removePending(key)
          })
          .then(() => {
            alert("Booking Confirmed!")
          })
      })
  }

  // Opens a specific chat, based on chateeName
  openMessages(name, itemID) {
    let user_ref = firebase.database().ref("Usernames").child(name)
    user_ref.on("value", snapshot => {
      var chateeID = snapshot.val()
      this.props.navigation.navigate("Chat", {
        ref: chateeID,
        ref_name: name,
        ref_itemID: itemID
      })
    })
  }

  showChats() {
    let user = firebase.auth().currentUser
    let chatRef = firebase.database().ref("Chats").child(user.uid)
    chatRef.once("value").then(snapshot => {
      var chatArr = []
      snapshot.forEach(child => {
        var chateeID = child.val().chateeID
        var chateeName = child.val().chateeName
        var itemID = child.val().itemID
        var itempic = child.val().itemPhoto
        var itemtitle = child.val().itemtitle
        chatArr.push({
          chateeID: chateeID,
          chateeName: chateeName,
          itemID: itemID,
          itempic: itempic,
          itemtitle: itemtitle
        })
      })
      this.setState({ chats: chatArr })
    })
  }

  componentDidMount() {
    this.showPending()
    this.showBooking()
    this.showChats()
  }

  render() {
    let user = firebase.auth().currentUser
    const buttons = ["Bookings", "Pending", "Chats"]

    return (
      <View>
        <Header
          centerComponent={{
            text: "Notifications",
            style: { fontSize: 20, fontWeight: "bold" }
          }}
          backgroundColor="white"
        />

        <View style={styles.tabbar}>
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={this.state.selectedIndex}
            buttons={buttons}
          />
        </View>

        <ScrollView>
          {/** tab view */}
          {this.renderSection()}
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
  tabbar: {
    justifyContent: "center",
    alignSelf: "center",
    width: width * 0.9,
    marginTop: 10
  },
  chats: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomColor: "#eee",
    borderColor: "transparent",
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16
  },
  chatText: {
    color: "#1E90FF",
    fontSize: 22
  }
})
