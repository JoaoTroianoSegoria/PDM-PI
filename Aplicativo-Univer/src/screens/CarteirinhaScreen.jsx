import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import StatusView from '../components/StatusView';
import { animation, colors, getThemeColors, sharedStyles, theme as uiTheme } from '../styles/styles';
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
      <AppHeader
        isDarkMode={isDarkMode}
        onLogout={handleLogout}
        onToggleTheme={toggleTheme}
        subtitle="Documento estudantil digital"
        title="Carteirinha"
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={50}>
          <View style={[styles.idCard, theme.shadow]}>
            <View style={styles.cardTopRow}>
              <View>
                <Text style={styles.cardEyebrow}>UniPortal</Text>
                <Text style={styles.cardTitle}>Carteirinha Estudantil</Text>
              </View>
              <View style={styles.logoBadge}>
                <Text style={styles.logoBadgeText}>U</Text>
              </View>
            </View>

            <View style={styles.identityRow}>
              <View style={styles.photoPlaceholder}>
                <Ionicons name="person" size={44} color={colors.white} />
              </View>
              <View style={styles.idInfo}>
                <Text style={styles.userName}>{studentCard?.name ?? studentCard?.firstName}</Text>
                <Text style={styles.userRA}>RA {studentCard?.registration}</Text>
                <Text style={styles.userCourse}>{studentCard?.course}</Text>
              </View>
            </View>

            <View style={styles.idFooter}>
              <View>
                <Text style={styles.label}>Semestre atual</Text>
                <Text style={styles.value}>{studentCard?.currentSemester}</Text>
              </View>
              <View style={styles.footerRight}>
                <Text style={styles.label}>Válido até</Text>
                <Text style={styles.value}>{studentCard?.validUntil}</Text>
              </View>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={150}>
          <View style={[styles.field, { backgroundColor: theme.card, borderColor: theme.border }, theme.shadow]}>
            <View style={[styles.fieldIcon, { backgroundColor: colors.primaryTint }]}>
              <Ionicons name="finger-print-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.fieldTexts}>
              <Text style={[styles.fieldLabel, { color: theme.subText }]}>Matrícula</Text>
              <Text style={[styles.fieldValue, { color: theme.text }]}>{studentCard?.registration}</Text>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={250}>
          <View style={[styles.qrPanel, { backgroundColor: theme.card, borderColor: theme.border }, theme.shadow]}>
            <View style={styles.panelHeader}>
              <View>
                <Text style={[styles.sectionEyebrow, { color: colors.primarySoft }]}>Acesso rápido</Text>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>QR Code de Validação</Text>
              </View>
              <Ionicons name="shield-checkmark-outline" size={24} color={colors.success} />
            </View>

            <View style={[styles.qrBox, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}>
              <Ionicons name="qr-code-outline" size={112} color={theme.text} />
            </View>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ...sharedStyles,
  idCard: {
    backgroundColor: colors.primary,
    borderRadius: uiTheme.radius.lg,
    padding: 20,
    marginBottom: 18,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },
  cardEyebrow: {
    color: '#ffe66d',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0,
  },
  cardTitle: { color: colors.white, fontSize: 20, fontWeight: '900', marginTop: 4 },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadgeText: { color: colors.white, fontWeight: '900', fontSize: 16 },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  photoPlaceholder: {
    width: 82,
    height: 100,
    backgroundColor: colors.primaryDark,
    borderRadius: uiTheme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  idInfo: { flex: 1, minWidth: 0 },
  userName: { color: colors.white, fontSize: 20, fontWeight: '900' },
  userRA: { color: '#ffe5e9', fontSize: 13, fontWeight: '800', marginTop: 6 },
  userCourse: { color: '#ffe5e9', fontSize: 13, marginTop: 4 },
  idFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  footerRight: { alignItems: 'flex-end' },
  label: { color: '#ffdce1', fontSize: 11, fontWeight: '700' },
  value: { color: colors.white, fontSize: 14, fontWeight: '900', marginTop: 4 },
  field: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: uiTheme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  fieldIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fieldTexts: { flex: 1, minWidth: 0 },
  fieldLabel: { fontSize: 12, fontWeight: '800' },
  fieldValue: { fontSize: 18, fontWeight: '900', marginTop: 3 },
  qrPanel: {
    borderWidth: 1,
    borderRadius: uiTheme.radius.md,
    padding: 18,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 18,
  },
  qrBox: {
    padding: 22,
    borderWidth: 1,
    borderRadius: uiTheme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
