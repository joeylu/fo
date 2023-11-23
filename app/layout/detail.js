import React, { Component, useContext } from "react";
import { View, ScrollView, Text, StyleSheet, Pressable } from "react-native";
import { Divider } from 'react-native-elements';
import AppContext from "../utilities/context";
import Image from "./images";
import styles from "../content/css/styles";

export default class Detail extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <Page 
      source={this.props.source}
      image={this.props.image}
    />
  }
}
const Page = props => {
  const appStateContext = useContext(AppContext);

  let source = props.source;
  let image = props.image;
  return (
    <View style={[styles.pageBody, appStateContext.settingThemePageBackgroundColor]}>
      <Image image={image} />
      <Text 
        selectable = {appStateContext.settingTextSelectable}
        textBreakStrategy = {"simple"}
        style={[appStateContext.settingThemePageFontColor, 
          {fontSize: appStateContext.settingFontSize}, 
          {lineHeight: appStateContext.settingLineHeight}
        ]}>
          {source}{'\n'}{'\n'}{'\n'}
      </Text>
    </View>
  );
}

const timeout = setTimeout(function () {
  console.log('Hello from setTimeout')
}, 5000)

