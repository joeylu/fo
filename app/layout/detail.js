import React, { Component, useContext } from "react";
import { View, ScrollView, Text, StyleSheet, Button } from "react-native";
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

