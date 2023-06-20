import React, { useContext, useEffect } from 'react';
import { FlatList, Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import ShoppingListContext from '../ShoppingListContext';
import ShoppingListItem from './ShoppingListItem';

function ShoppingListScreen({ navigation, route }) {
    const { shoppingList, setShoppingList } = useContext(ShoppingListContext);
    

    useEffect(() => {
        if (route.params?.newItem) {
            setShoppingList(currentShoppingList => [
                ...currentShoppingList,
                route.params.newItem,
            ]);
        }
    }, [route.params?.newItem]);

    const calculateTotal = () => {
        let total = 0;
        shoppingList.forEach(item => {
            total += item.price * item.quantity;
        });
        return parseFloat(total).toFixed(2);
    };


    return (
        <View style={styles.container}>
            <FlatList
                data={shoppingList}
                renderItem={({ item }) => <ShoppingListItem item={item} />}
                keyExtractor={item => item.id.toString()}
            />
            <View style={styles.down}>
                <Text style={styles.total}>Total: {calculateTotal()}€</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => {
                    navigation.navigate('AddItem')
                }}>
                    <Icon name="plus" type="font-awesome" size={40} color="white" />
                </TouchableOpacity>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    total: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        color: 'white',
    },
    down: {
        backgroundColor: '#262626',
        padding: 5,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        backgroundColor: 'black',
        borderRadius: 30,
    },
});

export default ShoppingListScreen;
