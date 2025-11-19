import { useState } from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TrackingScreen = ({ navigation }) => {
  const [orderStatus, setOrderStatus] = useState('preparing');
  const { width } = Dimensions.get('window');

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'preparing': return 'bg-amber-500';
      case 'ready': return 'bg-blue-500';
      case 'picked_up': return 'bg-violet-500';
      case 'delivered': return 'bg-emerald-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-500';
      case 'preparing': return 'text-amber-500';
      case 'ready': return 'text-blue-500';
      case 'picked_up': return 'text-violet-500';
      case 'delivered': return 'text-emerald-500';
      default: return 'text-slate-500';
    }
  };

  const trackingSteps = [
    { id: 'confirmed', label: 'Order Confirmed', time: '2:30 PM' },
    { id: 'preparing', label: 'Preparing Food', time: '2:45 PM' },
    { id: 'ready', label: 'Ready for Pickup', time: '3:15 PM' },
    { id: 'picked_up', label: 'Out for Delivery', time: '3:30 PM' },
    { id: 'delivered', label: 'Delivered', time: '4:00 PM' }
  ];

  const currentStepIndex = trackingSteps.findIndex(step => step.id === orderStatus);

  return (
    <View className="flex-1 bg-slate-50">
      {/* Map Background (Mock) */}
      <View className="absolute top-0 left-0 right-0 h-[55%] bg-slate-200 overflow-hidden">
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop' }}
          className="w-full h-full opacity-80"
          resizeMode="cover"
        />

        {/* Map Overlay Gradient */}
        <View className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />

        {/* Mock Markers */}
        {/* Restaurant Marker */}
        <View className="absolute top-[30%] left-[20%] items-center">
          <View className="bg-white p-1.5 rounded-full shadow-md elevation-4 mb-1">
            <Text className="text-xl">🏪</Text>
          </View>
          <View className="bg-white px-2 py-0.5 rounded-md shadow-sm">
            <Text className="text-[10px] font-bold text-slate-700">Restaurant</Text>
          </View>
        </View>

        {/* Driver Marker */}
        <View className="absolute top-[45%] left-[45%] items-center">
          <View className="bg-green-500 p-1.5 rounded-full shadow-md elevation-4 mb-1 border-2 border-white">
            <Text className="text-xl">🛵</Text>
          </View>
          <View className="bg-white px-2 py-0.5 rounded-md shadow-sm">
            <Text className="text-[10px] font-bold text-slate-700">Driver</Text>
          </View>
        </View>

        {/* User Marker */}
        <View className="absolute top-[60%] left-[75%] items-center">
          <View className="bg-blue-500 p-1.5 rounded-full shadow-md elevation-4 mb-1 border-2 border-white">
            <Text className="text-xl">🏠</Text>
          </View>
          <View className="bg-white px-2 py-0.5 rounded-md shadow-sm">
            <Text className="text-[10px] font-bold text-slate-700">You</Text>
          </View>
        </View>

        {/* Route Line (Mock SVG or View) */}
        {/* Simple dashed line visualization using absolute positioned dots for simplicity */}
        <View className="absolute top-[38%] left-[28%] w-2 h-2 bg-slate-400 rounded-full opacity-50" />
        <View className="absolute top-[42%] left-[36%] w-2 h-2 bg-slate-400 rounded-full opacity-50" />
        <View className="absolute top-[50%] left-[55%] w-2 h-2 bg-slate-400 rounded-full opacity-50" />
        <View className="absolute top-[55%] left-[65%] w-2 h-2 bg-slate-400 rounded-full opacity-50" />

      </View>

      {/* Header Overlay */}
      <SafeAreaView className="absolute top-0 left-0 right-0 z-10">
        <View className="flex-row items-center justify-between px-4 py-2">
          <TouchableOpacity
            className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm elevation-2"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-lg text-slate-800">←</Text>
          </TouchableOpacity>
          <View className="bg-white px-4 py-2 rounded-full shadow-sm elevation-2">
            <Text className="font-bold text-slate-800">Order #12345</Text>
          </View>
          <View className="w-10" />
        </View>
      </SafeAreaView>

      {/* Bottom Sheet Content */}
      <View className="flex-1 mt-[50%] bg-transparent">
        <ScrollView
          className="flex-1 bg-white rounded-t-3xl shadow-lg elevation-10 pt-6 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Drag Handle */}
          <View className="self-center w-12 h-1.5 bg-slate-200 rounded-full mb-6" />

          {/* Estimated Time */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-sm text-slate-500 mb-1">Estimated Delivery</Text>
              <Text className="text-2xl font-bold text-slate-800">25-30 Mins</Text>
            </View>
            <View className="bg-green-50 px-4 py-2 rounded-xl">
              <Text className="text-green-600 font-bold">On Time</Text>
            </View>
          </View>

          {/* Current Status */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-slate-800 mb-2">
              {trackingSteps[currentStepIndex]?.label}
            </Text>
            <Text className="text-slate-500 leading-5">
              Your order is being prepared by the restaurant chef. It will be picked up soon.
            </Text>

            {/* Progress Bar */}
            <View className="h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
              <View
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${((currentStepIndex + 1) / trackingSteps.length) * 100}%` }}
              />
            </View>
          </View>

          {/* Driver Info */}
          <View className="flex-row items-center p-4 bg-slate-50 rounded-xl mb-6 border border-slate-100">
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
              className="w-12 h-12 rounded-full mr-4"
            />
            <View className="flex-1">
              <Text className="text-base font-bold text-slate-800">Rajesh Kumar</Text>
              <Text className="text-xs text-slate-500">Delivery Partner • 4.8 ⭐</Text>
            </View>
            <TouchableOpacity className="w-10 h-10 bg-green-500 rounded-full items-center justify-center shadow-sm elevation-2">
              <Text className="text-xl">📞</Text>
            </TouchableOpacity>
          </View>

          {/* Timeline */}
          <View className="mb-6">
            <Text className="text-base font-bold text-slate-800 mb-4">Timeline</Text>
            {trackingSteps.map((step, index) => (
              <View key={step.id} className="flex-row mb-4 last:mb-0">
                <View className="items-center mr-4">
                  <View className={`w-3 h-3 rounded-full ${index <= currentStepIndex ? 'bg-green-500' : 'bg-slate-300'}`} />
                  {index < trackingSteps.length - 1 && (
                    <View className={`w-0.5 flex-1 my-1 ${index < currentStepIndex ? 'bg-green-500' : 'bg-slate-200'}`} />
                  )}
                </View>
                <View className="flex-1 pb-4">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className={`text-sm font-semibold ${index <= currentStepIndex ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step.label}
                    </Text>
                    <Text className="text-xs text-slate-400">{step.time}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Order Details Button */}
          <TouchableOpacity className="w-full py-4 border border-slate-200 rounded-xl items-center mb-4">
            <Text className="text-slate-600 font-semibold">View Order Details</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </View>
  );
};

export default TrackingScreen;