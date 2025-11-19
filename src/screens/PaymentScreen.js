import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import api from '../services/api';

const PaymentScreen = ({ navigation, route }) => {
  const { cart } = route.params || {};
  const [cartItems, setCartItems] = useState(cart || []);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [deliveryAddress, setDeliveryAddress] = useState('Home - 123 Main Street, Mumbai');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'upi', name: 'UPI', icon: '📱' },
    { id: 'wallet', name: 'Digital Wallet', icon: '👛' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
  ];

  useEffect(() => {
    if (!cart) {
      // Load cart if not passed as params
      loadCart();
    }
  }, []);

  const loadCart = async () => {
    try {
      const response = await api.getCart();
      if (response.success) {
        setCartItems(response.cart);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load cart');
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => 40;
  const getGST = () => getTotalPrice() * 0.05;
  const getGrandTotal = () => getTotalPrice() + getDeliveryFee() + getGST();

  const handlePayment = async () => {
    if (selectedPaymentMethod === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name)) {
      Alert.alert('Missing Information', 'Please fill in all card details');
      return;
    }

    if (selectedPaymentMethod === 'upi' && !cardDetails.number) {
      Alert.alert('Missing Information', 'Please enter UPI ID');
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        amount: getGrandTotal(),
        method: selectedPaymentMethod,
        items: cartItems,
        address: deliveryAddress,
      };

      const response = await api.processPayment(paymentData);

      if (response.success) {
        // Place the order
        const orderData = {
          vendorName: 'Green Tea House', // This should be dynamic based on cart
          total: getGrandTotal(),
          items: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        };

        const orderResponse = await api.placeOrder(orderData);

        if (orderResponse.success) {
          Alert.alert(
            'Payment Successful!',
            `Your order has been placed successfully.\nOrder ID: ${orderResponse.order.orderId}`,
            [
              {
                text: 'View Order',
                onPress: () => navigation.navigate('Tracking', { order: orderResponse.order }),
              },
              {
                text: 'Back to Home',
                onPress: () => navigation.navigate('Home'),
                style: 'cancel',
              },
            ]
          );
        } else {
          Alert.alert('Error', 'Order placement failed. Please contact support.');
        }
      } else {
        Alert.alert('Payment Failed', response.error || 'Please try again or choose a different payment method.');
      }
    } catch (error) {
      Alert.alert('Error', 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentMethod = (method) => (
    <TouchableOpacity
      key={method.id}
      className={`flex-row items-center justify-between bg-white rounded-xl p-4 mb-2 border ${selectedPaymentMethod === method.id ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}
      onPress={() => setSelectedPaymentMethod(method.id)}
    >
      <View className="flex-row items-center">
        <Text className="text-xl mr-3">{method.icon}</Text>
        <Text className={`text-base ${selectedPaymentMethod === method.id ? 'text-green-600 font-semibold' : 'text-slate-800'}`}>
          {method.name}
        </Text>
      </View>
      <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${selectedPaymentMethod === method.id ? 'border-green-500' : 'border-slate-300'}`}>
        {selectedPaymentMethod === method.id && <View className="w-2 h-2 rounded-full bg-green-500" />}
      </View>
    </TouchableOpacity>
  );

  const renderCardForm = () => (
    <View className="mt-4">
      <TextInput
        className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-base text-slate-800 mb-3"
        placeholder="Card Number"
        value={cardDetails.number}
        onChangeText={(text) => setCardDetails({ ...cardDetails, number: text })}
        keyboardType="numeric"
        placeholderTextColor="#64748b"
      />
      <View className="flex-row justify-between">
        <TextInput
          className="flex-[0.48] bg-white border border-slate-200 rounded-lg px-4 py-3 text-base text-slate-800 mb-3"
          placeholder="MM/YY"
          value={cardDetails.expiry}
          onChangeText={(text) => setCardDetails({ ...cardDetails, expiry: text })}
          placeholderTextColor="#64748b"
        />
        <TextInput
          className="flex-[0.48] bg-white border border-slate-200 rounded-lg px-4 py-3 text-base text-slate-800 mb-3"
          placeholder="CVV"
          value={cardDetails.cvv}
          onChangeText={(text) => setCardDetails({ ...cardDetails, cvv: text })}
          keyboardType="numeric"
          secureTextEntry
          placeholderTextColor="#64748b"
        />
      </View>
      <TextInput
        className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-base text-slate-800 mb-3"
        placeholder="Cardholder Name"
        value={cardDetails.name}
        onChangeText={(text) => setCardDetails({ ...cardDetails, name: text })}
        placeholderTextColor="#64748b"
      />
    </View>
  );

  const renderUPIForm = () => (
    <View className="mt-4">
      <TextInput
        className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-base text-slate-800 mb-3"
        placeholder="Enter UPI ID (e.g., user@paytm)"
        value={cardDetails.number}
        onChangeText={(text) => setCardDetails({ ...cardDetails, number: text })}
        placeholderTextColor="#64748b"
      />
    </View>
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
        <Text className="text-lg font-bold text-slate-800">Checkout</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View className="bg-white rounded-xl p-4 mt-4">
          <Text className="text-lg font-bold text-slate-800 mb-4">Order Summary</Text>
          {cartItems.map((item, index) => (
            <View key={index} className="flex-row justify-between items-center mb-2">
              <View className="flex-1">
                <Text className="text-sm text-slate-800 mb-0.5">{item.name}</Text>
                <Text className="text-xs text-slate-500">Qty: {item.quantity}</Text>
              </View>
              <Text className="text-sm text-slate-800 font-semibold">₹{item.price * item.quantity}</Text>
            </View>
          ))}

          <View className="h-px bg-slate-200 my-3" />

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-slate-500">Subtotal:</Text>
            <Text className="text-sm text-slate-800">₹{getTotalPrice()}</Text>
          </View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-slate-500">Delivery Fee:</Text>
            <Text className="text-sm text-slate-800">₹{getDeliveryFee()}</Text>
          </View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-slate-500">GST (5%):</Text>
            <Text className="text-sm text-slate-800">₹{getGST().toFixed(2)}</Text>
          </View>

          <View className="flex-row justify-between items-center border-t border-slate-200 pt-2 mt-2">
            <Text className="text-base text-slate-800 font-bold">Total:</Text>
            <Text className="text-base text-green-500 font-bold">₹{getGrandTotal().toFixed(2)}</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View className="mt-6">
          <Text className="text-lg font-bold text-slate-800 mb-4">Delivery Address</Text>
          <Card className="mb-2">
            <CardContent>
              <View className="flex-row items-center">
                <Text className="text-xl mr-3">📍</Text>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-slate-800 mb-0.5">{deliveryAddress.split(' - ')[0]}</Text>
                  <Text className="text-xs text-slate-500">{deliveryAddress.split(' - ')[1]}</Text>
                </View>
                <TouchableOpacity className="px-3 py-1.5">
                  <Text className="text-green-500 text-sm font-semibold">Change</Text>
                </TouchableOpacity>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Payment Methods */}
        <View className="mt-6">
          <Text className="text-lg font-bold text-slate-800 mb-4">Payment Method</Text>
          {paymentMethods.map(renderPaymentMethod)}

          {/* Payment Forms */}
          {selectedPaymentMethod === 'card' && renderCardForm()}
          {selectedPaymentMethod === 'upi' && renderUPIForm()}
        </View>

        <View className="h-5" />
      </ScrollView>

      {/* Checkout Button */}
      <View className="bg-white px-4 py-4 border-t border-slate-200">
        <Button
          title={`Pay ₹${getGrandTotal().toFixed(2)}`}
          onPress={handlePayment}
          loading={loading}
          className="bg-green-500"
        />
      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;