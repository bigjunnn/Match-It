import React from "react"
import {
  StyleSheet,
  View,
  Dimensions,
  Linking,
  Picker,
  Platform
} from "react-native"
import { Form, Item, Input, Text, Button, Label } from "native-base"
import firebase from "firebase"
import { Header, Avatar } from "react-native-elements"
import ImagePicker from "react-native-image-crop-picker"
import RNFetchBlob from "rn-fetch-blob"

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class UpdateProfile extends React.Component {
  constructor() {
    super()
    this.state = {
      skillName: "",
      category: "",
      description: "",
      image: ""
    }
  }

  chooseImage = () => {
    ImagePicker.openPicker({
      mediaType: "photo"
    }).then(image => {
      const imagePath = image.path
      this.setState({ image: imagePath })
    })

    alert("You have uploaded a certificate!")
  }

  createSkill() {
    // NOTE: HARDCODED ADMIN UID
    let admin_uid = "CGIx1TmGQqYajo5jn7WXiiGvwrx2"
    let user = firebase.auth().currentUser
    let user_ref = firebase.database().ref("Skills").child(admin_uid)

    // Input Validation
    if (this.state.skillName == "") {
      alert("Please enter name of skill")
      return
    } else if (this.state.category == "") {
      alert("Please pick a skill category")
      return
    } else if (this.state.description == "") {
      alert("Please enter a description of skill")
      return
    } else if (this.state.image == "") {
      alert("Please upload a certificate")
      return
    } else {
      // Push skill info into DB
      var skillData = {
        userid: user.uid,
        skillName: this.state.skillName,
        category: this.state.category,
        description: this.state.description,
        image: this.state.image
      }

      var ref = user_ref.push(skillData)
      var skillKey = ref.key

      // Push image to firebase storage
      let imageRef = firebase.storage().ref(user.uid + "/Skills/" + skillKey)
      const uploadUri =
        Platform.OS === "ios"
          ? this.state.image.replace("file://", "")
          : this.state.image
      const mime = "image/jpg"

      const Blob = RNFetchBlob.polyfill.Blob
      const fs = RNFetchBlob.fs
      window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
      window.Blob = Blob

      fs
        .readFile(uploadUri, "base64")
        .then(data => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then(blob => {
          return imageRef.put(blob, { contentType: mime })
        })
        .then(() => {
          return imageRef.getDownloadURL()
        })
        .then(url => {
          user_ref.child(skillKey).update({ image: url, skill_id: skillKey })
        })
        .then(() => {
          alert("You have successfully added a new skill!")
        })
    }
  }

  render() {
    let user = firebase.auth().currentUser
    return (
      <View style={styles.container}>
        <Header
          backgroundColor="white"
          centerComponent={{
            text: "Add a Skill",
            style: { fontSize: 20, fontWeight: "bold" }
          }}
        />

        <Form style={({ color: "black" }, styles.input)}>
          <Item stackedLabel>
            <Label>Name of Skill</Label>
            <Input
              autoCapitalize="none"
              onChangeText={skillName => this.setState({ skillName })}
              value={this.state.skillName}
              style={{ width: width * 0.8, height: height * 0.1 }}
            />
          </Item>

          <Item
            stackedLabel
            style={{
              height: height * 0.2,
              alignContent: "center",
              alignItems: "center"
            }}
          >
            <Label>Description of Skill</Label>
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

          <Item stackedLabel style={{marginBottom: 20, height: height * 0.2}}>
            <Label>Skill Category</Label>
            <Picker
              style={styles.picker} // NOTE: Apparently this style field must be present for picker to work
              selectedValue={this.state.category}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ category: itemValue })}
            >
              <Picker.Item label="Select a Category" value="" />
              <Picker.Item label="Music" value="music" />
              <Picker.Item label="Education" value="book" />
              <Picker.Item label="Technical" value="cog" />
            </Picker>
          </Item>
        </Form>

        <Button
          block
          danger
          style={styles.submit}
          onPress={() => this.chooseImage()}
        >
          <Text>Upload Certificates</Text>
        </Button>

        <Button
          block
          danger
          style={styles.submit}
          onPress={() => this.createSkill()}
        >
          <Text>Submit</Text>
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
  },
  picker: {
    width: width * 0.8,
    height: height * 0.1,
    paddingLeft: 30
  }
})
