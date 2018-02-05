import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Popover, { PopoverTouchable } from 'react-native-modal-popover';
import { List, ListItem } from 'react-native-elements'
import Sound from 'react-native-sound';
import RNFetchBlob from 'react-native-fetch-blob'
import Icon from 'react-native-vector-icons/FontAwesome';
import foData from '../content/data.json';
//init directory
const dirs = RNFetchBlob.fs.dirs;
// Enable playback in silence mode
Sound.setCategory('Playback');
//init react native sound
function initNewSound(){
  if (global.preload.sound == null) {    
    //console.log(JSON.stringify(global.preload));
    global.preload.sound = new Sound(global.preload.media, dirs.MusicDir + "/fo", (error) => {
      console.log(error);
      if (error) {
        console.log('failed to load the sound', error);
        return;
      } 
      // loaded successfully
      // Loop indefinitely until stop() is called
      //sound.setNumberOfLoops(-1);
      //console.log('duration in seconds: ' + global.preload.sound.getDuration() + 'number of channels: ' + global.preload.sound.getNumberOfChannels());
    });
  } else {
    //console.log("not null");
  }
}

class IconPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {sound: props.songInfo};
    if (global.song.media != props.songInfo.media) {
      initNewSound();
    }
  }
  playNewSound() { //when new play is pressed
    //console.log(JSON.stringify(global.preload));
    //console.log(global.preload.sound.isLoaded());    
    if (global.preload.sound.isLoaded()) { //make sure the new sound is initiated
      global.song = global.preload;
      global.song.status = 1;
      this.props.songHandler(global.song);
      this.updateFrame();
      global.song.sound.play((success) => {
        if (success) {
          //something when finish playing
        } else {
          alert('无法加载音乐，请尝试重新下载: (1000)');
          global.song.sound.release();
        }
      }); 
    } else {      
      alert('无法加载音乐，如果是第一次下载，请回到主页面再重新点击当前目录: (10)');
    }
  }
  pauseSong(){
    global.song.status = 2;
    global.song.sound.pause();
    this.props.songHandler(global.song);
    this.updateFrame();
  }
  resumeSong(){
    global.song.status = 1;
    global.song.sound.play(); //resume() is not there yet
    this.props.songHandler(global.song);
    this.updateFrame();
  }
  stopSong(){
    global.song.sound.stop(() => {
      global.song.sound.release();
    });
    global.song.status = 0;
    this.props.songHandler(global.song);
  }
  updateFrame(){
    clearInterval(global.song.intervalID);    
    global.song.intervalID = setInterval(()=>{
      let time = new Date();
      console.log(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + " -- " + song.intervalID);      
      if (global.song.status == 1 && global.song.sound.isLoaded()){
        global.song.sound.getCurrentTime((second)=> { 
          let playbackFrame = parseInt((second / global.song.sound.getDuration()) * 100);
          if (playbackFrame > global.song.frame) {
            global.song.frame = playbackFrame;
            this.props.songHandler(global.song);
            console.log(second + " // " + global.song.frame);
          }
        });
      }    
      if(global.song.frame > 100 || global.song.status != 1 || !global.song.sound.isLoaded()) {
        clearInterval(global.song.intervalID);
      }
    }, 1000)
  }
  render() {
    if (this.state.sound.status == 3) {    
      return (
        <ListItem key={0} hideChevron={true} title="尚未缓存"
          leftIcon={<Icon name="exclamation-triangle" style={styles.icons} size={20} ></Icon>} />
      )  
    } else if (this.state.sound.status == 2) {    
      return (
        <ListItem key={0} hideChevron={true} title="继续播放" onPress={() => {return this.resumeSong();}}
          leftIcon={<Icon name="play-circle-o" style={styles.icons} size={20} ></Icon>} />
      )  
    } else if (this.state.sound.status == 1) {    
      return (
        <ListItem key={0} hideChevron={true} title="暂停播放" onPress={() => {return this.pauseSong();}}
          leftIcon={<Icon name="pause" style={styles.icons} size={20} ></Icon>}          
          title={
            <View style={{flex: 1, height:20, position: 'relative'}}>
              <Text style={{position: 'relative', zIndex:2}}>暂停播放</Text>
              <View style={{width: this.state.sound.frame.toString() + '%', height:"100%", backgroundColor:'#ddd', position: 'absolute',zIndex:1}}></View>
            </View>
          } />
      )
    } else {            
      return (              
        <ListItem key={0} hideChevron={true} title="播放音乐" onPress={() => {return this.playNewSound();}}
          leftIcon={<Icon name="play" style={styles.icons} size={20} ></Icon>} />
      )
    }
  }
}
class Download extends Component {
  constructor(props) {
    super(props);
    this.state = {sound: props.downloadInfo};    
  }
  downloadSound(){
    global.preload.status = 3, global.preload.download = 0; global.preload.sound = null;
    this.props.fileHandler(global.preload);
    RNFetchBlob.config({
      path : dirs.MusicDir + '/fo/' + global.preload.media
    }).fetch('GET', 'http://www.halagame.com/fo/' + global.preload.media, {
      //some headers ..    
    }).progress({ count : 10 }, (received, total) => {
      let progressingValue = parseInt((received / total) * 100);
      global.preload.download = 1; global.preload.progress = progressingValue;
      this.props.fileHandler(global.preload);
      //console.log('progress', progressingValue)    
    }).then((res) => {
      global.preload.status = 0; global.preload.download = 2; global.preload.progress = 100; global.preload.sound = null;       
      this.props.fileHandler(global.preload);
      initNewSound(); //set song.sound, hacky for react native sound to initialize the file 
    }).catch((errorMessage, statusCode)=>{     
      global.preload.status = 3; global.preload.download = 0; global.preload.progress = 0;
      this.props.fileHandler(global.preload);
      //console.log('failed: ' + errorMessage);
    })
  }
  render() {
    if (this.state.sound.download == 2) {
      return (                
        <ListItem key={1} hideChevron={true} onPress={() => {return this.downloadSound();}} title="重新下载" 
          leftIcon={<Icon name="check" style={styles.icons} size={20} ></Icon>} />
      )
    } else if (this.state.sound.download == 1) {
      return (               
        <ListItem key={1} hideChevron={true} 
          leftIcon={ <Icon name="spinner" style={styles.icons} size={20} ></Icon> }
          title={
            <View style={{flex: 1, height:20, position: 'relative'}}>
              <Text style={{position: 'relative', zIndex:2}}>下载中..</Text>
              <View width style={{width: this.state.sound.progress.toString() + '%', height:"100%", backgroundColor:'#ddd', position: 'absolute',zIndex:1}}></View>
            </View>
          }
        />
      )
    } else {
      return (
        <ListItem key={1} hideChevron={true} onPress={() => {return this.downloadSound();}} title="缓存音乐"
          leftIcon={<Icon name="download" style={styles.icons} size={20} ></Icon>} />
      )
    }
  }  
}

