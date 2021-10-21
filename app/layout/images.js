import React, { Component } from "react";
import {
  View,
  Image,
  ScrollView,
  Text,
  Dimensions,
  StyleSheet,
} from "react-native";
import resolveAssetSource from "react-native/Libraries/Image/resolveAssetSource";
let winWidth = 0,
  winHeight = 0,
  imageWidth = 0,
  imageHeight = 0;
export default class ImageList extends Component {
  render() {
    winWidth = Dimensions.get("window").width;
    winHeight = Dimensions.get("window").height;
    if (this.props.image) {
      let image = images[this.props.image];
      let imageDimension = resolveAssetSource(image);
      imageWidth = winWidth * 0.8;
      imageHeight = imageWidth / (imageDimension.width / imageDimension.height);
      return (
        <ScrollView style={styles.imageHolder}>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <Image
              style={{
                flex: 1,
                width: imageWidth,
                height: imageHeight,
                resizeMode: "stretch",
              }}
              source={image}
            />
          </View>
        </ScrollView>
      );
    } else {
      return (
        <ScrollView>
          <View style={styles.imageHolder}>
            <Image source={require("../content/images/space.png")} />
          </View>
        </ScrollView>
      );
    }
  }
}
//require image cannot be dynamic since it's needed in bundle
const images = {
  Protect: require("../content/images/budda-protect.jpg"),
  OmManiPadmeHum: require("../content/images/OmManiPadmeHum.jpg"),
  Cundi: require("../content/images/cundi.jpg"),
  Yaoshi: require("../content/images/yaoshirulai_zhoulun.jpg"),
  Green: require("../content/images/green.jpg"),
};
const styles = StyleSheet.create({
  imageHolder: {
    marginTop: 20,
  },
});
