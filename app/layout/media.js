import React, { Component } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import styles from "../content/css/styles";
import CircularProgress from "./progress";
import DownloadBtn from "./download";
import AudioBtn from "./audio";
import { GetFileInfo } from "../utilities/files";

export default class Media extends Component {
  constructor(props) {
    super(props);
    this.state = {mediaExist: false};
    this.state = {mediaName: ''};
    this.updateMediaExistState = this.updateMediaExistState.bind(this);
  }

  componentDidMount() {
    //console.log(this.props.media);
    if (this.props.media !== "undefined" && this.props.media !== "") {
      GetFileInfo(this.props.media)
      .then(result => {
        console.log("media check: " + this.props.media + " > " + result.exists);     
        this.setState({mediaExist: result.exists});
      })
      .catch(error => {
        console.log("media check: " + error);
      });
    }
  }

  componentDidUpdate() {
    //console.log("update " + this.state.mediaExist);
  }

  updateMediaExistState(exist) {
    //console.log("handler: " + exist);
    this.setState({mediaExist: exist});
  }

  render() {    
    const media = this.props.media;

    //firstly, check if is has a media file
    //console.log(this.props.media);
    if (this.props.media !== "undefined" && this.props.media !== "") {

      if (this.state.mediaName != this.props.media) {
        //if the last media file from state is not matching the new media file (could be refocused), recheck file existence
        //console.log(this.props.media + " : " + this.state.mediaName);
        
        this.setState({mediaName: this.props.media}); //update the new media file to the state despite whether it is existed

        GetFileInfo(this.props.media)
        .then(result => {
          //console.log("media check: " + this.props.media + " > " + result.exists);     
          this.setState({mediaExist: result.exists});
        })
        .catch(error => {
          console.log("media check: " + error);
        });
      }
      return (
        <View style={{flexDirection: 'row'}}>
          <AudioBtn 
            media={media} 
            title={this.props.title} 
            exist={this.state.mediaExist}
          />
          <DownloadBtn
            media={media}
            menu={this.props.menu}
            book={this.props.book}
            title={this.props.title}
            mediaExist={this.state.mediaExist}
            updateMediaExist={this.updateMediaExistState}
          />
        </View>
      );
    } else {
      //if media is empty, show nothing
      return <View></View>;
    }
  }
}
