'use strict';

import React, { Component } from 'react';

import {StyleSheet} from 'react-native';

import { Storage } from 'aws-amplify'

import {
  ViroARScene,
  ViroText,
  ViroImage,
} from 'react-viro';

/*
https://s3.amazonaws.com/amsterdamar-userfiles-mobilehub-1708327480/public/025cca83-4527-4134-9566-660a5d2a0a46
*/

class HelloWorldSceneAR extends React.Component {
  state = {
    text : "Initializing AR...",
    images: []
  }
  componentDidMount() {
    setInterval(() => {
      Storage.list('')
        .then(result => {
          if (result.length !== this.state.images.length) {
            this.setState({
              images: result
            })
          }
          console.log('result: ', result)
        })
        .catch(err => console.log(err));
    }, 5000)
  }
  fetchImages() {
    Storage.list('')
      .then(result => {
        this.setState({
          images: result
        })
        console.log('result: ', result)
      })
      .catch(err => console.log(err));
  }
  render() {
    
    let length = this.state.images.length
    length = length

    const root = Math.round(Math.sqrt(length))
    let negativeRoot = -root

    const beginningIndex = Math.round(negativeRoot / 2) - 1
    const endingIndex = Math.round(root / 2) - 1

    let beginX = beginningIndex
    let beginY = beginningIndex
    let end = endingIndex

    let increment = 3
    let start = 0
  
    console.log('root:', root)
    console.log('endingIndex: ', endingIndex)
    console.log('beginningIndex: ', beginningIndex)
    console.log('negativeRoot:', negativeRoot)

    return (
      <ViroARScene onTrackingInitialized={()=>{this.setState({text : "Hello Amsterdam!"})}}>
        <ViroText text={this.state.text} scale={[.5, .5, .5]} position={[0, 0, -1]} style={styles.helloWorldTextStyle} />
        {
          this.state.images.map((image, index) => {
            beginX = beginX + 1
            if (beginX > end) {
              beginX = beginningIndex + 1
              beginY = beginY + 1
            }
            console.log('xyz: ', `[${beginX}, 0, ${beginY}]`)
            return (
              <ViroImage
                key={index}
                transformBehaviors='billboard'
                position={[beginX * 5, 0, beginY * 5]}
                height={2}
                width={2}
                source={{ uri: `https://s3.amazonaws.com/amsterdamar-userfiles-mobilehub-1708327480/public/${image.key}` }}
              />
            )
          })
        }
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

