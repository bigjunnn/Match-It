import React from 'react';
import {StyleSheet, View, Dimensions, Linking} from 'react-native';
import {Form, Title, Item, Input, Text, Button, Content, Label} from 'native-base';

var width = Dimensions.get('window').width;
export default class RegisterScreen extends React.Component {
    render() {
        return (
            <View style= {styles.container}>
                <Title style={{fontFamily:'Lobster-Regular', fontSize:60, color:'black', marginTop:30 }}>Register</Title>
                <Form style={{color:'black'}, styles.input}>
                    <Item floatingLabel>
                        <Label>Email Address</Label>
                        <Input autoCapitalize = 'none'/>
                    </Item>
                    
                    <Item floatingLabel>
                        <Label>Username</Label>
                        <Input autoCapitalize = 'none'/>
                    </Item>
                        
                    <Item floatingLabel>
                        <Label>Password</Label>
                        <Input autoCapitalize = 'none' secureTextEntry={true}/>
                    </Item>

                    <Item floatingLabel>
                        <Label>Confirm Password</Label>
                        <Input autoCapitalize = 'none' secureTextEntry={true}/>
                    </Item>
                </Form>

                <View style={styles.terms}>
                <Text style ={{fontSize: 12}}> By Signing up, you agree to our 
                    <Text style={{opacity: 0.7, fontWeight: 'bold', fontSize:12.5}} onPress={() => Linking.openURL('https://google.com') }> Terms</Text>, 
                    <Text style={{opacity: 0.7, fontWeight: 'bold', fontSize:12.5}} onPress={() => Linking.openURL('https://google.com')}> Data Policy </Text> and
                    <Text style={{opacity: 0.7, fontWeight: 'bold', fontSize:12.5}} onPress={() => Linking.openURL('https://google.com')}> Cookies Policy </Text>
                </Text>
                </View>

                <Button block danger style={styles.submit} onPress={() => this.props.navigation.navigate("Home")}>
                    <Text >Sign Up</Text>
                </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff6f5',
    },
    input: {
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: width * .8,
        paddingLeft: 30
    },
    terms: {
        marginTop: 25,
        width: width * 0.60,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 50
    },
    submit: {
        opacity: 0.8,
        marginTop: 50,
        paddingTop: 10,
        marginLeft: 90,
        marginRight: 90
    }
});