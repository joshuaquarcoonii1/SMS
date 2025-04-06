import React, { useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Pressable
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

const StudentListScreen = ({ students }) => {
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
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { transform: [{ scale: 0.98 }], backgroundColor: '#f0f4ff' }
      ]}
      onPress={() => navigation.navigate('StudentDetail', { student: item })}
    >
      <Text style={styles.name}>{item.student_name}</Text>
      <Text style={styles.class}>{item.present_class} · {item.student_gender}</Text>
      <Text style={styles.school}>{item.school_name}</Text>
    </Pressable>
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
        <View>
          <Text style={styles.welcome}>Hello, {firstName} 👋</Text>
          <Text style={styles.subtitle}>Here are your wards</Text>
        </View>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
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
    backgroundColor: '#f5f7fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#007bff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#e0ecff',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    color: '#d9534f',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
    marginHorizontal: 16,
    color: '#333',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
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
