import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentDetailScreen = ({ route, navigation }) => {
  const { student } = route.params;
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      const cacheKey = `balance_${student.student_id}`;

      try {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached !== null) {
          setBalance(JSON.parse(cached));
          return;
        }

        const response = await fetch('https://vraschools.online/ais/api/receiveBalance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: student.student_id }),
        });

        const data = await response.json();

        if (data?.balance?.length > 0) {
          const rawBalance = data.balance[0].current_balance;
          const formatted = parseFloat(rawBalance).toFixed(2);
          setBalance(formatted);
          await AsyncStorage.setItem(cacheKey, JSON.stringify(formatted));
        } else {
          setBalance('N/A');
        }
      } catch (error) {
        console.error('Error fetching or caching balance:', error);
        setBalance('Error');
      }
    };

    fetchBalance();
  }, [student.student_id]);

  const handleBack = () => navigation.goBack();
  const handleViewBills = () => navigation.navigate('BillsScreen', { student });
  const handleViewAssessment = () => navigation.navigate('AssessmentScreen', { student });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.headerCard}>
          <Text style={styles.title}>{student.student_name}</Text>
          {balance !== null && (
            <Text
              style={[
                styles.balanceText,
                { color: parseFloat(balance) < 0 ? 'red' : 'green' }
              ]}
            >
              Balance: GHS {balance}
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <Section label="Student ID" value={student.student_id} />
          <Section label="Class" value={student.present_class} />
          <Section label="House" value={student.student_house} />
          <Section label="Guardian Phone" value={student.guardian_phone} />
          <Section label="Last Promotion" value={student.last_promotion_date} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleViewBills}>
            <Text style={styles.buttonText}>View Bills</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleViewAssessment}>
            <Text style={styles.buttonText}>View Assessment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Section = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || 'N/A'}</Text>
  </View>
);

export default StudentDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fa',
  },
  scrollContainer: {
    padding: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  headerCard: {
    backgroundColor: '#e7f0fe',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f3c88',
    textAlign: 'center',
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#222',
  },
  buttonContainer: {
    marginTop: 30,
    gap: 16,
  },
  actionButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
