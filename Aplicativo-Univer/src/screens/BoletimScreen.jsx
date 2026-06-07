import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import { animation, colors, getThemeColors, sharedStyles } from '../styles/styles';
import { useTheme } from '../contexts/ThemeContext';

export default function BoletimScreen({ navigation }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const theme = getThemeColors(isDarkMode);

  const materias = [
    { id: '1', nome: 'Computação Gráfica', cod: 'MCA304', nota: 7.8, freq: 85 },
    { id: '2', nome: 'Cálculo Numérico', cod: 'MAT201', nota: 8.5, freq: 73 },
    { id: '3', nome: 'Projeto Integrador', cod: 'BDC312', nota: 9.2, freq: 100 },
  ];

  const mediaGeral = (materias.reduce((acc, curr) => acc + curr.nota, 0) / materias.length).toFixed(1);
  const freqMedia = Math.round(materias.reduce((acc, curr) => acc + curr.freq, 0) / materias.length);

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: () => navigation.replace('Login'), style: 'destructive' },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onLogout={handleLogout} />

      <ScrollView style={styles.content}>
        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={50}>
          <Text style={[styles.title, { color: theme.text }]}>Boletim de Notas</Text>
          <Text style={[styles.subtitle, { color: theme.subText }]}>Semestre 2026.1</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={150}>
          <View style={styles.row}>
            <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.summaryLabel, { color: theme.subText }]}>Média Geral</Text>
              <Text style={styles.summaryValue}>{mediaGeral}</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.summaryLabel, { color: theme.subText }]}>Frequência Média</Text>
              <Text style={styles.summaryValue}>{freqMedia}%</Text>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={250}>
          <View style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.subText }]}>Distribuição de Notas</Text>
            <View style={styles.chartPlaceholder}>
              <View style={styles.circle}>
                {materias.map((materia) => (
                  <Text key={materia.id} style={styles.chartText}>
                    {materia.cod}: {materia.nota}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={350}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Detalhamento por Disciplina</Text>
        </Animatable.View>

        {materias.map((materia, index) => (
          <Animatable.View key={materia.id} animation="fadeInUp" duration={animation.duration} delay={450 + index * 100}>
            <View style={[styles.cardDetail, { backgroundColor: theme.card, borderColor: theme.border, marginBottom: 15 }]}>
              <View style={styles.detailRow}>
                <View>
                  <Text style={[styles.subjectTitle, { color: theme.text }]}>{materia.nome}</Text>
                  <Text style={[styles.subjectSub, { color: theme.subText }]}>{materia.cod}</Text>
                </View>
                <Text style={[styles.gradeBig, { color: materia.nota >= 7 ? colors.success : colors.danger }]}>
                  {materia.nota}
                </Text>
              </View>

              <Text style={[styles.freqLabel, { color: theme.subText }]}>Frequência: {materia.freq}%</Text>

              <View style={styles.progressContainer}>
                <View style={[styles.progressBarBg, { backgroundColor: theme.marker }]}>
                  <View style={[styles.progressBarFill, { width: `${materia.freq}%` }]} />
                  <View style={styles.marker75} />
                </View>
                <Text style={styles.markerText}>75%</Text>
              </View>

              {materia.freq < 75 && (
                <Text style={styles.warningText}>
                  Presença abaixo do aceitável. O aluno deve comparecer mais nas aulas.
                </Text>
              )}
            </View>
          </Animatable.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ...sharedStyles,
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  summaryCard: { width: '48%', padding: 15, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  summaryLabel: { fontSize: 12 },
  summaryValue: { fontSize: 32, fontWeight: 'bold', color: colors.primary },
  chartCard: { padding: 15, borderRadius: 10, borderWidth: 1, marginBottom: 20 },
  cardTitle: { fontSize: 14, marginBottom: 10 },
  chartPlaceholder: { height: 160, alignItems: 'center', justifyContent: 'center' },
  circle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 8,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartText: { fontSize: 10, color: colors.primary, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  cardDetail: { padding: 15, borderRadius: 10, borderWidth: 1 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subjectTitle: { fontSize: 16, fontWeight: 'bold' },
  subjectSub: { fontSize: 12 },
  gradeBig: { fontSize: 20, fontWeight: 'bold' },
  freqLabel: { fontSize: 12, marginTop: 10 },
  progressContainer: { marginTop: 5, marginBottom: 5 },
  progressBarBg: { height: 10, borderRadius: 5, position: 'relative', overflow: 'hidden' },
  progressBarFill: { height: 10, backgroundColor: colors.primary },
  marker75: { position: 'absolute', left: '75%', top: 0, bottom: 0, width: 7, backgroundColor: colors.success, zIndex: 1 },
  markerText: { fontSize: 9, color: colors.mutedText, textAlign: 'right', marginRight: '20%' },
  warningText: { color: colors.danger, fontSize: 11, fontWeight: 'bold', marginTop: 8, fontStyle: 'italic' },
});
