import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentDetailScreen = ({ route, navigation }) => {
  const { student } = route.params;
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      const cacheKey = `balance_${student.student_id}`;
  
      try {
        // Try getting from cache
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached !== null) {
          setBalance(JSON.parse(cached)); // use cached balance
          return;
        }
  
        // Otherwise, fetch from API
        const response = await fetch('https://vraschools.online/ais/api/receiveBalance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ student_id: student.student_id }),
        });
  
        const data = await response.json();
  
        if (data?.balance && Array.isArray(data.balance) && data.balance.length > 0) {
          const rawBalance = data.balance[0].current_balance;
          const formatted = parseFloat(rawBalance).toFixed(2);
          setBalance(formatted);
          await AsyncStorage.setItem(cacheKey, JSON.stringify(formatted)); // cache it
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
  
  

  const handleBack = () => {
    navigation.goBack();
  };

  const handleViewBills = () => {
    navigation.navigate('BillsScreen', { student });
  };

  const handleViewAssessment = () => {
    navigation.navigate('AssessmentScreen', { student });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{student.student_name}</Text>
        {balance !== null && (
  <Text
    style={[
      styles.balanceText,
      { color: parseFloat(balance) < 0 ? 'red' : 'green' }
    ]}
  >
    Current Balance: GHS {balance}
  </Text>
)}
        <View style={styles.card}>
          <Section label="Student ID" value={student.student_id} />
          {/* <Section label="DOB" value={student.student_dob} /> */}
          <Section label="Class" value={student.present_class} />
          {/* <Section label="Gender" value={student.student_gender} /> */}
          {/* <Section label="Nationality" value={student.student_nationality} /> */}
          <Section label="School" value={student.school_name} />
          <Section label="House" value={student.student_house} />
          <Section label="Guardian Name" value={student.guardian_name} />
          <Section label="Guardian Phone" value={student.guardian_phone} />
          {/* <Section label="Guardian Email" value={student.guardian_email} /> */}
          {/* <Section label="Occupation" value={student.guardian_occupation} /> */}
          {/* <Section label="Address" value={student.student_address} /> */}
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
balanceText: {
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 20,
},

  container: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  scrollContainer: {
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#000'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  detailRow: {
    marginBottom: 14
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2
  },
  value: {
    fontSize: 16,
    color: '#222'
  },
  buttonContainer: {
    marginTop: 30,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
