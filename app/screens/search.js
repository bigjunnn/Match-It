import React from 'react';
import {StyleSheet, View, Dimensions, Linking} from 'react-native';
import {Item, Input, Text, Button, Container, Header, Icon} from 'native-base';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
export default class SearchScreen extends React.Component {
    render() {
        return (
            <Container>
                <Header searchBar style={styles.search}>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search" />
                    </Item>
                </Header>

                <Content style={styles.container}>
                    
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff6f5',
      justifyContent: 'center',
      alignItems: 'center'
    },
    search: {
      paddingLeft: width * 0.05,
      paddingRight: width * 0.05,
      paddingTop: height * 0.04,
      height: height * 0.1
    }
  });