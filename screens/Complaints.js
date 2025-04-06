import React, { useState, useEffect, useRef } from 'react';
import {
  View, TextInput, Text, Alert, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
  TouchableWithoutFeedback, Keyboard, ActivityIndicator, Animated, Pressable
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // requires: expo install expo-linear-gradient

const ComplaintScreen = ({ students }) => {
  const [phone, setPhone] = useState('');
  const [complaint, setComplaint] = useState('');
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (students && students.length > 0) {
      setPhone(students[0].guardian_phone);
    }
  }, [students]);

  const animatePressIn = () => Animated.spring(scaleAnim, {
    toValue: 0.95,
    useNativeDriver: true,
  }).start();

  const animatePressOut = () => Animated.spring(scaleAnim, {
    toValue: 1,
    useNativeDriver: true,
  }).start();

  const submitComplaint = async () => {
    if (!phone || !complaint) {
      Alert.alert('Missing Info', 'Please fill in the complaint.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://vraschools.online/ais/api/submitComplaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, complaint }),
      });

      if (response.ok) {
        setComplaint('');
        Alert.alert('Success', 'Complaint sent successfully!');
      } else {
        Alert.alert('Error', 'Failed to send complaint.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network or server issue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#e0eafc', '#cfdef3']} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Submit a Complaint</Text>

            {/* <View style={styles.readonly}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.readonlyText}>{phone}</Text>
            </View> */}

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Type your complaint..."
              value={complaint}
              onChangeText={setComplaint}
              multiline
              numberOfLines={4}
              placeholderTextColor="#888"
            />

            <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, styles.buttonWrapper]}>
              <Pressable
                onPressIn={animatePressIn}
                onPressOut={animatePressOut}
                onPress={submitComplaint}
                disabled={loading}
                style={styles.button}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Submit</Text>
                )}
              </Pressable>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ComplaintScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  readonly: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
  },
  readonlyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  buttonWrapper: {
    marginTop: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
