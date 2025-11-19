import { useEffect, useState } from 'react';
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

const VendorScreen = ({ navigation, route }) => {
  const { vendor } = route.params || {};
  const [vendorData, setVendorData] = useState(vendor || null);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    if (vendor) {
      loadVendorMenu(vendor.id);
    }
  }, [vendor]);

  const loadVendorMenu = async (vendorId) => {
    try {
      const response = await api.getVendorMenu(vendorId);
      if (response.success) {
        setMenu(response.menu);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load menu');
    }
  };

  const addToCart = async (item) => {
    try {
      const response = await api.addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        vendorId: vendorData.id,
      });
      if (response.success) {
        Alert.alert('Success', `${item.name} added to cart!`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const renderMenuItem = (item) => (
    <Card key={item.id} className="mb-3 p-4">
      <View className="flex-row items-center">
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47?w=100' }}
          className="w-[60px] h-[60px] rounded-lg mr-3"
        />
        <CardContent className="flex-1 p-0">
          <Text className="text-base font-semibold text-slate-800 mb-1">{item.name}</Text>
          <Text className="text-xs text-slate-500 mb-1">{item.category}</Text>
          <Text className="text-base text-green-500 font-semibold">₹{item.price}</Text>
        </CardContent>
        <Button
          title="Add"
          onPress={() => addToCart(item)}
          size="small"
          className="bg-green-500 px-4"
        />
      </View>
    </Card>
  );

  if (!vendorData) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="flex-1 px-4 justify-center items-center">
          <Text className="text-lg font-bold text-slate-800 mb-4">Vendor not found</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            className="w-full"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-slate-200">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-lg text-slate-500">←</Text>
        </TouchableOpacity>
        <View className="flex-1 ml-3">
          <Text className="text-lg font-bold text-slate-800" numberOfLines={1}>{vendorData.name}</Text>
          <Text className="text-xs text-slate-500 mt-0.5">⭐ {vendorData.rating} • {vendorData.time}</Text>
        </View>
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
          onPress={() => navigation.navigate('Cart')}
        >
          <Text className="text-lg">🛒</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Vendor Info */}
        <View className="bg-white rounded-xl p-4 mt-4 flex-row">
          <Image source={{ uri: vendorData.image }} className="w-20 h-20 rounded-lg" />
          <View className="flex-1 ml-3">
            <Text className="text-xl font-bold text-slate-800 mb-1">{vendorData.name}</Text>
            <Text className="text-sm text-slate-500 mb-1">
              ⭐ {vendorData.rating} • {vendorData.time} • {vendorData.distance}
            </Text>
            <Text className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded self-start mb-1 font-semibold">{vendorData.offers}</Text>
            <Text className="text-sm text-slate-500 mb-1">{vendorData.price}</Text>
            <Text className="text-sm text-slate-500 leading-5">{vendorData.description}</Text>
          </View>
        </View>

        {/* Menu Categories */}
        <View className="mt-6">
          <Text className="text-lg font-bold text-slate-800 mb-4">Menu</Text>

          {menu.length === 0 ? (
            <View className="items-center p-8">
              <Text className="text-base text-slate-500">No menu items available</Text>
            </View>
          ) : (
            menu.map(renderMenuItem)
          )}
        </View>

        <View className="h-5" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default VendorScreen;