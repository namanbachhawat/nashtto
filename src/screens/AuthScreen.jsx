```javascript
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import api from '../services/api';

const AuthScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    name: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLogin = () => {
    const newErrors = {};
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (formData.email.trim() && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Home');
    }, 1500);
  };

  const handleRegister = async () => {
    if (!validateRegister()) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Home');
    }, 2000);
  };

  const handleGuestLogin = () => {
    navigation.navigate('Home');
  };

  const handleSocialLogin = async (provider) => {
    try {
      const response = await api.socialLogin(provider);
      if (response.success) {
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Social login failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to login with social account.');
    }
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="p-5 justify-center min-h-full">
        {/* Header */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-white text-center mb-2">Welcome to Nashtto</Text>
          <Text className="text-base text-green-50 text-center">
            Pure vegetarian food delivered fresh to your doorstep
          </Text>
        </View>

        {/* Auth Card */}
        <View className="bg-white rounded-2xl p-6 shadow-lg elevation-8">
          {/* Tab Navigation */}
          <View className="flex-row bg-slate-100 rounded-xl p-1 mb-6">
            <TouchableOpacity
              className={`flex - 1 py - 3 rounded - lg items - center ${ activeTab === 'login' ? 'bg-white shadow-sm elevation-2' : '' } `}
              onPress={() => setActiveTab('login')}
            >
              <Text className={`text - base font - semibold ${ activeTab === 'login' ? 'text-slate-800' : 'text-slate-500' } `}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex - 1 py - 3 rounded - lg items - center ${ activeTab === 'register' ? 'bg-white shadow-sm elevation-2' : '' } `}
              onPress={() => setActiveTab('register')}
            >
              <Text className={`text - base font - semibold ${ activeTab === 'register' ? 'text-slate-800' : 'text-slate-500' } `}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Form */}
          {activeTab === 'login' && (
            <View className="gap-4">
              <Input
                placeholder="Enter your mobile number"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                keyboardType="phone-pad"
                error={errors.phone}
              />
              
              <Button
                title="Login with OTP"
                onPress={handleLogin}
                loading={loading}
                className="bg-green-500"
              />

              <Button
                title="Continue as Guest"
                onPress={handleGuestLogin}
                variant="outline"
                className="border-green-500"
                textClassName="text-green-500"
              />

              {/* Social Login */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-slate-200" />
                <Text className="mx-4 text-slate-500 text-sm">or</Text>
                <View className="flex-1 h-px bg-slate-200" />
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center border border-slate-200 rounded-xl py-3 px-4 gap-2"
                  onPress={() => handleSocialLogin('google')}
                >
                  <Text className="text-lg font-bold text-blue-500">G</Text>
                  <Text className="text-base font-semibold text-slate-800">Google</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center border border-slate-200 rounded-xl py-3 px-4 gap-2"
                  onPress={() => handleSocialLogin('facebook')}
                >
                  <Text className="text-lg font-bold text-blue-600">f</Text>
                  <Text className="text-base font-semibold text-slate-800">Facebook</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <View className="gap-4">
              <Input
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                error={errors.name}
              />

              <Input
                placeholder="Enter your phone number"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                keyboardType="phone-pad"
                error={errors.phone}
              />

              <Input
                placeholder="Enter your email address (optional)"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
                error={errors.email}
              />

              <TouchableOpacity
                className="flex-row items-start gap-3"
                onPress={() => handleInputChange('acceptTerms', !formData.acceptTerms)}
              >
                <View className={`w - 5 h - 5 border - 2 border - slate - 200 rounded items - center justify - center mt - 0.5 ${ formData.acceptTerms ? 'bg-green-500 border-green-500' : '' } `}>
                  {formData.acceptTerms && <Text className="text-white text-xs font-bold">✓</Text>}
                </View>
                <Text className="flex-1 text-sm text-slate-800 leading-5">
                  I agree to Nashtto's Terms of Service and Privacy Policy
                </Text>
              </TouchableOpacity>
              {errors.acceptTerms && (
                <Text className="text-red-500 text-xs mt-1">{errors.acceptTerms}</Text>
              )}

              <Button
                title="Sign Up with OTP"
                onPress={handleRegister}
                loading={loading}
                className="bg-green-500"
              />

              <View className="flex-row justify-center mt-4">
                <Text className="text-slate-500">Already have an account? </Text>
                <TouchableOpacity onPress={() => setActiveTab('login')}>
                  <Text className="text-green-500 font-semibold">Sign in here</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Additional Info */}
        <View className="flex-row justify-around mt-8">
          <View className="flex-row items-center gap-2">
            <Text className="text-green-500 text-base">✓</Text>
            <Text className="text-green-50 text-xs">100% Vegetarian</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-green-500 text-base">✓</Text>
            <Text className="text-green-50 text-xs">Fresh & Healthy</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-green-500 text-base">✓</Text>
            <Text className="text-green-50 text-xs">Fast Delivery</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AuthScreen;
```