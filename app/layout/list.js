import React, { Component, useContext } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import AppContext from "../utilities/context";

export default class List extends Component {
  render() {
    let list = this.props.source;    
    //console.log("sec:" + this.props.section);
    return (
      <View>
        {list.map((item, i) => (
          <GetList key = {(this.props.menu + this.props.book + this.props.section + i).toString()} 
            index = {i} item = {item} props = {this.props} />
        ))}
      </View>
    );
  }
}

const GetList = values => {
  const appStateContext = useContext(AppContext);
  return (
    <ListItem 
      key={(values.props.menu + values.props.book + values.props.section + values.index).toString()}
      containerStyle = {appStateContext.settingThemePageBackgroundColor}
      bottomDivider       
      onPress={()=>{      
        if (typeof values.item.targetID === "undefined") {
          // console.log("list from book: " + values.props.book + " > section: " + values.props.section + " > article: " + values.props.article + " > chapter: " + values.props.chapter);
          /*
            1. a unknown list is provide from content.js, list name is "source"
            2. when book id is not provided, this list is a foMenu root sections
            3. when a book id is provided and section id is default 0, this list is a book>sections
            4. when a section id is provided, this list is a book>section>articles
          */        
            values.props.navigation.push("Page", {
              menu: values.props.menu,
              book: values.props.book == 0 ? values.item.id : values.props.book, //update book id, when book id is 0, this list is a book list
              section: values.props.section, //inherit section id
              article: values.props.section > 0 ? (values.props.article >= 0 ? values.props.article : values.item.id) : -1, //update article id, when section is given, article id is -1, since the List component is called, meaning this article has a list of pages, when article id is also given, meaning this is a chapter list, article id should be inheritedc
              chapter: values.props.article >= 0 ? values.item.id : 0 //update chapter id, this is a List component, if article is give and list is called, meaning article has chapters, otherwise, will never reach here with condition (article >= 0)
            }); 
        } else {          
          //console.log("list main menu: " + values.props.book + " : " + values.props.article);
          //redirect to a target book with given target book ID
          values.props.navigation.push("Page", {
            menu: values.props.menu,
            book: values.item.targetID, //set target content
            section: 0,
            article: -1,
            chapter: 0,
          });
        }
      }}
    >
      <Icon name='library-books' color="#bbbbbb" style={{padding: 5, paddingRight: 20}} />
      <ListItem.Content>
          <ListItem.Title style={[appStateContext.settingThemePageFontColor, {fontSize: 20}]}>{values.item.title}</ListItem.Title>
          {values.item.brief ? <ListItem.Subtitle style={appStateContext.settingThemePageFontColor}>{values.item.brief}</ListItem.Subtitle> : null}
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
}