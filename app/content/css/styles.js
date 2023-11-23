import React, { StyleSheet } from 'react-native'

export default StyleSheet.create({
  pageText: {
    padding: 20,
    fontSize: 18
  },
  container: {    
    backgroundColor: '#ffffff',
    padding: 20,
  },
  subtitle: {
    fontSize: 50,
    color: "#4d4d4d"
  },
  headerAudio: {
    marginTop: 10
  },
  headerDownload: {
    marginRight: 15
  },
  headerDownloading: {
    marginTop: 0
  },
  contentContainer: {
    marginBottom: 50
  },
  contentRow: {
    flex: 1, 
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 5
  },
  contentCenterView: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  contentCenterViewLeft: {
    flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start'
  },
  contentPage: {
    margin: 25
  },
  settingText: {
    fontSize: 16,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },  
  settingSlider: {
    width: 300,
    opacity: 1,
    height: 50,
  },
  settingButton: {
    paddingTop: 10, 
    paddingBottom: 10,
    paddingRight: 30,
    paddingLeft: 30,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  settingButtonLight: {
    backgroundColor: '#ffffff', 
    color: '#000000'
  },
  settingButtonDark: {
    backgroundColor: '#2b2b2b', 
    color: '#f1f1f1'
  },
  settingButtonBook: {
    backgroundColor: '#fff5d9', 
    color: '#2b2b2b'
  },
  divider: {
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: '#4d4d4d'
  },

  //theme
  pageBodyNoMargin: {
    flex: 1, 
    alignItems: 'stretch', 
  },
  pageBody: {
    flex: 1, 
    alignItems: 'stretch', 
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 50
  },
  pageBodyLight: {
    backgroundColor: '#ffffff',
    color: '#000000'
  },
  pageBodyDark: {
    backgroundColor: '#2b2b2b',
    color: '#f1f1f1'
  },
  pageBodyBook: {
    backgroundColor: '#fff5d9',
    color: '#2b2b2b'
  },
  pageFontLight: {
    color: '#000000'
  },  
  pageFontDark: {    
    color: '#f1f1f1'
  },
  pageFontBook: {    
    color: '#2b2b2b'
  },
  headerBgLight: {
    backgroundColor: '#ff8040',
  },
  headerBgDark: {
    backgroundColor: '#444444',
  },
  headerBgBook: {
    backgroundColor: '#ff8040',
  },  
  tabBgLight: {
    backgroundColor: '#b32400',
  },
  tabBgDark: {
    backgroundColor: '#222222',
  },
  tabBgBook: {
    backgroundColor: '#b32400',
  },
  audioBarBody: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 10,
    paddingBottom: 10
  },
});