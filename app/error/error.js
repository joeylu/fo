import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';

export default class ErrorPage extends Component {    
  render(){    
    return (      
      <View>
        <Text>{ this.props.title }</Text>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text>{ this.props.msg }</Text>
          <Text>Error Occurred</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20
  }
});