import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StudentDetailScreen = ({ route, navigation }) => {
  const { student } = route.params;

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#000" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{student.student_name}</Text>

      <View style={styles.card}>
        <Section label="Student ID" value={student.student_id} />
        <Section label="DOB" value={student.student_dob} />
        <Section label="Class" value={student.present_class} />
        <Section label="Gender" value={student.student_gender} />
        <Section label="Nationality" value={student.student_nationality} />
        <Section label="School" value={student.school_name} />
        <Section label="House" value={student.student_house} />
        <Section label="Guardian Name" value={student.guardian_name} />
        <Section label="Guardian Phone" value={student.guardian_phone} />
        <Section label="Guardian Email" value={student.guardian_email} />
        <Section label="Occupation" value={student.guardian_occupation} />
        <Section label="Address" value={student.student_address} />
        <Section label="Last Promotion" value={student.last_promotion_date} />
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
    padding: 20,
    backgroundColor: '#f2f2f2'
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
  }
});
