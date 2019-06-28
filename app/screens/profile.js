import React from "react"
import {
    StyleSheet,
    Text,
    Button, 
    View, 
    FlatList, 
    TouchableOpacity ,
    Dimensions,
    ScrollView
} from "react-native"
import { Title, Subtitle } from "native-base"
import { Header, Avatar, Rating, ListItem, Icon } from "react-native-elements";
import firebase from "firebase"

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class Profile extends React.Component {
    state = {listings: [], activeIndex: 0}
    
    keyExtractor = (item, index) => index.toString()

    componentDidMount() {
    let user = firebase.auth().currentUser
    let listing_ref = firebase.database().ref('Listing')

    // get user's listings from firebase db in array form
    var query = listing_ref.orderByChild("userid").equalTo(user.uid)
    query.once('value').then(snapshot => {
         var items = []
         snapshot.forEach((child) => {
           items.push({
            key: child.key,
            title: child.val().title,
            price: child.val().price,
            price_type: child.val().price_type,
            photo: child.val().photo
           })
        })
        this.setState({ listings: items})
    })
  }

  //render tab view
  renderSection() {
    if (this.state.activeIndex == 0) { //SERVICES
      return (
        <FlatList
        style={styles.fl}
        data={ this.state.listings }
        keyExtractor={this.keyExtractor}
        renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("Details", {ref: item.key})}>
            <ListItem
              leftAvatar={{ size:'large' , rounded: false, source: { uri: item.photo } }}
              title={item.title}
              subtitle={`${item.price} / ${item.price_type}`}
              style = {{width: width * 0.9}}
            />
            </TouchableOpacity>
        )} 
        />
    )} else if (this.state.activeIndex == 1) { //REVIEWS
      return (
        <Text style={{marginTop: 20, fontSize: 30}}> No Reviews Yet </Text>
    )} else if (this.state.activeIndex == 2) { //SKILLS
      return (
        <Text style={{marginTop: 20, fontSize: 30}}>Coming Soon ...</Text>
    )}


  }

  render() {
    let user = firebase.auth().currentUser
    return (
      <View style={styles.container}>
        <Header 
        backgroundColor='white'
        centerComponent={{text: `${user.displayName}`, style:{ fontSize: 20, fontWeight: 'bold'}}}
        rightComponent={
          <Icon 
          name='bookmark'
          />
        }
        />

      <ScrollView>
        <View style={{flexDirection: 'row'}}>
          <View>
          <Avatar
            size='xlarge'
            source={{uri: user.photoURL}} 
            showEditButton
            onEditPress={()=>this.props.navigation.navigate("Update")}
            containerStyle={{marginTop:20}}
          />
          </View>

          <View style={{flexDirection: 'column', justifyContent: 'center'}}>
            <Title style={{fontSize:30}}>{user.displayName}</Title>
            <Subtitle>User since //</Subtitle>
            <Rating
              imageSize={20}
              startingValue={3}
              readonly
            />
            <Text style={{padding: 10}}>//your description here</Text>
          </View>
        </View> 

        <View style={ styles.tabbar}>
          <Button
          onPress={() => this.setState({activeIndex: 0})}
          transparent active={this.state.activeIndex == 0}
          title="SERVICES"
          color= {this.state.activeIndex == 0 ? '#874036' : '#2f3e66'}
          back
          />

          <Button
          onPress={() => this.setState({activeIndex: 1})}
          transparent active={this.state.activeIndex == 1}
          title="REVIEWS"
          color= {this.state.activeIndex == 1 ? '#874036' : '#2f3e66'}
          />

          <Button
          onPress={() => this.setState({activeIndex: 2})}
          transparent active={this.state.activeIndex == 2}
          title="SKILLS"
          color= {this.state.activeIndex == 2 ? '#874036' : '#2f3e66'}
          />
        </View>

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
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignSelf: 'stretch',
    width: width * 0.9,
    borderBottomWidth: 1, 
    marginTop: 30 
  }
})
