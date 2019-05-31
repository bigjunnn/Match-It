import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {Item, Input, Form, Label, Button, Text, Title} from 'native-base';

var width = Dimensions.get('window').width;
export default class LoginScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Title style={{fontFamily:'Lobster-Regular', fontSize:60, color:'black'}}>MatchIt</Title>
        <Form style={styles.login}>
            <Item stackedLabel>
                <Label>Username</Label>
                <Input style={styles.input} autoCapitalize = 'none'/>
            </Item>

            <Item stackedLabel>
                <Label>Password</Label>
                <Input style={styles.input} autoCapitalize = 'none' secureTextEntry={true}/>
            </Item>

            <Text style={{opacity:0.8, marginTop:10, marginLeft:30, fontSize:12, fontStyle: 'italic'}} > 
                Dont't have an account? 
                <Text style={{color: 'blue', fontSize: 13}} 
                      onPress={() => this.props.navigation.navigate("Register")}> Register</Text> now!
            </Text>
        </Form>
        <Button block danger style={styles.submit} onPress={() => this.props.navigation.navigate("Home")}>
            <Text>Sign In</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff6f5',
  },
  login: {
    marginTop: 100,
    paddingLeft: 10,
    paddingRight: 30,
    width: width * .8
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
});
