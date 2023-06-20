import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ShoppingListScreen from './ShoppingListScreen';
import AddItemScreen from './AddItemScreen';
import Barcode from './Barcode';

const Stack = createStackNavigator();

function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="ShoppingList"
            screenOptions={{
                headerStyle: { backgroundColor: '#262626' },
                headerTintColor: 'white',
                headerShadowVisible: false,
            }}>
                <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
                <Stack.Screen name="AddItem" component={AddItemScreen} />
                <Stack.Screen name="code" component={Barcode} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;
