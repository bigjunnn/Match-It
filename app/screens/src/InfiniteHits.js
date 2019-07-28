import React from 'react';
import { 
  StyleSheet, 
  Text, 
  Image,
  View, 
  FlatList, 
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { Icon } from 'react-native-elements'
import PropTypes from 'prop-types';
import { connectInfiniteHits } from 'react-instantsearch-native';
import { withNavigation } from "react-navigation"

var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
const InfiniteHits = ({ hits, hasMore, refine, navigation }) => (
  <FlatList
    data={hits}
    keyExtractor={item => item.objectID}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
    onEndReached={() => hasMore && refine()}
    renderItem={({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Details", {
        ref: item.id
      })}
    >
      <Text style={{alignSelf: "flex-end", fontSize: 11, fontWeight: "bold", color: "grey", marginTop: 1}}>
        {item.sales !== undefined && item.sales > 0 ? item.sales + " BOOKED": ""}
      </Text>

      <View style={styles.item}>
        <Image 
          source={{uri: item.photo[0]}}
          style={styles.image}
        />

        <View style={{flexDirection: 'column', marginLeft: 10}}>
          <Text style={{fontSize: 17, fontWeight: "bold"}}>{item.title}</Text>
          <View style={{flexDirection: "row", padding: 5}}>
          <Icon
            name="star"
            type="antdesign"
            color="#f2c202"
            size={13}
          />
          <Text style={{fontSize: 13, fontWeight: "bold", color: "grey"}}> 
            {item.review_overall != undefined ? 
              item.review_overall.toFixed(1) + " / 5.0 (" + item.review_count + ")"
              : "-- / (0)"
            }
          </Text>
        </View>
          <View style={{flexDirection: "row", padding: 5}}>
            <Text style={{fontSize: 14}}>From SGD {item.package[0].price} / {item.package[0].price_type}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
    )}
  />
);

InfiniteHits.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasMore: PropTypes.bool.isRequired,
  refine: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  item: {
    padding: 10,
    flexDirection: 'row',
    width: width * 0.9
  },
  titleText: {
    fontWeight: 'bold',
  },
  image: {
    width: 65, 
    height: 60, 
    borderRadius: 4, 
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1
  }
});

export default withNavigation(connectInfiniteHits(InfiniteHits))
