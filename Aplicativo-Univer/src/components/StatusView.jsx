import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { colors, sharedStyles } from '../styles/styles';

export default function StatusView({ error, isDarkMode, message, onRetry }) {
  return (
    <View style={sharedStyles.statusContainer}>
      {error ? (
        <>
          <Text style={[sharedStyles.statusTitle, { color: isDarkMode ? colors.white : colors.darkText }]}>
            Não foi possível carregar.
          </Text>
          <Text style={sharedStyles.statusText}>{error}</Text>
          {onRetry && (
            <TouchableOpacity style={sharedStyles.primaryButton} onPress={onRetry}>
              <Text style={sharedStyles.primaryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={sharedStyles.statusText}>{message ?? 'Carregando...'}</Text>
        </>
      )}
    </View>
  );
}
