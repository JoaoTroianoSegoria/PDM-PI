import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import { animation, colors, getThemeColors, sharedStyles } from '../styles/styles';
import { useTheme } from '../contexts/ThemeContext';

const MEDIA_APROVACAO = 5;
const NOTA_MAXIMA = 10;
const PESO_P1 = 0.4;
const PESO_P2 = 0.6;

const notaLancada = (nota) => typeof nota === 'number' && !Number.isNaN(nota);

const formatNota = (nota, fallback = 'Não lançada') =>
  notaLancada(nota) ? nota.toFixed(1) : fallback;

const arredondarParaCima = (valor) => Math.max(0, Math.ceil(valor * 10) / 10);

const calcularMedia = (p1, p2) => p1 * PESO_P1 + p2 * PESO_P2;

const calcularMediaFinal = ({ p1, p2, substitutiva }) => {
  if (!notaLancada(p1) || !notaLancada(p2)) {
    return { valor: null, origem: 'Aguardando notas' };
  }

  const opcoes = [{ valor: calcularMedia(p1, p2), origem: 'Sem substitutiva' }];

  if (notaLancada(substitutiva)) {
    opcoes.push(
      { valor: calcularMedia(substitutiva, p2), origem: 'Substituiu a P1' },
      { valor: calcularMedia(p1, substitutiva), origem: 'Substituiu a P2' }
    );
  }

  return opcoes.reduce((melhor, atual) => (atual.valor > melhor.valor ? atual : melhor));
};

const calcularP2Necessaria = (p1) =>
  arredondarParaCima((MEDIA_APROVACAO - p1 * PESO_P1) / PESO_P2);

const calcularSubstitutivaNecessaria = ({ p1, p2 }) => {
  const substituirP1 = arredondarParaCima((MEDIA_APROVACAO - p2 * PESO_P2) / PESO_P1);
  const substituirP2 = arredondarParaCima((MEDIA_APROVACAO - p1 * PESO_P1) / PESO_P2);

  return substituirP1 <= substituirP2
    ? { nota: substituirP1, alvo: 'P1' }
    : { nota: substituirP2, alvo: 'P2' };
};

const getGradeColor = (nota, theme) => {
  if (!notaLancada(nota)) return theme.subText;
  return nota >= MEDIA_APROVACAO ? colors.success : colors.danger;
};

const getDiagnostico = (materia) => {
  if (!notaLancada(materia.p1)) {
    return {
      titulo: 'Calculadora',
      valor: '--',
      texto: 'Aguardando lançamento da P1.',
      cor: colors.mutedText,
    };
  }

  if (!notaLancada(materia.p2)) {
    const necessaria = calcularP2Necessaria(materia.p1);

    return {
      titulo: 'Para passar direto',
      valor: necessaria > NOTA_MAXIMA ? 'Acima de 10' : `P2: ${formatNota(necessaria)}`,
      texto:
        necessaria > NOTA_MAXIMA
          ? 'Mesmo com nota máxima na P2, será preciso substitutiva.'
          : `Com P1 ${formatNota(materia.p1)}, essa é a nota mínima na P2.`,
      cor: necessaria > NOTA_MAXIMA ? colors.danger : colors.primary,
    };
  }

  const mediaFinal = calcularMediaFinal(materia);

  if (mediaFinal.valor >= MEDIA_APROVACAO) {
    return {
      titulo: 'Situação',
      valor: `Média: ${formatNota(mediaFinal.valor)}`,
      texto: `${mediaFinal.origem}. O aluno já alcançou a média mínima.`,
      cor: colors.success,
    };
  }

  const substitutiva = calcularSubstitutivaNecessaria(materia);

  return {
    titulo: 'Para passar',
    valor: substitutiva.nota > NOTA_MAXIMA ? 'Acima de 10' : `Sub: ${formatNota(substitutiva.nota)}`,
    texto:
      substitutiva.nota > NOTA_MAXIMA
        ? 'Mesmo substituindo a melhor prova, não fecha média 7.'
        : `Melhor usar a substitutiva no lugar da ${substitutiva.alvo}.`,
    cor: substitutiva.nota > NOTA_MAXIMA ? colors.danger : colors.primary,
  };
};

