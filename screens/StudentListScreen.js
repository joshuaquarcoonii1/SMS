import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet,SafeAreaView,Button } from 'react-native';
import { Image } from 'react-native';

const StudentListScreen = ({ route, navigation }) => {
  const { students } = route.params;
 
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
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
    <View style={styles.logoutContainer}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.student_id}
        contentContainerStyle={styles.list}
      />
    </View>
    </SafeAreaView>
  );
};

export default StudentListScreen;

const styles = StyleSheet.create({
    image: {
  width: 60,
  height: 60,
  borderRadius: 30,
  marginRight: 16
},
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  list: {
    padding: 16
  },  logoutContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: '#222'
  },
  class: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2
  },
  school: {
    fontSize: 13,
    color: '#777'
  }
});
