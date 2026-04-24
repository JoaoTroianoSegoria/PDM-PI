import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export default function BoletimScreen({ navigation }) {
  const { isDarkMode, toggleTheme } = useTheme();

  const bgColor = isDarkMode ? '#121212' : '#f5f5f5';
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  const cardColor = isDarkMode ? '#1e1e1e' : '#ffffff';
  const subTextColor = isDarkMode ? '#aaaaaa' : '#666666';
  const borderColor = isDarkMode ? '#333333' : '#B90000';

  // Lista de matérias com os dados que você pediu
  const materias = [
    { id: '1', nome: 'Computação Gráfica', cod: 'MCA304', nota: 7.8, freq: 85 },
    { id: '2', nome: 'Cálculo Numérico', cod: 'MAT201', nota: 8.5, freq: 73 },
    { id: '3', nome: 'Projeto Integrador', cod: 'BDC312', nota: 9.2, freq: 100 },
  ];

  // Cálculos automáticos baseados na lista acima
  const mediaGeral = (materias.reduce((acc, curr) => acc + curr.nota, 0) / materias.length).toFixed(1);
  const freqMedia = Math.round(materias.reduce((acc, curr) => acc + curr.freq, 0) / materias.length);

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja sair da conta?", [
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
            <Text style={styles.headerTitle}>UniPortal</Text>
            <Text style={styles.headerGreeting}>Olá, João</Text>
          </View>
        </View>
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
            <Text style={styles.summaryValue}>{mediaGeral}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
            <Text style={[styles.summaryLabel, { color: subTextColor }]}>Frequência Média</Text>
            <Text style={styles.summaryValue}>{freqMedia}%</Text>
          </View>
        </View>

        <View style={[styles.chartCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Text style={[styles.cardTitle, { color: subTextColor }]}>Distribuição de Notas</Text>
          <View style={styles.chartPlaceholder}>
             <View style={styles.circle}>
                {materias.map(m => (
                  <Text key={m.id} style={styles.chartText}>{m.cod}: {m.nota}</Text>
                ))}
             </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: textColor }]}>Detalhamento por Disciplina</Text>
        
        {materias.map((materia) => (
          <View key={materia.id} style={[styles.cardDetail, { backgroundColor: cardColor, borderColor: borderColor, marginBottom: 15 }]}>
            <View style={styles.detailRow}>
              <View>
                <Text style={[styles.subjectTitle, { color: textColor }]}>{materia.nome}</Text>
                <Text style={[styles.subjectSub, { color: subTextColor }]}>{materia.cod}</Text>
              </View>
              <Text style={[styles.gradeBig, { color: materia.nota >= 7 ? '#4CAF50' : '#FF3B30' }]}>{materia.nota}</Text>
            </View>
            
            <Text style={[styles.freqLabel, { color: subTextColor }]}>Frequência: {materia.freq}%</Text>
            
            {/* Barra de Progresso com Marcador de 75% */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${materia.freq}%` }]} />
                {/* Marcador visual de 75% */}
                <View style={styles.marker75} />
              </View>
              <Text style={styles.markerText}>75%</Text>
            </View>

            {/* Mensagem de alerta se a frequência for abaixo de 75% */}
            {materia.freq < 75 && (
              <Text style={styles.warningText}>
                ⚠️ Presença abaixo do aceitável. O aluno deve comparecer mais nas aulas.
              </Text>
            )}
          </View>
        ))}
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
  chartPlaceholder: { height: 160, alignItems: 'center', justifyContent: 'center' },
  circle: { width: 130, height: 130, borderRadius: 65, borderWidth: 8, borderColor: '#B90000', justifyContent: 'center', alignItems: 'center' },
  chartText: { fontSize: 10, color: '#B90000', fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  cardDetail: { padding: 15, borderRadius: 10, borderWidth: 1 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subjectTitle: { fontSize: 16, fontWeight: 'bold' },
  subjectSub: { fontSize: 12 },
  gradeBig: { fontSize: 20, fontWeight: 'bold' },
  freqLabel: { fontSize: 12, marginTop: 10 },
  progressContainer: { marginTop: 5, marginBottom: 5 },
  progressBarBg: { height: 10, backgroundColor: '#e1e1e1', borderRadius: 5, position: 'relative', overflow: 'hidden' },
  progressBarFill: { height: 10, backgroundColor: '#B90000' },
  marker75: { position: 'absolute', left: '75%', top: 0, bottom: 0, width: 2, backgroundColor: '#ffffff', zIndex: 1 },
  markerText: { fontSize: 9, color: '#666', textAlign: 'right', marginRight: '20%' },
  warningText: { color: '#FF3B30', fontSize: 11, fontWeight: 'bold', marginTop: 8, fontStyle: 'italic' }
});