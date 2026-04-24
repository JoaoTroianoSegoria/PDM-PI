import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  const { isDarkMode, toggleTheme } = useTheme();

  const bgColor = isDarkMode ? '#121212' : '#f5f5f5';
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  const cardColor = isDarkMode ? '#1e1e1e' : '#ffffff';
  const subTextColor = isDarkMode ? '#aaaaaa' : '#666666';
  const borderColor = isDarkMode ? '#333333' : '#ffcccc';

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: () => navigation.replace('Login'), style: "destructive" }
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="person-circle-outline" size={40} color="#fff" />
          </TouchableOpacity>
          <View style={styles.userTextContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.headerTitle}>UniPortal</Text>
            </View>
            <Text style={styles.headerGreeting}>Olá, João</Text>
          </View>
        </View>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.dateText, { color: subTextColor }]}>Sexta-Feira, 13 de março de 2026</Text>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Sua grade de hoje</Text>

        {/* Card 1: Aula de Hoje */}
        <Animatable.View animation="fadeInUp" duration={400} delay={50}>
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
        </Animatable.View>
        
        <Animatable.View animation="fadeIn" duration={900} delay={150}>
          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
            <Text style={[styles.dividerText, { color: subTextColor }]}>Pendências & Serviços</Text>
            <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
          </View>
        </Animatable.View>

        {/* Card 2: Cobranças */}
        <Animatable.View animation="fadeInUp" duration={400} delay={50}>
          <View style={[styles.card, { backgroundColor: cardColor, borderColor: borderColor }]}>
            <View style={[styles.cardHeader, { justifyContent: 'space-between' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="card-outline" size={20} color="#B90000" />
                <Text style={styles.cardTitle}>Cobranças</Text>
              </View>
              <View style={styles.badgeRed}><Text style={styles.badgeText}>Pendente</Text></View>
            </View>
            <Text style={[styles.subjectText, { color: textColor }]}>Mensalidade Março/2026</Text>
            <Text style={[styles.infoText, { color: subTextColor }]}>Vencimento: 20/03/2026</Text>
            <Text style={[styles.valueText, { color: textColor }]}>Valor: R$ 850,00</Text>
            <TouchableOpacity style={styles.buttonRed} onPress={() => navigation.navigate('Faturas')}>
              <Text style={styles.buttonRedText}>Ir para faturas</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        {/* Card 3: Biblioteca */}
        <Animatable.View animation="fadeInUp" duration={400} delay={50}>
          <View style={[styles.card, { backgroundColor: cardColor, borderColor: borderColor, marginBottom: 40 }]}>
            <View style={[styles.cardHeader, { justifyContent: 'space-between' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="library-outline" size={20} color="#B90000" />
                <Text style={styles.cardTitle}>Biblioteca</Text>
              </View>
              <View style={[styles.badgeRed, { backgroundColor: '#FF3B30' }]}><Text style={styles.badgeText}>Atrasado 4 dias</Text></View>
            </View>
            <Text style={[styles.subjectText, { color: textColor }]}>Algoritmos e Estruturas de Dados</Text>
            <Text style={[styles.infoText, { color: subTextColor, marginTop: 5, marginBottom: 15 }]}>
              <Ionicons name="alert-circle-outline" /> Prazo: 19/03/2026
            </Text>
            <TouchableOpacity 
              style={[styles.buttonRed, { backgroundColor: '#8B0000' }]} 
              onPress={() => Alert.alert("Devolução", "Dirija-se ao balcão da biblioteca para devolver o exemplar.")}
            >
              <Text style={styles.buttonRedText}>Realizar devolução</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>

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
  headerLogo: { width: 25, height: 25, marginRight: 8 },
  content: { padding: 20 },
  dateText: { fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 5 },
  card: { borderWidth: 1, borderRadius: 8, padding: 15, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#B90000', marginLeft: 5 },
  subjectText: { fontSize: 16, fontWeight: 'bold' },
  profText: { fontSize: 14, marginBottom: 10 },
  infoText: { fontSize: 14, marginBottom: 5 },
  valueText: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', marginVertical: 10 },
  badgeRed: { backgroundColor: '#ff1a1a', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  buttonRed: { backgroundColor: '#B90000', padding: 10, borderRadius: 5, alignItems: 'center' },
  buttonRedText: { color: '#fff', fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center',marginVertical: 10, },
  dividerLine: { flex: 1, height: 1, },
  dividerText: { marginHorizontal: 10, fontSize: 12, fontWeight: '600', },
});