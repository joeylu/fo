import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import HomePage from './home';
import DetailPage from './detail';
import ErrorPage from '../error/error';
//status: 0 stop, 1 playing, 2 paused, 3 no file   // download: 0 no file, 1 downloading, 2 downloaded
global.song = {status: 3, media: "", download: 0, progress: 0, sound: null, frame: 0, intervalID: 0};
global.preload = {status: 3, media: "", download: 0, progress: 0, sound: null, frame: 0, intervalID: 0};
export const AppNavigator = StackNavigator({  
  Home: {
    screen: HomePage
  },
  Page: {
    screen: DetailPage
  },
  Error: {
    screen: ErrorPage
  }
});