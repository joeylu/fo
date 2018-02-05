import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import NavTabs from './navigator'
import OptionsPopover from './options';
import foMenu from '../content/menu.json';

export default class HomePage extends Component {      
  constructor(props) {
    super(props);      
    const { params } = this.props.navigation.state;
    this.fo = null;
    this.title = "未知主题";
    if (typeof params != 'undefined') {
      this.fo = params.fo;
      this.bookID = params.bookID;
      this.title = params.title;
    }
  }
  static navigationOptions = ({ navigation }) => {
    let headerLeft = "佛经与佛咒"; let media = null;
    if (typeof navigation.state.params !== 'undefined' ) {
      if (navigation.state.params.title) {
        headerLeft = navigation.state.params.title;
      }
      if (navigation.state.params.media) {
        media = navigation.state.params.media;
      }
    }
    return {
      title: headerLeft,
      headerRight: (
        <OptionsPopover media={ media } />
      ),
      headerStyle: {
        backgroundColor: '#f9b300',
        borderBottomColor: '#ffffff'
      }
    };
  };

  render(){    
    if ( this.fo == null ) {
      //default page
      return (    
        <View style={{flex: 1, paddingBottom: 20}}>
          <NavTabs data={ foMenu } navigation={this.props.navigation} bookID = {0} />        
        </View>
      );
    } else {      
      //book page
      return (    
        <View style={{flex: 1}}>
          <NavTabs data={ this.fo } navigation={this.props.navigation} bookID = { this.bookID } />        
        </View>
      );
    }
  }
}

HomePage.router = NavTabs.router;