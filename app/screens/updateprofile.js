import React from "react"
import { StyleSheet, View, Dimensions, Linking } from "react-native"
import {
  Form,
  Title,
  Item,
  Input,
  Text,
  Button,
  Content,
  Label
} from "native-base"
import firebase from "firebase"
import ImagePicker from "react-native-image-crop-picker"
import RNFetchBlob from "rn-fetch-blob"

var width = Dimensions.get("window").width

export default class Register extends React.Component {
  // Manage State
  state = { username: "", avatar: "" }

  updateUsername = () => {
    var userf = firebase.auth().currentUser
    userf.updateProfile({
      displayName: this.state.username
    })

    alert("Your display name has been changed!")
  }

  updateAvatar = () => {
    var userf = firebase.auth().currentUser
    userf.updateProfile({
      photoURL: this.state.avatar
    })
    alert("Your profile picture has been changed!")
  }

  uploadImage = uri => {
    // Prepare Blob support
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
        alert("Upload successful!")
        return imageRef.getDownloadURL()
      })
      .then(url => {
        this.setState({ avatar: url })
        this.updateAvatar()
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
      this.uploadImage(imagePath)
    })
  }

  render() {
    let user = firebase.auth().currentUser
    return (
      <View style={styles.container}>
        <Title
          style={{
            fontFamily: "Lobster-Regular",
            fontSize: 60,
            color: "black",
            marginTop: 30
          }}
        >
          Update Profile
        </Title>

        <Form style={({ color: "black" }, styles.input)}>
          <Item floatingLabel>
            <Label>Enter your new name</Label>
            <Input
              autoCapitalize="none"
              onChangeText={username => this.setState({ username })}
              value={this.state.username}
            />
          </Item>
        </Form>

        <Button
          block
          danger
          style={styles.submit}
          onPress={this.updateUsername}
        >
          <Text>Change Username</Text>
        </Button>

        <Button block danger style={styles.submit} onPress={this.chooseImage}>
          <Text>Change Profile Picture</Text>
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff6f5"
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
  }
})
