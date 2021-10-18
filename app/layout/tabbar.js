import React, { Component, useContext } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import AppContext from "../utilities/context";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import foData from "../content/data.json";
import foMenu from "../content/menu.json";

import ErrorScreen from "../error/error";
import ContentScreen from "./content";

const Tab = createMaterialTopTabNavigator();
export default class TabBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: []
    };
  }
  componentDidMount() {    
    //
    this.setState({
      list: InitTabList(this.props.menu, this.props.book, this.props.section, this.props.article) 
      //only validate the list length to perform the renderer
    })
  }
  render() {
    /*
    somehow the renderer will refresh multiple times
    and when it does, only the first list (the app default list length) is counted and rendered
    we use componentDidMount to make sure the initTabList returns a valid (> 0) length
    use below log to see the different
    */
    //console.log(this.state.list.length + " : " + this.list.length);

    this.list = InitTabList(this.props.menu, this.props.book, this.props.section, this.props.article);
    //console.log(this.list);
    if (this.state.list.length > 0) {
      return <TabStyle list={this.list} props={this.props} />;
    } else {
      //return error
      return <ErrorScreen></ErrorScreen>;
    }
  }
}

const TabStyle = values => {  
  const appStateContext = useContext(AppContext);
  return (
    <Tab.Navigator
      tabBarOptions={{
        labelStyle: { fontSize: 16 },
        tabStyle: { width: "auto", padding: 20 },
        style: appStateContext.settingThemeTabBackgroundColor,
        indicatorStyle: { backgroundColor: "#ffffff" },
        inactiveTintColor: "#edafad",
        activeTintColor: "#ffffff",
        scrollEnabled: true,
        lazy: true,
        lazyPlaceholder: ()=>{<View>Loading...</View>}
      }}
      sceneContainerStyle={{ backgroundColor: "#ffffff" }}
      initialRouteName={values.props.article == 0 ? "tab1" : "tab" + values.props.article}
    >
      {values.list.map((item, i) => (
        /*
            based on the different state, this tabbar item can be 
            a foMenu's root section
            a book's section list
            a section's list
          */
        <Tab.Screen
          key={i}
          name={"tab" + item.id}
          options={{ title: item.title }}
        >
          {props => (
            <ContentScreen
              {...values.props}
              menu={values.props.menu > 0 ? values.props.menu : item.id} //when menu id is 0, this item.id is a foMenu section id
              book={values.props.book}
              //when book id is presented, this item.id is a section id of this book
              //when article id is presented either, inherits from previous
              section={values.props.book > 0 ? (values.props.article >= 0 ? values.props.section : item.id) : 0}
              article={values.props.article >= 0 ? item.id : -1} //when an article id is presented, this item.id is an article id of a section of a book
              media={values.props.media}
            />
          )}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

function InitTabList(menuID, bookID, sectionID, articleID){
  //console.log("tablist: " + menuID + ": " + bookID);
  if (menuID <= 0) {
    //when menuID is not provided, get the root of Fo
    //console.log("menu: " + menuID + ", " + bookID);
    return foMenu;
  } else if(bookID > 0) {
    const book = foData.find(item => item.id == bookID);
    if ( articleID < 0) {
      //console.log("book: " + menuID + ", " + bookID);
      //when book ID is provided and article index is not set, get book sections
      if (book.sections) return book.sections;
    } else {
      //when book ID is provided and article index is set, get articles from the section
      const bookSection = book.sections.find(item => item.id == sectionID);
      if (bookSection) return bookSection.list;
    }
  } 
  return [];
}
