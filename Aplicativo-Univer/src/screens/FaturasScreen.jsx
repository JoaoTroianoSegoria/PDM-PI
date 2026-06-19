import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import StatusView from '../components/StatusView';
import { animation, colors, getThemeColors, sharedStyles, theme as uiTheme } from '../styles/styles';
import { useTheme } from '../contexts/ThemeContext';
import { useUniver } from '../contexts/UniverContext';

export default function FaturasScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { dashboard, error, invoices, loading, logout, refresh } = useUniver();
  const [abaAtual, setAbaAtual] = useState('pendentes');
  const theme = getThemeColors(isDarkMode);

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: logout, style: 'destructive' },
    ]);
  };

  if (loading && invoices.pending.length === 0 && invoices.history.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusView isDarkMode={isDarkMode} message="Carregando faturas..." />
      </SafeAreaView>
    );
  }

  if (error && invoices.pending.length === 0 && invoices.history.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusView error={error} isDarkMode={isDarkMode} onRetry={refresh} />
      </SafeAreaView>
    );
  }

  const items = abaAtual === 'pendentes' ? invoices.pending : invoices.history;
  const getTabTextStyle = (isActive) => [
    styles.tabText,
    { color: isActive ? colors.white : theme.subText },
    isActive && styles.activeTabText,
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader
        isDarkMode={isDarkMode}
        onLogout={handleLogout}
        onToggleTheme={toggleTheme}
        subtitle={dashboard?.dateLabel ?? 'Financeiro acadêmico'}
        title="Faturas"
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={50}>
          <View style={styles.toolbar}>
            <View style={[styles.tabContainer, { backgroundColor: theme.tabContainer, borderColor: theme.border }]}>
              <TouchableOpacity
                style={[styles.tab, abaAtual === 'pendentes' && { backgroundColor: theme.activeTab }]}
                onPress={() => setAbaAtual('pendentes')}
              >
                <Text style={getTabTextStyle(abaAtual === 'pendentes')}>Pendentes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, abaAtual === 'historico' && { backgroundColor: theme.activeTab }]}
                onPress={() => setAbaAtual('historico')}
              >
                <Text style={getTabTextStyle(abaAtual === 'historico')}>Histórico</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.countText, { color: theme.subText }]}>
              {items.length} {items.length === 1 ? 'fatura' : 'faturas'}
            </Text>
          </View>
        </Animatable.View>

        <View style={styles.summaryGrid}>
          <SummaryCard label="Pendentes" value={String(invoices.pending.length)} icon="alert-circle" tone="warning" theme={theme} />
          <SummaryCard label="Histórico" value={String(invoices.history.length)} icon="checkmark-circle" tone="success" theme={theme} />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12 }]}>
          {abaAtual === 'pendentes' ? 'Faturas Pendentes' : 'Histórico de Pagamentos'}
        </Text>

        {items.map((item, index) => (
          <Animatable.View key={item.id} animation="fadeInUp" duration={animation.duration} delay={100 + index * 80}>
            <View style={[styles.invoiceCard, { backgroundColor: theme.card, borderColor: theme.border }, theme.shadow]}>
              <View style={styles.invoiceHeader}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[styles.month, { color: theme.text }]}>{item.mes}</Text>
                  <Text style={[styles.invoiceSub, { color: theme.subText }]}>
                    {abaAtual === 'pendentes' ? 'Mensalidade em aberto' : 'Mensalidade quitada'}
                  </Text>
                </View>
                <StatusBadge status={item.status} paid={abaAtual === 'historico'} />
              </View>

              <View style={styles.detailPanel}>
                <DetailLine
                  label={abaAtual === 'pendentes' ? 'Vencimento' : 'Vencimento original'}
                  value={item.vencimento}
                  theme={theme}
                />
                {abaAtual === 'historico' && (
                  <DetailLine label="Data de pagamento" value={item.dataPagamento} theme={theme} success />
                )}
                <DetailLine label={abaAtual === 'pendentes' ? 'Valor' : 'Valor pago'} value={item.valor} theme={theme} large />
              </View>

              {abaAtual === 'pendentes' && (
                <TouchableOpacity
                  style={[styles.primaryButton, styles.payButton]}
                  onPress={() => Alert.alert('Pagamento', 'Funcionalidade de pagamento simulada para o projeto.')}
                >
                  <Ionicons name="card" size={20} color={colors.white} />
                  <Text style={[styles.primaryButtonText, styles.payButtonText]}>Pagar agora</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animatable.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryCard({ icon, label, theme, tone, value }) {
  const isSuccess = tone === 'success';
  return (
    <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }, theme.shadow]}>
      <View style={[styles.summaryIcon, { backgroundColor: isSuccess ? '#dff7ec' : '#fff1d6' }]}>
        <Ionicons name={icon} size={22} color={isSuccess ? colors.success : colors.warning} />
      </View>
      <View>
        <Text style={[styles.summaryLabel, { color: theme.subText }]}>{label}</Text>
        <Text style={[styles.summaryValue, { color: theme.text }]}>{value}</Text>
      </View>
    </View>
  );
}

function DetailLine({ label, large, success, theme, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: theme.subText }]}>{label}</Text>
      <Text
        style={[
          styles.detailValue,
          { color: success ? colors.success : theme.text },
          large && styles.valueLarge,
          large && { color: success ? colors.success : colors.primary },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function StatusBadge({ paid, status }) {
  return (
    <View style={[styles.statusBadge, { backgroundColor: paid ? '#dff7ec' : '#fff1d6' }]}>
      <Text style={[styles.statusBadgeText, { color: paid ? colors.success : colors.warning }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ...sharedStyles,
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 18,
  },
  summaryCard: {
    flex: 1,
    minWidth: 160,
    borderWidth: 1,
    borderRadius: uiTheme.radius.md,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: { fontSize: 12, fontWeight: '800' },
  summaryValue: { fontSize: 24, fontWeight: '900', marginTop: 2 },
  toolbar: {
    alignItems: 'stretch',
    marginBottom: 4,
  },
  tabContainer: {
    ...sharedStyles.tabContainer,
    alignSelf: 'stretch',
    width: '100%',
  },
  tab: {
    ...sharedStyles.tab,
    flex: 1,
  },
  countText: { fontSize: 12, fontWeight: '800', alignSelf: 'flex-end', marginTop: -8 },
  invoiceCard: {
    padding: 18,
    borderRadius: uiTheme.radius.md,
    borderWidth: 1,
    marginBottom: 14,
  },
  invoiceHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  month: { fontSize: 18, fontWeight: '900' },
  invoiceSub: { fontSize: 13, marginTop: 4 },
  statusBadge: {
    borderRadius: uiTheme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusBadgeText: { fontSize: 11, fontWeight: '900' },
  detailPanel: {
    gap: 10,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  detailLabel: { fontSize: 13, fontWeight: '700' },
  detailValue: { fontSize: 14, fontWeight: '900', textAlign: 'right' },
  valueLarge: { fontSize: 22, fontWeight: '900' },
  payButton: { marginTop: 4 },
  payButtonText: { marginLeft: 10 },
});
