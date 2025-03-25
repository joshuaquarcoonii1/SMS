import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import LoginScreen from '../screens/LoginScreen';
import StudentListScreen from '../screens/StudentListScreen';
import StudentDetailScreen from '../screens/StudentDetailScreen';
import BillsScreen from '../screens/BillsScreen';
import AssessmentScreen from '../screens/AssessmentScreen';
import ComplaintScreen from '../screens/Complaints'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const StudentStack = ({ students }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="StudentList">
      {() => <StudentListScreen students={students} />}  
    </Stack.Screen>
    <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
    <Stack.Screen name="BillsScreen" component={BillsScreen} />
    <Stack.Screen name="AssessmentScreen" component={AssessmentScreen} />
  </Stack.Navigator>
);

const TabNavigator = ({ route }) => {
  const students = route.params?.students || []; // Get students from route.params
  console.log("Students in TabNavigator:", students);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Students"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      >
        {() => <StudentStack students={students} />} 
      </Tab.Screen>
      <Tab.Screen
        name="Complaints"
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" size={size} color={color} />
          ),
        }}
      >
        {() => <ComplaintScreen students={students} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// Root Stack Navigator to handle login first
const RootStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen 
      name="MainApp" 
      component={TabNavigator} 
      initialParams={{ students: [] }} 
    />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <RootStack />
  </NavigationContainer>
);

export default AppNavigator;