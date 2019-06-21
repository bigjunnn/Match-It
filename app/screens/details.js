import React from "react"
import { 
    StyleSheet, 
    Image, 
    Text, 
    View, 
    FlatList, 
    TouchableOpacity ,
    Dimensions
} from "react-native"
import { Button, Left, Right } from "native-base"
import { List, ListItem, SearchBar } from "react-native-elements";
import firebase from "firebase"

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class Details extends React.Component {
    state = {key: '', details: ''}

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
                photo: snapshot.val().photo
            }
            this.setState({ details: items })
        })
    }

    render() {
        return (
          <View style={styles.container}>
            <Text>{this.state.key}</Text>
            <Text>TITLE:    {this.state.details.title}</Text>
            <Text>PRICE:    {this.state.details.price} / {this.state.details.price_type}</Text>
            <Image 
            source={{ uri: this.state.details.photo }}
            style={{ width: 250, height: 200 }}
            />

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