import React, { useContext, useState } from 'react';
import { Text, View, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import ShoppingListContext from '../ShoppingListContext';

function ShoppingListItem({ item }) {
    const { shoppingList, setShoppingList } = useContext(ShoppingListContext);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    

    const increaseQuantity = () => {
        const updatedList = shoppingList.map((listItem) => {
            if (listItem.id === item.id) {
                return { ...listItem, quantity: listItem.quantity + 1 };
            }
            return listItem;
        });
        setShoppingList(updatedList);
    };

    const decreaseQuantity = () => {
        if (item.quantity > 1) {
            const updatedList = shoppingList.map((listItem) => {
                if (listItem.id === item.id) {
                    return { ...listItem, quantity: listItem.quantity - 1 };
                }
                return listItem;
            });
            setShoppingList(updatedList);
        }
    };

    const deleteItem = () => {
        const updatedList = shoppingList.filter(listItem => listItem.id !== item.id);
        setShoppingList(updatedList);
        setShowConfirmationModal(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.text}>{item.price} €</Text>
            <View style={styles.quantityContainer}>
                <Button title="-" onPress={decreaseQuantity} />
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <Button title="+" onPress={increaseQuantity} />
            </View>
            <Button title="Delete" onPress={() => setShowConfirmationModal(true)} />

            <Modal visible={showConfirmationModal}  transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Êtes-vous sûr de vouloir supprimer cet article ?</Text>
                        <View style={styles.modalButtons}>
                            <Button title="Annuler" onPress={() => setShowConfirmationModal(false)} />
                            <Button title="Supprimer" onPress={deleteItem} />
                        </View>
                    </View>
                </View>
            </Modal>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    text: {
        flex: 1,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityText: {
        marginRight: 10,
        marginLeft: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default ShoppingListItem;
