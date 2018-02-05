import React, { Component } from 'react';
import { TabNavigator } from 'react-navigation';
import SectionPage from './section';
import ErrorPage from '../error/error';

export default class NavTabs extends Component {      
  render(){        
    const MainScreenNavigator = TabNavigator(SectionScreens(this.props.data, this.props.navigation, this.props.bookID), {
      animationEnabled: true,
      tabBarOptions: {
        scrollEnabled: true,
        activeTintColor: '#f9b300',
        labelStyle: { fontSize: 16, color: '#ffffff' },
        tabStyle: { height: 56, width: 125 },
        style: {
          backgroundColor: '#da251c',
        },
      },
    });
    return (    
      <MainScreenNavigator />
    );
  }
}

function SectionScreens(data, navigation, bookID) {  
  var screens = {};
  if (data.length > 0) {
    data.map((scr,i) => {    
      screens[i] = {
        screen: props => <SectionPage data={scr} navigation={navigation} bookID = {bookID} />,
        navigationOptions: {
          tabBarLabel: scr.title.length>6 ? scr.title.substr(0, 5).concat('..') : scr.title, 
          //tabBarIcon: ({ tintColor }) => <Icon name="list" size={35} color={tintColor} />
        }
      }
    });
  } else {
    screens[0] = {
      screen: props => <ErrorPage msg="No data record found" />,
      navigationOptions: {
        tabBarLabel: "Fatal error occurred"
      }
    }
  }
  return screens;  
}


NavTabs.router = SectionPage.router;
