import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importação do Provedor de Tema e do Hook
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';

// Importação de todas as Telas
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import DisciplinasScreen from './src/screens/DisciplinasScreen';
import BoletimScreen from './src/screens/BoletimScreen';
import CarteirinhaScreen from './src/screens/CarteirinhaScreen';
import FaturasScreen from './src/screens/FaturasScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const globalRed = '#B90000'; 

// Navegação por Abas
function MainTabs() {
  // Puxando o tema para aplicar no rodapé
  const { isDarkMode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: globalRed,
        tabBarInactiveTintColor: 'gray',
        // Estilo dinâmico do rodapé
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
          borderTopColor: isDarkMode ? '#333333' : '#e0e0e0',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Início') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Disciplinas') iconName = focused ? 'book' : 'book-outline';
          else if (route.name === 'Boletim') iconName = focused ? 'document-text' : 'document-text-outline';
          else if (route.name === 'Carteirinha') iconName = focused ? 'id-card' : 'id-card-outline';
          else if (route.name === 'Faturas') iconName = focused ? 'card' : 'card-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Disciplinas" component={DisciplinasScreen} />
      <Tab.Screen name="Boletim" component={BoletimScreen} />
      <Tab.Screen name="Carteirinha" component={CarteirinhaScreen} />
      <Tab.Screen name="Faturas" component={FaturasScreen} />
    </Tab.Navigator>
  );
}

// Componente Principal
export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}