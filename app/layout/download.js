import React, { Component, useContext } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import styles from "../content/css/styles";
import AppContext from "../utilities/context";
import constants from "../utilities/constants.json";
import { Icon } from "react-native-elements";
import CircularProgress from "./progress";
import { DownloadFile } from "../utilities/files";
import * as RootNavigation from '../utilities/navigator';

export default class DownloadBtn extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {    
    //return <View></View> 
    return <GetBtn media={this.props.media} title={this.props.title} book={this.props.book} menu={this.props.menu} updateMediaExist={this.props.updateMediaExist} mediaExist={this.props.mediaExist} />;
  }
}
/*
  get current book media file name
  if book media == download media and download status is downloading or started, show progress bar
  otherwise:
  if the media is found in local, show complete progress bar
  if the media is not found, show download btn

  when download btn or redownload is confirmed
  if download status is downloading or started, show wait message
  otherwise, start download
*/
const GetBtn = props => {
  const appStateContext = useContext(AppContext);
  function handler(percent, error) {
    if (typeof error === "undefined") {
      appStateContext.set_download_progress(percent);
      appStateContext.set_download_status(constants.downloadStatus.downloading);
    } else {
      //error timout
      console.log("handler error: " + error);
      appStateContext.set_download_progress(0);
      appStateContext.set_download_status(constants.downloadStatus.notStarted);
      Alert.alert("下载出错", "下载中出现异常问题，请尝试重新下载");
    }
    console.log(
      "current download: " +
        appStateContext.downloadProgress +
        "%, " +
        appStateContext.downloadStatus +
        ", " +
        props.media +
        " / " +
        appStateContext.downloadMedia +
        " --> " +
        percent
    );
  }

  //if the current book media is matching the download media
  if (props.media === appStateContext.downloadMedia) {
    //show progress icon only if its status is downloading or started or completed
    if (
      appStateContext.downloadStatus !== constants.downloadStatus.notStarted
    ) {
      //start call download function when status changes to started
      if (
        appStateContext.downloadStatus === constants.downloadStatus.started 
      ) {
        try {
          console.log("start download: " + appStateContext.downloadStatus);
          appStateContext.set_download_status(
            constants.downloadStatus.downloading
          );
            DownloadFile(props.media, handler)
            .then(result => {
              console.log("downloadFile Result: " + JSON.stringify(result));
              if (result.status == 200) {          
                //once download is completed, change download status back to not started      
                appStateContext.set_download_status(
                  constants.downloadStatus.notStarted
                );
              } else {
                handler(0, "下载中发生错误");
                appStateContext.set_download_status(
                  constants.downloadStatus.notStarted
                );
              }
            })
            .catch(error => {
              console.log("downloadFile: " + appStateContext.downloadStatus);
              handler(0, error);
              appStateContext.set_download_status(
                constants.downloadStatus.notStarted
              );
            })
            .finally(()=>{
              //Alert.alert("下载完成", "文件已储存在: " + result.uri);         
              //RootNavigation.push('Page', { menu: props.menu, book: props.book, section: 0, article: -1 });                 
              props.updateMediaExist(true); 
            });
          //<DownloadMedia media={props.media} handler={handler} />
        } catch (e) {
          handler(0, e);
          appStateContext.set_download_status(
            constants.downloadStatus.notStarted
          );
        }
      }
      //right after download started, the handler will change the status to downloading, show progress here
      return (
        <GetProgressBtn
          media={props.media}
          progress={appStateContext.downloadProgress}
          title={props.title}
        />
      );
    } else {
      //if current downloading media is current book media, but downloading is not yet started
      return <GetDefaultBtn media={props.media} title={props.title} mediaExist={props.mediaExist} />;
    }
  } else {
    //if current downloading media is not current book media
    return <GetDefaultBtn media={props.media} title={props.title} mediaExist={props.mediaExist} />;
  }
};

const GetDefaultBtn = props => {
  if (props.mediaExist === true) {
    return <GetProgressBtn media={props.media} title={props.title} progress={100} />;
  } else {
    return <GetDownloadBtn media={props.media} title={props.title} />;
  }
};
const GetProgressBtn = props => {  
  //console.log("download debug 003: " + props.media + " / " + props.progress);
  const appStateContext = useContext(AppContext);
  appStateContext.set_download_media(props.media);
  return (
    <TouchableOpacity
      style={styles.headerDownloading}
      onPress={() => {
        if ( appStateContext.downloadStatus === constants.downloadStatus.downloading ) {
          Alert.alert(
            "正在下载",
            "当前音频正在下载中，下载进度 " + props.progress.toFixed(1) + "%，请稍后。"
          );
        } else {          
          Alert.alert(
            "重新下载",
            "音频已经下载，是否要重新下载？",
            [
              {
                text: "取消",
                onPress: () => { 
                  console.log("Cancel Pressed " + props.title);
                },
                style: "cancel",
              },
              {
                text: "确认",
                onPress: () => {
                  console.log("OK Pressed " + props.title);
                  if ( appStateContext.downloadStatus === constants.downloadStatus.notStarted ) {
                    console.log("restart download " + props.title);
                    appStateContext.set_download_media(props.media);
                    appStateContext.set_download_progress(0);
                    appStateContext.set_download_status(constants.downloadStatus.started);
                  } else {
                    Alert.alert("请稍后", "("+ appStateContext.downloadMedia +")音频正在下载，请稍后");
                  }
                },
              },
            ],
            { cancelable: true }
          );
        }
      }}
    >
      <CircularProgress
        size={25}
        strokeWidth={5}
        progressPercent={props.progress}
        text={""}
      />
    </TouchableOpacity>
  );
};
const GetDownloadButtonPressed = props => {
  const appStateContext = useContext(AppContext);
}
const GetDownloadBtn = props => {
  const appStateContext = useContext(AppContext);
  return (
    <Icon
      name="download"
      onPress={() => {
        console.log("GetDownloadBtn: " + appStateContext.downloadStatus);
        if (
          appStateContext.downloadStatus === constants.downloadStatus.notStarted
        ) {
          appStateContext.set_download_media(props.media);
          appStateContext.set_download_progress(0);
          appStateContext.set_download_status(constants.downloadStatus.started);
          console.log("GetDownloadBtn: " + appStateContext.downloadMedia);
        } else {
          Alert.alert("请稍后", "其他("+ appStateContext.downloadMedia +")音频正在下载，请稍后");
        }
      }}
      type="font-awesome"
      color="#ffffff"
      containerStyle={styles.headerDownload}
    />
  );
};