import React, { Component, useContext } from 'react';
import { View, ScrollView, Text, StyleSheet, Animated } from 'react-native';
import { Slider, Icon } from 'react-native-elements';
import styles from "../content/css/styles";
import AppContext from "../utilities/context";
import constants from "../utilities/constants.json";

export default class AudioBar extends Component { 
    constructor(props) {
        super(props);      
        this.state = {currentPosition: 0};
        this.state = {newPostion: 0};        
        //this.updatePlaybackPosition = this.updatePlaybackPosition.bind(this);
    }

    // updatePlaybackPosition(value) {
    //     this.setState({newPostion: value});
    //     console.log("update: " + value + " > " + this.state.newPostion);
    // }

    render() {
        // if (this.state.newPostion > this.state.currentPosition) {
        //     this.setState({currentPosition: this.state.newPostion});
        // }
        return (
            <GetAudioBar />
        )
    }    
}

const GetAudioBar = (props) => {    
    const appStateContext = useContext(AppContext);
    let positionValue = 0;
    let playbackTitle = "";
    let playbackStatus = "";
    let playbackDuration = "00:00";
    let playbackTimePosition = "00:00";

    if (appStateContext.audioPlayingTitle !== "" && typeof appStateContext.audioPlayingTitle !== "undefined") {
        playbackTitle = appStateContext.audioPlayingTitle;        
        if (typeof appStateContext.audioPlayingDuration !== "undefined") {
            playbackDuration = MillSecToDuration(appStateContext.audioPlayingDuration);
        }
    }
    if (typeof appStateContext.audioPlayingStatus !== "undefined") {
        switch (appStateContext.audioPlayingStatus) {
            case constants.audioStatus.playing:
                playbackStatus = "正在播放："
                break;
            case constants.audioStatus.paused:                
                playbackStatus = "暂停播放："
                break;
        }
    }

    if (appStateContext.audioPlaybackUpdate > positionValue) {
        playbackTimePosition = MillSecToDuration(appStateContext.audioPlayingDuration * appStateContext.audioPlaybackUpdate / 100);
        //console.log(playbackTimePosition);
        positionValue = appStateContext.audioPlaybackUpdate;
    }
    
    //console.log(positionValue + " : " + appStateContext.audioPlaybackUpdate);

    return (
        <View style={[styles.audioBarBody ]}>
              <Slider
                value={positionValue}
                //onValueChange={setValue}
                maximumValue={100}
                minimumValue={0}
                step={1}
                trackStyle={{ height: 10, backgroundColor: 'transparent' }}
                thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
                thumbProps={{
                children: (
                    <Icon
                        name="music"
                        type="font-awesome"
                        size={20}
                        reverse
                        containerStyle={{ bottom: 20, right: 20 }}
                        color="#ff8040"
                    />
                ),
                }}
            />
            <View style={{position: 'absolute', left: 0, top:50}}>
                <Text>{playbackTimePosition}/{playbackDuration}</Text>
            </View>
            <View style={{position: 'absolute', right: 5, top:50}}>
                <Text>{playbackStatus}{playbackTitle}</Text>
            </View>
        </View>
    )
}

const MillSecToDuration = (duration) => {
    try {
        var milliseconds = parseInt((duration % 1000) / 100),
          seconds = Math.floor((duration / 1000) % 60),
          minutes = Math.floor((duration / (1000 * 60)) % 60),
          hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
      
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        
        return hours === "00" ? minutes + ":" + seconds : hours + ":" + minutes + ":" + seconds;
    } catch (e) {
        console.error(e);
        return "";
    }

}