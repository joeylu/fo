import React, { Component } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { List, ListItem, Icon } from 'react-native-elements'
import { NavigationActions } from 'react-navigation'
import ImageList from './images';
import styles from '../content/css/styles.js';
import foData from '../content/data.json';

export default class SectionPage extends Component {      
  constructor(props) {
    super(props);      
    let title = "";
    let list = {};
    let urls = {};
  }
  render(){        
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;
    if (typeof params != 'undefined') {
      this.title = params.title;
    }
    if (this.props.data.list.length > 0) { //has sub list
      this.list = this.props.data.list;
      this.bookID = this.props.bookID;
      return (    
        <ScrollView>  
          <List>          
            {         
              this.list.map((item, i) => (
                <ListItem
                  key={i}
                  title={item.title}                
                  subtitle={item.brief}                
                  leftIcon={<Icon name='library-books' color="#bbbbbb" style={{padding: 5, paddingRight: 20}} />}
                  titleStyle={{fontSize: 23}}
                  onPress={() => {
                    if (this.props.data.level == 0) { //list of each book
                      let detailData = foData.find(book => book.id == item.id); 
                      if (detailData.sections.length > 0) { //if book has section
                        return navigate('Home', { fo: detailData.sections, media: detailData.media, title: detailData.title, bookID: item.id })                        
                      } else { //if book has no section, display page with book ID
                        return navigate('Page', { detailID: item.id, level: 1, media: item.media, title: item.title, bookID: 0 })
                      }
                    } else { //list each section from book, navigate to sub list page with section list ID
                      return navigate('Page', { detailID: item.id, level: 3, media: item.media, title: this.title + " " + item.title, bookID: this.bookID })
                    }
                  }}
                />
              ))
            }
          </List>
        </ScrollView>  
      );
    } else if ( this.props.data.urls !== undefined ) { //no sub list, but has sub url jump to other book
      this.urls = this.props.data.urls;
      return (    
        <ScrollView>  
          <List>          
            {         
              this.urls.map((item, i) => (
                <ListItem
                  key={i}
                  title={item.title}                
                  subtitle={item.brief}                
                  leftIcon={<Icon name='label-outline' color="#bbbbbb" style={{padding: 5, paddingRight: 20}} />}
                  titleStyle={{fontSize: 23}}
                  onPress={() => {                        
                    let detailData = foData.find(book => book.id == item.targetID);                 
                    return navigate('Home', { fo: detailData.sections, media: detailData.media, title: detailData.title }) 
                  }}
                />
              ))
            }
          </List>
        </ScrollView>  
      );
    } else { //no sub list, lvl 0 or lvl 2 with no sub list will display directly in this else
      return (
        <ScrollView>
          <View style={styles.container}>
            <ImageList image={ this.props.data.image } />
            <Text style={styles.pageText}>{ this.props.data.page }</Text>
          </View>
        </ScrollView>
      )
    }
  }
}