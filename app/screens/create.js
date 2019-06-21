import React from "react"
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  AsyncStorage,
  Dimensions,
  ScrollView,
  Platform
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Item, Input, Label, Form, Button, Content } from "native-base"
import firebase from "firebase"
import uuid from 'uuid/v4'; // Import UUID to generate UUID
import RNFetchBlob from 'rn-fetch-blob'

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class Home extends React.Component {
  state = { type: 1, title: "", photo: "", tag: "", price: "", price_type: "", description: "" }

  selectImage = () => {
    ImagePicker.openPicker({
      width: 250,
      height: 200,
      cropping: true
    }).then(response => {
      console.log("response", response);
        if (response.path) {
            this.setState({ photo: response })
        }
    })
  }

  listingForm = (type, title, tag, price, priceType, description) => {
    let user = firebase.auth().currentUser
    let usersRef = firebase.database().ref('Listing')
    // listing info to firebase db
    var listingData = {
      userid: user.uid,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      type: this.state.type,
      title: this.state.title,
      tag: this.state.tag,
      price: this.state.price,
      price_type: this.state.price_type,
      description: this.state.description
    }
    var ref= usersRef.push(listingData) //push to server
    var listingKey = ref.key
 
    // image to firebase storage
    let imageRef = firebase.storage().ref(user.uid + '/Listing/' + listingKey)
    const uploadUri = Platform.OS === 'ios' ? this.state.photo.path.replace('file://', '') : this.state.photo.path
    const mime = this.state.photo.mime

    const Blob = RNFetchBlob.polyfill.Blob
    const fs = RNFetchBlob.fs
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    window.Blob = Blob

    fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          return imageRef.put(blob, { contentType: mime })
        })
        .then(() => {
          return imageRef.getDownloadURL()
        }).then((url) => {
          usersRef.child(listingKey).update({ photo: url, id: listingKey })
        }).then(() => {
          alert("Your Listing has been uploaded to the marketplace!")
          this.props.navigation.navigate("Home")
        })

  }

  render() {
    let user = firebase.auth().currentUser.email
    let photo = this.state.photo

    return (
      <ScrollView>
      <View style={styles.container}>
        <Form style={styles.input}> 
        <Item floatingLabel>
          <Label>Title</Label>
          <Input
          autoCapitalize="none"
          onChangeText={title => this.setState({ title })}
          value={this.state.title}
          />
        </Item>
        
        <View style={ styles.image } >
        {/** Display selected image */}
        <Image 
          source={{ uri: photo.path }}
          style={{ width: 250, height: 200 }}
        />
        <TouchableOpacity
        style={styles.button}
        onPress={this.selectImage}
        >
        <Text> Choose photo </Text>
        </TouchableOpacity>
        </View>

        <View style={{flexDirection: "row", width: width * 0.6, height: 50 }}>
          <View style={{flex: 1}}>
          <Item underline style={{justifyContent: 'flex-end',}}>
            <Input
            placeholder="SGD"
            keyboardType="numeric"
            onChangeText={price => this.setState({ price })}
            value={this.state.price}
            />
            <Text>/</Text>
          </Item>
          </View>
          <View style={{flex: 1}}>
          <Item underline style={{justifyContent: 'flex-end',}}>
            <Input
            placeholder="Rate"
            onChangeText={price_type => this.setState({ price_type })}
            value={this.state.price_type}
            />
          </Item>
          </View>

        </View>

        <View>
        <Item stackedLabel style={ styles.description }>
          <Label>Description</Label>
          <Input
          multiline={true}
          onContentSizeChange={(e) => {
            numOfLinesCompany = e.nativeEvent.contentSize.height / 18;
          }}
          onChangeText={description => this.setState({ description })}
          value={this.state.description}
          maxLength={300}
          />
        </Item>
        </View>

        </Form>

        <Button style={styles.submit_btn} onPress={this.listingForm}>
          <Text>Submit</Text>
        </Button>

      </View>
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:"center",
    alignItems: "center"
  },
  input: {
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.8
  },
  button: {
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  submit_btn: {
    width:170,
    backgroundColor: 'rgb(3, 154, 229)',
    marginTop: 20,
    justifyContent:"center",
    alignItems: "center"
  },
  description: {
    padding: 10,
    marginTop: 10,
    width: width * 0.8, 
    height: height * 0.3, 
    borderColor: 'gray', 
    borderWidth: 1,
    borderRadius: 1,
    borderTopWidth: 0.2,
    borderRightWidth: 0.2,
    borderLeftWidth: 0.2
  },
  image: {
    padding: 10,
    marginTop: 10
  }
})
