import React from "react"
import {
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  ScrollView
} from 'react-native';
import { Form, Input, Item } from "native-base"
import { Header, Text, AirbnbRating, Button } from "react-native-elements";
import firebase from "firebase"

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class Ratings extends React.Component {
    state = { 
        user: firebase.auth().currentUser, 
        servicer_id: this.props.navigation.state.params.servicer_id, //servicer_id
        item_key: this.props.navigation.state.params.ref, //item id,
        service_rate: 3,
        service_review: '',
        provider_rate: 3,
        provider_review: ''
    }

    submitReview() { 
      let list_ref = firebase.database().ref('Review/Listing').child(this.state.item_key)
      list_ref.push({
        reviewer_id: this.state.user.uid,
        reviewer_name: this.state.user.displayName,
        service_rate: this.state.service_rate,
        service_review: this.state.service_review
      })

      let user_ref = firebase.database().ref('Review/Users').child(this.state.servicer_id)
      user_ref.push({
        reviewer_id: this.state.user.uid,
        reviewer_name: this.state.user.displayName,
        provider_rate: this.state.provider_rate,
        provider_review: this.state.provider_review
      }).then(() => {
      
      let info = firebase.database().ref('Users').child(this.state.servicer_id).child('review')
      var count = 0
      var total_stars = 0
      info.once("value").then(snapshot => {
        if (snapshot.exists()) {
          count = snapshot.val().count
          total_stars = snapshot.val().total_stars
        }
      }).then(() => {
        info.update({
          count: count + 1,
          total_stars: total_stars + this.state.provider_rate
        })
      })

      })

      alert('Review Submitted!')
      this.props.navigation.navigate("Inbox")
    }

    displayForm() {
    return (
        <Form style={{marginTop: 20}}>
        <Text h4>How satisfied are you with the service?</Text>
        <AirbnbRating
        count={5}
        onFinishRating={(rating)=> this.setState({service_rate: rating})}
        reviews={['Terrible', 'Meh', 'Hmm...', 'Very Good','Wow']}
        defaultRating={3}
        />

        <Text h5 style={{marginTop: 20, padding: 10}}>Your review on the service</Text>
        <Item regular style={{height: height * 0.20, alignContent: 'center', alignItems: 'center'}}>
          <Input 
          placeholder="What is lacking/ impressive from the service?" 
          multiline={true}
          onContentSizeChange={(e) => {
            numOfLinesCompany = e.nativeEvent.contentSize.height / 18;
          }}
          onChangeText={details => this.setState({ service_review: details })}
          maxLength={300}
          />
        </Item>

        <Text h4 style={{marginTop: 30}}>Did the provider perform up to expectations?</Text>
        <AirbnbRating
        count={5}
        onFinishRating={(rating)=> this.setState({provider_rate: rating})}
        reviews={['Terrible', 'Meh...', 'Average', 'Impressive!','Star Player!']}
        defaultRating={3}
        />

        <Text h5 style={{marginTop: 20, padding: 10}}>Your review on the provider</Text>
        <Item regular style={{height: height * 0.20, alignContent: 'center', alignItems: 'center'}}>
          <Input 
          placeholder="Rooms for improvement? Praises for the provider?" 
          multiline={true}
          onContentSizeChange={(e) => {
            numOfLinesCompany = e.nativeEvent.contentSize.height / 18;
          }}
          maxLength={300}
          onChangeText={details => this.setState({ provider_review: details })}
          />
        </Item>

        <View style={styles.submit_btn}>
        <Button
        containerStyle={{width: width * 0.80}}
        title="Submit"
        onPress={() => this.submitReview()}
        />
        </View>

        </Form>
    )}

    render() {
    return (
    <View>
    <ScrollView>
    {/** form inputs */}
    {this.displayForm()}
    </ScrollView>  
    </View> 
    )}
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    submit_btn: {
      marginTop: 20,
      justifyContent: "center",
      alignItems: "center",
      padding:10,
      marginBottom: height * 0.1
    }
  })