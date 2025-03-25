import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, 
  Dimensions, KeyboardAvoidingView, ScrollView, Platform 
} from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');

  const handleLogin = async () => {
    const trimmed = phone.trim();
    
    if (!trimmed || trimmed.length < 9) return Alert.alert('Enter a valid phone number');
  
    const sanitizedPhone = trimmed.replace(/\D/g, '').slice(-9);
  
    try {
      const response = await fetch('https://vraschools.online/ais/api/phone', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: sanitizedPhone }),
      });
  
      const data = await response.json();
      console.log(data);
  
      if (response.ok) {
        console.log('Navigating to MainApp with data:', data.students);
        navigation.replace('MainApp', { students: data.students }); // Ensure students data is passed
      } else {
        Alert.alert(data.message || 'No students found');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Network error');
    }
  };
  
  const main = {
    businessLogo: require('../assets/admission-logo.png'),
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.innerContainer}>
          <Image source={main.businessLogo} style={styles.logo} />
          <Text style={styles.title}>VRA SCHOOLS PARENT APP</Text>
          <Text style={styles.label}>Enter Guardian Phone Number</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="e.g. 0594523173"
            value={phone}
            onChangeText={setPhone}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>View Students</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  innerContainer: { width: Dimensions.get('window').width > 800 ? '80%' : '100%', alignItems: 'center' },
  logo: { width: 150, height: 150, borderRadius: 10, overflow: 'hidden', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center' },
  label: { fontSize: 18, marginBottom: 10, color: '#555' },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 20, backgroundColor: '#fff' },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, width: '100%' },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});