export default function BoletimScreen({ navigation }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [expandedId, setExpandedId] = useState(null);
  const theme = getThemeColors(isDarkMode);
  const panelBg = isDarkMode ? '#262626' : '#f7f7f7';

  const materias = [
  { id: '1', nome: 'Computação Gráfica', cod: 'MCA304', p1: 7.5, p2: 8.0, substitutiva: null, freq: 85 },
  { id: '2', nome: 'Cálculo Numérico', cod: 'MAT201', p1: 9.0, p2: 8.2, substitutiva: null, freq: 73 },
  { id: '3', nome: 'Projeto Integrador', cod: 'BDC312', p1: 8.5, p2: 9.7, substitutiva: null, freq: 100 },

  // Disciplina para testar o cálculo da P2 necessária
  { id: '4', nome: 'Banco de Dados', cod: 'BDC205', p1: 6.5, p2: null, substitutiva: null, freq: 82 },
];

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: () => navigation.replace('Login'), style: 'destructive' },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onLogout={handleLogout} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={50}>
          <Text style={[styles.title, { color: theme.text }]}>Boletim de Notas</Text>
          <Text style={[styles.subtitle, { color: theme.subText }]}>Semestre 2026.1</Text>
        </Animatable.View>

        {materias.map((materia, index) => {
          const expanded = expandedId === materia.id;
          const mediaFinal = calcularMediaFinal(materia);
          const diagnostico = getDiagnostico(materia);
          const gradeColor = getGradeColor(mediaFinal.valor, theme);

          return (
            <Animatable.View
              key={materia.id}
              animation="fadeInUp"
              duration={animation.duration}
              delay={450 + index * 100}
            >
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => setExpandedId(expanded ? null : materia.id)}
                style={[styles.cardDetail, { backgroundColor: theme.card, borderColor: theme.border }]}
              >
                <View style={styles.detailRow}>
                  <View style={styles.subjectInfo}>
                    <Text style={[styles.subjectTitle, { color: theme.text }]}>{materia.nome}</Text>
                    <Text style={[styles.subjectSub, { color: theme.subText }]}>{materia.cod}</Text>
                  </View>

                  <View style={styles.gradeArea}>
                    <Text style={[styles.gradeBig, { color: gradeColor }]}>
                      {formatNota(mediaFinal.valor, 'Pendente')}
                    </Text>
                    <Ionicons
                      name={expanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={theme.subText}
                    />
                  </View>
                </View>

                <Text style={[styles.freqLabel, { color: theme.subText }]}>Frequência: {materia.freq}%</Text>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${Math.min(materia.freq, 100)}%` }]} />
                    <View style={styles.marker75} />
                  </View>
                  <Text style={styles.markerText}>75%</Text>
                </View>

                {expanded && (
                  <View style={styles.expandedRow}>

                    <View style={[styles.infoPanel, { backgroundColor: panelBg }]}>
                      <View style={styles.panelTitleRow}>
                        <Ionicons name="document-text-outline" size={16} color={colors.primary} />
                        <Text style={[styles.panelTitle, { color: theme.text }]}>Notas</Text>
                      </View>

                      <View style={styles.noteRow}>
                        <Text style={[styles.noteLabel, { color: theme.subText }]}>Prova 1:</Text>
                        <Text style={[styles.noteValue, { color: theme.text }]}>{formatNota(materia.p1)}</Text>
                      </View>

                      <View style={styles.noteRow}>
                        <Text style={[styles.noteLabel, { color: theme.subText }]}>Prova 2:</Text>
                        <Text style={[styles.noteValue, { color: theme.text }]}>{formatNota(materia.p2)}</Text>
                      </View>

                      <View style={styles.noteRow}>
                        <Text style={[styles.noteLabel, { color: theme.subText }]}>Substitutiva:</Text>
                        <Text style={[styles.noteValue, { color: theme.text }]}>
                          {formatNota(materia.substitutiva)}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.infoPanel, { backgroundColor: panelBg }]}>
                      <View style={styles.panelTitleRow}>
                        <Ionicons name="calculator-outline" size={16} color={diagnostico.cor} />
                        <Text style={[styles.panelTitle, { color: theme.text }]}>{diagnostico.titulo}</Text>
                      </View>

                      <Text style={[styles.calcValue, { color: diagnostico.cor }]}>{diagnostico.valor}</Text>
                      <Text style={[styles.calcText, { color: theme.subText }]}>{diagnostico.texto}</Text>
                    </View>

                  </View>
                )}

                {materia.freq < 75 && (
                  <Text style={styles.warningText}>
                    Presença abaixo do aceitável. O aluno deve comparecer mais nas aulas.
                  </Text>
                )}
              </TouchableOpacity>
            </Animatable.View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ...sharedStyles,
  contentContainer: { paddingBottom: 24 },
  cardDetail: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  subjectInfo: { flex: 1, paddingRight: 12 },
  subjectTitle: { fontSize: 16, fontWeight: 'bold' },
  subjectSub: { fontSize: 12, marginTop: 2 },
  gradeArea: { alignItems: 'flex-end', flexDirection: 'row' },
  gradeBig: { fontSize: 20, fontWeight: 'bold', marginRight: 4 },
  freqLabel: { fontSize: 12, marginTop: 10 },
  progressContainer: { marginTop: 5, marginBottom: 5 },
  progressBarBg: {
    height: 10,
    backgroundColor: '#e1e1e1',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarFill: { height: 10, backgroundColor: colors.primary },
  marker75: {
    position: 'absolute',
    left: '75%',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#6de020',
  },
  markerText: {
    fontSize: 9,
    color: colors.mutedText,
    textAlign: 'right',
    marginRight: '20%',
  },
  expandedRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  infoPanel: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
  panelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  panelTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  calcValue: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calcText: {
    fontSize: 11,
    lineHeight: 15,
  },
  noteRow: {
    marginBottom: 6,
  },
  noteLabel: {
    fontSize: 11,
  },
  noteValue: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 1,
  },
  warningText: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 10,
    fontStyle: 'italic',
  },
});