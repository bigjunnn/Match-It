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
  state = {
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    profilepic: "",
    errorMessage: ""
  }

  // Method to handle SignUp
  handleSignUp = () => {
    let ref = firebase.database().ref("Usernames")
    firebase
      .storage()
      .ref("default/blank_profile.png")
      .getDownloadURL()
      .then(url => {
        this.setState({ profilepic: url })
      })

    //check if username is taken before creating acc
    var name_exist = true
    ref
      .child(this.state.username)
      .once("value")
      .then(snapshot => {
        return snapshot.exists()
      })
      .then(exist => {
        if (exist) alert(`Username ${this.state.username} has been taken!`)
        else {
          // create user account
          firebase
            .auth()
            .createUserWithEmailAndPassword(
              this.state.email,
              this.state.password
            )
            .then(() => {
              return firebase.auth().currentUser
            })
            .then(user => {
              //update user profile
              ref.child(this.state.username).set(user.uid)
              user.updateProfile({
                displayName: this.state.username,
                photoURL: this.state.profilepic
              })
            })
            .catch(error => {
              error = error.code
              if (error == "auth/email-already-in-use") {
                alert("This email has already been used")
              } else if (error == "auth/invalid-email") {
                alert("Please enter a valid email address")
              }
            })
        } //
      })

    // Checking whether the user is created
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase
          .database()
          .ref("Users")
          .child(user.uid)
          .set({
            //store user info in db
            email: user.email,
            userid: user.uid,
            username: this.state.username,
            profilepic: this.state.profilepic,
            createdAt: firebase.database.ServerValue.TIMESTAMP
          })
          .then(() => {
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
