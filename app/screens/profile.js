import React from "react"
import {
  StyleSheet,
  Text,
  Button,
  View,
  FlatList,
  Dimensions,
  ScrollView,
  RefreshControl
} from "react-native"
import { Header, Avatar, Rating, ListItem} from "react-native-elements"
import firebase from "firebase"
import { withNavigation } from "react-navigation"
import { Dropdown } from 'react-native-material-dropdown'
import { InstantSearch, Configure } from 'react-instantsearch-native'
import SearchBox from './src/SearchBox'
import Results from './src/InfiniteHits'

const dropdown = [
  {value: 'date', label:'Date'},
  {value: 'sales', label:'Sales'},
  {value: 'price', label:'Price'}
]

var onProfileChange = ""
var onSkillChange = ""
var listingsub = ""
var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
class Profile extends React.Component {
  state = {
    user: firebase.auth().currentUser,
    listings: [],
    activeIndex: 0,
    user_info: "",
    description: "",
    review_stars: 0.0,
    review_count: 0,
    reviews: [],
    skills: [],
    refreshing: false,
    sales: 0,
    text: "listing",
    orderType: "date",
    order: "desc",
    orderIndex: 1
  }

  changeOrder() {
    switch(this.state.orderIndex) {
      case 1: 
        this.setState({order: "desc"})
        break;
      case 2: 
        this.setState({order: "asc"})
        break;
    }
  }

  keyExtractor = (item, index) => index.toString()

  componentDidMount() {
    const { navigation } = this.props
    this.focusListener = navigation.addListener("didFocus", () => this.renderListings())
    this.renderProfileDetail()
    this.renderSkills()
  }

  componentWillUnmount() {
     // remove all listeners
     let user = this.state.user
     this.focusListener.remove()
     firebase.database().ref("Users/" + user.uid).off("value", onProfileChange)
     firebase.database().ref("Skills").child(user.uid).off("value", onSkillChange)
     listingsub()
   }

  onRefresh = () => {
    this.setState({ refreshing: true })
    this.renderListings()
    this.renderSkills()
  }

  renderListings() {
    window = undefined
    let user = firebase.auth().currentUser
    listingsub = firebase
      .firestore()
      .collection("Listing")
      .where("userid", "==", user.uid)
      .onSnapshot(snapshot => {
        var items = []
        var sales = 0
        snapshot.forEach(doc => {
          items.push({
            key: doc.data().id,
            title: doc.data().title,
            price: doc.data().package[0].price,
            price_type: doc.data().package[0].price_type,
            photo: doc.data().photo[0]
          })
          sales += doc.data().sales
        })
        this.setState({ listings: items, refreshing: false, sales: sales })
      })
  }

