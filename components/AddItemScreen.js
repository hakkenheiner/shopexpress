import React, { useContext, useState } from 'react';
import { Text, View, Button, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import ShoppingListContext from '../ShoppingListContext';

function AddItemScreen({ navigation }) {
    const { setShoppingList, barcodeData, setBarcodeData, productPrice, setProductPrice, isDetectingPrice } = useContext(ShoppingListContext);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const addItem = () => {
        const itemName = barcodeData !== '' ? barcodeData : name;
        const itemPrix = productPrice !== '' ? productPrice : price;

        if (itemName === '') {
            alert('Veuillez entrer un nom pour cet article');
            return;
        }
        if (itemPrix === '') {
            alert('Veuillez entrer un prix pour cet article');
            return;
        }
        let itemPrice = parseFloat(itemPrix.replace(',', '.')).toFixed(2);
    
        setShoppingList((currentShoppingList) => {
            let itemExists = false;
    
            const updatedList = currentShoppingList.map((item) => {
                if (item.name === itemName && item.price === itemPrice) {
                    itemExists = true;
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });
    
            if (!itemExists) {
                const newItem = {
                    id: Date.now(),
                    name: itemName,
                    price: itemPrice,
                    quantity: 1,
                };
                updatedList.push(newItem);
            }
    
            setName('');
            setPrice('');
            setBarcodeData('');
            setProductPrice('');
            navigation.navigate('ShoppingList');
    
            return updatedList;
        });
    };
    
    const handleNameChange = text => {
        if (barcodeData === '') {
            setName(text);
        } else {
            setName(text);
            setBarcodeData('');
        }
    };

    const handlePriceChange = text => {
        if (productPrice === '') {
            setPrice(text);
        } else {
            setPrice(text);
            setProductPrice('');
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Scan Barcode" onPress={() => navigation.navigate('code')} />
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={barcodeData !== '' ? barcodeData : name}
                onChangeText={handleNameChange}
            />
            <TextInput
                style={styles.input}
                placeholder="Price"
                value={productPrice !== '' ? productPrice : price}
                onChangeText={handlePriceChange}
                keyboardType="decimal-pad"
            />
            <Button title="Add" onPress={addItem} />
            {isDetectingPrice && (
                <View style={styles.loading}>
                  <ActivityIndicator size="large" color="#00ff00" />
                </View>
              )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.9)',
      },
});

export default AddItemScreen;
