import React from "react"
import { View } from "react-native"
import { Header } from "react-native-elements"
import { GiftedChat } from "react-native-gifted-chat"
import firebase from "firebase"

export default class Chat extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || "Chat!"
  })

  // Define state for messages
  state = {
    messages: [],
    partyid: this.props.navigation.state.params.ref,
    partyname: this.props.navigation.state.params.ref_name,
    itemID: this.props.navigation.state.params.ref_itemID
  }

  // Getters
  get uid() {
    return (firebase.auth().currentUser || {}).uid
  }

  // NOTE: use these accounts to test for chats
  // Chat between hello123 + testing123 => tester1 cannot see the messages
  get chateeUID() {
    return this.state.partyid
  }

  get itemID() {
    return this.state.itemID
  }

  get ref() {
    return firebase
      .database()
      .ref("Messages")
      .child(this.chatID(this.uid, this.chateeUID, this.itemID))
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP
  }

  // Generate a unique code for 2 person chat, using chaterID, chateeID & itemID
  chatID = (id1, id2, itemID) => {
    const chatIDpre = []
    chatIDpre.push(id1)
    chatIDpre.push(id2)
    chatIDpre.push(itemID)
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
      <View style={{ flex: 1 }}>
        <Header
          centerComponent={{
            text: `${this.state.partyname}`,
            style: { fontSize: 20, fontWeight: "bold" }
          }}
          backgroundColor="#e6ebed"
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
