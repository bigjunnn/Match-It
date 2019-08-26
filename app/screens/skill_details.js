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
  Rating,
  PricingCard
} from "react-native-elements"
import firebase from "firebase"
import Swiper from "react-native-swiper"

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height

export default class SkillDetails extends React.Component {
  state = {
    skillkey: this.props.navigation.state.params.ref, // skillID
    details: "",
    images: []
  }

  showPics = () => {
    return this.state.images.map((value, index) =>
      <Image
        key={index}
        source={{ uri: this.state.images[index] }}
        style={{
          height: height * 0.6,
          width: width * 1,
          resizeMode: "stretch"
        }}
      />
    )
  }

  // Creates a skill reference for specified user, then deletes the reference for admin user
  approveSkill(details) {
    let user_ref = firebase.database().ref("Skills").child(details.userid)
    var newSkillKey = user_ref.push(details).key
    user_ref.child(newSkillKey).update({ skillKey: newSkillKey })
    this.rejectSkill(this.state.skillkey, false)

    alert("You have approved the skill!")
    this.props.navigation.navigate("Admin")
  }

  // Deletes the reference for admin user only
  rejectSkill(key, boolean) {
    let user = firebase.auth().currentUser
    var user_ref = firebase.database().ref("Skills").child(user.uid).child(key)
    user_ref.remove()

    if (boolean == true) {
      alert("You have rejected this skill submission")
    }

    this.props.navigation.navigate("Admin")
  }

  componentDidMount() {
    let adminuid = firebase.auth().currentUser.uid
    let skill_ref = firebase
      .database()
      .ref("Skills")
      .child(adminuid)
      .child(this.state.skillkey)

    skill_ref.on("value", snapshot => {
      if (snapshot.exists()) {
        this.setState({ details: snapshot.val() })
        this.setState({ images: snapshot.val().image })
      } else {
      }
    })
  }

  render() {
    return (
      <View>
        <Header
          centerComponent={{
            text: "Skill Details",
            style: { fontSize: 20, fontWeight: "bold" }
          }}
          backgroundColor="white"
        />

        <ScrollView style={{ height: height * 0.8 }}>
          <View style={styles.container}>
            <Text
              style={{
                padding: 10,
                fontSize: 30,
                fontWeight: "bold",
                textAlign: "left",
                alignSelf: "stretch"
              }}
            >
              {this.state.details.skillName}
            </Text>

            <Swiper
              style={{ height: height * 0.6 }}
              horizontal={true}
              showsButtons={true}
              containerStyle={{ alignSelf: "stretch" }}
              activeDotColor={"white"}
              loop={false}
              removeClippedSubviews={false}
            >
              {this.showPics()}
            </Swiper>

            <ListItem // user dp and username
              leftAvatar={{
                source: { uri: this.state.details.userdp }
              }}
              title={this.state.details.username}
              containerStyle={{ width: width * 0.95 }}
              chevron
            />

            <Text style={styles.description}>
              {this.state.details.description}
            </Text>
          </View>
        </ScrollView>

        <View style={styles.bottomBtn}>
          <Button
            containerStyle={{
              marginLeft: 10,
              marginRight: 10,
              width: width * 0.4
            }}
            title="Approve"
            onPress={() => this.approveSkill(this.state.details)}
          />

          <Button
            containerStyle={{
              marginRight: 10,
              marginLeft: 10,
              width: width * 0.4
            }}
            title="Reject"
            onPress={() => this.rejectSkill(this.state.skillkey, true)}
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
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 17,
    width: width * 0.9,
    height: height * 0.3
  },
  bottomBtn: {
    flexDirection: "row",
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  fl: {
    marginTop: 20
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
  }
})
