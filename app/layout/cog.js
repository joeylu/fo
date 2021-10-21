import React, { Component } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Icon } from "react-native-elements";
import styles from "../content/css/styles";


export default class Cog extends Component {
    constructor(props) {
      super(props);
    }
    onSettingPress = () => {
        this.props.navigation.push("Error");
    }
    render() {   
        return (
            <View style={{flexDirection: 'row'}}>                
                <TouchableOpacity
                    style={styles.headerAudio}
                    onPress={() => {this.props.navigation.push("Settings");}}
                >
                <Icon
                  name={"cog"}
                  type="font-awesome"
                  color="#ffffff"
                  containerStyle={styles.headerDownload}
                />
                </TouchableOpacity>
            </View>
        );
    }
}

