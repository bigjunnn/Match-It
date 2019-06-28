import React from "react"
import { View } from "react-native"
import { Header } from "react-native-elements"
import { GiftedChat } from "react-native-gifted-chat"
import firebase from "firebase"

// NOTE: Chat itself is working, hardcoded now
// TO-DO: Able to get chateeID automatically, send images in chat + video maybe?
export default class Chat extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || "Chat!"
  })

  // Define state for messages
  state = {
    messages: [],
    partyid: this.props.navigation.state.params.ref,
    partyname: this.props.navigation.state.params.ref_name
  }

  // Getters
  get uid() {
    return (firebase.auth().currentUser || {}).uid
  }

  // NOTE: use these accounts to test for chats
  // Chat between hello123 + testing123 => tester1 cannot see the messages
  get chateeUID() {
    return this.state.partyid
    // UID for hello123 account, HARD CODED
    // xEjxOG70eWON9urObTWm4IBzkLC2 --
    // UID for tester1 account, HARD CODED
    // I8UHUaV2EETZqGCQmIBM8Xc8Ufo2
    // UID for testing123 account, HARD CODED
    // 6MabX34Mn7XN4kI9RW27DuAsvoa2
    // UID for tester123 account, HARD CODED
    // exOuhQVSLfSaf5bdda1hInqwcuw2
  }

  get ref() {
    return firebase
      .database()
      .ref("Messages")
      .child(this.chatID(this.uid, this.chateeUID))
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP
  }

  // Generate a unique code for 2 person chat, using chaterID & chateeID
  chatID = (id1, id2) => {
    const chatIDpre = []
    chatIDpre.push(id1)
    chatIDpre.push(id2)
    chatIDpre.sort()
    return chatIDpre.join("_")
  }

  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val()
    const { key: id } = snapshot
    const { key: _id } = snapshot //needed for giftedchat
    const timestamp = new Date(numberStamp)

    const message = {
      id,
      _id,
      timestamp,
      text,
      user
    }
    return message
  }

  refOn = callback => {
    this.ref
      .limitToLast(20)
      .on("child_added", snapshot => callback(this.parse(snapshot)))
  }

  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i]
      const message = {
        text,
        user,
        createdAt: this.timestamp
      }
      this.ref.push(message)
    }
  }

  refOff() {
    this.ref.off()
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }))
  }

  get user() {
    return {
      name: firebase.auth().currentUser.displayName,
      email: firebase.auth().currentUser.email,
      avatar: firebase.auth().currentUser.photoURL,
      id: this.uid,
      _id: this.chateeUID
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
      <Header 
      centerComponent={{text: `${this.state.partyname}`, style:{ fontSize: 20, fontWeight: 'bold'}}}
      backgroundColor='#e6ebed'
      />

      <GiftedChat
        messages={this.state.messages}
        onSend={this.send}
        user={this.user}
      />
      </View>
    )
  }

  componentDidMount() {
    this.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message)
      }))
    )
  }
  componentWillUnmount() {
    this.refOff()
  }
}
