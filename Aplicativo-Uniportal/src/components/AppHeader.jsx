import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUniver } from '../contexts/UniverContext';
import { sharedStyles } from '../styles/styles';

export default function AppHeader({ isDarkMode, onToggleTheme, onLogout }) {
  const { user } = useUniver();
  const firstName = user?.name?.split(' ')[0] ?? 'Aluno';

  return (
    <View style={sharedStyles.header}>
      <Image source={require('../../assets/logo.png')} style={sharedStyles.logoContainer} />

      <View style={sharedStyles.userInfo}>
        <TouchableOpacity onPress={onLogout} style={sharedStyles.profileButton}>
          <Ionicons name="person-circle-outline" size={40} color="#fff" />
        </TouchableOpacity>

        <View style={sharedStyles.userTextContainer}>
          <View style={sharedStyles.headerTitleRow}>
            <Text style={sharedStyles.headerTitle}>UniPortal</Text>
          </View>
          <Text style={sharedStyles.headerGreeting}>Olá, {firstName}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={onToggleTheme} style={sharedStyles.themeButton}>
        <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
