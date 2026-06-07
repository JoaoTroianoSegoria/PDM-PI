import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BoletimScreen from './src/screens/BoletimScreen';
import CarteirinhaScreen from './src/screens/CarteirinhaScreen';
import DisciplinasScreen from './src/screens/DisciplinasScreen';
import FaturasScreen from './src/screens/FaturasScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { colors, getThemeColors } from './src/styles/styles';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabIcons = {
  'Início': ['home', 'home-outline'],
  'Disciplinas': ['book', 'book-outline'],
  'Boletim': ['document-text', 'document-text-outline'],
  'Carteirinha': ['id-card', 'id-card-outline'],
  'Faturas': ['card', 'card-outline'],
};

function MainTabs() {
  const { isDarkMode } = useTheme();
  const theme = getThemeColors(isDarkMode);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: isDarkMode ? colors.darkBorder : colors.tabLight,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const [activeIcon, inactiveIcon] = tabIcons[route.name];
          return <Ionicons name={focused ? activeIcon : inactiveIcon} size={size} color={color} />;
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

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
          <Stack.Screen name="Main" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
