import React from "react"
import {
    StyleSheet,
    View,
    ScrollView,
    Dimensions,
    Text,
    FlatList
} from "react-native"
import { Header, ListItem, Rating } from "react-native-elements"
import firebase from 'firebase'

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class ReviewList extends React.Component {
    state={
        key: this.props.navigation.state.params.ref, //item id
        reviews: [],
        order: "desc",
        orderIndex: 1
    }

    componentDidMount() {
        this.renderReviews()
    }

    keyExtractor = (item, index) => index.toString()

    renderReviews() {
        firebase.database().ref('Review').child('Listing').child(this.state.key).orderByChild("createdAt")
            .once("value", snapshot => {
                let arr = []
                snapshot.forEach(snap => {
                    arr.push(snap.val())
                })
                this.setState({reviews: arr.reverse()})
            })
    }

    changeOrder(index) {
        if (this.state.orderIndex !== index) {
            switch(index) {
                case 1: 
                    this.setState({order: "desc", orderIndex: index})
                    break;
                case 2: 
                    this.setState({order: "asc", orderIndex: index})
                    break;
            }
            let arr = this.state.reviews.slice()
            this.setState({reviews: arr.reverse()})
        }
    }

    render() {
        return(
        <View>
            <Header
            backgroundColor="white"
            centerComponent={{
                text: `Reviews (${this.state.reviews.length})`,
                style: { fontSize: 20, fontWeight: "bold" }
            }}
            />

            <View style={{flexDirection:"row", alignSelf: "flex-end", marginRight: 10, marginBottom: 5}}> 
                <Text style={{color: "red", fontSize: 15}}> Recents </Text>
                <Text 
                onPress={() => this.changeOrder(1)}
                style={ this.state.orderIndex === 1 ? styles.activeText : styles.inactiveText}
                > desc</Text>
                <Text> | </Text>
                <Text 
                onPress={() => this.changeOrder(2)}
                style={ this.state.orderIndex === 2 ? styles.activeText : styles.inactiveText}
                >asc</Text>
            </View>

            <ScrollView>
            <View style={styles.container}>
            <FlatList
                data={this.state.reviews}
                keyExtractor={this.keyExtractor}
                renderItem={({ item }) =>
                <ListItem
                    title={
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                        {item.reviewer_name}
                        </Text>
                        <View style={{ flexDirection: "row", marginLeft: 10 }}>
                        <Rating
                            imageSize={15}
                            fractions={1}
                            startingValue={item.service_rate}
                            readonly
                        />
                        <Text style={{ padding: 3, fontSize: 15 }}>
                            {item.service_rate.toFixed(1)}/5.0
                        </Text>
                        </View>
                    </View>
                    }
                    subtitle={`${item.service_review}`}
                    style={{ width: width * 0.9 }}
                />}
            />
            </View>
            </ScrollView>
         </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: width * 0.9
    },
    activeText: {
      fontWeight: 'bold',
      color: "red",
      fontSize: 15
    },
    inactiveText: {
      fontWeight: "normal",
      color: "#2f3e66",
      fontSize: 15
    }
  })
  