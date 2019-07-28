import React from "react"
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  RefreshControl
} from "react-native"
import { Header, ListItem, Icon, Card, SearchBar } from "react-native-elements"
import firebase from "firebase"
import { withNavigation } from "react-navigation"
import Swiper from "react-native-swiper"

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
var category = ["Business", "Design", "Education", "Handyman", "Lifestyle", "Music", "Tech"]
var category_img = [
  {require: require("../images/Business.jpg")},
  {require: require("../images/Design.jpg")},
  {require: require("../images/Education.jpg")},
  {require: require("../images/Handyman.jpg")},
  {require: require("../images/Lifestyle.jpg")},
  {require: require("../images/Music.jpg")},
  {require: require("../images/Tech.jpg")},
]
var tag_color = ["#c9a7a7","#ccc4a9","#b6cca7","#abd1cc","#ad9fbf"]

class Home extends React.Component {
  // Define current state
  state = {
    tags: [], 
    topSales: [],
    topServicer: [],
    listing: [],
    refreshing: false,
    search: "" 
  }

  keyExtractor = (item, index) => index.toString()
  
  handleSignOut = () => {
    firebase.auth().signOut().then(this.props.navigation.navigate("Login"))
  }

  componentDidMount() {
    window = undefined
    const { navigation } = this.props
    this.focusListener = navigation.addListener("didFocus", () => {
      this.renderRisingTags()
      this.renderTopSalesListing()
      this.renderTopServicer()
      this.setState({search: ""})
    })
  }

  showCategories() {
    return (
      <ScrollView 
        horizontal={true}
      >
      <FlatList
        data={category}
        keyExtractor={this.keyExtractor}
        renderItem={({ item, index }) =>
        <TouchableOpacity
          onPress={() =>
          this.props.navigation.navigate("Category", {
            ref: item
          })}
        >
          <Card
            containerStyle={styles.category}
            image={category_img[index].require}
            imageStyle={{height: 100}}
          >
            <Text style={{marginBottom: 5, fontSize: 22, fontWeight: "bold"}}>{item}</Text>
          </Card>
        </TouchableOpacity>
        }
        horizontal={true}
      />
      </ScrollView>
    )
  }

  renderRisingTags() {
    firebase
      .firestore()
      .collection("Tags")
      .orderBy("value", "desc").limit(5)
      .get()
      .then(snapshot => {
        let tags = []
        snapshot.forEach(item => {
          tags.push({ name: item.id })
        })
        this.setState({ tags })
      })
  }

  showRisingTags() {
    return (
      <ScrollView 
        horizontal={true}
      >
      <FlatList
        data={this.state.tags}
        keyExtractor={this.keyExtractor}
        renderItem={({ item, index }) =>
          <TouchableOpacity 
            style={styles.tags}
            onPress={() =>
              this.props.navigation.navigate("List", {
                type: 'tags',
                name: item.name
              })}
          >
            <View style={{backgroundColor: tag_color[index], alignSelf: "stretch"}}>
              <Text style={{fontSize: 25, color: "black"}}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        }
        horizontal={true}
      />
      </ScrollView>
    )
  }

  renderTopSalesListing() {
    firebase
      .firestore()
      .collection("Listing")
      .where('sales','>',0)
      .orderBy("sales", "desc").limit(10)
      .get()
      .then(snapshot => {
        let topSales = []
        snapshot.forEach(doc => {
          topSales.push(doc.data())
        })
        this.setState({ topSales })
      })
  }

