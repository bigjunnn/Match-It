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
import {
  Icon,
  ListItem,
  Card,
  Header,
  Button,
  Rating,
  PricingCard
} from "react-native-elements"
import firebase from "firebase"
import Swiper from "react-native-swiper"

const pkg_name = ["Basic", "Premium", "Exclusive"]
const pkg_theme = ["#4f9deb", "#d14feb", "#de4759"]

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class Details extends React.Component {
  state = {
    key: this.props.navigation.state.params.ref, //item id
    details: "",
    servicer: "",
    photos: [],
    packages: [{price: "", price_type: "", info: ""}],
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
        itempic: this.state.photos[0],
        itemid: this.state.key,
        itemname: this.state.details.title,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      })
      .then(() => {
        alert("Request to book service has been sent!")
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

  renderListingDetail(callback) {
    //get all listings from db in array form
    firebase.firestore().collection("Listing").doc(this.state.key).get()
      .then(doc => {
        if (doc.exists) {
          this.setState({ 
            details: doc.data(), 
            photos: doc.data().photo,
            packages: doc.data().package
          })
          callback()
        } else {
          alert("Oops! Service no longer available!")
          this.props.navigation.navigate("Home")
        }
      })
      .catch(err => {
        console.log('Error getting documents', err)
      })
  }

  renderServicerDetail() {
    let user = firebase.auth().currentUser
    firebase.database().ref("Users").child(this.state.details.userid)
      .once("value").then(snapshot => {
        this.setState({ servicer: snapshot.val() })

        if (this.state.details.userid !== user.uid) {
          this.setState({ disabled_btn: false }) //allow booking of service
        }
      })
  }

  showPics() {
    return this.state.photos.map((value, index) => 
      <Image key={index}
        source={{uri: this.state.photos[index]}}
        style={{ height: height * 0.3, width: width * 1, resizeMode: 'stretch'}}
      />
    )
  }

  pricingPackage() {
    return this.state.packages.map((item, index) => 
      <PricingCard
        key={index.toString()}
        color={pkg_theme[index]}
        title={pkg_name[index]}
        price={`$${item.price} / ${item.price_type}`}
        info={[item.info]}
        button={{title: ""}}
        containerStyle={{width: 230, height: 200}}
        pricingStyle={{fontSize: 20}}
        titleStyle={{fontSize: 27}}
      />
    )
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

  componentDidMount() {
    this.renderListingDetail(() => this.renderServicerDetail())
    this.getReviews()
  }

  render() {
    return (
      <View>
        <Header
          centerComponent={{
            text: "Service Details",
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
                  this.state.photos[0],
                  this.state.details.title
                )
              }}
            />
          }
          backgroundColor="white"
        />

        <ScrollView style={{ height: height * 0.8 }}>
          <View style={styles.container}>
            <Text style={{ padding: 10, fontSize: 30, fontWeight: "bold", textAlign: "left", alignSelf: "stretch" }}>
              {this.state.details.title}
            </Text>

            <Swiper 
            style={{ height: height * 0.3}} 
            horizontal={true} 
            showsButtons={true} 
            containerStyle={{ alignSelf: 'stretch' }}
            activeDotColor={"white"}
            loop={false}
            removeClippedSubviews={false}>
              {this.showPics()}
            </Swiper>

            <ListItem //servicer dp and username
              leftAvatar={{
                source: { uri: this.state.servicer.profilepic }
              }}
              title={this.state.servicer.username}
              onPress={() => this.linkProfile()}
              containerStyle={{ width: width * 0.95}}
              chevron
            />

            {/** show package details */}
            <Text style={styles.title}>Package</Text>
            <ScrollView horizontal={true} style={{flexDirection: "row"}}>
            {this.pricingPackage()}
            </ScrollView>
            
            <Text style={styles.info_title}>Description</Text>
            <Text style={styles.description}>
              {this.state.details.description}
            </Text>

            {/** show reviews */}
            <Text style={styles.title}>Reviews ({this.state.reviews.length})</Text>
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
    fontSize: 17,
    width: width * 0.9,
    height: 170
  },
  bottomBtn: {
    flexDirection: "row",
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  bthnHide: {
    width: 10,
    height: 10
  },
  title: {
    marginLeft: 20, 
    fontSize: 15, 
    fontWeight: "bold", 
    color: "grey", 
    alignSelf: "stretch"
  },
  info_title: {
    marginTop: 10,
    marginLeft: 20, 
    fontSize: 15, 
    fontWeight: "bold", 
    color: "black", 
    alignSelf: "stretch"
  }
})
