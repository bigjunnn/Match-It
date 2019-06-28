import React from "react"
import { 
    StyleSheet, 
    Image, 
    Text, 
    View,
    Dimensions,
    ScrollView
} from "react-native"
import { Title, Subtitle, H1 } from "native-base"
import { Icon, ListItem, Card, Header, Button } from "react-native-elements";
import firebase from "firebase"
import { tsThisType } from "@babel/types";

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class Details extends React.Component {
    state = {
      key: this.props.navigation.state.params.ref, 
      details: '', 
      servicer: ''
    }

    linkProfile() {
      let user = firebase.auth().currentUser
      if (this.state.servicer.userid === user.uid) {
        this.props.navigation.navigate("Profile")
      } else {
        this.props.navigation.navigate("ServicerProfile", {ref: this.state.servicer.userid})
      }
    }

    pendingService() {
      let user = firebase.auth().currentUser
      let book_ref = firebase.database().ref('Booking').child('Pending')

      book_ref.push({
        request_id: user.uid,
        request_name: user.displayName,
        servicer_id: this.state.servicer.userid,
        servicer_name: this.state.servicer.username,
        itempic: this.state.details.photo,
        itemid: this.state.key,
        itemname: this.state.details.title,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      }).then(() => {
        alert("Request to book service has been sent!")
      })
    }

    /**
    allowChat() {
      let user = firebase.auth().currentUser
      if (this.state.servicer.userid !== user.uid) {
        <Icon 
        name='message' 
        onPress= {() => this.props.navigation.navigate("Chat", {ref: this.state.servicer.userid})}
        />
      }
    }

    showBtn() {
      let user = firebase.auth().currentUser
      if (this.state.servicer.userid !== user.uid) {
        return 1
      } else {
        return 0
      }
    }
    */

    componentDidMount() {
        var key = this.props.navigation.state.params.ref
        let data_ref = firebase.database().ref('Listing').child(key)
        this.setState({key: key})

        data_ref.once("value").then(snapshot => {
          var items = {
              id: snapshot.val().id,
              title: snapshot.val().title,
              description: snapshot.val().description,
              price: snapshot.val().price,
              price_type: snapshot.val().price_type,
              type: snapshot.val().type,
              tag: snapshot.val().tag,
              photo: snapshot.val().photo,
              userid: snapshot.val().userid
          }
          this.setState({ details: items })
        }).then(() => {
          let user_ref = firebase.database().ref('Users').child(this.state.details.userid)
          user_ref.once("value").then(snapshot => {
            var user = {
                userid: snapshot.val().userid,
                username: snapshot.val().username,
                profilepic: snapshot.val().profilepic
            }
            this.setState({ servicer: user })
          })
        })
        
    }

    render() {
        return (
          <View>
          <Header 
          centerComponent={{text: `${this.state.details.title}`, style:{ fontSize: 20, fontWeight: 'bold'}}}
          rightComponent={
            <Icon 
            name='message' 
            onPress= {() => this.props.navigation.navigate("Chat", {ref: this.state.servicer.userid, ref_name: this.state.servicer.username})}
            />
          }
          backgroundColor='#e6ebed'
          />
          
          <ScrollView style={{height: height*0.8}}>
          <View style={styles.container}>
            <Card>
              <H1 style={{padding:10, fontWeight:'bold'}}>{this.state.details.title}</H1>

              <Image //item's image
                source={{uri: this.state.details.photo}}
                resizeMode= 'cover'
                style={{height: height*0.3, width: width*0.9}}
              />

              <ListItem //servicer dp and username
                leftAvatar={{
                  source: { uri: this.state.servicer.profilepic }
                }}
                title={this.state.servicer.username}
                onPress={() => this.linkProfile()}
                chevron
              />

              <Subtitle>Package</Subtitle>
              <Title>{this.state.details.price} / {this.state.details.price_type}</Title>

              <Text style={styles.description} >{this.state.details.description}</Text>
              
            </Card>

          </View>
          </ScrollView>

          <View style={styles.bottomBtn}>
            <Button
            containerStyle={{width: width * 0.1}}
            type="clear"
            icon={
            <Icon
              name="bookmark"
            />}
            />

            <Button
            containerStyle={{width: width * 0.80}}
            title="Book Service"
            onPress={() => this.pendingService()}
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
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 17
    },
    bottomBtn: {
      flexDirection: 'row', 
      bottom:0,
      justifyContent: "center",
      alignItems: "center"
    }
})