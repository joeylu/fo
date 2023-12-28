import React, { Component, useContext } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import styles from "../content/css/styles";
import AppContext from "../utilities/context";
import Listitem from "./list";
import Detail from "./detail";
import AudioBar from "./audioBar";
import foData from "../content/data.json";
import foMenu from "../content/menu.json";

export default class Content extends Component {
  render() {
    //set default content, only listed level 1 objects, performance safe
    //const isFocused = useIsFocused();
    let content = foMenu.find(item => item.id == this.props.menu);
    //console.log("content: " + this.props.menu + "," + this.props.book + "," + this.props.section + "," + this.props.article + " is focused >> " + isFocused);
    //set book content by section id
    if (this.props.menu > 0 && this.props.book > 0) {
      const book = foData.find(item => item.id == this.props.book);
      let bookSection = book.sections.find(s => s.id == this.props.section);
      //remove text from list pages to save performance since this screen will be refreshed multiple times
      // if (bookSection.list.length > 0) {
      //   bookSection.list = bookSection.list.map(v => {
      //     v.page = [];
      //     return v;
      //   });
      // }

      if (this.props.article < 0) {
        //if article is not provided, get section content
        if (bookSection) content = bookSection;
      } else {
        //if article is provided, get article content
        if (bookSection && bookSection.list.length > 0) {
          const bookSectionArticle = bookSection.list.find(a => a.id == this.props.article);
          if (bookSectionArticle) {            
            //console.log("article id: " + this.props.article + " / " + "chapter id: " + this.props.chapter);
            content = bookSectionArticle;
            if (typeof bookSectionArticle.chapters !== "undefined") {
              //console.log("chapter id: " + this.props.chapter);
              const bookSectionArticleChapter = bookSectionArticle.chapters.find(c => c.id == this.props.chapter);
              if (bookSectionArticleChapter) content = bookSectionArticleChapter;
            }
          }
        }
      }
    }
    this.list = typeof content.list === "undefined" ? [] : content.list;
    this.page = typeof content.page === "undefined" ? [] : content.page;
    this.image = typeof content.image === "undefined" ? "" : content.image;
    this.media = typeof content.media === "undefined" ? "" : content.media;
    this.urls = typeof content.urls === "undefined" ? [] : content.urls;
    this.chapters = typeof content.chapters === "undefined" ? [] : content.chapters;
    //console.log("content validation: " + this.list.length + ", " + typeof this.page + ", " + this.urls.length)

    if (this.urls.length > 0) {
      //return a list of a book collections
      return <GetBook urls={this.urls} props={this.props} />;
    }
    if (this.chapters.length > 0) {
      //when this object has chapters, it is an article list page object, return a list of chapaters of an article
      return <GetList list={this.chapters} props={this.props} />;
    }

    //when reach this block, the content object is not a url list, not a chapter list from article list page object, so it must be the article itself, show article page list or article single page
    if (this.list.length == 0) {
      //return page content
      return <GetBasic page={this.page} image={this.image} section={this.props.section} chapter={this.props.chapter} />;
    } else {            
      return <GetList list={this.list} props={this.props} />;
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
      <AudioBar />
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
          article={values.props.article} //if an article id is provided, the source list is a chapter list of an article list page
          //chapter={values.props.chapter} //if a specific chapter id is provided, the source list is a chapter list of an article list page
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