export default class OptionsPopover extends Component {  
  constructor(props) {
    super(props);    
    global.preload = {status: 3, media: "", download: 0, progress: 0, sound: null, frame: 0, intervalID: 0}; //always reset preload
    if (global.song.media != this.props.media) { //when new book is opened, create a new preload media file
      global.preload.media = this.props.media;
    } else { //when same book or both has no media, use global song
      global.preload = global.song;
    }
    this.state = {sound:global.preload};
    this.updateSong = this.setSoundState.bind(this);
    //console.log(JSON.stringify(this.state.sound));
  }    
  doFileCheck() {  
    let fileName = global.preload.media;
    RNFetchBlob.fs.exists(dirs.MusicDir + "/fo/" + fileName).then((exist) => {
      //console.log("file is: " + exist + " -- status: " + global.preload.status);
      if (exist && global.preload.status != 1) { //has file, set to default playable
        global.preload = {status: 0, media: fileName, download: 2, progress: 100, frame: 0,intervalID: 0 };
        this.setSoundState(global.preload);
      } else if (!exist) { //no file, set to default downloadable
        global.preload = {status: 3, media: fileName, download: 0, progress: 0, frame: 0,intervalID: 0 };
        this.setSoundState(global.preload);
      }
    }).catch(() => { 
      //log error
    })
  }
  setSoundState(songInfo) { 
    this.setState({ sound: songInfo });
  }
  componentDidMount() {
    //console.log("start checking");
    this.doFileCheck();
  }
  render(){           
    const OptionList = ()=>{
      if (this.state.sound.media) {        
        return (
          <List containerStyle={{marginBottom: 20}}>          
            <IconPlayer songInfo={this.state.sound} songHandler = {this.updateSong.bind(this)} />            
            <Download downloadInfo={this.state.sound} fileHandler = {this.updateSong.bind(this)} />
            <ListItem key={99} hideChevron={true} titleStyle={{color: '#ccc'}} title="设置" 
              leftIcon={<Icon name="cog" style={styles.iconsDisabled} size={20} ></Icon>} />
          </List>
        )
      } else {           
        return (
          <List containerStyle={{marginBottom: 20}}>          
            <ListItem key={99} hideChevron={true} titleStyle={{color: '#ccc'}} title="设置" 
              leftIcon={<Icon name="cog" style={styles.iconsDisabled} size={20} ></Icon>} />
          </List>
        )     
      }
    }
    return (    
      <PopoverTouchable>
        <Icon.Button name="bars" backgroundColor="transparent" color="#1a1a1a" size={30} />
        <Popover
          contentStyle={styles.content}
          arrowStyle={styles.arrow}
          backgroundStyle={styles.background}
          placement = "bottom"
        >
          {
            <OptionList />
          }
        </Popover>
      </PopoverTouchable>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    backgroundColor: '#fcfcfc',
    borderRadius: 8,
  },
  arrow: {
    borderTopColor: '#fcfcfc',
  },
  icons: {
    marginRight: 15
  },
  iconsDisabled: {
    marginRight: 15,
    color: '#ccc'
  }
});

