import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import StatusView from '../components/StatusView';
import { animation, colors, getThemeColors, sharedStyles } from '../styles/styles';
import { useTheme } from '../contexts/ThemeContext';
import { useUniver } from '../contexts/UniverContext';

export default function FaturasScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { error, invoices, loading, logout, refresh } = useUniver();
  const [abaAtual, setAbaAtual] = useState('pendentes');
  const theme = getThemeColors(isDarkMode, {
    card: isDarkMode ? colors.darkCard : colors.invoiceCardLight,
  });

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

  const getTabTextStyle = (isActive) => [styles.tabText, isActive && styles.activeTabText];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onLogout={handleLogout} />

      <ScrollView style={styles.content}>
        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={50}>
          <View style={[styles.tabContainer, { backgroundColor: theme.tabContainer }]}>
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
        </Animatable.View>

        {abaAtual === 'pendentes' ? (
          <View>
            <Animatable.View animation="fadeInUp" duration={animation.duration} delay={150}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Faturas Pendentes</Text>
              <Text style={[styles.subtitle, { color: theme.subText }]}>
                {invoices.pending.length} fatura pendente
              </Text>
            </Animatable.View>

            {invoices.pending.map((item, index) => (
              <Animatable.View key={item.id} animation="fadeInUp" duration={animation.duration} delay={250 + index * 100}>
                <View style={[styles.invoiceCard, { backgroundColor: theme.card }]}>
                  <View style={styles.invoiceHeader}>
                    <Text style={[styles.month, { color: theme.text }]}>{item.mes}</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.status}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.subText }]}>Vencimento:</Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>{item.vencimento}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.subText }]}>Valor:</Text>
                    <Text style={styles.valueLarge}>{item.valor}</Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryButton, styles.payButton]}
                    onPress={() => Alert.alert('Pagamento', 'Funcionalidade de pagamento simulada para o projeto.')}
                  >
                    <Ionicons name="card" size={20} color="#fff" />
                    <Text style={[styles.primaryButtonText, styles.payButtonText]}>Pagar agora</Text>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            ))}
          </View>
        ) : (
          <View>
            <Animatable.View animation="fadeInUp" duration={animation.duration} delay={150}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Histórico de Pagamentos</Text>
              <Text style={[styles.subtitle, { color: theme.subText }]}>Faturas já quitadas</Text>
            </Animatable.View>

            {invoices.history.map((item, index) => (
              <Animatable.View key={item.id} animation="fadeInUp" duration={animation.duration} delay={250 + index * 100}>
                <View style={[styles.invoiceCard, { backgroundColor: theme.card, borderWidth: 1, borderColor: colors.success }]}>
                  <View style={styles.invoiceHeader}>
                    <Text style={[styles.month, { color: theme.text }]}>{item.mes}</Text>
                    <View style={[styles.badge, { backgroundColor: colors.success }]}>
                      <Text style={styles.badgeText}>{item.status}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.subText }]}>Vencimento original:</Text>
                    <Text style={[styles.detailValue, { color: theme.text }]}>{item.vencimento}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.subText }]}>Data de Pagamento:</Text>
                    <Text style={[styles.detailValue, { color: colors.success }]}>{item.dataPagamento}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.subText }]}>Valor pago:</Text>
                    <Text style={[styles.valueLarge, { color: colors.success, fontSize: 16 }]}>{item.valor}</Text>
                  </View>
                </View>
              </Animatable.View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ...sharedStyles,
  invoiceCard: { padding: 20, borderRadius: 15, marginBottom: 15 },
  invoiceHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  month: { fontSize: 16, fontWeight: 'bold' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  detailLabel: {},
  detailValue: { fontWeight: 'bold' },
  valueLarge: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
  payButton: { marginTop: 10 },
  payButtonText: { marginLeft: 10 },
});
