import React from "react"
import {
  StyleSheet,
  View,
  Dimensions,
  Linking,
  Picker,
  Platform,
  ScrollView
} from "react-native"
import { Form, Item, Input, Text, Button, Label } from "native-base"
import firebase from "firebase"
import { Header, Avatar } from "react-native-elements"
import { TextField } from "react-native-material-textfield"
import SectionedMultiSelect from "react-native-sectioned-multi-select"
import ImagePicker from "react-native-image-crop-picker"
import RNFetchBlob from "rn-fetch-blob"

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height

// Self-defined categories
// name: display name for selection, value: name of icon
const categories = [
  {
    name: "Education",
    value: "book",
    id: 0
  },
  {
    name: "Technical",
    value: "cog",
    id: 1
  },
  {
    name: "Handyman Services",
    value: "tools",
    id: 2
  },
  {
    name: "Music",
    value: "music",
    id: 3
  }
]

export default class SkillProfile extends React.Component {
  constructor(props) {
    super(props)

    let category_ref = firebase.database().ref("Categories")
    for (let i = 0; i < categories.length; i++) {
      var name = categories[i].name
      var value = categories[i].value
      category_ref.child(name).update({ value })
    }

    this.state = {
      skillName: "",
      category: "",
      description: "",
      image: [],
      errors: "",
      selectedItems: []
    }
  }

  selectImage = () => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 250,
      compressImageMaxHeight: 200,
      forceJpg: true,
      multiple: true
    }).then(response => {
      this.setState({
        image: response.map(i => {
          return { path: i.path, mime: i.mime }
        })
      })
    })
  }

  uploadImage(image, image_name, skillKey) {
    let user = firebase.auth().currentUser
    let imageRef = firebase
      .storage()
      .ref(user.uid + "/Skills/" + skillKey + "/")
      .child(image_name)
    const mime = image.mime

    window = global
    const Blob = RNFetchBlob.polyfill.Blob
    const fs = RNFetchBlob.fs
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    window.Blob = Blob

    return new Promise((resolve, reject) => {
      const uploadUri =
        Platform.OS === "ios" ? image.path.replace("file://", "") : image.path

      fs
        .readFile(uploadUri, "base64")
        .then(data => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then(blob => {
          return imageRef.put(blob, { contentType: mime })
        })
        .then(() => {
          resolve(imageRef.getDownloadURL())
        })
        .catch(error => {
          console.log("error", error)
          reject()
        })
    })
  }

  async uploadImages(skillKey) {
    const uploadImagePromises = this.state.image.map((img, index) =>
      this.uploadImage(img, "image_" + index, skillKey)
    )
    const urls = await Promise.all(uploadImagePromises)
    firebase
      .database()
      .ref("Skills")
      .child("CGIx1TmGQqYajo5jn7WXiiGvwrx2")
      .child(skillKey)
      .update({ image: urls })
      .then(() => {
        alert("Your skills have been sent for approval")
      })
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems })
    let category_ref = firebase
      .database()
      .ref("Categories")
      .child(selectedItems[0])
    category_ref.on("value", snapshot => {
      var iconName = snapshot.val().value
      this.setState({ category: iconName })
    })
  }

  onSubmit = () => {
    let errors = {}
    var checker = true

    if (this.state.skillName == "") {
      errors.skillName = "Should not be empty"
      checker = false
    }

    if (this.state.description == "") {
      errors.description = "Should not be empty"
      checker = false
    }

    if (this.state.selectedItems[0] === undefined) {
      errors.category = "Please select a category"
      checker = false
    }
    if (this.state.image[0] === undefined) {
      errors.image = "Please upload certificates"
      checker = false
    }

    this.setState({ errors })

    if (checker) {
      // Proceed to createSkill
      this.createSkill()
    }
  }

  createSkill = () => {
    // NOTE: HARDCODED ADMIN UID
    let admin_uid = "CGIx1TmGQqYajo5jn7WXiiGvwrx2"
    let user = firebase.auth().currentUser
    let user_ref = firebase.database().ref("Skills").child(admin_uid)

    // Push skill info into DB
    var skillData = {
      userid: user.uid,
      skillName: this.state.skillName,
      category: this.state.category,
      description: this.state.description
    }

    var ref = user_ref.push(skillData)
    var skillKey = ref.key
    this.uploadImages(skillKey)
    user_ref.child(skillKey).update({ skillKey: skillKey })
  }

  render() {
    let user = firebase.auth().currentUser
    let errors = this.state.errors

    return (
      <View style={styles.container}>
        <Header
          backgroundColor="white"
          centerComponent={{
            text: "Add a Skill",
            style: { fontSize: 20, fontWeight: "bold" }
          }}
        />

        <ScrollView style={{ padding: 20 }}>
          <View style={styles.input}>
            <TextField
              value={this.state.skillName}
              ref={this.skillNameRef}
              onChangeText={skillName => this.setState({ skillName })}
              label="Name of Skill"
              autoCapitalize="none"
              characterRestriction={30}
              maxLength={30}
              containerStyle={{ width: width * 0.8, alignSelf: "center" }}
              error={errors.skillName}
            />

            <TextField
              ref={this.descriptionRef}
              onChangeText={description => this.setState({ description })}
              value={this.state.description}
              multiline={true}
              onContentSizeChange={e => {
                numOfLinesCompany = e.nativeEvent.contentSize.height / 18
              }}
              onChangeText={description => this.setState({ description })}
              label="Description"
              placeholder="Briefly describe your skill"
              autoCapitalize="none"
              characterRestriction={200}
              maxLength={200}
              inputContainerStyle={styles.description}
              labelHeight={1}
              labelFontSize={15}
              labelPadding={10}
              labelTextStyle={{ color: "black" }}
              error={errors.description}
            />

            <View style={{ width: width * 0.8, alignSelf: "center" }}>
              <SectionedMultiSelect
                items={categories}
                uniqueKey="name"
                selectText="Pick a Category"
                showDropDowns={true}
                single={true}
                onSelectedItemsChange={this.onSelectedItemsChange}
                selectedItems={this.state.selectedItems}
              />
              {errors.category !== "" &&
                <Text style={styles.errorText}>
                  {errors.category}
                </Text>}
            </View>

            <Button
              block
              danger
              style={{ marginTop: 20 }}
              onPress={this.selectImage}
            >
              <Text>Upload Certificates</Text>
            </Button>
            {errors.image !== "" &&
              <Text style={styles.errorText}>
                {errors.image}
              </Text>}

            <Button
              block
              danger
              style={{ marginTop: 20 }}
              onPress={this.onSubmit}
            >
              <Text>Submit</Text>
            </Button>
          </View>
        </ScrollView>
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
  },
  description: {
    padding: 10,
    marginTop: 40,
    width: width * 0.8,
    height: height * 0.3,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#969595",
    alignSelf: "center"
  },
  errorText: {
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 14,
    color: "red"
  }
})
