import React, { Component, useContext } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useIsFocused } from "@react-navigation/native"; 
import styles from "../content/css/styles";
import AppContext from "../utilities/context";
import Listitem from "./list";
import Detail from "./detail";
import foData from "../content/data.json";
import foMenu from "../content/menu.json";

export default class Content extends Component {    
  render(){    
    //set default content
    let content = foMenu.find(item => item.id == this.props.menu);
    //console.log("content: " + this.props.menu + "," + this.props.book + "," + this.props.section + "," + this.props.article);
    //set book content by section id
    if (this.props.menu > 0 && this.props.book > 0) {
      const book = foData.find(item => item.id == this.props.book);
      const bookSection = book.sections.find(s => s.id == this.props.section)
      if(this.props.article < 0){
        //if article is not provided, get section content
        if (bookSection) content = bookSection;
      } else {
        //if article is provided, get article content
        if (bookSection && bookSection.list.length > 0) {
          const bookSectionArticle = bookSection.list.find(a => a.id == this.props.article);
          if (bookSectionArticle) content = bookSectionArticle;
        }
      }
    }
    this.list = typeof content.list === "undefined" ? [] : content.list;
    this.page = typeof content.page === "undefined" ? [] : content.page;
    this.image = typeof content.image === "undefined" ? "" : content.image;
    this.media = typeof content.media === "undefined" ? "" : content.media;
    this.urls = typeof content.urls === "undefined" ? [] : content.urls;
    //console.log("content validation: " + this.list.length + ", " + typeof this.page + ", " + this.urls.length)  

    if (this.urls.length > 0) {
      return <GetBook urls = {this.urls} props = {this.props} />
    }
    if (this.list.length == 0) {
      //return page content
      return <GetBasic page = {this.page} image = {this.image} section={this.props.section} />
    }  else {
      return <GetList list = {this.list} props = {this.props} />
    }
  }
}

const GetBasic = values => {
  const appStateContext = useContext(AppContext);
  return(
    <View style={[styles.pageBody, appStateContext.settingThemePageBackgroundColor]}>
      <ScrollView>
        <Detail source={values.page} image={values.image} />
      </ScrollView>
    </View>
  )
}

const GetList = values => {
  const appStateContext = useContext(AppContext);
  return (    
    <View style={[styles.pageBodyNoMargin, appStateContext.settingThemePageBackgroundColor]}>
      <ScrollView>
        <Listitem 
          source={values.list}
          menu={values.props.menu}
          book={values.props.book} //if a speicfic book id is provided, the source list is a section list
          section={values.props.section} //if a specific section id is provided, the source list is an article list
          navigation={values.props.navigation} 
        />
      </ScrollView>
    </View>
  )
}

const GetBook = values => {
  const appStateContext = useContext(AppContext);
  return (    
    <View style={[styles.pageBody, appStateContext.settingThemePageBackgroundColor]}>          
      <ScrollView>
        <Listitem 
          source={values.urls}
          menu={values.props.menu}
          book={values.props.book} //if a speicfic book id is provided, the source list is a section list
          section={values.props.section} //if a specific section id is provided, the source list is an article list
          navigation={values.props.navigation} 
        />
      </ScrollView>
    </View>
  )
}