```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import api from '../services/api';

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const [categoriesResponse, vendorsResponse, addressesResponse, notificationsResponse] = await Promise.all([
        api.getCategories(),
        api.getVendors(),
        api.getAddresses(),
        api.getNotifications(),
      ]);

      if (categoriesResponse.success) setCategories(categoriesResponse.categories);
      if (vendorsResponse.success) setVendors(vendorsResponse.vendors);
      if (addressesResponse.success) setAddresses(addressesResponse.addresses);
      if (notificationsResponse.success) setNotifications(notificationsResponse.notifications);
    } catch (error) {
      Alert.alert('Error', 'Failed to load home data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    navigation.navigate('Search', { searchQuery: searchText });
  };

  const handleVendorPress = (vendor) => {
    navigation.navigate('Vendor', { vendor });
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('Search', { category: category.name });
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      className="items-center mr-4 w-20"
      onPress={() => handleCategoryPress(item)}
    >
      <Image source={{ uri: item.image }} className="w-[60px] h-[60px] rounded-full mb-2" />
      <Text className="text-xs font-semibold text-slate-800 text-center">{item.name}</Text>
      <Text className="text-[10px] text-slate-500 text-center">{item.items} items</Text>
    </TouchableOpacity>
  );

  const renderVendor = ({ item }) => (
    <Card 
      className="mb-3 p-0"
      onPress={() => handleVendorPress(item)}
    >
      <View className="flex-row">
        <Image source={{ uri: item.image }} className="w-20 h-20 rounded-l-2xl" />
        {item.promoted && (
          <View className="absolute top-2 left-2 bg-green-500 rounded px-1.5 py-0.5">
            <Text className="text-white text-[8px] font-bold">Promoted</Text>
          </View>
        )}
        <CardContent className="flex-1 p-3">
          <Text className="text-base font-semibold text-slate-800 mb-1">{item.name}</Text>
          <View className="flex-row items-center mb-2">
            <Text className="text-xs text-slate-500 mr-3">⭐ {item.rating}</Text>
            <Text className="text-xs text-slate-500 mr-3">⏰ {item.time}</Text>
            <Text className="text-xs text-slate-500">• {item.distance}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-semibold">{item.offers}</Text>
            <Text className="text-[10px] text-slate-500">{item.price}</Text>
          </View>
        </CardContent>
      </View>
    </Card>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white">
        <View className="flex-row items-center flex-1">
          <View className="w-8 h-8 bg-green-100 rounded-lg items-center justify-center mr-3">
            <Text className="text-base">📍</Text>
          </View>
          <View>
            <Text className="text-xs text-slate-500">Deliver to</Text>
            <View className="flex-row items-center">
              <Text className="text-sm font-semibold text-slate-800">{addresses[selectedAddress]?.name || 'Home'}</Text>
              <Text className="text-sm text-slate-500 ml-1">• {addresses[selectedAddress]?.address || 'Loading address...'}</Text>
            </View>
          </View>
        </View>
        
        <View className="flex-row gap-2">
          <TouchableOpacity className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center relative">
            <Text className="text-lg">👤</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center relative"
            onPress={() => navigation.navigate('Support')}
          >
            <Text className="text-lg">🔔</Text>
            {unreadNotificationsCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-[10px] font-bold">{unreadNotificationsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center relative"
            onPress={() => navigation.navigate('Cart')}
          >
            <Text className="text-lg">💰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <TouchableOpacity className="flex-row items-center bg-slate-100 mx-4 my-3 rounded-xl px-4 py-3" onPress={handleSearch}>
        <Text className="text-lg mr-3">🔍</Text>
        <TextInput
          className="flex-1 text-base text-slate-800"
          placeholder="Search for food, drinks, vendors..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <Text className="text-lg">🎤</Text>
      </TouchableOpacity>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Welcome Offer */}
        <View className="rounded-2xl p-5 mb-5 bg-green-500">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-lg font-bold text-white">Welcome Offer!</Text>
              <Text className="text-sm text-green-50 mt-1">
                Get 40% off on your first 3 orders with code NASHTO40
              </Text>
            </View>
            <Button title="Claim" size="small" className="bg-white px-4" textClassName="text-green-500" />
          </View>
        </View>

        {/* Categories */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-slate-800 mb-3">Shop by category</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="py-2"
          />
        </View>

        {/* Order Again */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-slate-800">Order again</Text>
            <TouchableOpacity>
              <Text className="text-sm text-green-500 font-semibold">See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Masala Chai', 'Samosa', 'Filter Coffee', 'Dhokla'].map((item, index) => (
              <View key={index} className="w-28 bg-white rounded-xl p-3 mr-3 items-center">
                <View className="w-20 h-20 bg-slate-100 rounded-xl mb-2" />
                <Text className="text-xs font-semibold text-slate-800 text-center">{item}</Text>
                <Text className="text-[10px] text-slate-500 text-center">Green Tea House</Text>
                <Text className="text-xs font-semibold text-slate-800 my-1">₹25</Text>
                <Button title="Add" size="small" className="bg-green-500 px-3 py-1" />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Popular Stores */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-slate-800">Popular stores near you</Text>
            <TouchableOpacity>
              <Text className="text-sm text-green-500 font-semibold">See all ›</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={vendors}
            renderItem={renderVendor}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        <View className="h-5" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
```