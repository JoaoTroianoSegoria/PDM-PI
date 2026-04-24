import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export default function BoletimScreen() {
  // Puxando o tema para a tela de Boletim
  const { isDarkMode, toggleTheme } = useTheme();

  // Cores dinâmicas
  const bgColor = isDarkMode ? '#121212' : '#f5f5f5';
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  const cardColor = isDarkMode ? '#1e1e1e' : '#ffffff';
  const subTextColor = isDarkMode ? '#aaaaaa' : '#666666';
  const borderColor = isDarkMode ? '#333333' : '#B90000';

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
        
        {/* Botão para alternar o tema */}
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>Boletim de Notas</Text>
        <Text style={[styles.subtitle, { color: subTextColor }]}>Semestre 2026.1</Text>

        <View style={styles.row}>
          <View style={[styles.summaryCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
            <Text style={[styles.summaryLabel, { color: subTextColor }]}>Média Geral</Text>
            <Text style={styles.summaryValue}>8.1</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
            <Text style={[styles.summaryLabel, { color: subTextColor }]}>Frequência Média</Text>
            <Text style={styles.summaryValue}>86%</Text>
          </View>
        </View>

        <View style={[styles.chartCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.cardTitle, { color: subTextColor }]}>Distribuição de Notas</Text>
          <View style={styles.chartPlaceholder}>
             <View style={styles.circle}>
                <Text style={styles.chartText}>COM102: 8.5</Text>
                <Text style={styles.chartText}>MAT201: 7.8</Text>
             </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: textColor }]}>Detalhamento por Disciplina</Text>
        <View style={[styles.cardDetail, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <View style={styles.detailRow}>
            <View>
               <Text style={[styles.subjectTitle, { color: textColor }]}>Computação Gráfica</Text>
               <Text style={[styles.subjectSub, { color: subTextColor }]}>MCA304</Text>
            </View>
            <Text style={styles.gradeBig}>7.8</Text>
          </View>
          <Text style={[styles.freqLabel, { color: subTextColor }]}>Frequência</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '85%' }]} />
          </View>
          <Text style={[styles.freqValue, { color: subTextColor }]}>85%</Text>
        </View>
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
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 12, marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  summaryCard: { width: '48%', padding: 15, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  summaryLabel: { fontSize: 12 },
  summaryValue: { fontSize: 32, fontWeight: 'bold', color: '#B90000' },
  chartCard: { padding: 15, borderRadius: 10, borderWidth: 1, marginBottom: 20 },
  cardTitle: { fontSize: 14, marginBottom: 10 },
  chartPlaceholder: { height: 150, alignItems: 'center', justifyContent: 'center' },
  circle: { width: 120, height: 120, borderRadius: 60, borderWidth: 8, borderColor: '#B90000', justifyContent: 'center', alignItems: 'center' },
  chartText: { fontSize: 10, color: '#B90000', fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  cardDetail: { padding: 15, borderRadius: 10, borderWidth: 1 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subjectTitle: { fontSize: 16, fontWeight: 'bold' },
  subjectSub: { fontSize: 12 },
  gradeBig: { fontSize: 20, fontWeight: 'bold', color: '#4CAF50' },
  freqLabel: { fontSize: 12, marginTop: 10 },
  progressBarBg: { height: 8, backgroundColor: '#eee', borderRadius: 4, marginTop: 5 },
  progressBarFill: { height: 8, backgroundColor: '#B90000', borderRadius: 4 },
  freqValue: { fontSize: 12, textAlign: 'right', marginTop: 2 }
});