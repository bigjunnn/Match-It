import React from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import { Item, Input, Form, Label, Button, Text, Title } from "native-base"
import firebase from "firebase"

var width = Dimensions.get("window").width
export default class Login extends React.Component {
  // Define state
  state = { email: "", password: "", errorMessage: "" }

  // Remain signed in
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) { 
        this.props.navigation.navigate("Home")
      }
    })
  }
  
  // Method to handle Login
  handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => {
        error = error.code
        if (error == "auth/invalid-email") {
          alert("Please enter a valid email address")
        } else if (error == "auth/user-not-found") {
          alert("There is no such user")
        } else if (error == "auth/wrong-password") {
          alert("Please enter the correct password")
        }
      })
    
    // Checking whether a user is logged in
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate("Home")
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Title
          style={{
            fontFamily: "Lobster-Regular",
            fontSize: 60,
            color: "black"
          }}
        >
          MatchIt
        </Title>

        <Form style={styles.login}>
          <Item stackedLabel>
            <Label>Email</Label>
            <Input
              style={styles.input}
              autoCapitalize="none"
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
            />
          </Item>

          <Item stackedLabel>
            <Label>Password</Label>
            <Input
              style={styles.input}
              autoCapitalize="none"
              secureTextEntry
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
            />
          </Item>

          <Text
            style={{
              opacity: 0.8,
              marginTop: 10,
              marginLeft: 30,
              fontSize: 12,
              fontStyle: "italic"
            }}
          >
            Dont't have an account?
            <Text
              style={{ color: "blue", fontSize: 13 }}
              onPress={() => this.props.navigation.navigate("Register")}
            >
              {" "}Register
            </Text>{" "}
            now!
          </Text>
        </Form>

        <Button block danger style={styles.submit} onPress={this.handleLogin}>
          <Text>Sign In</Text>
        </Button>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff6f5"
  },
  login: {
    marginTop: 100,
    paddingLeft: 10,
    paddingRight: 30,
    width: width * 0.8
  },
  input: {
    fontSize: 15
  },
  submit: {
    opacity: 0.8,
    marginTop: 120,
    paddingTop: 10,
    marginLeft: 90,
    marginRight: 90
  }
})
