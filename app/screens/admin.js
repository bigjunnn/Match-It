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

// TODO: Add in a page to view information about skills - Description etc
export default class Home extends React.Component {
  // Define current state
  state = { skills: [] }

  componentDidMount() {
    let adminSkillRef = firebase
      .database()
      .ref("Skills")
      .child("CGIx1TmGQqYajo5jn7WXiiGvwrx2")

    // get admin's pending skills approval
    adminSkillRef.once("value").then(snapshot => {
      let user_ref = firebase.database().ref("Users")
      var items = []
      snapshot.forEach(child => {
        items.push({
          key: child.key,
          category: child.val().category,
          description: child.val().description,
          skillName: child.val().skillName,
          userid: child.val().userid,
          userdp: child.val().userdp,
          username: child.val().username,
          image: child.val().image,
          skill_id: child.val().skillKey
        })
      })
      this.setState({ skills: items })
    })
  }

  // Creates a skill reference for specified user, then deletes the reference for admin user
  approveSkill(item) {
    var skillData = {
      userid: item.userid,
      userdp: item.userdp,
      skillName: item.skillName,
      category: item.category,
      description: item.description,
      image: item.image
    }

    var user_ref = firebase.database().ref("Skills").child(item.userid)
    var skillKey = user_ref.push(skillData).key
    user_ref.child(skillKey).update({ skill_id: skillKey })
    this.rejectSkill(item.skill_id)

    alert("You have approved this skill submission")
  }

  // Deletes the reference for admin user only
  rejectSkill(key) {
    let user = firebase.auth().currentUser
    var user_ref = firebase.database().ref("Skills").child(user.uid).child(key)
    user_ref.remove()

    alert("You have rejected this skill submission")
  }

  handleSignOut = () => {
    firebase.auth().signOut().then(this.props.navigation.navigate("Login"))
  }

  render() {
    return (
      <View>
        <Header
          leftComponent={
            <Icon
              name="sc-telegram"
              type="evilicon"
              onPress={this.handleSignOut}
            />
          }
          centerComponent={{
            text: "Admin Approvals",
            style: { fontSize: 30, fontFamily: "Lobster-Regular" }
          }}
        />

        <ScrollView>
          <View style={styles.container}>
            <Text>Hi Admin</Text>

            <FlatList
              style={styles.fl}
              data={this.state.skills}
              keyExtractor={this.keyExtractor}
              renderItem={({ item }) =>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("SkillDetails", {
                      ref: item.skill_id
                    })}
                >
                  <ListItem
                    leftAvatar={{
                      size: "large",
                      rounded: true,
                      source: {
                        uri: item.userdp
                      }
                    }}
                    title={item.skillName}
                    subtitle={item.username}
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
