import React from 'react';
import {View, Dimensions, StyleSheet, ScrollView, ImageBackground, Image} from 'react-native';
import {Text, Container, Header, Body, Left, Right, Title, Item, Icon, Input, Content, H1, H3, Card} from 'native-base'

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
export default class HomeScreen extends React.Component {
    render() {
        return (
            <View style= {styles.container}>
                <Header style= {{height: height * 0.1, backgroundColor:'#fffcfc'}}>
                    <Left>
                        <Icon ios='ios-menu' android="md-menu" style={{fontSize: 25, color: 'red', paddingLeft: width * .025}}/>
                    </Left>
                    <Body>
                        <Title style={{textAlign:'center', fontFamily:'Lobster-Regular',color:'black', fontSize:25}}>MatchIt</Title>
                    </Body>
                    <Right> 
                        <Icon name="ios-search" style={{fontSize: 25, color: 'red', paddingRight: width * .025}}
                            onPress={() => this.props.navigation.navigate("Search")}/>
                    </Right>
                </Header>

                <ScrollView>
                    <View style={styles.viewer}>
                        <H1 style={styles.titleText}>Top Rated Services</H1>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <Card>
                                <ImageBackground source={require('../images/painting.jpg')} style={styles.image} imageStyle={{opacity:0.3}} imageStyle={{opacity:0.4}}>
                                    <Text style={styles.userText}>alexandra1033</Text>
                                    <Text style={styles.imageText}>Painting Service @ $50/room</Text>
                                </ImageBackground>
                            </Card>

                            <Card>
                                <ImageBackground source={require('../images/violin.jpg')} style={styles.image} imageStyle={{opacity:0.4}} imageStyle={{opacity:0.3}}>
                                    <Text style={styles.userText}>hilaryyap</Text>
                                    <Text style={styles.imageText}>Violin Lessons @ CCK</Text>
                                </ImageBackground>
                            </Card>

                            <Card>
                                <ImageBackground source={require('../images/moving.jpg')} style={styles.image} imageStyle={{opacity:0.3}} imageStyle={{opacity:0.4}}>
                                    <Text style={styles.userText}>Superstar_Mover</Text>
                                    <Text style={styles.imageText}>Moving Service @ flat $300</Text>
                                </ImageBackground>
                            </Card>
                        </ScrollView>
                    </View>

                    <View style={styles.viewer}>
                        <H1 style={styles.titleText}>Hot Demand</H1>
                        <Text style={styles.subtitleText}>Your chance to shine as a provider!</Text>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <Card style= {styles.image}>
                                <ImageBackground source={require('../images/shopper.jpg')} style={styles.image} imageStyle={{opacity:0.3}}>
                                    <Text style={styles.imageText}>Shopper</Text>
                                </ImageBackground>
                            </Card>

                            <Card>
                                <ImageBackground source={require('../images/webdesign.jpg')} style={styles.image} imageStyle={{opacity:0.3}}>
                                    <Text style={styles.imageText}>Web Design</Text>
                                </ImageBackground>
                            </Card>

                            <Card>
                                <ImageBackground source={require('../images/tutor.jpg')} style={styles.image} imageStyle={{opacity:0.3}}>
                                    <Text style={styles.imageText}>Tutoring</Text>
                                </ImageBackground>
                            </Card>
                        </ScrollView>
                    </View>

                    <View style={styles.viewer}>
                        <H1 style={styles.titleText}>Recommendations</H1>
                        <Text style={styles.subtitleText}>Only suggesting from our trusty providers</Text>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <Card>
                                <ImageBackground source={require('../images/facebook.jpg')} style={styles.image} imageStyle={{opacity:0.3}}>
                                    <Text style={styles.userText}>spacewtx88</Text>
                                    <Text style={styles.imageText}>Create facebook ads for you</Text>
                                </ImageBackground>
                            </Card>

                            <Card>
                                <ImageBackground source={require('../images/translate.png')} style={styles.image} imageStyle={{opacity:0.3}}>
                                    <Text style={styles.userText}>karlagerfeld</Text>
                                    <Text style={styles.imageText}>Translate German to English</Text>
                                </ImageBackground>
                            </Card>
                        </ScrollView>
                    </View>

                    <View style={styles.viewer}>
                        <H1 style={styles.titleText}>Star Providers</H1>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>

            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff6f5'
    },
    viewer: {
        height: height * 0.3,
        paddingLeft: width * 0.01,
        paddingRight: width * 0.01
    },
    image: {
        resizeMode: 'stretch',
        flex: 1,
        aspectRatio: 1.2
    },
    titleText: {
        paddingTop: 20,
        fontFamily:'Ubuntu-Medium'
    },
    subtitleText: {
        fontSize: 12,
        paddingLeft: width * 0.05,
        fontFamily:'Ubuntu-Italic'
    },
    imageText: {
        flex: 1,
        color: '#2d2c2c',
        fontSize: 35,
        fontFamily:'Ubuntu-Regular',
        position: 'absolute',
        bottom:0
    },
    userText: {
        color: 'black',
        fontSize: 14,
        fontFamily:'Ubuntu-Bold',
        position: 'absolute',
        right: 0
    }
});