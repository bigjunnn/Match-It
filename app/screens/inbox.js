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

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class ChatLog extends React.Component {
  constructor() {
    super()
    this.state = {
      pending: [],
      bookings: [],
      services: [],
      ratings: [],
      selectedIndex: 0,
      activeIndex: 0
    }
    this.updateIndex = this.updateIndex.bind(this)
    this.updateActiveIndex = this.updateActiveIndex.bind(this)
  }

  keyExtractor = (item, index) => index.toString()

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex })
  }

  updateActiveIndex(selectedIndex) {
    this.setState({ activeIndex: selectedIndex })
  }

  renderSubSection() {
    if (this.state.activeIndex == 0) {
      return (
        <FlatList
          data={this.state.bookings}
          keyExtractor={this.keyExtractor}
          renderItem={({ item }) =>
            <ListItem
              style={{ width: width * 0.9, alignSelf: "center" }}
              leftAvatar={{
                size: "medium",
                rounded: false,
                source: { uri: item.itempic }
              }}
              title={`${item.itemname}`}
              subtitle={`Servicer: ${item.servicer_name}`}
            />}
        />
      )
    } else if (this.state.activeIndex == 1) {
      return (
        <FlatList
          data={this.state.services}
          keyExtractor={this.keyExtractor}
          renderItem={({ item }) =>
            <ListItem
              style={{ width: width * 0.9, alignSelf: "center" }}
              leftAvatar={{
                size: "medium",
                rounded: false,
                source: { uri: item.itempic }
              }}
              title={`${item.itemname}`}
              subtitle={`Requester: ${item.request_name}`}
              rightElement={
                <View style={{ flexDirection: "row", width: width * 0.25 }}>
                  <Button
                    title="Complete"
                    type="outline"
                    onPress={() => this.acknowledgeBooking(item.key)}
                  />
                </View>
              }
            />}
        />
      )
    } else if (this.state.activeIndex == 2) {
      return (
        <FlatList
          data={this.state.ratings}
          keyExtractor={this.keyExtractor}
          renderItem={({ item }) =>
            <ListItem
              style={{ width: width * 0.9, alignSelf: "center" }}
              leftAvatar={{
                size: "medium",
                rounded: false,
                source: { uri: item.itempic }
              }}
              title={`${item.itemname}`}
              subtitle={`Servicer: ${item.servicer_name}`}
              rightElement={
                <View style={{ flexDirection: "row", width: width * 0.18 }}>
                  <Button
                    title="Rate"
                    type="outline"
                    onPress={() =>
                      this.props.navigation.navigate("Review", {
                        ref: item.itemid,
                        servicer_id: item.servicer_id,
                        review_key: item.key
                      })}
                  />
                </View>
              }
            />}
        />
      )
    }
  }

  renderSection() {
    if (this.state.selectedIndex == 0) {
      // Bookings
      const buttons = ["Your Bookings", "Acknowledge", "Rating"]
      return (
        <View>
          <ButtonGroup
            onPress={this.updateActiveIndex}
            selectedIndex={this.state.activeIndex}
            buttons={buttons}
            containerStyle={styles.innerTabBar}
          />

          {this.renderSubSection()}
        </View>
      )
    } else if (this.state.selectedIndex == 1) {
      //Pending
      return (
        <FlatList
          data={this.state.pending}
          keyExtractor={this.keyExtractor}
          renderItem={({ item }) =>
            <ListItem
              style={{ width: width * 0.9, alignSelf: "center" }}
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
                    onPress={() => this.acceptBooking(item.key, item.itemid)}
                  />

                  <Icon //reject request
                    name="close"
                    type="antdesign"
                    color="red"
                    size={20}
                    containerStyle={{ padding: 5 }}
                    onPress={() => this.removePending(item.key)}
                  />
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
              style={{ width: width * 0.9, alignSelf: "center" }}
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
    query.on("value", snapshot => {
      var items = []
      snapshot.forEach(child => {
        items.push({
          key: child.key,
          request_id: child.val().request_id,
          request_name: child.val().request_name,
          itempic: child.val().itempic,
          itemid: child.val().itemid,
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
    query.on("value", snapshot => {
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

  showYourServices() {
    let user = firebase.auth().currentUser
    var query = firebase
      .database()
      .ref("Booking")
      .child("Confirmed")
      .orderByChild("servicer_id")
      .equalTo(user.uid)
    query.on("value", snapshot => {
      var items = []
      snapshot.forEach(child => {
        items.push({
          key: child.key,
          itemid: child.val().itemid,
          servicer_id: child.val().servicer_id,
          servicer_name: child.val().servicer_name,
          itempic: child.val().itempic,
          itemname: child.val().itemname,
          createdAt: child.val().createdAt
        })
      })
      this.setState({ services: items })
    })
  }

  showYourRatings() {
    let user = firebase.auth().currentUser
    var query = firebase
      .database()
      .ref("Booking")
      .child("Rating")
      .orderByChild("request_id")
      .equalTo(user.uid)
    query.on("value", snapshot => {
      var items = []
      snapshot.forEach(child => {
        items.push({
          key: child.key,
          itemname: child.val().itemname,
          itemid: child.val().itemid,
          servicer_id: child.val().servicer_id,
          servicer_name: child.val().servicer_name,
          itempic: child.val().itempic,
          createdAt: child.val().createdAt
        })
      })
      this.setState({ ratings: items })
    })
  }

  //remove pending of service - upon accept/ reject
  removePending(key) {
    firebase.database().ref("Booking").child("Pending").child(key).remove()
  }

  // confirm booking of service - accept
  acceptBooking(key, itemid) {
    firebase.firestore().collection("Listing").doc(itemid).update({
      sales: firebase.firestore.FieldValue.increment(1)
    })

    firebase
      .database()
      .ref("Booking")
      .child("Pending")
      .child(key)
      .on("value", snapshot => {
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

  acknowledgeBooking(key) {
    firebase
      .database()
      .ref("Booking")
      .child("Confirmed")
      .child(key)
      .on("value", snapshot => {
        let rating_ref = firebase.database().ref("Booking").child("Rating")
        rating_ref
          .push(snapshot.val())
          .then(() => this.removeFromBooking(key))
          .then(() => {
            alert("You have acknowledged this booking!")
          })
      })
  }

  removeFromBooking(key) {
    firebase.database().ref("Booking").child("Confirmed").child(key).remove()
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
    chatRef.on("value", snapshot => {
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
    this.showYourServices()
    this.showYourRatings()
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
  innerTabBar: {
    justifyContent: "space-around",
    alignSelf: "center",
    width: width * 0.9,
    marginTop: 10,
    flexDirection: "row",
    borderBottomWidth: 1
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
