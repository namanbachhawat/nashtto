import { useState } from 'react';
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

const SupportScreen = ({ navigation }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'general', label: 'General Inquiry', icon: '❓' },
    { id: 'order', label: 'Order Issue', icon: '📦' },
    { id: 'payment', label: 'Payment', icon: '💳' },
    { id: 'technical', label: 'App Issue', icon: '📱' },
  ];

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'Go to the "Orders" tab and select your active order to view real-time tracking.',
    },
    {
      question: 'Can I cancel my order?',
      answer: 'You can cancel your order within 5 minutes of placing it. After that, please contact support.',
    },
    {
      question: 'How do I change my payment method?',
      answer: 'You can manage your payment methods in Profile > Payment Methods.',
    },
  ];

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.submitSupportTicket({
        category,
        subject,
        message,
      });

      if (response.success) {
        Alert.alert(
          'Ticket Submitted',
          'We have received your message and will get back to you shortly.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <Text className="text-lg font-bold text-slate-800">Help & Support</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Quick Contact */}
        <View className="mt-4">
          <Text className="text-lg font-bold text-slate-800 mb-4">Quick Contact</Text>
          <View className="flex-row justify-around">
            <TouchableOpacity className="items-center p-4 bg-white rounded-xl w-20">
              <Text className="text-2xl mb-2">📞</Text>
              <Text className="text-xs text-slate-500 text-center">Call Us</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center p-4 bg-white rounded-xl w-20">
              <Text className="text-2xl mb-2">💬</Text>
              <Text className="text-xs text-slate-500 text-center">Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center p-4 bg-white rounded-xl w-20">
              <Text className="text-2xl mb-2">📧</Text>
              <Text className="text-xs text-slate-500 text-center">Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Form */}
        <View className="mt-6">
          <Text className="text-lg font-bold text-slate-800 mb-4">Send us a message</Text>

          <View className="flex-row flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                className={`flex-row items-center px-4 py-3 bg-white rounded-xl border border-slate-200 flex-1 min-w-[45%] ${category === cat.id ? 'bg-green-50 border-green-500' : ''
                  }`}
                onPress={() => setCategory(cat.id)}
              >
                <Text className="text-lg mr-2">{cat.icon}</Text>
                <Text className={`text-sm font-medium ${category === cat.id ? 'text-green-600' : 'text-slate-500'
                  }`}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-800 mb-3"
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
            placeholderTextColor="#94a3b8"
          />

          <TextInput
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-800 mb-4"
            placeholder="Describe your issue..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#94a3b8"
            style={{ height: 120 }}
          />

          <Button
            title="Submit Ticket"
            onPress={handleSubmit}
            loading={loading}
            className="bg-green-500"
          />
        </View>

        {/* FAQs */}
        <View className="mt-6">
          <Text className="text-lg font-bold text-slate-800 mb-4">Frequently Asked Questions</Text>
          {faqs.map((faq, index) => (
            <Card key={index} className="mb-3">
              <CardContent>
                <Text className="text-base font-semibold text-slate-800 mb-2">{faq.question}</Text>
                <Text className="text-sm text-slate-500 leading-5">{faq.answer}</Text>
              </CardContent>
            </Card>
          ))}
        </View>

        <View className="h-5" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupportScreen;