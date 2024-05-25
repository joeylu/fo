import * as React from "react";
import { useState, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ErrorScreen from "./app/error/error";
import SettingScreen from "./app/layout/settings";
import PageScreen from "./app/layout/page";
import AppContext from "./app/utilities/context";
import constants from "./app/utilities/constants.json";
import styles from "./app/content/css/styles";
import { navigationRef } from './app/utilities/navigator';
import { Load } from "./app/utilities/storage";
;
const Stack = createStackNavigator();

function App() {  
  const [test_string, set_test_string] = useState(styles.testData);
  // Define as many global variables as your app needs, and hooks to set the state of the variable.
  // For each global variable, define a function for updating it. In the case of download_progress, we’ll just use set_download_progress.
  // useState usage: const [var, set action] = useState("initialValue")
  // setState() is usually asynchronous, which means that at the time you console.log the state, it's not updated yet
  // state value will not get synced from a callback, such from audio onPlaybackUpdated(), use ref in local to resolve the issue (https://stackoverflow.com/questions/71447566/react-state-variables-not-updating-in-function)
  //for some reason, boolean type does not work because useState turns boolean type to string, not sure why, using int instead
  const [download_title, set_download_title] = useState(constants.downloadTitle);
  const [download_media, set_download_media] = useState(constants.downloadMedia);
  const [download_progress, set_download_progress] = useState(0.0);
  const [download_status, set_download_status] = useState(constants.downloadStatus.notStarted);
  const [audio_playing_title, set_audio_playing_title] = useState("");
  const [audio_playing_media, set_audio_playing_media] = useState("");
  const [audio_playing_duration, set_audio_playing_duration] = useState(0.0); //total duration of this audio
  const [audio_playing_status, set_audio_playing_status] = useState(constants.audioStatus.unloaded);
  const [audio_player_instance, set_audio_player_instance] = useState(null);
  const [audio_playback_update, set_audio_playback_update] = useState(0.0); //get position (0-100) of this audio from its instance onPlaybackUpdate
  const [audio_is_seeking, on_audio_is_seeking] = useState(0);
  const [audio_playback_position_set, on_audio_playback_position_set] = useState(-1.0); //whenever user input is finalizded such as on slider completed, a negative number indicates seeking has not yet started
  //app settings
  const [setting_font_size, set_font_size] = useState(constants.settings.fontSize);
  const [setting_line_height, set_line_height] = useState(constants.settings.lineHeight);
  const [setting_theme, set_theme] = useState(constants.settings.themeIndex);
  const [setting_theme_page_background_color, set_theme_page_background_color] = useState(styles.pageBodyLight);
  const [setting_theme_page_font_color, set_theme_page_font_color] = useState(styles.pageFontLight);
  const [setting_theme_header_background_color, set_theme_header_background_color] = useState(styles.headerBgLight);
  const [setting_theme_tab_background_color, set_theme_tab_background_color] = useState(styles.tabBgLight);
  const [setting_text_selectable, set_text_selectable] = useState(0);
  
  const appState = {
    testString: test_string,    
    set_test_string,
    //constants
    downloadTitle: download_title,
    downloadMedia: download_media,
    downloadProgress: download_progress,
    downloadStatus: download_status,
    audioPlayingTitle: audio_playing_title,
    audioPlayingMedia: audio_playing_media,
    audioPlayingDuration: audio_playing_duration,
    audioPlayingStatus: audio_playing_status,
    audioPlayerInstance: audio_player_instance,
    audioPlaybackUpdate: audio_playback_update,
    audioIsSeeking : audio_is_seeking,
    audioPlaybackPositionSet : audio_playback_position_set,
    set_download_title,
    set_download_progress,
    set_download_status,
    set_download_media,
    set_audio_playing_title,
    set_audio_playing_media,
    set_audio_playing_duration,
    set_audio_playing_status,
    set_audio_player_instance,
    set_audio_playback_update,
    on_audio_is_seeking,
    on_audio_playback_position_set,
    //settings
    settingFontSize: setting_font_size,
    settingLineHeight: setting_line_height,
    settingTheme: setting_theme,
    settingThemePageBackgroundColor: setting_theme_page_background_color,
    settingThemePageFontColor: setting_theme_page_font_color,
    settingThemeHeaderBackgroundColor: setting_theme_header_background_color,
    settingThemeTabBackgroundColor: setting_theme_tab_background_color,
    settingTextSelectable: setting_text_selectable,
    set_font_size,
    set_line_height,
    set_theme,
    set_theme_page_background_color,
    set_theme_page_font_color,
    set_theme_header_background_color,
    set_theme_tab_background_color,
    set_text_selectable,
  };
  return (
    <AppContext.Provider value={appState}>
      <NavigationContainer ref={navigationRef}>
        <StackNavigator />
      </NavigationContainer>
    </AppContext.Provider>
  );
}

const StackNavigator = () => {
  const appStateContext = useContext(AppContext);

  const SetSlider = (fontSize) => {    
    if (!fontSize) { 
        fontSize = constants.settings.fontSize; 
    } else {
        if (fontSize.toString() === appStateContext.settingFontSize.toString()) return; 
    }
    fontSize = Number(fontSize);
    appStateContext.set_font_size(fontSize)
  }
  const SetLine = (lineHeight) => {    
    if (!lineHeight) { 
      lineHeight = constants.settings.lineHeight; 
    } else {
        if (lineHeight.toString() === appStateContext.settingLineHeight.toString()) return; 
    }
    lineHeight = Number(lineHeight);
    appStateContext.set_line_height(lineHeight)
  }
  const SetTheme = (themeIndex) => {     
      if (!themeIndex) {            
          themeIndex = constants.settings.themeIndex; 
      } else {
          if (themeIndex.toString() === appStateContext.settingTheme.toString()) return; 
      }
      themeIndex = Number(themeIndex);
      UpdateTheme(themeIndex);
  }
  const UpdateTheme = index => {
    var themeIndex = 0;
    var pageBg = styles.pageBodyLight, pageFont = styles.pageFontLight, headerBg = styles.headerBgLight, tabBg = styles.tabBgLight;
    if (index) {
        switch (index) {
            case 1:
                themeIndex = index;
                pageBg = styles.pageBodyDark;
                pageFont = styles.pageFontDark;
                headerBg = styles.headerBgDark;
                tabBg = styles.tabBgDark;
                break;
            case 2:
                themeIndex = index;
                pageBg = styles.pageBodyBook;
                pageFont = styles.pageFontBook;
                headerBg = styles.headerBgBook;
                tabBg = styles.tabBgBook;
                break;
        }
    }
    
    appStateContext.set_theme(themeIndex);
    appStateContext.set_theme_page_background_color(pageBg);
    appStateContext.set_theme_page_font_color(pageFont);
    appStateContext.set_theme_header_background_color(headerBg);
    appStateContext.set_theme_tab_background_color(tabBg);
}

  Load(constants.settings.fontSizeName)
        .then(result => SetSlider(result))
        .catch(error => {   
            console.log("error caught font size");         
            SetSlider(constants.settings.fontSize); 
        })

  Load(constants.settings.lineHeightName)
      .then(result => SetLine(result))
      .catch(error => {   
          console.log("error caught line height");         
          SetLine(constants.settings.lineHeight); 
      })

  Load(constants.settings.themeIndexName)
      .then(result => SetTheme(result))
      .catch(error => {            
          console.log("error caught theme");       
          SetTheme(constants.settings.themeIndex);
      });

  return (
    <Stack.Navigator
      initialRouteName="Page"
      screenOptions={{
        headerStyle: appStateContext.settingThemeHeaderBackgroundColor,
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        cardStyle: appStateContext.settingThemePageBackgroundColor,
      }}
    >
      <Stack.Screen name="Page">
        {(props) => <PageScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Error" component={ErrorScreen} />
      <Stack.Screen name="Settings" component={SettingScreen} />
    </Stack.Navigator>
  );
}
export default App;
