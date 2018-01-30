import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';

export default class MainHeader extends Component {    
  render(){    
    return (
      <Text>{ this.props.id + ' ' + this.props.title }</Text>
    );
  }
}