import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { colors, getThemeColors, sharedStyles } from '../styles/styles';

export default function StatusView({ error, isDarkMode, message, onRetry }) {
  const theme = getThemeColors(isDarkMode);

  return (
    <View style={sharedStyles.statusContainer}>
      {error ? (
        <>
          <Text style={[sharedStyles.statusTitle, { color: theme.text }]}>
            Não foi possível carregar.
          </Text>
          <Text style={[sharedStyles.statusText, { color: theme.subText }]}>{error}</Text>
          {onRetry && (
            <TouchableOpacity style={sharedStyles.primaryButton} onPress={onRetry}>
              <Text style={sharedStyles.primaryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[sharedStyles.statusText, { color: theme.subText }]}>{message ?? 'Carregando...'}</Text>
        </>
      )}
    </View>
  );
}
