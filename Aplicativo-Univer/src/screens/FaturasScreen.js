import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export default function FaturasScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [abaAtual, setAbaAtual] = useState('pendentes');

  // Cores dinâmicas
  const bgColor = isDarkMode ? '#121212' : '#f5f5f5';
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  const cardColor = isDarkMode ? '#1e1e1e' : '#D9D9D9';
  const subTextColor = isDarkMode ? '#aaaaaa' : '#666666';
  const tabContainerBg = isDarkMode ? '#333333' : '#e0e0e0';
  const activeTabBg = isDarkMode ? '#1e1e1e' : '#fff';

  const faturasPendentes = [
    { id: '1', mes: 'Março/2026', vencimento: '20/03/2026', valor: 'R$ 850,00', status: 'Pendente' }
  ];

  const historicoFaturas = [
    { id: '2', mes: 'Fevereiro/2026', vencimento: '20/02/2026', valor: 'R$ 850,00', status: 'Pago', dataPagamento: '19/02/2026' },
    { id: '3', mes: 'Janeiro/2026', vencimento: '20/01/2026', valor: 'R$ 850,00', status: 'Pago', dataPagamento: '15/01/2026' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Ionicons name="person-circle-outline" size={40} color="#fff" />
          <View style={styles.userTextContainer}>
            <Text style={styles.headerTitle}>UniPortal</Text>
            <Text style={styles.headerGreeting}>Olá, João</Text>
          </View>
        </View>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Controle das Abas com cores dinâmicas */}
        <View style={[styles.tabContainer, { backgroundColor: tabContainerBg }]}>
          <TouchableOpacity 
            style={[styles.tab, abaAtual === 'pendentes' && { backgroundColor: activeTabBg }]} 
            onPress={() => setAbaAtual('pendentes')}
          >
            <Text style={[styles.tabText, abaAtual === 'pendentes' && styles.activeTabText]}>
              Pendentes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, abaAtual === 'historico' && { backgroundColor: activeTabBg }]} 
            onPress={() => setAbaAtual('historico')}
          >
            <Text style={[styles.tabText, abaAtual === 'historico' && styles.activeTabText]}>
              Histórico
            </Text>
          </TouchableOpacity>
        </View>

        {abaAtual === 'pendentes' ? (
          <View>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Faturas Pendentes</Text>
            <Text style={[styles.subtitle, { color: subTextColor }]}>{faturasPendentes.length} fatura pendente</Text>

            {faturasPendentes.map((item) => (
              <View key={item.id} style={[styles.invoiceCard, { backgroundColor: cardColor }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.month, { color: textColor }]}>{item.mes}</Text>
                  <View style={styles.badgePendente}><Text style={styles.badgeText}>{item.status}</Text></View>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: subTextColor }]}>Vencimento:</Text>
                  <Text style={[styles.detailValue, { color: textColor }]}>{item.vencimento}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: subTextColor }]}>Valor:</Text>
                  <Text style={styles.valueLarge}>{item.valor}</Text>
                </View>

                <TouchableOpacity style={styles.payButton}>
                  <Ionicons name="card" size={20} color="#fff" />
                  <Text style={styles.payButtonText}>Pagar agora</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Histórico de Pagamentos</Text>
            <Text style={[styles.subtitle, { color: subTextColor }]}>Faturas já quitadas</Text>

            {historicoFaturas.map((item) => (
              <View key={item.id} style={[styles.invoiceCard, { backgroundColor: cardColor, borderWidth: 1, borderColor: '#4CAF50' }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.month, { color: textColor }]}>{item.mes}</Text>
                  <View style={[styles.badgePendente, { backgroundColor: '#4CAF50' }]}>
                    <Text style={styles.badgeText}>{item.status}</Text>
                  </View>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: subTextColor }]}>Vencimento original:</Text>
                  <Text style={[styles.detailValue, { color: textColor }]}>{item.vencimento}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: subTextColor }]}>Data de Pagamento:</Text>
                  <Text style={[styles.detailValue, { color: '#4CAF50' }]}>{item.dataPagamento}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: subTextColor }]}>Valor pago:</Text>
                  <Text style={[styles.valueLarge, { color: '#4CAF50', fontSize: 16 }]}>{item.valor}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { backgroundColor: '#B90000', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userTextContainer: { marginLeft: 10 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerGreeting: { color: '#fff', fontSize: 14 },
  content: { padding: 20 },
  tabContainer: { flexDirection: 'row', borderRadius: 8, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  tabText: { color: '#666', fontWeight: '500' },
  activeTabText: { color: '#B90000', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 12, marginBottom: 20 },
  invoiceCard: { padding: 20, borderRadius: 15, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  month: { fontSize: 16, fontWeight: 'bold' },
  badgePendente: { backgroundColor: '#B90000', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  detailLabel: {},
  detailValue: { fontWeight: 'bold' },
  valueLarge: { fontSize: 18, fontWeight: 'bold', color: '#B90000' },
  payButton: { backgroundColor: '#B90000', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 8, marginTop: 10 },
  payButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 10 }
});