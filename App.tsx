// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import { StatusBar } from "expo-status-bar";
import { FlatList, Image, StyleSheet,TouchableOpacity,View } from "react-native";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';

import Button from "./components/Button";
// import ImageViewer from "./components/ImageViewer";
const PlaceholderImage = require('./assets/background-image.png');

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>This is Notes Taking App</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });



export default function App(){
  
  const [images, setImages] = useState<string[]>([]);

  const pickImageAsync = async() =>{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection : true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map(asset => asset.uri)]);
    } else {
      alert('You did not select any image.');
    }
  };

  // const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  return (
    <View style = {styles.container}>
      <View style = {styles.imageContainer}>

      <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3} // Grid layout
          renderItem={({ item }) => (
            <TouchableOpacity>
              <Image source={{ uri: item }} style={styles.image} />
            </TouchableOpacity>
          )}
        />
      </View>

      <View style = {styles.footerContainer}>
      <Button theme="primary" label="Choose photos" onPress={pickImageAsync} />
      <Button label="Use this photos" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 4,
  },
  imageContainer: {
    paddingTop : 50,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});