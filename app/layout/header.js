import React, { Component } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default class Header extends Component {
  render() {
    //console.log(this.props);
    return (
      <View>
        <Text style={styles.headerTitleText}>{this.props.title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerTitleText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 22
  },
});
