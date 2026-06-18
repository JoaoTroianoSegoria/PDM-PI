import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import StatusView from '../components/StatusView';
import { animation, colors, getThemeColors, sharedStyles } from '../styles/styles';
import { useTheme } from '../contexts/ThemeContext';
import { useUniver } from '../contexts/UniverContext';

export default function CarteirinhaScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { error, loading, logout, refresh, studentCard } = useUniver();
  const theme = getThemeColors(isDarkMode);

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: logout, style: 'destructive' },
    ]);
  };

  if (loading && !studentCard) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusView isDarkMode={isDarkMode} message="Carregando carteirinha..." />
      </SafeAreaView>
    );
  }

  if (error && !studentCard) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusView error={error} isDarkMode={isDarkMode} onRetry={refresh} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onLogout={handleLogout} />

      <View style={styles.content}>
        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={50}>
          <Text style={[styles.title, { color: theme.text }]}>Carteirinha Estudantil</Text>
          <Text style={[styles.subtitle, { color: theme.subText }]}>Documento de Identificação</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={150}>
          <View style={styles.idCard}>
            <View style={styles.photoContainer}>
              <View style={styles.photoPlaceholder}>
                <Ionicons name="person" size={50} color="#fff" />
              </View>
            </View>
            <View style={styles.idInfo}>
              <Text style={styles.userName}>{studentCard?.firstName}</Text>
              <Text style={styles.userRA}>RA: {studentCard?.registration}</Text>
              <Text style={styles.userCourse}>{studentCard?.course}</Text>
              <View style={styles.idFooter}>
                <View>
                  <Text style={styles.label}>Semestre Atual</Text>
                  <Text style={styles.value}>{studentCard?.currentSemester}</Text>
                </View>
                <View>
                  <Text style={styles.label}>Válido até:</Text>
                  <Text style={styles.value}>{studentCard?.validUntil}</Text>
                </View>
              </View>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={250}>
          <View style={[styles.field, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="finger-print-outline" size={20} color={colors.primary} />
            <View style={styles.fieldTexts}>
              <Text style={[styles.fieldLabel, { color: theme.subText }]}>Matrícula</Text>
              <Text style={[styles.fieldValue, { color: theme.text }]}>{studentCard?.registration}</Text>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={350}>
          <View style={styles.qrContainer}>
            <Text style={[styles.qrLabel, { color: theme.subText }]}>QR Code de Validação</Text>
            <View style={[styles.qrBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Ionicons name="qr-code-outline" size={100} color={theme.text} />
            </View>
          </View>
        </Animatable.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ...sharedStyles,
  idCard: { backgroundColor: '#FF4D4D', borderRadius: 15, flexDirection: 'row', padding: 15, marginBottom: 20 },
  photoPlaceholder: {
    width: 80,
    height: 100,
    backgroundColor: colors.darkText,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  idInfo: { flex: 1, marginLeft: 15 },
  userName: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
  userRA: { color: colors.white, fontSize: 12 },
  userCourse: { color: colors.white, fontSize: 12, marginBottom: 10 },
  idFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#eee', fontSize: 10 },
  value: { color: colors.white, fontSize: 12, fontWeight: 'bold' },
  field: { flexDirection: 'row', padding: 15, borderRadius: 10, borderWidth: 1, alignItems: 'center', marginBottom: 10 },
  fieldTexts: { marginLeft: 15 },
  fieldLabel: { fontSize: 10 },
  fieldValue: { fontSize: 16, fontWeight: 'bold' },
  qrContainer: { alignItems: 'center', marginTop: 20 },
  qrLabel: { fontSize: 12, marginBottom: 10 },
  qrBox: { padding: 20, borderWidth: 1, borderRadius: 10 },
});
