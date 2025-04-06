import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image,
  Dimensions, KeyboardAvoidingView, ScrollView, Platform, Animated, ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const animatePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = async () => {
    const trimmed = phone.trim();
    if (!trimmed || trimmed.length < 9) return Alert.alert('Enter a valid phone number');

    const sanitizedPhone = trimmed.replace(/\D/g, '').slice(-9);
    setLoading(true);

    try {
      const response = await fetch('https://vraschools.online/ais/api/phone', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: sanitizedPhone }),
      });

      const data = await response.json();
      if (response.ok) {
        navigation.replace('MainApp', { students: data.students });
      } else {
        Alert.alert(data.message || 'No students found');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  const main = {
    businessLogo: require('../assets/admission-logo.png'),
  };

  return (
    <LinearGradient colors={['#e0eafc', '#cfdef3']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.innerContainer}>
            <Image source={main.businessLogo} style={styles.logo} />
            <Text style={styles.title}>VRA SCHOOLS PARENT APP</Text>
            <Text style={styles.label}>Enter Guardian Phone Number</Text>

            <View style={styles.inputWrapper}>
              <Feather name="phone" size={20} color="#555" style={styles.icon} />
              <TextInput
                ref={inputRef}
                style={styles.input}
                keyboardType="phone-pad"
                placeholder="e.g. 0594523173"
                placeholderTextColor="#aaa"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPressIn={animatePressIn}
                onPressOut={animatePressOut}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>View Students</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  innerContainer: {
    width: Dimensions.get('window').width > 800 ? '75%' : '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 0,
    marginBottom: 20,
    width: '100%',
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: Platform.OS === 'android' ? 10 : 0,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
