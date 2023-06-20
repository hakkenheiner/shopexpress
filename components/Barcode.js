import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import ShoppingListContext from '../ShoppingListContext';

const visionAPI = "AIzaSyCOcgcoEivQ-4JxSihH73v_vqeZAsB4QwU";

export default function Barcode({ navigation }) {
  const { setBarcodeData, setProductPrice, setIsDetectingPrice } = useContext(ShoppingListContext);
  const [isScanned, setIsScanned] = useState(false);
  
  
  useEffect(() => {
    return () => {
      setIsScanned(false);
    };
  }, []);

  const detectPrice = async () => {
    setIsDetectingPrice(true);
    navigation.navigate('AddItem');
    let { assets } = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
  
    if (assets && assets.length > 0) {
      const base64 = assets[0].base64;
  
      const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${visionAPI}`, {
        method: 'POST',
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64,
              },
              features: [
                { type: 'TEXT_DETECTION', maxResults: 5 },
              ],
            },
          ],
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();

      const formatNoSymbol = /\b(\d{3,5})\b ?€?/;
      const formatWithSpace = /\b(\d{1,3})\s(\d{2})\b ?€?/;

      if (data.responses && data.responses.length > 0 && data.responses[0].fullTextAnnotation) { 
          const fullText = data.responses[0].fullTextAnnotation.text;
          console.log("fullText : ", fullText);
      
          const priceFormats = [/\b(\d+[,.]\d{2})\b ?€/, /\b(\d+[,.]\d{2})\b/, formatWithSpace, formatNoSymbol];
          let priceMatch = null;
          for (const format of priceFormats) {
              priceMatch = fullText.match(format);
              if (priceMatch) {
                  console.log('Matching format: ', format);
                  console.log('Matched price: ', priceMatch[0]);
                  if (format === formatNoSymbol || format === formatWithSpace) {
                      const correctPrice = `${priceMatch[1].slice(0, priceMatch[1].length-2)},${priceMatch[1].slice(priceMatch[1].length-2)}`;
                      console.log('Corrected price: ', correctPrice);
                      setProductPrice(correctPrice);
                  } else {
                      setProductPrice(priceMatch[0]);
                  }
                  break; 
              }
          }
          if (!priceMatch) {
              Alert.alert('Prix non détecté');
              setIsScanned(false);
          }
      } else {
        Alert.alert('Prix non détecté'); 
        setIsScanned(false);
      }      
    }
    setIsDetectingPrice(false);
  };
  

  const handleBarCodeScanned = async ({ data }) => {
    if (isScanned) return;
    setIsScanned(true);
  
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      const productData = await response.json();
  
      if (productData.status === 1) {
        const name = productData.product.product_name;
        setBarcodeData(name);
        detectPrice();
      } else {
        Alert.alert('Produit non trouvé');
        navigation.navigate('AddItem');
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Erreur de réseau',
        "Une erreur s'est produite lors de la tentative de connexion au réseau. Veuillez vérifier votre connexion Internet et réessayer."
      );
      setIsScanned(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={Camera.Constants.Type.back} onBarCodeScanned={handleBarCodeScanned}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  camera: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
