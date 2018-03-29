import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  StyleSheet,
  PixelRatio,
  View,
  CameraRoll,
  Image
} from 'react-native';
import { TabNavigator } from 'react-navigation'
import { colors } from './js/theme'
global.Buffer = global.Buffer || require('buffer').Buffer; // Required for aws sigv4 signing

import {
  ViroARSceneNavigator
} from 'react-viro';

var sharedProps = {
  apiKey:"BD05E2FA-5AC3-4768-AC35-B958EEACEE34",
}

import AddImage from './js/AddImage'
var InitialARScene = require('./js/HelloWorldSceneAR');

import Amplify, { Auth, Storage } from 'aws-amplify'
import config from './js/aws-exports.js'
Amplify.configure(config)
// window.LOG_LEVEL = 'DEBUG'

class ViroSample extends Component {
  constructor() {
    super();
    this.state = {
      sharedProps: sharedProps,
      imageUrl: ''
    }
    this._getARNavigator = this._getARNavigator.bind(this);
  }
  componentDidMount() {
    Storage.get('29f5cd3d-5f6f-453f-84bd-50f2ad08895f')
      .then(data => {
        this.setState({ imageUrl: data })
      })
      .catch(err => {
        console.log('error..: ', err)
      })
  }
  render() {
    return this._getARNavigator();
  }
  _getARNavigator() {
    return (
      <View style={{ flex: 1 }}>
        <ViroARSceneNavigator
          {...this.state.sharedProps}
          initialScene={{scene: InitialARScene}}
        />
      </View>
    );
  }
}

const tabs = {
  AddImage: {
    screen: AddImage,
    navigationOptions: {
      tabBarLabel: 'Add Image',
      tabBarIcon: ({ tintColor }) => (
        <Image
          style={{ tintColor, width: 28, height: 28 }}
          source={require('./js/assets/add.png')}
        />
      )
    }
  },
  Home: {
    screen: ViroSample,
    navigationOptions: {
      tabBarLabel: 'Gallery',
      tabBarIcon: ({ tintColor }) => (
        <Image
          style={{ tintColor, width: 28, height: 28 }}
          source={require('./js/assets/gallery.png')}
        />
      )
    }
  },
}

const tabConfig = {
  tabBarOptions: {
    activeTintColor: colors.primary,
    style: {
      borderTopColor: 'transparent',
      backgroundColor: 'transparent'
    }
  }
}

const Nav = TabNavigator(tabs, tabConfig) 

var localStyles = StyleSheet.create({
  outer : {
    flex : 1,
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor: "black",
  },
  inner: {
    flex : 1,
    flexDirection: 'column',
    alignItems:'center',
    backgroundColor: "black",
  },
  titleText: {
    paddingTop: 30,
    paddingBottom: 20,
    color:'#fff',
    textAlign:'center',
    fontSize : 25
  },
  buttonText: {
    color:'#fff',
    textAlign:'center',
    fontSize : 20
  },
  buttons : {
    height: 80,
    width: 150,
    paddingTop:20,
    paddingBottom:20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  }
});

AppRegistry.registerComponent('ViroSample', () => Nav);

// The below line is necessary for use with the TestBed App
AppRegistry.registerComponent('ViroSample', () => Nav);

