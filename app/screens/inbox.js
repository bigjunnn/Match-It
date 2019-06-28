import React from "react"
import { 
    StyleSheet, 
    Text, 
    View,
    FlatList,
    ScrollView,
    Dimensions
} from "react-native"
import { Header, ListItem, ButtonGroup } from "react-native-elements"
import firebase from "firebase"

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class ChatLog extends React.Component {
    constructor () {
        super()
        this.state = {
          pending: [],
          bookings: [],
          selectedIndex: 0
        }
        this.updateIndex = this.updateIndex.bind(this)
      }

    updateIndex (selectedIndex) {
        this.setState({selectedIndex})
    }

    keyExtractor = (item, index) => index.toString()
    renderSection() {
    if (this.state.selectedIndex == 0) { //Bookings
        return (
        <Text style={{marginTop: 20, fontSize: 30}}> In Construction </Text>
    )} else if (this.state.selectedIndex == 1) { //Pending
        return (
        <FlatList
        data={ this.state.pending }
        keyExtractor={this.keyExtractor}
        renderItem={({ item }) => (
            <ListItem
            leftAvatar={{ size:'medium' , rounded: false, source: { uri: item.itempic } }}
            title={`${item.itemname}`}
            subtitle={`Requester: ${item.request_name}`}
            style = {{width: width * 0.9}}
            />
        )} 
        />
    )} else if (this.state.selectedIndex == 2) { //Messages
        return (
        <Text style={{marginTop: 20, fontSize: 30}}>Coming Soon ...</Text>
    )}
    }

    pendingStorage() {
    let user = firebase.auth().currentUser
    var query =  firebase.database().ref('Booking').child('Pending').orderByChild("servicer_id").equalTo(user.uid)
    query.once("value").then(snapshot => {
        var items = []
        snapshot.forEach(child => {
        items.push({
            request_id: child.val().request_id,
            request_name: child.val().request_name,
            itempic: child.val().itempic,
            itemname: child.val().itemname,
            createdAt: child.val().createdAt
        })
        })
        this.setState({ pending: items})
    })
    }

    componentDidMount() {
        this.pendingStorage()
    }

    render() {
    let user = firebase.auth().currentUser
    const buttons=['Bookings', 'Pending' ,'Messages']

    return (
        <View>
        <Header 
        centerComponent={{text: 'Notifications', style:{ fontSize: 20, fontWeight: 'bold'}}}
        backgroundColor='#e6ebed'
        />

        <ScrollView>
        <View style={ styles.tabbar}>
        <ButtonGroup
        onPress={this.updateIndex}
        selectedIndex={this.state.selectedIndex}
        buttons={buttons}
        />
        </View>

        {/** tab view */}
        {this.renderSection()} 
        </ScrollView>
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
  tabbar: { 
    justifyContent: 'center', 
    alignSelf: 'center',
    width: width * 0.9,
    marginTop: 10 
  }
})
