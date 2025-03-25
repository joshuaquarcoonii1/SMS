import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Button } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

const StudentListScreen = ({students }) => {
  const navigation = useNavigation();
  const route = useRoute();


  useFocusEffect(
    useCallback(() => {
      console.log('Route params:', route.params);
    }, [route])
  );

  const guardianName = students[0]?.guardian_name || 'Guardian';
  const firstName = guardianName?.split(' ')[0] || 'Guardian';

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('StudentDetail', { student: item })}
    >
      <Text style={styles.name}>{item.student_name}</Text>
      <Text style={styles.class}>{item.present_class} · {item.student_gender}</Text>
      <Text style={styles.school}>{item.school_name}</Text>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, {firstName} 👋</Text>
        <Button title="Logout" onPress={handleLogout} color="#d9534f" />
      </View>

      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.student_id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Your Wards</Text>}
      />
    </SafeAreaView>
  );
};

export default StudentListScreen;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
    marginHorizontal: 16,
    color: '#444',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: '#222',
  },
  class: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  school: {
    fontSize: 13,
    color: '#777',
  },
});