import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert ,Image} from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');

  const handleLogin = async () => {
    if (!phone.trim()) return Alert.alert('Enter a valid phone number');

    try {
      const response = await fetch('https://vraschools.online/ais/api/phone', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      console.log(data); // Log the response data for debugging

      if (response.ok) {
        console.log('Navigating to StudentList with data:', data.students); // Log navigation
        navigation.navigate('StudentList', { students: data.students });
      } else {
        Alert.alert(data.message || 'No students found');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Network error');
    }
  };
  const main={
    businessLogo:require('../assets/admission-logo.png'),

  };
  return (
    <View style={styles.container}>
        <Image source={main.businessLogo} style={{width: 150,
          height: 150,
          borderRadius: 80,
          overflow: 'hidden',
          marginBottom: 16,alignSelf: 'center'}}/>
      <Text style={styles.label}>Enter Guardian Phone Number</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="e.g. 0246256448"
        value={phone}
        onChangeText={setPhone}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>View Students</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 ,verticalAlign:'center',top:-80},
  label: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 20 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});