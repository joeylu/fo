import React, { Component, useContext, useRef } from 'react';
import { View, ScrollView, Text } from 'react-native';
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
        return (
            <GetAudioBar slideable={this.props.media} />
        )
    }    
}

const GetAudioBar = (props) => {    
    const appStateContext = useContext(AppContext);
    const audioSlideable = useRef(); //useContext wont get updated its value in onPlaybackStatusUpdate callback
    audioSlideable.current = appStateContext.audioIsSlideable;
    //console.log("current audio at: " + appStateContext.audioPlaybackUpdate + " and slideable is " + audioSlideable.current);

    let isSlideable = false;
    if (props.slideable.length > 0 && appStateContext.audioPlayingMedia.length > 0) {
        isSlideable = props.slideable === appStateContext.audioPlayingMedia;
        //console.log(props.slideable + " : " + appStateContext.audioPlayingMedia + " : " + isSlideable);
    }
    return (
        <View style={ isSlideable ? [styles.audioBarBody ] : [styles.audioBarBodyHidden ]}>
              <Slider
                //thumbTouchSize = {{width: 60, height: 60}}
                value={ parseFloat(appStateContext.audioPlaybackUpdate) }
                //onValueChange={(value) => appStateContext.set_audio_playback_update(value)}
                maximumValue={100} 
                minimumValue={0}
                //disabled={ (parseInt(audioSlideable.current) == 0) }
                step={0.1}
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
                    console.log("sliding started", progress, (parseInt(appStateContext.audioIsSlideable) == 0));
                    appStateContext.on_audio_is_seeking(1);
                    appStateContext.on_audio_playback_position_set(-2.0);
                }}
                onSlidingComplete={(progress) => {
                    console.log("sliding complete", progress);
                    appStateContext.on_audio_is_seeking(0);
                    appStateContext.on_audio_playback_position_set(progress);
                }}
            />
            <View style={{position: 'absolute', left: 50, bottom:10}}>
                <PlayingTimer />
            </View>
            <View style={{position: 'absolute', right: 50, bottom:10}}>
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
                return (<Text style={{color:"#ffffff"}}>正在播放：{appStateContext.audioPlayingTitle}</Text>);
            case constants.audioStatus.paused:      
                return (<Text style={{color:"#ffffff"}}>暂停播放：{appStateContext.audioPlayingTitle}</Text>);
        }
    }
    return (<Text style={{color:"#ffffff"}}>目前没有播放音频</Text>);
}
const PlayingTimer = () => {
    const appStateContext = useContext(AppContext);
    if (typeof appStateContext.audioPlayingDuration !== "undefined") {
        return (
            <Text style={{color:"#ffffff"}}>
                {MillSecToDuration(appStateContext.audioPlayingDuration * appStateContext.audioPlaybackUpdate / 100)} / 
                {MillSecToDuration(appStateContext.audioPlayingDuration)}
            </Text>
        );
        
    }
    return (<Text style={{color:"#ffffff"}}>00:00/00:00</Text>);
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