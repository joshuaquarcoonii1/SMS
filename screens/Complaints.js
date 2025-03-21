import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

const ComplaintScreen = () => {
  const [phone, setPhone] = useState('');
  const [complaint, setComplaint] = useState('');
  const [loading, setLoading] = useState(false);

  const submitComplaint = async () => {
    if (!phone || !complaint) {
      Alert.alert('Missing Info', 'Please fill in both fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://vraschools.online/ais/api/submitComplaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, complaint }),
      });

      if (response.ok) {
        setPhone('');
        setComplaint('');
        Alert.alert('Success', 'Complaint sent successfully!');
      } else {
        Alert.alert('Error', 'Failed to send complaint. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network or server issue. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Submit Complaint</Text>

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Type your complaint..."
            value={complaint}
            onChangeText={setComplaint}
            multiline
            numberOfLines={4}
          />

          <View style={styles.buttonWrapper}>
            <Button
              title={loading ? 'Sending...' : 'Submit'}
              onPress={submitComplaint}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ComplaintScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonWrapper: {
    marginTop: 10,
  },
});
