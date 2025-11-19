import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import api from '../services/api';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await api.getUserProfile();
      if (response.success) {
        setUser(response.user);
        setNotifications(response.user.preferences.notifications);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    }
  };

  const updateNotificationPreference = async (value) => {
    setNotifications(value);
    try {
      const response = await api.updateUserProfile({
        preferences: { ...user.preferences, notifications: value }
      });
      if (response.success) {
        setUser(response.user);
      }
    } catch (error) {
      setNotifications(!value); // Revert on error
      Alert.alert('Error', 'Failed to update notification preferences');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.navigate('Auth')
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'orders',
      title: 'My Orders',
      icon: '📦',
      onPress: () => navigation.navigate('Orders'),
    },
    {
      id: 'addresses',
      title: 'Saved Addresses',
      icon: '📍',
      onPress: () => navigation.navigate('Addresses'),
    },
    {
      id: 'wallet',
      title: 'Wallet & Payments',
      icon: '💰',
      onPress: () => Alert.alert('Coming Soon', 'Wallet feature is coming soon!'),
    },
    {
      id: 'favorites',
      title: 'Favorite Restaurants',
      icon: '❤️',
      onPress: () => Alert.alert('Coming Soon', 'Favorites feature is coming soon!'),
    },
    {
      id: 'reviews',
      title: 'My Reviews',
      icon: '⭐',
      onPress: () => navigation.navigate('Reviews'),
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: '🆘',
      onPress: () => navigation.navigate('Support'),
    },
    {
      id: 'about',
      title: 'About Nashtto',
      icon: 'ℹ️',
      onPress: () => Alert.alert('About', 'Nashtto - Pure vegetarian food delivery'),
    },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      className="flex-row items-center justify-between bg-white rounded-xl p-4 mb-2"
      onPress={item.onPress}
    >
      <View className="flex-row items-center">
        <Text className="text-xl mr-3">{item.icon}</Text>
        <Text className="text-base text-slate-800">{item.title}</Text>
      </View>
      <Text className="text-lg text-slate-500">›</Text>
    </TouchableOpacity>
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
        <Text className="text-lg font-bold text-slate-800">Profile</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View className="mt-4">
          <View className="flex-row items-center bg-white rounded-2xl p-5 shadow-sm elevation-4">
            <View className="w-[60px] h-[60px] rounded-full bg-green-500 items-center justify-center mr-4">
              <Text className="text-2xl font-bold text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-slate-800 mb-1">{user?.name || 'Loading...'}</Text>
              <Text className="text-sm text-slate-500 mb-0.5">{user?.phone || ''}</Text>
              <Text className="text-sm text-slate-500">{user?.email || ''}</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="mt-4">
          <View className="flex-row bg-white rounded-xl p-4">
            <View className="flex-1 items-center">
              <Text className="text-xl font-bold text-green-500 mb-1">12</Text>
              <Text className="text-xs text-slate-500">Orders</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-xl font-bold text-green-500 mb-1">₹2,450</Text>
              <Text className="text-xs text-slate-500">Spent</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-xl font-bold text-green-500 mb-1">4.8</Text>
              <Text className="text-xs text-slate-500">Rating</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View className="mt-6">
          <Text className="text-lg font-bold text-slate-800 mb-4">Settings</Text>

          <View className="flex-row items-center justify-between bg-white rounded-xl p-4 mb-2">
            <View className="flex-row items-center">
              <Text className="text-xl mr-3">🔔</Text>
              <Text className="text-base text-slate-800">Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={updateNotificationPreference}
              trackColor={{ false: '#cbd5e1', true: '#dcfce7' }}
              thumbColor={notifications ? '#22c55e' : '#f1f5f9'}
            />
          </View>

          <View className="flex-row items-center justify-between bg-white rounded-xl p-4 mb-2">
            <View className="flex-row items-center">
              <Text className="text-xl mr-3">🌍</Text>
              <Text className="text-base text-slate-800">Language</Text>
            </View>
            <Text className="text-sm text-slate-500">English</Text>
          </View>

          <View className="flex-row items-center justify-between bg-white rounded-xl p-4 mb-2">
            <View className="flex-row items-center">
              <Text className="text-xl mr-3">💱</Text>
              <Text className="text-base text-slate-800">Currency</Text>
            </View>
            <Text className="text-sm text-slate-500">INR</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="mt-6">
          <Text className="text-lg font-bold text-slate-800 mb-4">Account</Text>
          {menuItems.map(renderMenuItem)}
        </View>

        {/* Logout */}
        <View className="mt-6 mb-4">
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            className="border-red-500"
          />
        </View>

        <View className="h-5" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;