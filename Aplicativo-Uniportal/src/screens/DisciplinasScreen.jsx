import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import { animation, colors, getThemeColors, sharedStyles } from '../styles/styles';
import { useTheme } from '../contexts/ThemeContext';

export default function DisciplinasScreen({ navigation }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [abaAtual, setAbaAtual] = useState('atuais');
  const theme = getThemeColors(isDarkMode);

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: () => navigation.replace('Login'), style: 'destructive' },
    ]);
  };

  const disciplinasAtuais = [
    { id: '1', nome: 'Cálculo Numérico', cod: 'MAT201', turma: 'Turma A', prof: 'Prof. Valnei Alves Fernandes', horario: 'Segunda-feira 8:15 - 11:00', sala: 'Sala PCA2' },
    { id: '2', nome: 'Computação Gráfica', cod: 'MCA304', turma: 'Turma B', prof: 'Prof. Sofia Mitsuyo Taguchi da Cunha', horario: 'Segunda-feira 11:00 - 12:15', sala: 'Sala PCB1' },
    { id: '3', nome: 'Projeto Integrador', cod: 'BDC312', turma: 'Turma A', prof: 'Prof. Marcelo Alves Farias', horario: 'Sexta-feira 11:00 - 12:15', sala: 'Sala PJB5' },
  ];

  const historico = [
    { id: '1', nome: 'Algoritmos e Estruturas de Dados', cod: 'ALG201', status: 'Aprovado', nota: '8.5', semestre: '2025.2' },
    { id: '2', nome: 'Lógica de Programação', cod: 'LOG100', status: 'Aprovado', nota: '9.0', semestre: '2025.1' },
    { id: '3', nome: 'Matemática Discreta', cod: 'MAT105', status: 'Aprovado', nota: '7.8', semestre: '2025.1' },
  ];

  const getTabTextStyle = (isActive) => [styles.tabText, isActive && styles.activeTabText];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onLogout={handleLogout} />

      <ScrollView style={styles.content}>
        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={50}>
          <View style={[styles.tabContainer, { backgroundColor: theme.tabContainer }]}>
            <TouchableOpacity
              style={[styles.tab, abaAtual === 'atuais' && { backgroundColor: theme.activeTab }]}
              onPress={() => setAbaAtual('atuais')}
            >
              <Text style={getTabTextStyle(abaAtual === 'atuais')}>Disciplinas Atuais</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, abaAtual === 'historico' && { backgroundColor: theme.activeTab }]}
              onPress={() => setAbaAtual('historico')}
            >
              <Text style={getTabTextStyle(abaAtual === 'historico')}>Histórico</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        {abaAtual === 'atuais' ? (
          <View>
            <Animatable.View animation="fadeInUp" duration={animation.duration} delay={150}>
              <Text style={[styles.semesterTitle, { color: theme.text }]}>5º Semestre - 2026</Text>
              <Text style={[styles.subtitle, { color: theme.subText }]}>
                {disciplinasAtuais.length} disciplinas matriculadas
              </Text>
            </Animatable.View>

            {disciplinasAtuais.map((item, index) => (
              <Animatable.View key={item.id} animation="fadeInUp" duration={animation.duration} delay={250 + index * 100}>
                <View style={[styles.card, { backgroundColor: theme.card }]}>
                  <View style={styles.cardHeaderBetween}>
                    <View>
                      <Text style={[styles.subjectName, { color: theme.text }]}>{item.nome}</Text>
                      <Text style={styles.subjectCode}>{item.cod}</Text>
                    </View>
                    <View style={styles.badgeTurma}>
                      <Text style={styles.badgeText}>{item.turma}</Text>
                    </View>
                  </View>

                  <Text style={[styles.infoText, { color: theme.subText }]}>
                    <Ionicons name="person-outline" /> {item.prof}
                  </Text>
                  <Text style={[styles.infoText, { color: theme.subText }]}>
                    <Ionicons name="time-outline" /> {item.horario}
                  </Text>
                  <Text style={[styles.infoText, { color: theme.subText }]}>
                    <Ionicons name="location-outline" /> {item.sala}
                  </Text>
                </View>
              </Animatable.View>
            ))}
          </View>
        ) : (
          <View>
            <Animatable.View animation="fadeInUp" duration={animation.duration} delay={150}>
              <Text style={[styles.semesterTitle, { color: theme.text }]}>Histórico Acadêmico</Text>
              <Text style={[styles.subtitle, { color: theme.subText }]}>Disciplinas concluídas</Text>
            </Animatable.View>

            {historico.map((item, index) => (
              <Animatable.View key={item.id} animation="fadeInUp" duration={animation.duration} delay={250 + index * 100}>
                <View style={[styles.card, { backgroundColor: theme.card, borderColor: colors.success }]}>
                  <View style={styles.cardHeaderBetween}>
                    <View>
                      <Text style={[styles.subjectName, { color: theme.text }]}>{item.nome}</Text>
                      <Text style={styles.subjectCodeApproved}>{item.cod}</Text>
                    </View>
                    <View style={[styles.badgeTurma, { backgroundColor: colors.success }]}>
                      <Text style={styles.badgeText}>{item.status}</Text>
                    </View>
                  </View>

                  <Text style={[styles.infoText, { color: theme.subText }]}>Semestre Letivo: {item.semestre}</Text>
                  <Text style={[styles.infoText, { color: theme.subText, fontWeight: 'bold' }]}>Nota Final: {item.nota}</Text>
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
  semesterTitle: { fontSize: 18, fontWeight: 'bold' },
  card: { borderWidth: 1, borderColor: colors.primary, borderRadius: 12, padding: 15, marginBottom: 15 },
  subjectName: { fontSize: 16, fontWeight: 'bold' },
  subjectCode: { fontSize: 12, color: colors.primary, fontWeight: 'bold' },
  subjectCodeApproved: { color: colors.success, fontWeight: 'bold', fontSize: 12 },
  badgeTurma: { backgroundColor: colors.danger, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  infoText: { fontSize: 13, marginBottom: 4 },
});
