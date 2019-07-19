import React from "react"
import { StyleSheet, View, Dimensions, Linking } from "react-native"
import { Form, Item, Input, Text, Button, Label } from "native-base"
import firebase from "firebase"
import { Header, Avatar } from "react-native-elements"
import ImagePicker from "react-native-image-crop-picker"
import RNFetchBlob from "rn-fetch-blob"

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class UpdateProfile extends React.Component {
  // Manage State
  state = {
    user: firebase.auth().currentUser,
    username: firebase.auth().currentUser.displayName,
    avatar: firebase.auth().currentUser.photoURL,
    description: ""
  }

  verifyUsername() {
    //detected changes, proceed to verify
    if (this.state.username !== this.state.user.displayName) {
      firebase
        .database()
        .ref("Usernames")
        .child(this.state.username)
        .once("value", snapshot => {
          return snapshot.exists()
        })
        .then(exist => {
          if (exist) {
            this.verify()
          } else {
            alert("Username is taken! Try again!")
          }
        })
    } else {
      this.verify()
    }
  }

  verify() {
    this.uploadImage(this.state.avatar)
  }

  updateUsername = () => {
    var userf = firebase.auth().currentUser
    firebase.database().ref("Usernames").child(userf.displayName).remove()
    firebase
      .database()
      .ref("Usernames")
      .child(this.state.username)
      .set(userf.uid)
    userf
      .updateProfile({
        displayName: this.state.username
      })
      .then(() => {
        alert("Your profile has been updated!")
        this.props.navigation.navigate("Profile")
      })
  }

  updateAvatar = () => {
    var userf = firebase.auth().currentUser
    userf.updateProfile({
      photoURL: this.state.avatar
    })
  }

  uploadImage(uri) {
    // Prepare Blob support
    window = global
    const Blob = RNFetchBlob.polyfill.Blob
    const fs = RNFetchBlob.fs
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    window.Blob = Blob
    var userf = firebase.auth().currentUser

    const imageRef = firebase.storage().ref(userf.uid).child("dp.jpg")
    const mime = "image/jpg"

    fs
      .readFile(uri, "base64")
      .then(data => {
        return Blob.build(data, { type: `${mime};BASE64` })
      })
      .then(blob => {
        uploadBlob = blob
        return imageRef.put(blob, { contentType: mime })
      })
      .then(() => {
        return imageRef.getDownloadURL()
      })
      .then(url => {
        this.setState({ avatar: url })
      })
      .then(() => {
        this.updateProfile()
      })
  }

  chooseImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      mediaType: "photo"
    }).then(image => {
      const imagePath = image.path
      this.setState({ avatar: imagePath })
    })
  }

  updateDatabase() {
    firebase.database().ref("Users/" + this.state.user.uid).update({
      username: this.state.username,
      profilepic: this.state.avatar,
      description: this.state.description
    })
  }

  updateProfile = () => {
    this.updateDatabase()
    this.updateUsername()
    this.updateAvatar()
  }

  componentDidMount() {
    firebase
      .database()
      .ref("Users/" + this.state.user.uid)
      .once("value", snapshot => {
        if (snapshot.val().description !== undefined) {
          this.setState({ description: snapshot.val().description })
        }
      })
  }

  render() {
    let user = firebase.auth().currentUser
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="white"
          centerComponent={{
            text: "Update Profile",
            style: { fontSize: 20, fontWeight: "bold" }
          }}
        />

        <Form style={({ color: "black" }, styles.input)}>
          <Item stackedLabel>
            <Label>Username</Label>
            <Input
              autoCapitalize="none"
              maxLength={12}
              onChangeText={username => this.setState({ username })}
              value={this.state.username}
              style={{ width: width * 0.8, height: height * 0.1 }}
            />
          </Item>

          <Avatar
            size={width * 0.5}
            source={{ uri: this.state.avatar }}
            containerStyle={{ padding: 10 }}
            showEditButton
            onEditPress={() => this.chooseImage()}
          />

          <Item
            stackedLabel
            style={{
              height: height * 0.2,
              alignContent: "center",
              alignItems: "center"
            }}
          >
            <Label>Description</Label>
            <Input
              autoCapitalize="none"
              maxLength={100}
              multiline={true}
              onContentSizeChange={e => {
                numOfLinesCompany = e.nativeEvent.contentSize.height / 18
              }}
              onChangeText={description => this.setState({ description })}
              value={this.state.description}
              style={{ width: width * 0.8, height: height * 0.4 }}
            />
          </Item>
        </Form>

        <Button
          block
          danger
          style={styles.submit}
          onPress={() => this.verify()}
        >
          <Text>Update</Text>
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // backgroundColor: "#fff6f5"
  },
  input: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.8,
    paddingLeft: 30
  },
  terms: {
    marginTop: 25,
    width: width * 0.6,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 50
  },
  loginDirect: {
    marginTop: 10,
    width: width * 0.6,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 30
  },
  submit: {
    opacity: 0.8,
    marginTop: 50,
    paddingTop: 10,
    marginLeft: 90,
    marginRight: 90
  },
  description_box: {
    padding: 10,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 1,
    borderTopWidth: 1
  }
})
