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
import algoliasearch from 'algoliasearch/reactnative'

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

  chatID = (id1, id2, itemID) => {
    const chatIDpre = []
    chatIDpre.push(id1)
    chatIDpre.push(id2)
    chatIDpre.push(itemID)
    chatIDpre.sort()
    return chatIDpre.join("_")
  }

  // Creates a reference under "Chats" in db, for both parties
  createChat(
    useruid,
    username,
    chateeuid,
    chateename,
    itemid,
    itemphoto,
    itemtitle
  ) {
    var chatID = this.chatID(useruid, chateeuid, itemid)
    let ref = firebase.database().ref("Messages").child(chatID)
    ref.once("value").then(snapshot => {
      if (snapshot.exists()) {
        this.props.navigation.navigate("Chat", {
          ref: chateeuid,
          ref_name: chateename,
          ref_itemID: itemid
        })
      } else {
        let chatRef = firebase.database().ref("Chats").child(useruid)
        chatRef.push({
          chateeID: chateeuid,
          chateeName: chateename,
          itemID: itemid,
          itemtitle: itemtitle,
          itemPhoto: itemphoto
        })
        let newChatRef = firebase.database().ref("Chats").child(chateeuid)
        newChatRef.push({
          chateeID: useruid,
          chateeName: username,
          itemID: itemid,
          itemPhoto: itemphoto,
          itemtitle: itemtitle
        })
        this.props.navigation.navigate("Chat", {
          ref: chateeuid,
          ref_name: chateename,
          ref_itemID: itemid
        })
      }
    })
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
              rightElement={
                <Icon //PM 
                  name="message"
                  size={20}
                  containerStyle={{ padding: 5 }}
                  onPress={() =>
                    this.createChat(
                      firebase.auth().currentUser.uid,
                      firebase.auth().currentUser.displayName,
                      item.servicer_id,
                      item.servicer_name,
                      item.itemid,
                      item.itempic,
                      item.itemname
                    )}
                />
              }
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
                <View style={{ flexDirection: "row"}}>
                  <Text
                    style={styles.button}
                    onPress={() => this.acknowledgeBooking(item.key)}
                  >Complete</Text> 
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
                <View style={{ flexDirection: "row"}}>
                  <Text
                    style={styles.button}
                    onPress={() =>
                      this.props.navigation.navigate("Review", {
                        ref: item.itemid,
                        servicer_id: item.servicer_id,
                        review_key: item.key
                      })}
                  >Rate</Text> 
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
      return (
        <View>
        <View style={styles.bar}>
            <Text 
              onPress={() => { 
                this.setState({ activeIndex: 0}) 
              }}
              style={ this.state.activeIndex === 0 ? styles.activeText : styles.inactiveText}
            >Your Bookings</Text>
            <Text 
              onPress={() => { 
                this.setState({ activeIndex: 1})
              }}
              style={ this.state.activeIndex === 1 ? styles.activeText : styles.inactiveText}
            >Acknowledge</Text>
            <Text 
              onPress={() => { 
                this.setState({ activeIndex: 2})
              }}
              style={ this.state.activeIndex === 2 ? styles.activeText : styles.inactiveText}
            >Rating</Text>
        </View>
        <ScrollView>{this.renderSubSection()}</ScrollView>
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
                source: {uri: item.itempic }
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

                  <Icon //PM 
                    name="message"
                    size={20}
                    containerStyle={{ padding: 5 }}
                    onPress={() =>
                      this.createChat(
                        firebase.auth().currentUser.uid,
                        firebase.auth().currentUser.displayName,
                        item.request_id,
                        item.request_name,
                        item.itemid,
                        item.itempic,
                        item.itemname
                      )}
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
                <View style={{ flexDirection: "row"}}>
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
          request_id: child.val().request_id,
          request_name: child.val().request_name,
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
    }).then(() => this.updateAlgolia(itemid))
    
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

  updateAlgolia(key) {
    var client = algoliasearch('8KZO6PN2AS', '895e84f4ba2a65f489107006009abc4f')
    const index = client.initIndex('Listing')

    window = undefined
    firebase.firestore().collection("Listing").doc(key)
      .get().then(doc => {
        return doc.data().sales
      }).then(sales => {
        // update only sales attribute of existing item
        index.partialUpdateObject({
          sales: sales,
          objectID: key
        }, (err, content) => {
          if (err) throw err;
          console.log(content);
        });
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
  },
  button: {
    height: 32,
    borderWidth: 1,
    borderColor: "#2ba9d9",
    borderRadius: 6,
    padding: 7,
    fontWeight: "bold",
    textAlign: "center",
    color: "#12a7e0",
    fontSize: 15
  },
  bar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: "center",
    width: width * 0.9,
    borderBottomWidth: 0.8,
    padding: 15, 
    borderColor: '#ebebeb'
  },
  activeText: {
    fontWeight: 'bold',
    color: "#123145",
    fontSize: 14,
    textAlign: "center"
  },
  inactiveText: {
    fontWeight: "normal",
    color: "grey",
    fontSize: 14,
    textAlign: "center"
  }
})
