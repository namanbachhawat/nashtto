import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import api from '../services/api';

const CartScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const loadCart = async () => {
    try {
      const response = await api.getCart();
      if (response.success) {
        setCart(response.cart);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load cart items');
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(itemId);
      return;
    }

    try {
      const response = await api.updateCartItem(itemId, newQuantity);
      if (response.success) {
        setCart(response.cart);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update item quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await api.removeFromCart(itemId);
      if (response.success) {
        setCart(response.cart);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await api.clearCart();
              if (response.success) {
                setCart([]);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cart');
            }
          },
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout');
      return;
    }
    navigation.navigate('Payment', { cart });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const renderCartItem = ({ item }) => (
    <Card className="mb-3 p-4">
      <View className="flex-row items-center">
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47?w=100' }}
          className="w-[60px] h-[60px] rounded-lg mr-3"
        />
        <CardContent className="flex-1 p-0">
          <Text className="text-base font-semibold text-slate-800 mb-1">{item.name}</Text>
          <Text className="text-sm text-green-500 font-semibold mb-2">₹{item.price || 0}</Text>
          <View className="flex-row items-center">
            <TouchableOpacity
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
              onPress={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
            >
              <Text className="text-lg font-bold text-slate-500">-</Text>
            </TouchableOpacity>
            <Text className="mx-4 text-base font-semibold text-slate-800 min-w-[30px] text-center">{item.quantity || 1}</Text>
            <TouchableOpacity
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
              onPress={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
            >
              <Text className="text-lg font-bold text-slate-500">+</Text>
            </TouchableOpacity>
          </View>
        </CardContent>
        <TouchableOpacity
          className="w-8 h-8 rounded-full bg-red-50 items-center justify-center"
          onPress={() => removeItem(item.id)}
        >
          <Text className="text-base text-red-500">✕</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-lg text-slate-500">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-800">My Cart</Text>
        {cart.length > 0 && (
          <TouchableOpacity className="px-3 py-1.5" onPress={clearCart}>
            <Text className="text-red-500 text-sm font-semibold">Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {cart.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">🛒</Text>
          <Text className="text-2xl font-bold text-slate-800 mb-2 text-center">Your cart is empty</Text>
          <Text className="text-base text-slate-500 text-center mb-8">Add some delicious items to get started</Text>
          <Button
            title="Browse Restaurants"
            onPress={() => navigation.navigate('Home')}
            className="bg-green-500 px-6"
          />
        </View>
      ) : (
        <>
          <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
            {cart.map((item) => (
              <View key={item.id}>
                {renderCartItem({ item })}
              </View>
            ))}
          </ScrollView>

          {/* Cart Summary */}
          <View className="bg-white px-4 py-3 border-t border-slate-200">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-slate-500">Items ({getTotalItems()}):</Text>
              <Text className="text-sm text-slate-800 font-semibold">₹{getTotalPrice()}</Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-slate-500">Delivery Fee:</Text>
              <Text className="text-sm text-slate-800 font-semibold">₹40</Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-slate-500">GST:</Text>
              <Text className="text-sm text-slate-800 font-semibold">₹{(getTotalPrice() * 0.05).toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between items-center border-t border-slate-200 pt-3 mt-2">
              <Text className="text-base text-slate-800 font-bold">Total:</Text>
              <Text className="text-base text-green-500 font-bold">₹{(getTotalPrice() + 40 + getTotalPrice() * 0.05).toFixed(2)}</Text>
            </View>
          </View>

          {/* Checkout Button */}
          <View className="bg-white px-4 py-4 border-t border-slate-200">
            <Button
              title={`Proceed to Checkout • ₹${(getTotalPrice() + 40 + getTotalPrice() * 0.05).toFixed(2)}`}
              onPress={handleCheckout}
              loading={loading}
              className="bg-green-500"
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;