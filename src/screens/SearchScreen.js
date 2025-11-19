import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
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

const SearchScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState({ vendors: [], items: [] });
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    rating: null,
    vegOnly: false,
    priceRange: null, // 'under_100', '100_300', 'over_300'
  });

  const { searchQuery: initialQuery, category } = route.params || {};

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      performSearch(initialQuery);
    } else if (category) {
      setSelectedCategory(category);
      performSearch('', category);
    }
  }, [initialQuery, category]);

  const categories = [
    { id: 'all', name: 'All', icon: '🔍' },
    { id: 'tea', name: 'Tea', icon: '☕' },
    { id: 'coffee', name: 'Coffee', icon: '🍵' },
    { id: 'snacks', name: 'Snacks', icon: '🍪' },
    { id: 'combos', name: 'Combos', icon: '🍽️' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
  ];

  const performSearch = async (query = searchQuery, categoryFilter = selectedCategory, activeFilters = filters) => {
    // Allow search if there are filters, even if query is empty
    if (!query.trim() && !categoryFilter && !activeFilters.rating && !activeFilters.vegOnly && !activeFilters.priceRange) return;

    setLoading(true);
    try {
      const params = {};
      if (query.trim()) params.query = query;
      if (categoryFilter && categoryFilter !== 'all') params.category = categoryFilter;

      // Add filters to params
      if (activeFilters.rating) params.rating = activeFilters.rating;
      if (activeFilters.vegOnly) params.vegOnly = true;
      if (activeFilters.priceRange) params.priceRange = activeFilters.priceRange;

      const response = await api.search(params);
      if (response.success) {
        setResults(response.results);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to perform search');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    performSearch();
  };

  const handleCategoryPress = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      performSearch(searchQuery, 'all');
    } else {
      performSearch(searchQuery, categoryId);
    }
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
    performSearch(searchQuery, selectedCategory, newFilters);
  };

  const handleVendorPress = (vendor) => {
    navigation.navigate('Vendor', { vendor });
  };

  const handleAddToCart = async (item) => {
    try {
      const response = await api.addToCart(item);
      if (response.success) {
        Alert.alert('Success', `${item.name} added to cart!`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      className={`items-center mr-4 px-4 py-2 bg-white rounded-full border border-slate-200 ${selectedCategory === item.id ? 'bg-green-500 border-green-500' : ''}`}
      onPress={() => handleCategoryPress(item.id)}
    >
      <Text className="text-base mb-1">{item.icon}</Text>
      <Text className={`text-xs font-semibold ${selectedCategory === item.id ? 'text-white' : ''}`}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderVendor = ({ item }) => (
    <Card className="mb-3 p-4" onPress={() => handleVendorPress(item)}>
      <View className="flex-row">
        <Image source={{ uri: item.image }} className="w-[60px] h-[60px] rounded-lg mr-3" />
        <CardContent className="flex-1 p-0">
          <Text className="text-base font-semibold text-slate-800 mb-1">{item.name}</Text>
          <View className="flex-row items-center mb-1">
            <Text className="text-xs text-slate-500 mr-3">⭐ {item.rating}</Text>
            <Text className="text-xs text-slate-500 mr-3">⏰ {item.time}</Text>
            <Text className="text-xs text-slate-500">• {item.distance}</Text>
          </View>
          <Text className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded self-start font-semibold mb-1">{item.offers}</Text>
          <Text className="text-xs text-slate-500">{item.price}</Text>
        </CardContent>
      </View>
    </Card>
  );

  const renderMenuItem = ({ item }) => (
    <Card className="mb-3 p-4">
      <View className="flex-row items-center">
        <Image source={{ uri: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47?w=100' }} className="w-[50px] h-[50px] rounded-lg mr-3" />
        <CardContent className="flex-1 p-0">
          <Text className="text-sm font-semibold text-slate-800 mb-0.5">{item.name}</Text>
          <Text className="text-xs text-slate-500 mb-1">{item.vendorName}</Text>
          <Text className="text-sm text-green-500 font-semibold">₹{item.price}</Text>
        </CardContent>
        <Button
          title="Add"
          onPress={() => handleAddToCart(item)}
          size="small"
          className="bg-green-500 px-3"
        />
      </View>
    </Card>
  );

  const FilterModal = () => {
    const [tempFilters, setTempFilters] = useState(filters);

    return (
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-[70%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-slate-800">Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Text className="text-slate-500 text-lg">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {/* Veg Only */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-slate-800 mb-3">Dietary</Text>
                <TouchableOpacity
                  className={`flex-row items-center p-3 rounded-xl border ${tempFilters.vegOnly ? 'bg-green-50 border-green-500' : 'bg-white border-slate-200'}`}
                  onPress={() => setTempFilters({ ...tempFilters, vegOnly: !tempFilters.vegOnly })}
                >
                  <Text className="mr-2">🥬</Text>
                  <Text className={`font-medium ${tempFilters.vegOnly ? 'text-green-700' : 'text-slate-700'}`}>Pure Veg</Text>
                </TouchableOpacity>
              </View>

              {/* Rating */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-slate-800 mb-3">Rating</Text>
                <View className="flex-row flex-wrap">
                  {[4.0, 4.5].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      className={`mr-3 mb-3 px-4 py-2 rounded-full border ${tempFilters.rating === rating ? 'bg-green-500 border-green-500' : 'bg-white border-slate-200'}`}
                      onPress={() => setTempFilters({ ...tempFilters, rating: tempFilters.rating === rating ? null : rating })}
                    >
                      <Text className={`font-medium ${tempFilters.rating === rating ? 'text-white' : 'text-slate-700'}`}>
                        {rating}+ ⭐
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price Range */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-slate-800 mb-3">Price</Text>
                <View className="flex-row flex-wrap">
                  {[
                    { id: 'under_100', label: 'Under ₹100' },
                    { id: '100_300', label: '₹100 - ₹300' },
                    { id: 'over_300', label: 'Over ₹300' }
                  ].map((range) => (
                    <TouchableOpacity
                      key={range.id}
                      className={`mr-3 mb-3 px-4 py-2 rounded-full border ${tempFilters.priceRange === range.id ? 'bg-green-500 border-green-500' : 'bg-white border-slate-200'}`}
                      onPress={() => setTempFilters({ ...tempFilters, priceRange: tempFilters.priceRange === range.id ? null : range.id })}
                    >
                      <Text className={`font-medium ${tempFilters.priceRange === range.id ? 'text-white' : 'text-slate-700'}`}>
                        {range.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View className="flex-row gap-4 pt-4 border-t border-slate-100">
              <Button
                title="Reset"
                onPress={() => setTempFilters({ rating: null, vegOnly: false, priceRange: null })}
                className="flex-1 bg-slate-200"
                textClassName="text-slate-800"
              />
              <Button
                title="Apply Filters"
                onPress={() => applyFilters(tempFilters)}
                className="flex-1 bg-green-500"
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

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
        <Text className="text-lg font-bold text-slate-800">Search</Text>
        <View className="w-10" />
      </View>

      {/* Search Bar & Filter Button */}
      <View className="flex-row items-center mx-4 my-3 gap-3">
        <View className="flex-1 flex-row items-center bg-white rounded-xl px-4 py-1 shadow-sm elevation-2">
          <TextInput
            className="flex-1 text-base text-slate-800 py-2"
            placeholder="Search for food, drinks, vendors..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            placeholderTextColor="#64748b"
          />
          <TouchableOpacity className="p-2" onPress={handleSearch}>
            <Text className="text-lg text-slate-500">🔍</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className={`w-12 h-12 rounded-xl items-center justify-center shadow-sm elevation-2 ${filters.rating || filters.vegOnly || filters.priceRange ? 'bg-green-500' : 'bg-white'
            }`}
          onPress={() => setShowFilters(true)}
        >
          <Text className="text-xl">⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View className="mb-4">
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="py-2"
          />
        </View>

        {/* Active Filters Chips */}
        {(filters.rating || filters.vegOnly || filters.priceRange) && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 flex-row">
            {filters.vegOnly && (
              <View className="bg-green-100 px-3 py-1 rounded-full mr-2 flex-row items-center">
                <Text className="text-green-700 text-xs font-medium mr-1">Pure Veg</Text>
                <TouchableOpacity onPress={() => applyFilters({ ...filters, vegOnly: false })}>
                  <Text className="text-green-700 text-xs">✕</Text>
                </TouchableOpacity>
              </View>
            )}
            {filters.rating && (
              <View className="bg-green-100 px-3 py-1 rounded-full mr-2 flex-row items-center">
                <Text className="text-green-700 text-xs font-medium mr-1">{filters.rating}+ ⭐</Text>
                <TouchableOpacity onPress={() => applyFilters({ ...filters, rating: null })}>
                  <Text className="text-green-700 text-xs">✕</Text>
                </TouchableOpacity>
              </View>
            )}
            {filters.priceRange && (
              <View className="bg-green-100 px-3 py-1 rounded-full mr-2 flex-row items-center">
                <Text className="text-green-700 text-xs font-medium mr-1">
                  {filters.priceRange === 'under_100' ? '< ₹100' : filters.priceRange === '100_300' ? '₹100-300' : '> ₹300'}
                </Text>
                <TouchableOpacity onPress={() => applyFilters({ ...filters, priceRange: null })}>
                  <Text className="text-green-700 text-xs">✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}

        {/* Results */}
        {(results.vendors.length > 0 || results.items.length > 0) && (
          <>
            {/* Vendors */}
            {results.vendors.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-bold text-slate-800 mb-4">Restaurants ({results.vendors.length})</Text>
                <FlatList
                  data={results.vendors}
                  renderItem={renderVendor}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                />
              </View>
            )}

            {/* Menu Items */}
            {results.items.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-bold text-slate-800 mb-4">Menu Items ({results.items.length})</Text>
                <FlatList
                  data={results.items}
                  renderItem={renderMenuItem}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                />
              </View>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && (searchQuery || filters.rating || filters.vegOnly || filters.priceRange) && results.vendors.length === 0 && results.items.length === 0 && (
          <View className="items-center py-12">
            <Text className="text-5xl mb-4">🔍</Text>
            <Text className="text-lg font-bold text-slate-800 mb-2">No results found</Text>
            <Text className="text-sm text-slate-500 text-center px-8">
              Try adjusting your search or filters
            </Text>
          </View>
        )}

        {/* Search Suggestions */}
        {!searchQuery && !filters.rating && !filters.vegOnly && !filters.priceRange && (
          <View className="mt-4">
            <Text className="text-lg font-bold text-slate-800 mb-4">Popular Searches</Text>
            {['Pizza', 'Burger', 'Coffee', 'Ice Cream', 'Sandwich', 'Pasta'].map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-lg p-4 mb-2"
                onPress={() => {
                  setSearchQuery(suggestion);
                  performSearch(suggestion);
                }}
              >
                <Text className="text-base text-slate-800">{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className="h-5" />
      </ScrollView>

      <FilterModal />
    </SafeAreaView>
  );
};

export default SearchScreen;