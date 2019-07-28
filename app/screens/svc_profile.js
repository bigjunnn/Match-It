import React from "react"
import {
  StyleSheet,
  Text,
  Button,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  RefreshControl
} from "react-native"
import { Title, Subtitle } from "native-base"
import { Header, Avatar, Rating, ListItem, Icon } from "react-native-elements"
import firebase from "firebase"
import { withNavigation } from "react-navigation"

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
class ServicerProfile extends React.Component {
  state = {
    listings: [],
    activeIndex: 0,
    servicerid: this.props.navigation.state.params.ref,
    servicer: "",
    description: "",
    review_stars: 0.0,
    review_count: 0,
    reviews: [],
    refreshing: false
  }

  keyExtractor = (item, index) => index.toString()

  componentDidMount() {
    const { navigation } = this.props
    this.focusListener = navigation.addListener("didFocus", () => this.renderListings())
    this.renderServicerDetail()
    this.renderSkills()
  }

  componentWillUnmount() {
    // remove all listeners
    this.focusListener.remove()
  }

  onRefresh = () => {
    this.setState({refreshing: true})
    this.renderListings()
  }

  renderListings() {
    window = undefined
    let servicer = this.state.servicerid
    firebase.firestore().collection('Listing').where('userid', '==', servicer)
      .get().then(snapshot => {
        var items = []
        snapshot.forEach(doc => {
          items.push({
            key: doc.data().id,
            title: doc.data().title,
            price: doc.data().package[0].price,
            price_type: doc.data().package[0].price_type,
            photo: doc.data().photo[0]
          })
        })
        this.setState({ listings: items, refreshing: false })
      })
  }

  renderServicerDetail() {
    let servicer = this.state.servicerid
    firebase.database().ref("Users/" + servicer)
      .on("value", snapshot => {
        this.setState({servicer: snapshot.val()})

        if (snapshot.val().description !== undefined) {
          this.setState({description: snapshot.val().description})
        }
  
        if (snapshot.val().review !== undefined) {
          let total_stars = snapshot.val().review.total_stars
          let total_count = snapshot.val().review.count
          var val = total_stars / total_count
          this.setState({ review_stars: val, review_count: total_count })
          this.getReviews()
        }
      })
  }

  renderSkills() { // get user's skills
    let skill_ref = firebase.database().ref("Skills").child(this.state.servicerid)
    onSkillChange = skill_ref.on("value", snapshot => {
      var items = []
      snapshot.forEach(child => {
        items.push({
          category: child.val().category,
          skillName: child.val().skillName
        })
      })
      this.setState({ skills: items })
    })
  }

  getReviews() {
    firebase
      .database()
      .ref("Review")
      .child("Users")
      .child(this.state.servicerid)
      .on("value", snapshot => {
        var items = []
        snapshot.forEach(snap => {
          items.push(snap.val())
        })
        this.setState({ reviews: items })
      })
  }

  //render tab view
  renderSection() {
    if (this.state.activeIndex == 0) {
      //SERVICES
      return (
        <FlatList
          style={styles.fl}
          data={this.state.listings}
          keyExtractor={this.keyExtractor}
          renderItem={({ item }) =>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("Details", { ref: item.key })}
            >
              <ListItem
                leftAvatar={{
                  size: "large",
                  rounded: false,
                  source: { uri: item.photo }
                }}
                title={item.title}
                subtitle={`${item.price} / ${item.price_type}`}
                style={{ width: width * 0.9 }}
              />
            </TouchableOpacity>}
        />
      )
    } else if (this.state.activeIndex == 1) {
      //REVIEWS
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
                      startingValue={item.provider_rate}
                      readonly
                    />
                    <Text style={{ padding: 3, fontSize: 15 }}>
                      {item.provider_rate}/5
                    </Text>
                  </View>
                </View>
              }
              subtitle={`${item.provider_review}`}
              style={{ width: width * 0.9 }}
            />}
        />
      )
    } else if (this.state.activeIndex == 2) {
      //SKILLS
      return (
        <View style={styles.skillsContainer}>
          <FlatList
            style={styles.fl}
            data={this.state.skills}
            keyExtractor={this.keyExtractor}
            renderItem={({ item }) =>
              <ListItem
                leftAvatar={{
                  rounded: true,
                  size: "medium",
                  overlayContainerStyle: { backgroundColor: "orange" },
                  icon: {
                    name: item.category,
                    type: "font-awesome"
                  }
                }}
                title={item.skillName}
                style={{ width: width * 0.9 }}
              />}
	        />
	      </View>
      )
    }
  }

  render() {
    let user = this.state.servicer
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="white"
          centerComponent={{
            text: `${this.state.servicer.username}`,
            style: { fontSize: 20, fontWeight: "bold" }
          }}
        />

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
        }
        >
          <View style={{ flexDirection: "row" }}>
            <View>
              <Avatar
                size="xlarge"
                source={{ uri: user.profilepic}}
                containerStyle={{ marginTop: 20 }}
              />
            </View>

            <View style={{ flexDirection: "column", justifyContent: "center"}}>
              <Text style={{ fontSize: 30, padding: 5, fontWeight: "bold" }}>
                {this.state.servicer.username}
              </Text>
              <Subtitle>  </Subtitle>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  justifyContent: "center"
                }}
              >
                <Rating
                  imageSize={20}
                  fractions={1}
                  startingValue={this.state.review_stars}
                  readonly
                />
                <Text style={{ padding: 3, fontSize: 15 }}>
                  {this.state.review_stars} ({this.state.review_count})
                </Text>
              </View>
              <Text style={{ padding: 10 }}>{this.state.description}</Text>
            </View>
          </View>

          <View style={styles.tabbar}>
            <Button
              onPress={() => this.setState({ activeIndex: 0 })}
              transparent
              active={this.state.activeIndex == 0}
              title="SERVICES"
              color={this.state.activeIndex == 0 ? "#874036" : "#2f3e66"}
              back
            />

            <Button
              onPress={() => this.setState({ activeIndex: 1 })}
              transparent
              active={this.state.activeIndex == 1}
              title="REVIEWS"
              color={this.state.activeIndex == 1 ? "#874036" : "#2f3e66"}
            />

            <Button
              onPress={() => this.setState({ activeIndex: 2 })}
              transparent
              active={this.state.activeIndex == 2}
              title="SKILLS"
              color={this.state.activeIndex == 2 ? "#874036" : "#2f3e66"}
            />
          </View>

          {/** tab view */}
          {this.renderSection()}
        </ScrollView>
      </View>
    )
  }
}
export default withNavigation(ServicerProfile)

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
    marginTop: 20
  },
  tabbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: "stretch",
    width: width * 0.9,
    borderBottomWidth: 1,
    marginTop: 30
  }
})
