import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { app } from '../base';
import * as Fire from 'firebase'
import firebase from "firebase"
// import {firebaseConfig} from "../base"

export const ImagePickerFile = () => {
  // if(!Firebase.apps.length){
  //   Firebase.initializeApp(firebaseConfig)
  // }
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false)
  const [imageURL, setImageURL] = useState(null)

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })(); 
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 2,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async() => {


    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function(){
        resolve(xhr.response)
      } 
      xhr.onerror = function(){
        reject(new TypeError('Network request failed'))
      }
      xhr.responseType = "blob"
      xhr.open("GET", image, true)
      xhr.send(null)
    })

    const ref = app.storage().ref().child(new Date().toISOString())
    const snapshot = ref.put(blob)

    snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED, 
      () => {
        setUploading(true)
      },
      
   
    
    (error) => {
      console.log(error)
      blob.close()
      return 
    },
    ()=>{
      setUploading(false)
      snapshot.snapshot.ref.getDownloadURL().then((url)=>{
        console.log("downloaded url: ",url)
        // blob.close()
        setImageURL(url)
        return
      })
    }
    )
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

     {
       uploading ?  <ActivityIndicator 
       size="large" color="red"
       /> : <Button title="Upload now" onPress={uploadImage} /> 
     }
    
    </View>
  );
}