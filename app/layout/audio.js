import React, { Component, useContext } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Audio } from "expo-av";
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
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
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

  const playAudioHandler = async () => {
    try {
      if (appStateContext.audioPlayingMedia === props.media) {
        //load the audio if it's not yet loaded
        if (
          appStateContext.audioPlayingStatus === constants.audioStatus.unloaded
        ) {
          await _loadNewAudio(props.media);
        }
        //determine the button actio by playback status
        if (
          appStateContext.audioPlayingStatus === constants.audioStatus.playing
        ) {
          await _pauseAudio();
        } else {
          if (
            appStateContext.audioPlayingStatus === constants.audioStatus.resume
          ) {
            await _resumeAudio();
          } else {
            await _loadNewAudio(props.media);
          }
        }
      } else {
        if (
          appStateContext.audioPlayingStatus === constants.audioStatus.playing
        ) {
          Alert.alert(
            "中断播放",
            "正在播放 " + props.title + ", 是否中断当前播放"
          );
        } else {
          await _loadNewAudio(props.media);
        }
      }
    } catch (e) {
      console.log(e);
      Alert.alert("加载出错", "无法加载新音频，请尝试推出当前页面或重启APP");
    }
  };
  const _loadNewAudio = async (media) => {
    try {
      //loading new sound
      const source = { uri: mp3Folder + media };
      const newPlayback = new Audio.Sound();
      //set loading initial status
      const initialStatus = {
        shouldPlay: true,
        rate: 1.0,
        shouldCorrectPitch: true,
        volume: 1.0,
        isMuted: false,
      };
      appStateContext.set_audio_playing_media(media);

      await newPlayback
        .loadAsync(source, initialStatus, false)
        .then((playbackStatus) => {
          newPlayback.setIsLoopingAsync(true);
          appStateContext.set_audio_player_instance(newPlayback);
          appStateContext.set_audio_playing_status(
            constants.audioStatus.playing
          ); //since it's a local file and shouldPlay is true, should play the audio immediately instead buffering
          console.log("loading finished: " + JSON.stringify(playbackStatus));
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
          appStateContext.set_audio_player_instance(currentPlayback);
          appStateContext.set_audio_playing_status(
            constants.audioStatus.paused
          );
          console.log("paused finished: ");
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
          appStateContext.set_audio_player_instance(currentPlayback);
          appStateContext.set_audio_playing_status(
            constants.audioStatus.playing
          );
          console.log("play finished: ");
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
          appStateContext.set_audio_player_instance(currentPlayback);
          appStateContext.set_audio_playing_status(
            constants.audioStatus.unloaded
          );
          console.log("unload finished: ");
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

  /*
    check this audio media existence, if not, no show
    otherwise, if downloading is currently started, make sure the current download media is not current audio, if matches, no show
    
  */
  if (props.exist === true) {
    if (appStateContext.downloadStatus !== constants.downloadStatus.notStarted && appStateContext.downloadMedia === props.media) {
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
                "正在播放音频" + props.title + "，是否要终止当前播放？",
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