  showTopSalesListing() {
    return this.state.topSales.map((item, index) => 
      <ImageBackground 
        key={index}
        source={{uri: item.photo[0]}}
        style={{ height: height * 0.35, width: width * 1, resizeMode: 'stretch'}}
        imageStyle={{opacity: 0.30}}
      > 
        <View style={{flexDirection: "row", marginTop: 5, padding: 5,backgroundColor: "white", opacity: 0.9, position: "absolute"}}>
          <Icon
            name="star"
            type="antdesign"
            color="#f2c202"
            size={17}
          />
          <Text style={{fontSize: 15, fontWeight: "bold", color: "grey"}}> {item.review_overall.toFixed(1)} / 5.0 ({item.review_count})</Text>
        </View>

        <View style={{justifyContent: "center", alignItems: "center", flex: 1}}>
          <View style={{flexDirection: "row", marginTop: 5, padding: 5,backgroundColor: "#faf7f7", opacity: 0.8, borderRadius: 4, borderWidth: 1, borderColor: "grey"}}>
            <Icon
              name="check"
              type="antdesign"
              size={17}
            />
            <Text style={{fontSize: 14, fontWeight: "bold", color: "grey"}}> {item.sales} BOOKED</Text>
          </View>
          <Text style={{fontSize: 37, fontWeight:"bold", color: "#545252"}}>{item.title}</Text>
          <Text style={{fontSize: 22}}>From SGD {item.package[0].price} / {item.package[0].price_type}</Text>
          <TouchableOpacity
            style={{flexDirection:"row", opacity: 0.8, backgroundColor: "white", borderColor: "grey", marginTop: 15, borderRadius: 5, borderWidth: 1, padding: 5, paddingLeft: 20, paddingRight: 20}} 
            onPress={() =>
              this.props.navigation.navigate("Details", {
                ref: item.id
              })}
          >
            <Icon
              name="eyeo"
              type="antdesign"
              size={18}
            />
            <Text style={{fontSize: 15, fontWeight: "bold"}}> More Details</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    )
  }

  renderTopServicer() {
    firebase
      .database()
      .ref("Users")
      .orderByChild("review/overall_rate")
      .limitToFirst(3)
      .once("value", snapshot => {
        let topServicer=[]
        snapshot.forEach(child => {
          topServicer.push(child.val())
        })
        this.setState({topServicer})
      })
  }

  onRefresh = () => {
    this.setState({refreshing: true, search: ""})
    this.renderRisingTags()
    this.renderTopSalesListing()
    this.renderTopServicer()
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
              color="white"
              onPress={this.handleSignOut}
            />
          }
          centerComponent={{
            text: "Matchit",
            style: { fontSize: 30, fontFamily: "Lobster-Regular", color: "white" }
          }}
          rightComponent={
            <Icon
              name="bookmark"
              color="white"
              onPress={() => this.props.navigation.navigate("Bookmark")}
            />
          }
          backgroundColor="#373a4a"
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
            <View style={{padding: 7, marginBottom: 5, width: width * 0.90}}>
              <TextInput
                style={styles.searchBar}
                onFocus={() => this.props.navigation.navigate("Search")}
                value={this.state.search}
                placeholder="search services..."
              />
            </View>

            <Swiper
            key={this.state.topSales.length}
            autoplay={true}
            style={{ height: height * 0.38}} 
            horizontal={true} 
            containerStyle={{ alignSelf: 'stretch' }}
            activeDotColor={"red"}
            removeClippedSubviews={false}>
              {this.showTopSalesListing()}
            </Swiper>

            <Text style={styles.title}>Categories</Text>
            {/** show rising tags */}
            {this.showCategories()}

            <Text style={styles.title}>Popular Tags</Text>
            {/** show rising tags */}
            {this.showRisingTags()}
          
            
          </View>
        </ScrollView>
      </View>
    )
  }
}
export default withNavigation(Home)

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    marginBottom: 80
  },
  title: {
    marginLeft: 10, 
    fontSize: 25, 
    fontWeight: "bold",
    alignSelf: "stretch",
    padding: 5
  },
  tags: {
    backgroundColor: "transparent",
    opacity: 0.7,
    width:160,
    height:100,
    borderWidth:0.5,
    borderRadius:5,
    borderColor:"grey",
    padding:10,
    margin: 5
  },
  category: {
    width: 170,
    height: 150,
    margin: 5
  },
  searchBar: {
    height: 37,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  }
})