  renderProfileDetail() {
    let user = firebase.auth().currentUser
    onProfileChange = firebase
      .database()
      .ref("Users/" + user.uid)
      .on("value", snapshot => {
        this.setState({ user_info: snapshot.val() })

        if (snapshot.val().description !== undefined) {
          this.setState({ description: snapshot.val().description })
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

  renderSkills() {
    // get user's skills
    let user = firebase.auth().currentUser
    let skill_ref = firebase.database().ref("Skills").child(user.uid)
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

  //get all reviews data
  getReviews() {
    firebase
      .database()
      .ref("Review")
      .child("Users")
      .child(this.state.user.uid)
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
        <InstantSearch
          appId="8KZO6PN2AS"
          apiKey="3847b33ab120291475be5326b9c1c797"
          indexName={`${this.state.text}_${this.state.orderType}_${this.state.order}`}
        >
          <SearchBox />
          <View style={{flexDirection:"row", alignSelf: "flex-end", marginRight: 5, marginBottom: 5}}> 
            <Dropdown 
              ref={this.state.orderType}
              data={dropdown}
              value={this.state.orderType}
              onChangeText={(value) => {
                this.setState({orderType: value})
              }}
              dropdownOffset={{top: 0, left: 0}}
              containerStyle={{width: 80, marginRight: 5}}
              fontSize={14}
            />

            <Text 
              onPress={() => { 
                this.setState({ orderIndex: 1}, () => this.changeOrder()) 
              }}
              style={ this.state.orderIndex === 1 ? styles.activeText : styles.inactiveText}
            > desc</Text>
            <Text> | </Text>
            <Text 
              onPress={() => { 
                this.setState({ orderIndex: 2}, () => this.changeOrder()) 
              }}
              style={ this.state.orderIndex === 2 ? styles.activeText : styles.inactiveText}
            >asc</Text>
          </View>
          <View style={{flexDirection: 'row', alignSelf: 'center', width: width * 0.9, height: height * 0.8}}>
          <Results />
          </View>
          <Configure 
            facetFilters={`userid:${this.state.user.uid}`}
          />
        </InstantSearch>
      )
    } else if (this.state.activeIndex == 1) {
      //REVIEWS
      return (
        <View style={{width:width * 0.9, alignSelf: 'center'}}>
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
        </View>
      )
    } else if (this.state.activeIndex == 2) {
      //SKILLS
      return (
        <View style={styles.skillsContainer}>
          <Button
            title="Add a skill"
            type="solid"
            onPress={() => this.props.navigation.navigate("Skill")}
          />

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
    let user = firebase.auth().currentUser
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="#f5f6f7"
          centerComponent={{
            text: `${user.displayName}`,
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
          <View style={styles.info}>
            <Avatar
              rounded
              size={150}
              source={{ uri: user.photoURL }}
              showEditButton
              onEditPress={() => this.props.navigation.navigate("Update")}
              containerStyle={{ marginTop: 10, alignSelf: 'center' }}
              overlayContainerStyle={{borderWidth:2, borderColor:"black"}}
            />
            
            <View style={{ alignSelf: "center", width: width * 0.7, marginTop: 10, marginBottom: 10 }}>
              <Rating
                imageSize={20}
                fractions={1}
                startingValue={this.state.review_stars}
                readonly
              />
              <Text style={{ padding: 3, fontSize: 13, fontWeight: 'bold', color: 'black', alignSelf: 'center' }}>
                {this.state.review_stars.toFixed(1)} / 5.0 ({this.state.review_count})
              </Text>
              <Text style={{ marginTop: 10, alignSelf: 'center', fontSize: 13, fontWeight: 'bold', color: "grey"}}>ABOUT ME</Text>
              <Text style={{ padding: 2, alignSelf: 'center', fontSize: 13, color: "black"}}>
                {this.state.description !== "" ? this.state.description : "---"}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-around', width: width * 0.9, padding: 10, paddingBottom: 25}}>
              <View>
                <Text style={{fontSize: 30, fontWeight: "bold", textAlign: 'center'}}>{this.state.listings.length}</Text>
                <Text style={{fontSize: 12, color: 'grey'}}>SERVICES</Text>
              </View>

              <View>
                <Text style={{fontSize: 30, fontWeight: "bold", textAlign: 'center'}}>{this.state.sales}</Text>
                <Text style={{fontSize: 12, color: 'grey'}}>BOOKED</Text>
              </View>

              <View>
                <Text style={{fontSize: 30, fontWeight: "bold", textAlign: 'center'}}>{this.state.skills.length}</Text>
                <Text style={{fontSize: 12, color: 'grey'}}>SKILLS</Text>
              </View>

              <View>
                <Text style={{fontSize: 30, fontWeight: "bold", textAlign: 'center'}}>{this.state.review_count}</Text>
                <Text style={{fontSize: 12, color: 'grey'}}>REVIEWS</Text>
              </View>

            </View>
          </View>

          <View style={styles.tabbar}>
            <Text 
              onPress={() => { 
                this.setState({ activeIndex: 0}) 
              }}
              style={ this.state.activeIndex === 0 ? styles.activeText : styles.inactiveText}
            >SERVICES</Text>
            <Text 
              onPress={() => { 
                this.setState({ activeIndex: 1})
              }}
              style={ this.state.activeIndex === 1 ? styles.activeText : styles.inactiveText}
            >REVIEWS</Text>
            <Text 
              onPress={() => { 
                this.setState({ activeIndex: 2})
              }}
              style={ this.state.activeIndex === 2 ? styles.activeText : styles.inactiveText}
            >SKILLS</Text>
          </View>

          {/** tab view */}
          {this.renderSection()}
        </ScrollView>
      </View>
    )
  }
}
export default withNavigation(Profile)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  fl: {
    marginTop: 20
  },
  info: {
    alignContent: 'center', 
    justifyContent: 'center', 
    width: width, 
    borderBottomWidth: 0.5, 
    borderColor: '#ebebeb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    backgroundColor: "#f5f6f7"
  },
  tabbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: "center",
    width: width,
    borderBottomWidth: 0.8,
    padding: 15, 
    borderColor: '#ebebeb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2
  },
  skillsContainer: {
    marginTop: 20,
    height: height * 1
  },
  activeText: {
    fontWeight: 'bold',
    color: "#123145",
    fontSize: 15
  },
  inactiveText: {
    fontWeight: "normal",
    color: "#2f3e66",
    fontSize: 15
  }
})
