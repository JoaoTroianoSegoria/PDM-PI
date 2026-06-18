import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BoletimScreen from './src/screens/BoletimScreen';
import CarteirinhaScreen from './src/screens/CarteirinhaScreen';
import DisciplinasScreen from './src/screens/DisciplinasScreen';
import FaturasScreen from './src/screens/FaturasScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { UniverProvider, useUniver } from './src/contexts/UniverContext';
import { colors, getThemeColors, sharedStyles } from './src/styles/styles';

const Tab = createBottomTabNavigator();

const tabIcons = {
  Início: ['home', 'home-outline'],
  Disciplinas: ['book', 'book-outline'],
  Boletim: ['document-text', 'document-text-outline'],
  Carteirinha: ['id-card', 'id-card-outline'],
  Faturas: ['card', 'card-outline'],
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
          const [activeIcon, inactiveIcon] = tabIcons[route.name] ?? ['ellipse', 'ellipse-outline'];
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

function AppNavigator() {
  const { authLoading, user } = useUniver();

  if (authLoading) {
    return (
      <View style={[sharedStyles.centerContent, { backgroundColor: colors.primaryDark }]}>
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <LoginScreen />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <UniverProvider>
            <AppNavigator />
          </UniverProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
