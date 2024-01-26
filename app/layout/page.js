import React, { Component } from "react";
import { View } from "react-native";
import Header from "./header";
import Media from "./media";
import Cog from "./cog";
import TabBar from "./tabbar";
import foData from "../content/data.json";
import constants from "../utilities/constants.json";
import styles from "../content/css/styles";
import AudioBar from "./audioBar";

//console.log(DownloadFile("ab.mp3"));
export default class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: 0, //main menu
      book: 0, //book from menu.json, level 1
      section: 0, //sections in this book, level 2
      article: 0, //section article, could be a list of pages, or a single pages, level 3
      chapter: 0, //page chapters, level 4
      media: "",
      home: true,
    };
  }
  componentDidMount() {
    //set default, article is an index number to a book > section > list index
    this.menu = 0, this.book = 0, this.section = 0, this.article = -1, this.chapter = 0;
    this.home = true; this.media = "";
    //set header
    if (this.props.navigation) {
      let headerTItle = constants.appTitle;
      let headerMedia = "";
      //get params
      //console.log("page: " + this.props.route.params);
      if (this.props.route.params && typeof this.props.route.params.book !== "undefined") {
        const book = foData.find(item => item.id == this.props.route.params.book);
        headerTItle = book.title;
        headerMedia = book.media;
        if (this.props.route.params.article >= 0 && this.props.route.params.section >= 0) {
          //look for article specific media if there's any, make sure its book media is empty
          if (headerMedia === "undefined" || headerMedia === "") {
            if (book.sections.find(item => item.id == this.props.route.params.section) !== "undefined") {
              const article = book.sections.find(item => item.id == this.props.route.params.section).list.find(item => item.id == this.props.route.params.article);
              if (article && article.media && article.media !== "") {
                if (article.media != headerMedia) headerMedia = article.media;
              }
            }
          }
        }
        this.menu = this.props.route.params.menu;
        this.book = this.props.route.params.book;
        this.section = this.props.route.params.section;
        this.article = this.props.route.params.article;
        this.chapter = this.props.route.params.chapter;
        this.home = false;
        this.media = headerMedia;
      }
      //console.log("page home check: " + this.home);
      //setting header
      if (this.home) {
        //it's home page, display setting button
        this.props.navigation.setOptions({
          headerBackTitle: "",
          headerTitle: props => <Header {...props} title={headerTItle} />,
          headerRight: props => <Cog {...props} navigation={this.props.navigation} />,
        });
      } else {
        //display book download/media button
        //console.log("media: " + headerMedia);
        this.props.navigation.setOptions({
          headerBackTitle: "",
          headerTitle: props => <Header {...props} title={headerTItle} />,
          headerRight: props => <Media {...props} media={headerMedia} menu={this.menu} book={this.book} title={headerTItle} />,
        });
      }
    }
    //set tab
    if (this.props.route.params) {
      // console.log("menu id: " + this.props.route.params.menu + ", book id: " + this.props.route.params.book + " section id: " + this.props.route.params.section + " article id: " + this.props.route.params.article + " chapter id: " + this.props.route.params.chapter);
      
      if (typeof this.props.route.params.menu !== "undefined" && 
      typeof this.props.route.params.book !== "undefined" && 
      typeof this.props.route.params.section !== "undefined" && 
      typeof this.props.route.params.article !== "undefined" && 
      typeof this.props.route.params.chapter !== "undefined") {
        this.menu = this.props.route.params.menu;
        this.book = this.props.route.params.book;
        this.section = this.props.route.params.section;
        this.article = this.props.route.params.article;
        this.chapter = this.props.route.params.chapter;
      }
    }
    
    this.setState({
      menu: this.menu,
      book: this.book,
      section: this.section,
      article: this.article,
      chapter: this.chapter,
      home: this.home,
      media: this.media
    });
  }

  render() {
    //console.log("audio at " + appStateContext.audioPlaybackUpdate);
    return (
      <View style={[styles.pageRoot]}>
        <TabBar navigation={this.props.navigation} menu={this.state.menu} book={this.state.book} section={this.state.section} article={this.state.article} chapter={this.state.chapter} />
        <AudioBar media={this.state.media} />
      </View>
    );
  }
}
