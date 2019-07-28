import React from "react"
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  ScrollView
} from "react-native"
import firebase from "firebase"
import { Dropdown } from 'react-native-material-dropdown'

import algoliasearch from 'algoliasearch/reactnative'
import { InstantSearch, Configure } from 'react-instantsearch-native'
import SearchBox from './src/SearchBox'
import Results from './src/InfiniteHits'

const dropdown = [
  {value: 'date', label:'Date'},
  {value: 'sales', label:'Sales'},
  {value: 'price', label:'Price'}
]
var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default class Search extends React.Component {
  state = {
    text: "listing",
    type: "date",
    order: "desc",
    orderIndex: 1
  }

  changeOrder() {
    switch(this.state.orderIndex) {
      case 1: 
        this.setState({order: "desc"})
        break;
      case 2: 
        this.setState({order: "asc"})
        break;
    }
  }

  render() {
    const user = firebase.auth().currentUser

    return (
      <View>
        <ScrollView>
          <View style={styles.container}>
            <InstantSearch
              appId="8KZO6PN2AS"
              apiKey="3847b33ab120291475be5326b9c1c797"
              indexName={`${this.state.text}_${this.state.type}_${this.state.order}`}
            >
              <SearchBox />
              <View style={{flexDirection:"row", alignSelf: "flex-end", marginBottom: 5}}>
                <Dropdown 
                  ref={this.state.type}
                  data={dropdown}
                  value={this.state.type}
                  onChangeText={(value) => {
                    this.setState({type: value})
                  }}
                  dropdownOffset={{top: 0, left: 0}}
                  containerStyle={{width: 80, marginRight: 5}}
                  fontSize={14}
                />

                <Text 
                  onPress={() => { 
                    this.setState({ orderIndex: 1}, () => this.changeOrder()) 
                  }}
                  style={ this.state.orderIndex === 1 ? styles.activeText : styles.inactiveText}
                > desc</Text>
                <Text> | </Text>
                <Text 
                  onPress={() => { 
                    this.setState({ orderIndex: 2}, () => this.changeOrder()) 
                  }}
                  style={ this.state.orderIndex === 2 ? styles.activeText : styles.inactiveText}
                >asc</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
              <Results />
              </View>
            </InstantSearch>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    marginBottom: 80,
    marginTop: 50,
    flex: 1
  },
  title: {
    marginLeft: 10, 
    fontSize: 25, 
    fontWeight: "bold",
    alignSelf: "stretch",
    padding: 5
  },
  activeText: {
    fontWeight: 'bold',
    color: "red"
  },
  inactiveText: {
    fontWeight: "bold",
    color: "grey"
  }
})
