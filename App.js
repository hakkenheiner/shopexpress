import React, { useState } from 'react';
import Navigation from './components/Navigation';
import ShoppingListContext from './ShoppingListContext';

export default function App() {
    const [shoppingList, setShoppingList] = useState([]);
    const [barcodeData, setBarcodeData] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [isDetectingPrice, setIsDetectingPrice] = useState(false);
    

    return (
        <ShoppingListContext.Provider value={{ 
            shoppingList, 
            setShoppingList, 
            barcodeData, 
            setBarcodeData, 
            productPrice, 
            setProductPrice, 
            isDetectingPrice, 
            setIsDetectingPrice,
        }}>
            <Navigation />
        </ShoppingListContext.Provider>
    );
}