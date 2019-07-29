import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    FlatList,
    Dimensions,
    TouchableOpacity
} from 'react-native'
import { Header, ListItem } from 'react-native-elements'
import firebase from 'firebase'
import 'firebase/firestore'

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class Category extends React.Component {
    state = {
        category: this.props.navigation.state.params.ref,
        subcategory: []
    }

    keyExtractor = (item, index) => index.toString()

    componentDidMount() {
        window = undefined
        this.renderSubCategory()
    }

    renderSubCategory() {
        firebase.firestore().collection('Category').doc(this.state.category)
            .get().then(doc => {
                let arr = []
                let db = doc.data()
                Object.keys(db).forEach((key) => {
                    arr.push(key)
                })
                this.setState({ subcategory: arr })
            })
    }

    render() {
      return (
        <View>
            <Header
            backgroundColor="white"
            centerComponent={{
                text: `${this.state.category}`,
                style: { fontSize: 20, fontWeight: "bold" }
            }}
            />
            
            <ScrollView>
            <View style={styles.container}>
                <FlatList
                data={this.state.subcategory}
                keyExtractor={this.keyExtractor}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) =>
                    <TouchableOpacity
                    onPress={() =>
                        this.props.navigation.navigate("List", {
                        type: 'category',
                        name: item
                        })}
                    >
                    <ListItem
                        title={item}
                        style={{ width: width * 0.9 }}
                    />
                    </TouchableOpacity>}
                />
            </View>
            </ScrollView>

        </View>
      )}
}

const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "stretch",
      marginBottom: 80,
      flex: 1
    },
    separator: {
      borderBottomWidth: 1,
      borderColor: '#ddd',
    },
    title: {
      marginLeft: 10, 
      fontSize: 25, 
      fontWeight: "bold",
      alignSelf: "stretch",
      padding: 5
    }
  })
