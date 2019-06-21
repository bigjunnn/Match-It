import React from "react"
import { StyleSheet, Platform, Image, Text, View } from "react-native"
import { Button } from "native-base"
import firebase from "firebase"

export default class Home extends React.Component {
  // Define current state
  state = { currentUser: null }

  handleSignOut = () => {
    firebase.auth().signOut().then(this.props.navigation.navigate("Login"))
  }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
  }

  render() {
    const { currentUser } = this.state

    return (
      <View style={styles.container}>
        <Text>
          Hi {currentUser && currentUser.email}!
        </Text>

        <Button block warning style={styles.submit} onPress={() => this.props.navigation.navigate("Create")}>
          <Text>Create Listing</Text>
        </Button>

        <Button block danger style={styles.submit} onPress={this.handleSignOut}>
          <Text>Sign Out</Text>
        </Button>
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
  submit: {
    opacity: 0.8,
    marginTop: 120,
    paddingTop: 10,
    marginLeft: 90,
    marginRight: 90
  }
})
