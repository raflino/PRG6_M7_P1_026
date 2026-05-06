import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardScreen from './screens/DashboardScreen';
import FormLaporanScreen from './screens/FormLaporanScreen';
import RiwayatScreen from './screens/RiwayatScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Dashboard') {
              iconName = 'dashboard';
            } else if (route.name === 'Buat Laporan') {
              iconName = 'edit';
            } else if (route.name === 'Riwayat') {
              iconName = 'history';
            }
            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#D32F2F',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#D32F2F',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Buat Laporan" component={FormLaporanScreen} />
        <Tab.Screen name="Riwayat" component={RiwayatScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}