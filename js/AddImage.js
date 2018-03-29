import React, { Component } from 'react';
import {
  Dimensions,
  Text,
  StyleSheet,
  TouchableHighlight,
  View,
  TouchableOpacity,
  Modal,
  Image,
  Button,
  ScrollView,
  CameraRoll,
  ActivityIndicator 
} from 'react-native';
import uuidV4 from 'uuid/v4'
import RNFS from 'react-native-fs'
import { Storage } from 'aws-amplify'
import mime from 'mime-types'
import { colors } from './theme'
console.log('mime:', mime)

const { width, height } = Dimensions.get('window')

class AddImage extends React.Component {
  state = {
    modalVisible: false,
    images: [],
    page_info: {},
    chosenImageUrl: '',
    base64Data: '',
    imageType: '',
    uploading: false,
    processing: false
  }
  getPhotos = () => {
    CameraRoll.getPhotos({
      first: 50,
      assetType: 'All',
    })
    .then(r => {
      this.setState({
        images: r.edges,
        modalVisible: true,
        pageInfo: r.page_info
      }, () => {
        console.log('state: ', this.state)
      })
    })
  }
  viewMore = () => {
    CameraRoll.getPhotos({
      first: 50,
      assetType: 'All',
      after: this.state.pageInfo.end_cursor
    })
    .then(r => {
      console.log('r:', r)
      console.log('end: ', r.page_info.end_cursor)
      this.setState({
        images: [...this.state.images, ...r.edges],
        modalVisible: true,
        pageInfo: r.page_info
      })
    })
  }
  chooseImage(image) {
    const mimeType = mime.lookup(image.filename);
    this.setState({ processing: true, modalVisible: false, chosenImageUrl: image.uri })
    
    RNFS.copyAssetsFileIOS(
      image.uri,
      RNFS.DocumentDirectoryPath + '/' + uuidV4(),
      image.width,
      image.height
    )
      .then(data => {
        console.log('data:', data)
        RNFS.readFile(data, 'base64')
          .then(imageData => {
            this.setState({
              base64Data: imageData,
              processing: false
            })
          })
          .catch(err => console.log('err:', err))
      })
      .catch(error => {
        console.log('error: ', error)
      })
  }
  addPhoto = () => {
    if (!this.state.base64Data || this.state.base64Data === '') return
    this.setState({
      uploading: true
    })
    Storage.put(
      uuidV4(),
      new Buffer(this.state.base64Data, 'base64'),
      { contentType: 'image/jpeg', level: 'public' }
    )
    // console.log('adding photo...')
    // Storage.put(
    //   uuidV4(),
    //   this.state.chosenImageUrl,
    //   {
    //     contentType: 'image/png'
    //   }
    // )
    .then(success => {
      this.setState({ uploading: false, base64Data: '', chosenImageUrl: '' })
      console.log('success! :', success)}
    )
    .catch(err => console.log('error: ', err))
  }
  render() {
    console.log('width:', width)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={this.getPhotos.bind(this)}
        >
          <View style={styles.button}>
            <Text>Choose from Camera Roll</Text>
          </View>
        </TouchableOpacity>
        {
          this.state.chosenImageUrl !== '' && (
            <Image
              resizeMode='contain'
              style={styles.image}
              source={{ uri: this.state.chosenImageUrl }}
            />
          )
        }
        {
          this.state.chosenImageUrl === '' && (
            <View style={styles.placeholder} />
          )
        }
        {/* <TouchableOpacity>
          <View>
            <Text>Take Picture</Text>
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={this.state.uploading || this.state.processing ? null : this.addPhoto}
        >
          <View style={[styles.button, this.state.processing || this.state.uploading && {backgroundColor: '#ededed'}]}>
            {
              this.state.processing ? (
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{ marginRight: 16 }}>Processing image</Text>
                  <ActivityIndicator />
                </View>
              ) : this.state.uploading ? (
                <Text>Uploading Image</Text>
              ) : (
                <Text>Add Image</Text>
              )
            }
          </View>
        </TouchableOpacity>

        {
          this.state.uploading && <ActivityIndicator />
        }

        <Modal visible={this.state.modalVisible} style={{ width }}>
          <View style={{ width, height }}>
            <ScrollView
              contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'blue'}}
            >
              {
                this.state.images.map(({ node: { image } }, i) => (
                  <TouchableOpacity onPress={() => this.chooseImage(image)} key={i}>
                    <Image
                      resizeMode='contain'
                      style={styles.image}
                      source={{ uri: image.uri }}
                    />
                  </TouchableOpacity>
                ))
              }
              <TouchableOpacity onPress={this.viewMore}>
                <View style={styles.image}><Text>View More</Text></View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  image: {
    width: width / 3,
    height: width / 3,
    backgroundColor: '#ededed'
  },
  placeholder: {
    width: width / 3,
    height: width / 3,
    backgroundColor: '#ededed'
  },
  button: {
    marginVertical: 15,
    backgroundColor: colors.primary,
    height: 50,
    width: width - 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white'
  }
})

export default AddImage
