import React from "react"
import { StyleSheet, View, Dimensions, Linking } from "react-native"
import {
  Form,
  Title,
  Item,
  Input,
  Text,
  Button,
  Content,
  Label
} from "native-base"
import firebase from "firebase"

var width = Dimensions.get("window").width

export default class Register extends React.Component {
  // Manage State
  state = { username: "", email: "", password: "", confirm_password: "", errorMessage: "" }

  // Method to handle SignUp
  handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => {
        error = error.code
        if (error == "auth/email-already-in-use") {
          alert("This email has already been used")
        } else if (error == "auth/invalid-email") {
          alert("Please enter a valid email address")
        }
      })

    // Checking whether the user is created
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase.database().ref('Users').child(user.uid).set({
          email: user.email,
          userid: user.uid,
          username: this.state.username,
          createdAt: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
          alert("Your account has been created!")
          this.props.navigation.navigate("Home")
        })
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
            color: "black",
            marginTop: 30
          }}
        >
          Register
        </Title>

        <Form style={({ color: "black" }, styles.input)}>
          <Item floatingLabel>
            <Label>Username</Label>
            <Input
              autoCapitalize="none"
              onChangeText={username => this.setState({ username })}
              value={this.state.username}
              maxLength={12}
            />
          </Item>

          <Item floatingLabel>
            <Label>Email</Label>
            <Input
              autoCapitalize="none"
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
            />
          </Item>

          <Item floatingLabel>
            <Label>Password</Label>
            <Input
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
            />
          </Item>

          <Item floatingLabel>
            <Label>Confirm Password</Label>
            <Input autoCapitalize="none" secureTextEntry={true} />
          </Item>
        </Form>

        <View style={styles.terms}>
          <Text style={{ fontSize: 12 }}>
            {" "}By signing up, you agree to our
            <Text
              style={{ opacity: 0.7, fontWeight: "bold", fontSize: 12.5 }}
              onPress={() => Linking.openURL("https://google.com")}
            >
              {" "}Terms
            </Text>,
            <Text
              style={{ opacity: 0.7, fontWeight: "bold", fontSize: 12.5 }}
              onPress={() => Linking.openURL("https://google.com")}
            >
              {" "}Data Policy{" "}
            </Text>{" "}
            and
            <Text
              style={{ opacity: 0.7, fontWeight: "bold", fontSize: 12.5 }}
              onPress={() => Linking.openURL("https://google.com")}
            >
              {" "}Cookies Policy{" "}
            </Text>
          </Text>
        </View>

        <View style={styles.loginDirect}>
          <Text style={{ fontSize: 12 }}>
            {" "}Already have an account?
            <Text
              style={{ fontSize: 12 }}
              onPress={() => this.props.navigation.navigate("Login")}
            >
              {" "}Login here{" "}
            </Text>
          </Text>
        </View>

        <Button block danger style={styles.submit} onPress={this.handleSignUp}>
          <Text>Sign Up</Text>
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff6f5"
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
  }
})
