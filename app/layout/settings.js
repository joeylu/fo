import React, { Component, useContext } from "react";
import { View, ScrollView, Text, Alert } from "react-native";
import { Divider, ButtonGroup } from 'react-native-elements';
import Slider from '@react-native-community/slider';
import AppContext from "../utilities/context";
import constants from "../utilities/constants.json";
import styles from "../content/css/styles";
import { Save, Load } from "../utilities/storage";


export default class Settings extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <SettingContent />
    }
}


const SettingContent = props => {
    const appStateContext = useContext(AppContext);

    const SetSlider = (fontSize) => {    
        if (!fontSize) { 
            fontSize = constants.settings.fontSize; 
        } else {
            if (fontSize.toString() === appStateContext.settingFontSize.toString()) return; 
        }
        Save(constants.settings.fontSizeName, fontSize).then(result => {
            try {
                fontSize = Number(fontSize);
                appStateContext.set_font_size(fontSize)
            } catch(e) {
                console.log(e);
            }
        });
    }
    const SetTheme = (themeIndex) => {     
        if (!themeIndex) {            
            themeIndex = constants.settings.themeIndex; 
        } else {
            if (themeIndex.toString() === appStateContext.settingTheme.toString()) return; 
        }
        Save(constants.settings.themeIndexName, themeIndex).then(result => { 
            try {
                themeIndex = Number(themeIndex);
                UpdateTheme(themeIndex);
            } catch(e) {                
                console.log(e);
            }
        });
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

    const backColorLight = () => <Text style={[styles.settingButton, styles.settingButtonLight]}>白</Text>
    const backColorDark = () => <Text style={[styles.settingButton, styles.settingButtonDark]}>灰</Text>
    const backColorBook = () => <Text style={[styles.settingButton, styles.settingButtonBook]}>黄</Text>
    const buttons = [{ element: backColorLight }, { element: backColorDark }, { element: backColorBook }]

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
        <View style={[styles.pageBody, appStateContext.settingThemePageBackgroundColor]}>
            <ScrollView contentContainerStyle={styles.contentPage}>    
                <View style={styles.contentRow}>
                    <Text style={[{fontSize: appStateContext.settingFontSize}, appStateContext.settingThemePageFontColor]}>字体尺寸：{appStateContext.settingFontSize}</Text>
                </View>  
                <View style={styles.contentCenterView}>   
                    <Slider
                        value={appStateContext.settingFontSize}
                        style={styles.settingSlider}
                        minimumValue={10}
                        maximumValue={30}                            
                        thumbTintColor={constants.defaultColor2}
                        step={1}
                        onSlidingComplete={value => SetSlider(value)}
                    />
                </View>               
                <Divider style={styles.divider} />
                <View>                    
                    <View style={styles.contentRow}>
                        <Text style={[{fontSize: appStateContext.settingFontSize}, appStateContext.settingThemePageFontColor]}>主题配色：</Text>
                    </View>  
                    <ButtonGroup
                        selectedIndex = {appStateContext.settingTheme}
                        onPress={value => SetTheme(value)}
                        innerBorderStyle = {{width: 0}}
                        buttons={buttons}
                        buttonStyle = {appStateContext.settingThemePageBackgroundColor}
                        selectedButtonStyle = {{backgroundColor: constants.defaultColor1}}
                        containerStyle={{height: 50, borderWidth: 0}} />
                </View>
            </ScrollView>
        </View>
    )   
};

