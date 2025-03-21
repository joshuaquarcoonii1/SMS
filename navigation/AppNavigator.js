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
import ComplaintScreen  from '../screens/Complaints'; // Import your new screen

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const StudentStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="StudentList" component={StudentListScreen} />
    <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
    <Stack.Screen name="BillsScreen" component={BillsScreen} />
    <Stack.Screen name="AssessmentScreen" component={AssessmentScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen
        name="Students"
        component={StudentStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Complaints"
        component={ComplaintScreen} // Replace with the actual component for Complaints
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

export default AppNavigator;