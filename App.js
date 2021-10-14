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
  // Define as many global variables as your app needs, and hooks to set the state of the variable.
  // For each global variable, define a function for updating it. In the case of download_progress, we’ll just use set_download_progress.
  // useState usage: const [var, set action] = useState("initialValue")  
  const [download_title, set_download_title] = useState(constants.downloadTitle);
  const [download_media, set_download_media] = useState(constants.downloadMedia);
  const [download_progress, set_download_progress] = useState(0.00);
  const [download_status, set_download_status] = useState(constants.downloadStatus.notStarted);
  const [audio_playing_title, set_audio_playing_title] = useState("");
  const [audio_playing_media, set_audio_playing_media] = useState("");
  const [audio_playing_status, set_audio_playing_status] = useState(constants.audioStatus.unloaded);
  const [audio_player_instance, set_audio_player_instance] = useState(null);
  //app settings
  const [setting_font_size, set_font_size] = useState(constants.settings.fontSize);
  const [setting_theme, set_theme] = useState(constants.settings.themeIndex);
  const [setting_theme_page_background_color, set_theme_page_background_color] = useState(styles.pageBodyLight);
  const [setting_theme_page_font_color, set_theme_page_font_color] = useState(styles.pageFontLight);
  const [setting_theme_header_background_color, set_theme_header_background_color] = useState(styles.headerBgLight);
  const [setting_theme_tab_background_color, set_theme_tab_background_color] = useState(styles.tabBgLight);
  const appState = {
    downloadTitle: download_title,
    downloadMedia: download_media,
    downloadProgress: download_progress,
    downloadStatus: download_status,
    audio_playing_title: audio_playing_title,
    audioPlayingMedia: audio_playing_media,
    audioPlayingStatus: audio_playing_status,
    audioPlayerInstance: audio_player_instance,
    set_download_title,
    set_download_progress,
    set_download_status,
    set_download_media,
    set_audio_playing_title,
    set_audio_playing_media,
    set_audio_playing_status,
    set_audio_player_instance,
    //settings
    settingFontSize: setting_font_size,
    settingTheme: setting_theme,
    settingThemePageBackgroundColor: setting_theme_page_background_color,
    settingThemePageFontColor: setting_theme_page_font_color,
    settingThemeHeaderBackgroundColor: setting_theme_header_background_color,
    settingThemeTabBackgroundColor: setting_theme_tab_background_color,
    set_font_size,
    set_theme,
    set_theme_page_background_color,
    set_theme_page_font_color,
    set_theme_header_background_color,
    set_theme_tab_background_color
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
