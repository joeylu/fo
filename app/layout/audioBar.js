import React, { Component, useContext } from 'react';
import { View, ScrollView, Text, StyleSheet, Animated } from 'react-native';
import { Slider, Icon } from 'react-native-elements';
import styles from "../content/css/styles";
import AppContext from "../utilities/context";
import constants from "../utilities/constants.json";

export default class AudioBar extends Component { 
    constructor(props) {
        super(props);      
        //this.state = {currentPosition: 0};
        //this.state = {newPostion: 30};
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

    //console.log(appStateContext.audioPlaybackAllowUpdate + " : " + appStateContext.audioPlaybackUpdate);
    if (appStateContext.audioPlaybackAllowUpdate) {
        //console.log("updating " + appStateContext.audioPlaybackAllowUpdate);
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
                //disabled={false}
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
                onSlidingStart={(progress) => {
                    appStateContext.set_audio_playback_allow_update(false);
                    console.log("sliding start", progress, appStateContext.audioPlaybackAllowUpdate);
                  }}
                onSlidingComplete={(progress) => {
                    console.log("sliding complete", progress);
                    appStateContext.set_audio_playback_allow_update(true);
                    appStateContext.set_audio_playback_position(progress);
                }}
            />
            <View style={{position: 'absolute', left: 0, top:50}}>
                <PlayingTimer />
            </View>
            <View style={{position: 'absolute', right: 5, top:50}}>
                <PlayingStatus />
            </View>
        </View>
    )
}

const PlayingStatus = () => {
    const appStateContext = useContext(AppContext);
    if (typeof appStateContext.audioPlayingStatus !== "undefined") {
        switch (appStateContext.audioPlayingStatus) {
            case constants.audioStatus.playing:
                return (<Text>正在播放：{appStateContext.audioPlayingTitle}</Text>);
            case constants.audioStatus.paused:      
                return (<Text>暂停播放：{appStateContext.audioPlayingTitle}</Text>);
        }
    }
    return (<Text>目前没有播放音频</Text>);
}
const PlayingTimer = () => {
    const appStateContext = useContext(AppContext);
    MillSecToDuration(appStateContext.audioPlayingDuration);
    if (typeof appStateContext.audioPlayingDuration !== "undefined") {
        return (
            <Text>
                {MillSecToDuration(appStateContext.audioPlayingDuration * appStateContext.audioPlaybackUpdate / 100)} / 
                {MillSecToDuration(appStateContext.audioPlayingDuration)}
            </Text>
        );
        
    }
    return (<Text>00:00/00:00</Text>);
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