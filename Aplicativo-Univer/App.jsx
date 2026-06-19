import React from 'react';
import { ActivityIndicator, useWindowDimensions, View } from 'react-native';
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
import UniPortalTabBar from './src/components/UniPortalTabBar';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { UniverProvider, useUniver } from './src/contexts/UniverContext';
import { colors, sharedStyles } from './src/styles/styles';

const Tab = createBottomTabNavigator();

function MainTabs() {
  const { width } = useWindowDimensions();
  const isSidebar = width >= 900;

  return (
    <Tab.Navigator
      tabBar={(props) => <UniPortalTabBar {...props} isSidebar={isSidebar} />}
      screenOptions={{
        headerShown: false,
        tabBarPosition: isSidebar ? 'left' : 'bottom',
      }}
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
