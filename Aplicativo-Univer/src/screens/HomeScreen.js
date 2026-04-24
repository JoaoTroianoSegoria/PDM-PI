import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext'; // Importando o contexto do tema

export default function HomeScreen({ navigation }) {
  // Puxando o estado do Modo Escuro e a função de alternar
  const { isDarkMode, toggleTheme } = useTheme();

  // Definindo as cores dinâmicas
  const bgColor = isDarkMode ? '#121212' : '#f5f5f5';
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  const cardColor = isDarkMode ? '#1e1e1e' : '#ffffff';
  const subTextColor = isDarkMode ? '#aaaaaa' : '#666666';
  const borderColor = isDarkMode ? '#333333' : '#ffcccc';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header Vermelho */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Ionicons name="person-circle-outline" size={40} color="#fff" />
          <View style={styles.userTextContainer}>
            <Text style={styles.headerTitle}>UniPortal</Text>
            <Text style={styles.headerGreeting}>Olá, João</Text>
          </View>
        </View>
        
        {/* AQUI ESTÁ A MÁGICA: TouchableOpacity envolvendo o ícone */}
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.dateText, { color: subTextColor }]}>Sexta-Feira, 13 de março de 2026</Text>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Sua grade de hoje</Text>

        {/* Card: Aula de Hoje */}
        <View style={[styles.card, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar-outline" size={20} color="#B90000" />
            <Text style={styles.cardTitle}>Aula de Hoje</Text>
          </View>
          <Text style={[styles.subjectText, { color: textColor }]}>Projeto integrador</Text>
          <Text style={[styles.profText, { color: subTextColor }]}>Prof. Marcelo Alves Farias</Text>
          <Text style={[styles.infoText, { color: subTextColor }]}><Ionicons name="time-outline" /> 11:00 - 12:15</Text>
          <Text style={[styles.infoText, { color: subTextColor }]}><Ionicons name="location-outline" /> Sala B5 - Bloco J</Text>
        </View>

        {/* Card: Cobranças */}
        <View style={[styles.card, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <View style={[styles.cardHeader, { justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="card-outline" size={20} color="#B90000" />
              <Text style={styles.cardTitle}>Cobranças</Text>
            </View>
            <View style={styles.badgePendente}><Text style={styles.badgeText}>Pendente</Text></View>
          </View>
          <Text style={[styles.subjectText, { color: textColor }]}>Mensalidade Março/2026</Text>
          <Text style={[styles.infoText, { color: subTextColor }]}>Vencimento: 20/03/2026</Text>
          <Text style={[styles.valueText, { color: textColor }]}>Valor: R$ 850,00</Text>
          
          {/* Botão de navegação para a tela de Faturas */}
          <TouchableOpacity 
            style={styles.buttonRed}
            onPress={() => navigation.navigate('Faturas')}
          >
            <Text style={styles.buttonRedText}>Ir para faturas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: '#B90000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userTextContainer: { marginLeft: 10 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerGreeting: { color: '#fff', fontSize: 14 },
  content: { padding: 20 },
  dateText: { fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 5 },
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#B90000', marginLeft: 5 },
  subjectText: { fontSize: 16, fontWeight: 'bold' },
  profText: { fontSize: 14, marginBottom: 10 },
  infoText: { fontSize: 14, marginBottom: 5 },
  valueText: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', marginVertical: 10 },
  badgePendente: { backgroundColor: '#ff1a1a', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  buttonRed: { backgroundColor: '#B90000', padding: 10, borderRadius: 5, alignItems: 'center' },
  buttonRedText: { color: '#fff', fontWeight: 'bold' }
});