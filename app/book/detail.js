import React, { Component } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { NavigationActions } from 'react-navigation';
import OptionsPopover from './options';
import styles from '../content/css/styles.js';
import foData from '../content/data.json';

export default class DetailPage extends Component {  
  constructor(props) {
    super(props);      
    const { params } = this.props.navigation.state;
    this.detailID = params.detailID;
    this.bookID = params.bookID;
    this.level = params.level;
  }
    
  getData() {
    let data = null;
    if (this.level == 1) { //lvl1 is from book list, lvl3 is from section list, lvl0 or lvl2 are showed in section else
      data = foData.find(item => item.id == this.detailID);
    } else { //if it's lvl3, get all section.list and find id
      const book = foData.map((bk) => {
        if (bk.id == this.bookID) {
          if (bk.sections.length > 0){
            bk.sections.map((sec) => {
              if (sec.list.length > 0) {
                sec.list.map((li) => {
                  if (li.id == this.detailID){
                    data = li;
                  }
                })
              }
            })
          }
        }
      });
    }
    return data;
  } 

  static navigationOptions = ({ navigation }) => ({
    title:  navigation.state.params.title,
    headerRight: <OptionsPopover media={navigation.state.params.media} />,    
    headerStyle: {
      backgroundColor: '#f9b300',
      borderBottomColor: '#ffffff'
    }
  });
  
  render(){
    let fo = this.getData();
    if ( fo != null ) {
      if ( fo.image ){

      };
      return (    
        <ScrollView>
          <View>
            <Text style={styles.pageText}>{ fo.page }</Text>
          </View>
        </ScrollView>
      );
    } else {
      return (   
        <ScrollView>
          <View>
            <Text>内容为空或者无法读取内容</Text>
          </View>
        </ScrollView>
      )
    }
  }
}

module.exports = DetailPage;