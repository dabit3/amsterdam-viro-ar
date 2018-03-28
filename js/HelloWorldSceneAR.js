'use strict';

import React, { Component } from 'react';

import {StyleSheet} from 'react-native';

import { Storage } from 'aws-amplify'

import {
  ViroARScene,
  ViroText,
} from 'react-viro';

class HelloWorldSceneAR extends React.Component {
  state = {
    text : "Initializing AR..."
  }
  componentDidMount() {
    Storage.list('')
      .then(
        result => console.log('result: ', result)
      )
      .catch(err => console.log(err));
  }
  render() {
    return (
      <ViroARScene onTrackingInitialized={()=>{this.setState({text : "Hello World!"})}}>
        <ViroText text={this.state.text} scale={[.5, .5, .5]} position={[0, 0, -1]} style={styles.helloWorldTextStyle} />
      </ViroARScene>
    );
  }
}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',  
  },
});

module.exports = HelloWorldSceneAR;

