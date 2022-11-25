import React, { Component } from "react";
import { View } from "react-native";
import Header from "./header";
import Media from "./media";
import Cog from "./cog";
import TabBar from "./tabbar";
import foData from "../content/data.json";
import constants from "../utilities/constants.json";

//console.log(DownloadFile("ab.mp3"));
export default class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: 0,
      book: 0,
      section: 0,
      article: 0,
      home: true,
    };
  }
  componentDidMount() {
    //set default, article is an index number to a book > section > list index
    this.menu = 0, this.book = 0, this.section = 0, this.article = -1;
    this.home = true;
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
        this.home = false;
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
      //console.log("page: " + this.props.route.params.menu + ", " + this.props.route.params.book + " : " + this.props.route.params.section);
      if (typeof this.props.route.params.menu !== "undefined" && typeof this.props.route.params.book !== "undefined" && typeof this.props.route.params.section !== "undefined" && typeof this.props.route.params.article !== "undefined") {
        this.menu = this.props.route.params.menu;
        this.book = this.props.route.params.book;
        this.section = this.props.route.params.section;
        this.article = this.props.route.params.article;
      }
    }
    
    this.setState({
      menu: this.menu,
      book: this.book,
      section: this.section,
      article: this.article,
      home: this.home,
    });
  }

  render() {
    //console.log("page: " + this.state.book);
    return ( 
      <TabBar navigation={this.props.navigation} menu={this.state.menu} book={this.state.book} section={this.state.section} article={this.state.article} />
    );
  }
}
