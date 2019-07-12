import React from "react"
import {
  StyleSheet,
  Image,
  Text,
  View,
  Dimensions,
  ScrollView,
  FlatList
} from "react-native"
import { Title, Subtitle, H1 } from "native-base"
import {
  Icon,
  ListItem,
  Card,
  Header,
  Button,
  Rating
} from "react-native-elements"
import firebase from "firebase"

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class Details extends React.Component {
  state = {
    key: this.props.navigation.state.params.ref, //item id
    details: "",
    servicer: "",
    reviews: [],
    disabled_btn: true
  }

  keyExtractor = (item, index) => index.toString()

  linkProfile() {
    let user = firebase.auth().currentUser
    if (this.state.servicer.userid === user.uid) {
      this.props.navigation.navigate("Profile")
    } else {
      this.props.navigation.navigate("ServicerProfile", {
        ref: this.state.servicer.userid
      })
    }
  }

  pendingService() {
    let user = firebase.auth().currentUser
    let book_ref = firebase.database().ref("Booking").child("Pending")

    book_ref
      .push({
        request_id: user.uid,
        request_name: user.displayName,
        servicer_id: this.state.servicer.userid,
        servicer_name: this.state.servicer.username,
        itempic: this.state.details.photo,
        itemid: this.state.key,
        itemname: this.state.details.title,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      })
      .then(() => {
        alert("Request to book service has been sent!")
      })
  }

  addToBookMark() {
    let user = firebase.auth().currentUser
    // Creates a new bookmark for user, if it doesn't already exist
    let ref = firebase.database().ref("Bookmarks").child(user.uid)

    // Pushes the listing into bookmark page
    ref
      .push({
        request_id: user.uid,
        request_name: user.displayName,
        servicer_id: this.state.servicer.userid,
        servicer_name: this.state.servicer.username,
        itempic: this.state.details.photo,
        itemid: this.state.key,
        itemname: this.state.details.title,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        price: this.state.details.price,
        price_type: this.state.details.price_type
      })
      .then(() => {
        alert("Listing has been bookmarked!")
      })
  }

  getReviews() {
    firebase
      .database()
      .ref("Review")
      .child("Listing")
      .child(this.state.key)
      .once("value", snapshot => {
        var items = []
        snapshot.forEach(snap => {
          items.push(snap.val())
        })
        this.setState({ reviews: items })
      })
  }

  displayReviews() {
    return (
      <FlatList
        style={styles.fl}
        data={this.state.reviews}
        keyExtractor={this.keyExtractor}
        renderItem={({ item }) =>
          <ListItem
            title={
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                  {item.reviewer_name}
                </Text>
                <View style={{ flexDirection: "row", marginLeft: 10 }}>
                  <Rating
                    imageSize={15}
                    fractions={1}
                    startingValue={item.service_rate}
                    readonly
                  />
                  <Text style={{ padding: 3, fontSize: 15 }}>
                    {item.service_rate}/5
                  </Text>
                </View>
              </View>
            }
            subtitle={`${item.service_review}`}
            style={{ width: width * 0.9 }}
          />}
      />
    )
  }

  /**
    allowChat() {
      let user = firebase.auth().currentUser
      if (this.state.servicer.userid !== user.uid) {
        <Icon 
        name='message' 
        onPress= {() => this.props.navigation.navigate("Chat", {ref: this.state.servicer.userid})}
        />
      }
    }

    showBtn() {
      let user = firebase.auth().currentUser
      if (this.state.servicer.userid !== user.uid) {
        return 1
      } else {
        return 0
      }
    }
    */

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

  componentDidMount() {
    var key = this.props.navigation.state.params.ref
    let data_ref = firebase.database().ref("Listing").child(key)
    this.setState({ key: key })

    data_ref
      .once("value")
      .then(snapshot => {
        //listing details
        this.setState({ details: snapshot.val() })
      })
      .then(() => {
        //servicer details
        let user_ref = firebase
          .database()
          .ref("Users")
          .child(this.state.details.userid)

        let user = firebase.auth().currentUser

        user_ref
          .once("value")
          .then(snapshot => {
            this.setState({ servicer: snapshot.val() })

            if (this.state.servicer.userid !== user.uid) {
              this.setState({ disabled_btn: false }) //allow booking of service
            }
          })
          .then(() => {
            //reviews on listing
            this.getReviews()
          })
      })
  }

  render() {
    return (
      <View>
        <Header
          centerComponent={{
            text: `${this.state.details.title}`,
            style: { fontSize: 20, fontWeight: "bold" }
          }}
          rightComponent={
            <Icon
              name="message"
              onPress={() => {
                var user = firebase.auth().currentUser
                var useruid = user.uid
                var username = user.displayName
                this.createChat(
                  useruid,
                  username,
                  this.state.servicer.userid,
                  this.state.servicer.username,
                  this.state.key,
                  this.state.details.photo,
                  this.state.details.title
                )
              }}
            />
          }
          backgroundColor="#e6ebed"
        />

        <ScrollView style={{ height: height * 0.8 }}>
          <View style={styles.container}>
            <Card>
              <H1 style={{ padding: 10, fontWeight: "bold" }}>
                {this.state.details.title}
              </H1>

              <Image //item's image
                source={{ uri: this.state.details.photo }}
                resizeMode="cover"
                style={{ height: height * 0.3, width: width * 0.9 }}
              />

              <ListItem //servicer dp and username
                leftAvatar={{
                  source: { uri: this.state.servicer.profilepic }
                }}
                title={this.state.servicer.username}
                onPress={() => this.linkProfile()}
                chevron
              />

              <Subtitle>Package</Subtitle>
              <Title>
                SGD{this.state.details.price} / {this.state.details.price_type}
              </Title>

              <Text style={styles.description}>
                {this.state.details.description}
              </Text>
            </Card>

            {/** show reviews */}
            {this.displayReviews()}
          </View>
        </ScrollView>

        <View style={styles.bottomBtn}>
          <Button
            containerStyle={{
              paddingLeft: 25,
              width: width * 0.8
            }}
            title="Book Service"
            disabled={this.state.disabled_btn}
            onPress={() => this.pendingService()}
          />

          <Button
            containerStyle={{ width: width * 0.2 }}
            type="clear"
            icon={<Icon name="bookmark" />}
            onPress={() => this.addToBookMark()}
          />
        </View>
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
  description: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 17
  },
  bottomBtn: {
    flexDirection: "row",
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  fl: {
    marginTop: 20
  }
})
