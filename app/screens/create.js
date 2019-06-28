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
import { Item, Input, Label, Form, Subtitle } from "native-base"
import { Card, Header, Button } from "react-native-elements";
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
      <View style={styles.container}>
      <Header 
      centerComponent={{text: 'Create Listing', style:{ fontSize: 18, fontWeight: 'bold'}}}
      backgroundColor='#eaede6'
      />

      <ScrollView>
      <Card>
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
        <Image //item's image
        source={{uri: photo.path}}
        resizeMode= 'cover'
        style={{height: height*0.3, width: width*0.9}}
        />
        <TouchableOpacity
        style={styles.button}
        onPress={this.selectImage}
        >
        <Text> Choose photo </Text>
        </TouchableOpacity>
        </View>

        <Subtitle>Package</Subtitle>
        <View style={{flexDirection: "row", width: width * 0.6, height: 50 }}>
          <View style={{flex: 1}}>
          <Item underline style={{justifyContent: 'flex-end',}}>
            <Input
            placeholder="SGD"
            keyboardType="numeric"
            onChangeText={price => this.setState({ price })}
            value={this.state.price}
            />
            <Text> / </Text>
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

        <View style={ styles.desciption_box }>
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
        </Card>

        <View style={styles.submit_btn}>
        <Button
        containerStyle={{width: width * 0.80}}
        title="Submit"
        onPress={this.listingForm}
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
    justifyContent:"center",
    alignItems: "center"
  },
  input: {
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.85
  },
  button: {
    backgroundColor: "#DDDDDD",
    padding: 10,
    width: width * 0.8
  },
  submit_btn: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    padding:10
  },
  description_box: {
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray', 
    borderWidth: 1,
    borderRadius: 1,
    borderTopWidth: 1
  },
  description: {
    padding: 10,
    width: width * 0.85, 
    height: height * 0.3
  },
  image: {
    padding: 10,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  }
})
