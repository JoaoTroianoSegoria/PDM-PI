import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert , Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DisciplinasScreen({ navigation }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [abaAtual, setAbaAtual] = useState('atuais');

  const bgColor = isDarkMode ? '#121212' : '#f5f5f5';
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  const cardColor = isDarkMode ? '#1e1e1e' : '#ffffff';
  const subTextColor = isDarkMode ? '#aaaaaa' : '#666666';
  const tabContainerBg = isDarkMode ? '#333333' : '#e0e0e0';

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessao?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: () => navigation.replace('Login'), style: 'destructive' },
    ]);
  };

  const disciplinasAtuais = [
    { id: '1', nome: 'Calculo Numerico', cod: 'MAT201', turma: 'Turma A', prof: 'Prof. Valnei Alves Fernandes', horario: 'Segunda-Feira 8:15 - 11:00', sala: 'Sala PCA2' },
    { id: '2', nome: 'Computacao Grafica', cod: 'MCA304', turma: 'Turma B', prof: 'Prof. Sofia Mitsuyo Taguchi da Cunha', horario: 'Segunda-Feira 11:00 - 12:15', sala: 'Sala PCB1' },
    { id: '3', nome: 'Projeto Integrador', cod: 'BDC312', turma: 'Turma A', prof: 'Prof. Marcelo Alves Farias', horario: 'Sexta-Feira 11:00 - 12:15', sala: 'Sala PJB5' },
  ];

  const historico = [
    { id: '1', nome: 'Algoritmos e Estruturas de Dados', cod: 'ALG201', status: 'Aprovado', nota: '8.5', semestre: '2025.2' },
    { id: '2', nome: 'Logica de Programacao', cod: 'LOG100', status: 'Aprovado', nota: '9.0', semestre: '2025.1' },
    { id: '3', nome: 'Matematica Discreta', cod: 'MAT105', status: 'Aprovado', nota: '7.8', semestre: '2025.1' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header} >
              <Image source={require('../../assets/logo.png')} style={styles.logoContainer} /> 
              <View style={styles.userInfo}>
                <TouchableOpacity onPress={handleLogout} style={{ justifyContent: 'flex-start' }}>
                  <Ionicons name="person-circle-outline" size={40} color="#fff" />
                </TouchableOpacity>
                <View style={styles.userTextContainer}>
                    <Text style={styles.headerTitle}>UniPortal</Text>
                  <Text style={styles.headerGreeting}>Olá, João</Text>
                </View>
              </View>
              <TouchableOpacity onPress={toggleTheme} style={{ marginLeft: 'auto' }}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color="#fff" />
        </TouchableOpacity>
            </View>

      <ScrollView style={styles.content}>
        <Animatable.View animation="fadeInUp" duration={400} delay={50}>
          <View style={[styles.tabContainer, { backgroundColor: tabContainerBg }]}>
            <TouchableOpacity
              style={[styles.tab, abaAtual === 'atuais' && { backgroundColor: styles.activeTabBg.color }]}
              onPress={() => setAbaAtual('atuais')}
            >
              <Text
                style={[
                  abaAtual == 'atuais' && { color: styles.activeTabText.color, fontWeight:'bold' },
                  abaAtual != 'atuais' && { color: styles.tabText.color ,fontWeight:'bold'},
                ]}
              >
                Disciplinas Atuais
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, abaAtual === 'historico' && { backgroundColor: styles.activeTabBg.color }]}
              onPress={() => setAbaAtual('historico')}
            >
              <Text
                style={[
                  abaAtual  == 'historico' && { color: styles.activeTabText.color, fontWeight:'bold' },
                  abaAtual != 'historico' && { color: styles.tabText.color, fontWeight:'bold' },
                ]}
              >
                Historico
              </Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        {abaAtual === 'atuais' ? (
          <View>
            <Animatable.View animation="fadeInUp" duration={400} delay={150}>
              <Text style={[styles.semesterTitle, { color: textColor }]}>5o Semestre - 2026</Text>
              <Text style={[styles.subtitle, { color: subTextColor }]}>
                {disciplinasAtuais.length} disciplinas matriculadas
              </Text>
            </Animatable.View>

            {disciplinasAtuais.map((item, index) => (
              <Animatable.View key={item.id} animation="fadeInUp" duration={400} delay={250 + index * 100}>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={[styles.subjectName, { color: textColor }]}>{item.nome}</Text>
                      <Text style={styles.subjectCode}>{item.cod}</Text>
                    </View>
                    <View style={styles.badgeTurma}>
                      <Text style={styles.badgeText}>{item.turma}</Text>
                    </View>
                  </View>
                  <Text style={[styles.infoText, { color: subTextColor }]}>
                    <Ionicons name="person-outline" /> {item.prof}
                  </Text>
                  <Text style={[styles.infoText, { color: subTextColor }]}>
                    <Ionicons name="time-outline" /> {item.horario}
                  </Text>
                  <Text style={[styles.infoText, { color: subTextColor }]}>
                    <Ionicons name="location-outline" /> {item.sala}
                  </Text>
                </View>
              </Animatable.View>
            ))}
          </View>
        ) : (
          <View>
            <Animatable.View animation="fadeInUp" duration={400} delay={150}>
              <Text style={[styles.semesterTitle, { color: textColor }]}>Historico Academico</Text>
              <Text style={[styles.subtitle, { color: subTextColor }]}>Disciplinas concluidas</Text>
            </Animatable.View>

            {historico.map((item, index) => (
              <Animatable.View key={item.id} animation="fadeInUp" duration={400} delay={250 + index * 100}>
                <View style={[styles.card, { backgroundColor: cardColor, borderColor: '#4CAF50' }]}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={[styles.subjectName, { color: textColor }]}>{item.nome}</Text>
                      <Text style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: 12 }}>{item.cod}</Text>
                    </View>
                    <View style={[styles.badgeTurma, { backgroundColor: '#4CAF50' }]}>
                      <Text style={styles.badgeText}>{item.status}</Text>
                    </View>
                  </View>
                  <Text style={[styles.infoText, { color: subTextColor }]}>Semestre Letivo: {item.semestre}</Text>
                  <Text style={[styles.infoText, { color: subTextColor, fontWeight: 'bold' }]}>Nota Final: {item.nota}</Text>
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
  activeTabBg: { color: '#B90000' },
  logoContainer: { marginRight: 10, width: 25, height: 25 },
  container: { flex: 1 },
  header: { backgroundColor: '#B90000', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 20, paddingTop: 20 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userTextContainer: { marginLeft: 10 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerGreeting: { color: '#fff', fontSize: 14 },
  content: { padding: 20 },
  tabContainer: { flexDirection: 'row', borderRadius: 8, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  tabText: { color: '#666', fontWeight: '500' },
  activeTabText: { color: '#ffffff', fontWeight: 'bold' },
  semesterTitle: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 12, marginBottom: 20 },
  card: { borderWidth: 1, borderColor: '#B90000', borderRadius: 12, padding: 15, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  subjectName: { fontSize: 16, fontWeight: 'bold' },
  subjectCode: { fontSize: 12, color: '#B90000', fontWeight: 'bold' },
  badgeTurma: { backgroundColor: '#FF3B30', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  infoText: { fontSize: 13, marginBottom: 4 },
});