import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView
} from "react-native"
import { Header } from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown'
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
export default class List extends React.Component {
    state = {
        type: this.props.navigation.state.params.type,
        name: this.props.navigation.state.params.name,
        text: "listing",
        orderType: "date",
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
    
    keyExtractor = (item, index) => index.toString()

    render() {
      return (
       <View>
        <Header
          backgroundColor="white"
          centerComponent={{
            text: `${this.state.name}`,
            style: { fontSize: 20, fontWeight: "bold" }
          }}
        />

        <ScrollView>
          <View style={styles.container}>
            <InstantSearch
              appId="8KZO6PN2AS"
              apiKey="3847b33ab120291475be5326b9c1c797"
              indexName={`${this.state.text}_${this.state.orderType}_${this.state.order}`}
            >
              <SearchBox />
              <View style={{flexDirection:"row", alignSelf: "flex-end", marginBottom: 5}}>
                <Dropdown 
                  ref={this.state.orderType}
                  data={dropdown}
                  value={this.state.orderType}
                  onChangeText={(value) => {
                    this.setState({orderType: value})
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
              <View style={{flexDirection: 'row', width: width * 0.9, height: height * 0.8}}>
              <Results />
              </View>
              <Configure 
                facetFilters={`${this.state.type}: ${this.state.name}`}
              />
            </InstantSearch>
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

