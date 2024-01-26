import React, { Component, useContext, useRef } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import AppContext from "../utilities/context";
import styles from "../content/css/styles";
import { Icon } from "react-native-elements";
import { mp3Folder, GetFileInfo } from "../utilities/files";
import constants from "../utilities/constants.json";

export default class AudioBtn extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true
    });
  }

  render() {
    return (
      <GetAudioBtn
        media={this.props.media}
        title={this.props.title}
        exist={this.props.exist}
      />
    );
  }
}

const GetAudioBtn = (props) => {
  const appStateContext = useContext(AppContext);
  const audioSeekingRef = useRef(); //useContext wont get updated its value in onPlaybackStatusUpdate callback
  const audioPositionSet = useRef(); //useContext wont get updated its value in onPlaybackStatusUpdate callback
  audioSeekingRef.current = appStateContext.audioIsSeeking;
  audioPositionSet.current = appStateContext.audioPlaybackPositionSet;

  const onPlaybackStatusUpdate = (status) => {  
    // console.log(audioSeekingRef.current + ">>>>>> " + (audioSeekingRef.current == 0) + " : " + audioPositionSet.current + " >>>> " + (parseInt(audioPositionSet.current) < 0));  
    if (parseInt(audioSeekingRef.current) == 0 && parseInt(audioPositionSet.current) < 0) {
      if (status.durationMillis > 0 && status.positionMillis > 0) {
        // console.log("updating from audio instance " + audioSeekingRef.current + " : " + audioPositionSet.current + " > " + ((status.positionMillis/status.durationMillis) * 100).toFixed(1));
        appStateContext.set_audio_playback_update(((status.positionMillis/status.durationMillis) * 100).toFixed(1));
      }
    }
  }

  const playAudioHandler = async () => {
    try {      
      //console.log("playAudioHandler " + appStateContext.audioPlayingMedia + " : " + props.media + " status is " + appStateContext.audioPlayingStatus);
      //check if the current playing media equals to the target media
      if (appStateContext.audioPlayingMedia === props.media) {
        //load the audio if it's not yet loaded
        if (
          appStateContext.audioPlayingStatus === constants.audioStatus.unloaded ||
          appStateContext.audioPlayingStatus === constants.audioStatus.stopped
        ) {
          await _loadNewAudio(props.media, props.title);
        } else {
          //determine the button actio by playback that is already loaded
          if (
            appStateContext.audioPlayingStatus === constants.audioStatus.playing
          ) {
            //console.log("playAudioHandler.pauseAudio " + appStateContext.audioPlayingTitle + " : " + props.media + " : " + props.title);
            await _pauseAudio();
          } 
          if (
            appStateContext.audioPlayingStatus === constants.audioStatus.paused
          ) {
            //console.log("playAudioHandler.resumeAudio " + appStateContext.audioPlayingTitle + " : " + props.media + " : " + props.title);
            await _resumeAudio();
          }
        }
      } else { //when current playing media is not target media
        console.log("target media check: " + appStateContext.audioPlayingStatus);
        if (
          appStateContext.audioPlayingStatus === constants.audioStatus.playing
        ) {       
          Alert.alert(
            "中断播放",
            "正在播放:" + appStateContext.audioPlayingTitle + ",是否中断当前播放",
            [
              {
                text: "取消",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "确认",
                onPress: () => _unloadAudio(),
              },
            ],
            { cancelable: true }
          );
        } else {          
          //if nothing is currently playing, load the target media
          await _loadNewAudio(props.media, props.title);
        }
      }
    } catch (e) {
      console.log(e);
      Alert.alert("加载出错", "无法加载新音频，请尝试退出当前页面或重启APP");
    }
  };
  const _loadNewAudio = async (media, title) => {
    try {
      //loading new sound
      const source = { uri: mp3Folder + media };
      const newPlayback = new Audio.Sound();
      newPlayback.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate); //invoke everytime when this playback status has updated, such as duration
      //set loading initial status
      const initialStatus = {
        shouldPlay: true,
        rate: 1.0,
        shouldCorrectPitch: true,
        volume: 1.0,
        isMuted: false,
      };

      await newPlayback
        .loadAsync(source, initialStatus, false)
        .then((playbackStatus) => {
          newPlayback.setIsLoopingAsync(true);
          appStateContext.set_audio_player_instance(newPlayback);
          appStateContext.set_audio_playing_media(media);
          appStateContext.set_audio_playing_title(title);
          appStateContext.set_audio_playing_duration(playbackStatus.durationMillis)
          appStateContext.set_audio_playing_status(constants.audioStatus.playing); //since it's a local file and shouldPlay is true, should play the audio immediately instead buffering
          appStateContext.on_audio_playback_position_set(-1.0);
          //console.log("loading finished: " + JSON.stringify(playbackStatus));          
        })
        .catch((error) => {
          console.log("loading audio error: " + error);
          Alert.alert("加载出错", "无法加载音频，请尝试推出当前页面");
        });
    } catch (e) {
      console.log(e);
      Alert.alert("加载出错", "无法加载音频，请尝试推出当前页面");
    }
  };
  const _pauseAudio = async () => {
    const currentPlayback = appStateContext.audioPlayerInstance;
    try {
      await currentPlayback
        .pauseAsync()
        .then(() => {
          //appStateContext.set_audio_player_instance(currentPlayback);
          appStateContext.set_audio_playing_status(constants.audioStatus.paused);
          console.log("paused");
        })
        .catch((error) => {
          console.log("pause audio error: " + error);
          Alert.alert("播放出错", "无法暂停音频，请尝试重启");
        });
    } catch (e) {
      console.log(e);
      Alert.alert("播放出错", "无法暂停音频，请尝试重启APP");
    }
  };
  const _resumeAudio = async () => {
    const currentPlayback = appStateContext.audioPlayerInstance;
    try {
      await currentPlayback
        .playAsync()
        .then(() => {
          //appStateContext.set_audio_player_instance(currentPlayback);
          appStateContext.set_audio_playing_status(constants.audioStatus.playing);
          console.log("resumed");
        })
        .catch((error) => {
          console.log("play audio error: " + error);
          Alert.alert("播放出错", "无法重新播放音频，请尝试重启");
        });
    } catch (e) {
      console.log(e);
      Alert.alert("播放出错", "无法重新播放音频，请尝试重启APP");
    }
  };
  const _unloadAudio = async () => {
    const currentPlayback = appStateContext.audioPlayerInstance;
    try {
      await currentPlayback
        .unloadAsync()
        .then(() => {
          appStateContext.set_audio_player_instance(null);   
          appStateContext.set_audio_playing_media('');       
          appStateContext.set_audio_playing_title('');
          appStateContext.set_audio_playing_status(constants.audioStatus.unloaded);
          appStateContext.set_audio_playing_duration(0)
          appStateContext.set_audio_playback_update(0);
          //console.log("unload finished: ");
        })
        .catch((error) => {
          console.log("unload audio error: " + error);
          Alert.alert("播放出错", "无法终止播放音频，请尝试重启");
        });
    } catch (e) {
      console.log(e);
      Alert.alert("播放出错", "无法终止播放音频，请尝试重启APP");
    }
  };
  const _seekAudio = async (newPosition) => {    
    const currentPlayback = appStateContext.audioPlayerInstance;
    //console.log("123432256432254352: >>>>>>>>>>>> " + newPosition);
    try {
      await currentPlayback
        .playFromPositionAsync(newPosition)
        .then(() => {
          appStateContext.set_audio_playing_status(constants.audioStatus.playing);
          appStateContext.on_audio_playback_position_set(-1); //reset
          console.log("seeking finished seeking to " + newPosition + " from " + appStateContext.audioPlaybackUpdate);
        })
        .catch((error) => {
          appStateContext.on_audio_playback_position_set(-1); //reset
          console.log("seeking audio error: " + error);
          Alert.alert("寻址出错", "无法定位音频，请尝试重启");
        });
    } catch (e) {
      appStateContext.on_audio_playback_position_set(-1); //reset
      console.log(e);
      Alert.alert("播放出错", "无法寻址音频，请尝试重启APP");
    }
  }

  //console.log(appStateContext.audioIsSeeking + " >> " + (parseInt(appStateContext.audioIsSeeking) != 0) + " : " + appStateContext.audioPlaybackPositionSet + " >> " + (parseInt(appStateContext.audioPlaybackPositionSet) >= 0));
  //while audio is playing and when user is finished changing the slider (seeking is completed)
  if (parseInt(appStateContext.audioPlaybackPositionSet) >= 0 && parseInt(appStateContext.audioIsSeeking) == 0) {
    if (typeof appStateContext.audioPlayerInstance !== "undefined" && appStateContext.audioPlayerInstance != null) {
      console.log("user has changed audio position from " + appStateContext.audioPlaybackUpdate + " to: " + appStateContext.audioPlaybackPositionSet);
      _seekAudio(appStateContext.audioPlayingDuration * (appStateContext.audioPlaybackPositionSet / 100));
    } else {
      appStateContext.set_audio_playback_update(0);
    }
  }

  /*
    check this audio media existence, if not, no show
    otherwise, if downloading is currently started, make sure the current download media is not current audio, if matches, no show    
  */
  //console.log(props.media + " : " + props.exist);
  if (props.exist === true) {    
    if (appStateContext.downloadStatus !== constants.downloadStatus.notStarted && appStateContext.downloadMedia === props.media) {
      console.log("re-downloading " + appStateContext.downloadMedia + " : " + props.media);
      //when media file is existed, but is redownloading
      return <Text />
    } else {
      return (
        <TouchableOpacity
          style={styles.headerAudio}
          onPress={playAudioHandler}
          onLongPress={() => {
            if (
              appStateContext.audioPlayingStatus === constants.audioStatus.playing ||
              appStateContext.audioPlayingStatus === constants.audioStatus.paused
            ) {
              Alert.alert(
                "终止播放",
                "正在播放:" + appStateContext.audioPlayingTitle + "，是否要终止当前播放？",
                [
                  {
                    text: "取消",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "确认",
                    onPress: () => _unloadAudio(),
                  },
                ],
                { cancelable: true }
              );
            }
          }}
        >
          <GetAudioIcon media={props.media} />
        </TouchableOpacity>
      );
    }
  } else {
    return <Text />;
  }
};

const GetAudioIcon = (props) => {
  const appStateContext = useContext(AppContext);
  let iconName = "play";
  if (
    appStateContext.audioPlayingMedia === props.media &&
    appStateContext.audioPlayingStatus === constants.audioStatus.playing
  ) {
    iconName = "pause";
  }
  return (
    <Icon
      name={iconName}
      type="font-awesome"
      color="#ffffff"
      containerStyle={styles.headerPlayer}
    />
  );
};
