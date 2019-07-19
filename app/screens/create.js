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
} from "react-native"
import ImagePicker from "react-native-image-crop-picker"
import { Item, Input, Label} from "native-base"
import { Header, Button } from "react-native-elements"
import { TextField } from "react-native-material-textfield"
import firebase from "firebase"
import 'firebase/firestore'
import RNFetchBlob from "rn-fetch-blob"
import SectionedMultiSelect from "react-native-sectioned-multi-select"
import TagInput from "react-native-tag-input"
import Swiper from "react-native-swiper"

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
const pkg_name = ["Basic", "Premium", "Exclusive"]

export default class Create extends React.Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
    this.titleRef = this.updateRef.bind(this, 'title')
    this.descriptionRef = this.updateRef.bind(this, 'description')

    this.state = {
      type: 1,
      title: "",
      photo: [],
      tag: "",
      package: [{price: "", price_type: "", info: ""}],
      description: "",
      items: [],
      selectedItems: [],
      tags: [],
      text: "",
      errors: "",
      disableAdd: false,
      disableMinus: true
    }
  }

  componentDidMount() {
    this.loadCategory()
  }

  loadCategory() {
    window = undefined
    let ref = firebase.firestore().collection('Category')
    var counter = 1000 // "unique" id generator
    let data = ref.get()
      .then(snapshot => {
        items = []
        snapshot.forEach(doc => {
          names = []
          let db = doc.data()
          Object.keys(db).forEach((key) => {
            names.push({
              name: key,
              id: db[key]
            })
          })

          items.push({
            name: doc.id,
            id: counter,
            children: names
          })

          counter = counter + 1000 //update "unique" id generator

        })

        this.setState({items})
      })
  }

  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
  }

  selectImage = () => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 250,
      compressImageMaxHeight: 200,
      forceJpg: true,
      multiple: true,
    }).then(response => {
      this.setState({
        photo: response.map(i => {
          return { path: i.path, mime: i.mime }
        })
      })
    })
  }

  onChangeText_tags = (text) => {
    this.setState({ text });

    const lastTyped = text.charAt(text.length - 1);
    const parseWhen = [' '];

    if (parseWhen.indexOf(lastTyped) > -1) {
      this.setState({
        tags: [...this.state.tags, this.state.text],
        text: "",
      });
    }
  }

  onSubmit() {
    let errors = {};
    var checker = true;

    ['title', 'description']
      .forEach((name) => {
        let value = this[name].value();

        if (!value) {
          errors[name] = 'Should not be empty';
          checker = false
        }
      })

    if (this.state.selectedItems[0] === undefined) {
      errors.category = "Please select a category"
      checker = false
    }
    if (this.state.photo === "") {
      errors.photo = "Please select a photo"
      checker = false
    }

    var arr = this.state.package.slice()
    arr.forEach(x => {
      if (x.price === "" || x.price_type === "") {
        errors.package = "Price and Rate should not be empty"
        checker = false
        return
      }
    })

    this.setState({ errors })

    if (checker) { //proceed to upload listing
      this.uploadData()
    }
  }

  updateTags() {
    let ref = firebase.firestore().collection('Tags').doc('General')
    let FieldValue = firebase.firestore.FieldValue
    this.state.tags.forEach((item) => {
      ref.update(item, FieldValue.increment(1))
    })
  }

  uploadData() {
    window = undefined
    let FieldValue = firebase.firestore.FieldValue
    let ref = firebase.firestore().collection('Listing').doc()
    let setDoc = ref.set({
      id: ref.id,
      userid: firebase.auth().currentUser.uid,
      createdAt: FieldValue.serverTimestamp(),
      title: this.state.title,
      type: this.state.type,
      category: this.state.selectedItems[0],
      tags: this.state.tags,
      package: this.state.package,
      description: this.state.description
    }).then(() => {
      this.uploadImages(ref.id)
    }).then(() => {
      this.updateTags()
    })
  }

  uploadImage(image, image_name, listingKey) {
    let user = firebase.auth().currentUser
    let imageRef = firebase.storage().ref(user.uid + "/Listing/" + listingKey + "/").child(image_name)
    const mime = image.mime

    window = global
    const Blob = RNFetchBlob.polyfill.Blob
    const fs = RNFetchBlob.fs
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    window.Blob = Blob

    return new Promise((resolve, reject) => {
      const uploadUri =
        Platform.OS === "ios"
          ? image.path.replace("file://", "")
          : image.path
      
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

  async uploadImages(listingKey) {
    const uploadImagePromises = this.state.photo.map((img, index) => this.uploadImage(img, "image_" + index ,listingKey))
    const url = await Promise.all(uploadImagePromises)
    let urls = url
    if (!Array.isArray(url)) {
      let arr = []
      arr.push(url)
      urls = arr
    }
    firebase.firestore().collection('Listing').doc(listingKey)
    .update({ photo: urls })
    .then(() => {
      alert("Your Listing has been uploaded to the marketplace!")
      this.props.navigation.navigate("Home")
    })
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  onChangeTextField(value, type, index) {
    var arr = this.state.package.slice() // copy array
    switch (type) { // manipulate array
      case "price":
        arr[index].price = value
        break;
      case "price_type":
        arr[index].price_type = value
        break;
      case "info":
        arr[index].info = value
        break;
    }
    this.setState({ package: arr }) //set amended array
  }

  addField() {
    var denyFurther = false
    var data = { price: "", price_type: "", info: "" }
    if (this.state.package.length >= 2) {
      denyFurther = true
    }

    this.setState({ 
      package: [...this.state.package, data],
      disableAdd: denyFurther,
      disableMinus: false
    })
  }

  minusField() {
    let arr = this.state.package.slice()
    arr.pop()
    var denyMinus = false
    if (arr.length === 1) {
      denyMinus = true
    }

    this.setState({ 
      package: arr,
      disableAdd: false,
      disableMinus: denyMinus
    })
  }

  packageFields() {
    let arr = this.state.package.slice()
    return arr.map((value, index) => 
      <View key={index} style={{padding:10}}>
        <Text style={styles.title}>{pkg_name[index]}</Text>
        <View style={ styles.pkg_price }>
          <TextInput
            placeholder="SGD"
            keyboardType="numeric"
            onChangeText={x => this.onChangeTextField(x, "price", index)}
            value={value.price}
            maxLength={4}
            style={{width: 70}}
          />

          <Text>  /  </Text>

          <TextInput
            placeholder="Rate"
            onChangeText={x => this.onChangeTextField(x, "price_type", index)}
            value={value.price_type}
            maxLength={12}
            style={{width: 70}}
          />
        </View>

        <TextInput
          placeholder="Info (Optional)"
          multiline={true}
          onContentSizeChange={e => {
            numOfLinesCompany = e.nativeEvent.contentSize.height / 18
          }}
          onChangeText={x => this.onChangeTextField(x, "info", index)}
          value={this.state.package[index].info}
          maxLength={50}
          style={styles.pkg_info}
        />
        
      </View>
    )
  }

  showPics() {
    return this.state.photo.map((value, index) => 
      <Image key={index}
        source={{uri: this.state.photo[index].path}}
        style={{ height: height * 0.3, width: width}}
      />
    )
  }

  render() {
    let user = firebase.auth().currentUser.email
    let photo = this.state.photo
    let errors = this.state.errors

    return (
      <View style={styles.container}>
        <Header
          centerComponent={{
            text: "Create Listing",
            style: { fontSize: 20, fontWeight: "bold" }
          }}
          backgroundColor="white"
        />

        <ScrollView style={{padding: 20}}>
          <View style={styles.input}>
            <TextField
              value={this.state.title}
              ref={this.titleRef}
              onChangeText={(title) => this.setState({ title })}
              label='Title'
              autoCapitalize="none"
              characterRestriction={30}
              maxLength={30}
              containerStyle={{ width: width * 0.80, alignSelf: "center"}}
              error={errors.title}
            />

            <View style={styles.image}>
              {/** Display selected image */}
              {photo[0] !== undefined && (
                <Swiper style={{ height: height * 0.3, marginBottom: 10}} horizontal={true} showsButtons={true}>
                  {this.showPics()}
                </Swiper>
              )}
              <TouchableOpacity
                style={styles.button}
                onPress={this.selectImage}
              >
                <Text style={styles.btnText}>Choose photo</Text>
              </TouchableOpacity>
              {errors.photo !== '' && (
                <Text style={styles.errorText}>{errors.photo}</Text>
              )}
            </View>
            
            <View style={{alignSelf: "center", width: width * 0.8}}>
            <Text style={styles.title}> Package </Text>
            </View>
            <View style={{flexDirection: 'row', width: width * 0.8, alignSelf: "center"}}>
              <View style={{ flexDirection:'row' ,width: width * 0.70}}>
                <ScrollView horizontal={true}>
                  {this.packageFields()}
                </ScrollView>
              </View>
              
              <View style={{flexDirection: 'column', width: width * 0.1, height: 35}}>
                <Button title="+" onPress={() => this.addField()} disabled={this.state.disableAdd}/>
                <Button title="-" onPress={() => this.minusField()} disabled={this.state.disableMinus}/>
              </View>
            </View>
            {errors.package !== '' && (
              <Text style={styles.errorText}>{errors.package}</Text>
            )}

            <View style={{width: width * 0.8, alignSelf: "center"}}>
              <SectionedMultiSelect
                items={this.state.items}
                uniqueKey="name"
                subKey="children"
                selectText="Choose Category"
                showDropDowns={true}
                readOnlyHeadings={true}
                single={true}
                onSelectedItemsChange={this.onSelectedItemsChange}
                selectedItems={this.state.selectedItems}
              />
              {errors.category !== '' && (
                <Text style={styles.errorText}>{errors.category}</Text>
              )}
            </View>
            
            <View style={{width: width * 0.8, alignSelf: "center"}}>
            <Text style={styles.title}># Tags (Optional)</Text>
              <View style={{borderWidth: 1, borderRadius: 3, borderColor: '#d4d2d2'}}>
              <ScrollView style={{padding:5}}>
              <TagInput
                value={this.state.tags}
                onChange={(tags) => this.setState({ tags })}
                labelExtractor={(tag) => tag}
                text={this.state.text}
                onChangeText={this.onChangeText_tags}
                tagTextStyle={{fontSize: 14}}
                tagContainerStyle={{height: 30}}
                maxHeight={75}
              />
              </ScrollView>
              </View>
            </View>
            
            <TextField
              ref={this.descriptionRef}
              onChangeText={(description) => this.setState({ description })}
              value={this.state.description}
              multiline={true}
              onContentSizeChange={e => {
                numOfLinesCompany = e.nativeEvent.contentSize.height / 18
              }}
              onChangeText={(description) => this.setState({ description })}
              label="Description"
              placeholder="Describe your service"
              autoCapitalize="none"
              characterRestriction={300}
              maxLength={300}
              inputContainerStyle={styles.description}
              labelHeight={1}
              labelFontSize={15}
              labelPadding={10}
              labelTextStyle={{color:'black'}}
              error={errors.description}
            />
            
          </View>

          <View style={styles.submit_btn}>
            <Button
              containerStyle={{ width: width * 0.8 }}
              title="Submit"
              onPress={this.onSubmit}
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
  button: {
    backgroundColor: "#DDDDDD",
    padding: 10,
    width: 200,
    alignSelf: "center",
    borderRadius: 5
  },
  btnText: {
    textAlign: "center"
  },
  submit_btn: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    paddingBottom: 5, 
    fontSize: 15,
    color: 'grey',
  },
  description: {
    padding: 10,
    marginTop: 40,
    width: width * 0.80,
    height: height * 0.3,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#969595',
    alignSelf: "center"
  },
  errorText: {
    marginBottom: 10, 
    marginLeft: 10, 
    fontSize: 12, 
    color: "red"
  },
  image: {
    padding: 10,
    marginTop: 10
  },
  pkg_price: {
    height: 35,
    flexDirection:'row',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "grey",
    padding: 5,
    marginBottom: 5,
    width: 160
  },
  pkg_info: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "grey",
    padding: 5,
    height: 70,
    width: 160
  }
})
