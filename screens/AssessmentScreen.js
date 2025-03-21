import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const AssessmentScreen = ({ route }) => {
  const { student } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Assessment for {student.student_name}</Text>
      <View style={styles.card}>
        <Text style={styles.text}>Assessment results coming soon...</Text>
      </View>
    </SafeAreaView>
  );
};

export default AssessmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  text: {
    fontSize: 16,
    color: '#333'
  }
});