import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import StatusView from '../components/StatusView';
import { animation, colors, getThemeColors, sharedStyles, theme as uiTheme } from '../styles/styles';
import { useTheme } from '../contexts/ThemeContext';
import { useUniver } from '../contexts/UniverContext';

const MEDIA_APROVACAO = 5;
const NOTA_MAXIMA = 10;
const PESO_P1 = 0.4;
const PESO_P2 = 0.6;

const notaLancada = (nota) => typeof nota === 'number' && !Number.isNaN(nota);
const formatNota = (nota, fallback = 'Não lançada') => (notaLancada(nota) ? nota.toFixed(1) : fallback);
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

const formatP2 = (materia) => {
  if (notaLancada(materia.p2)) return formatNota(materia.p2);
  if (!notaLancada(materia.p1)) return formatNota(materia.p2);

  const necessaria = calcularP2Necessaria(materia.p1);
  return necessaria > NOTA_MAXIMA ? 'Acima de 10' : `Precisa ${formatNota(necessaria)}`;
};

const getP2Detail = (materia) => {
  if (notaLancada(materia.p2)) return 'nota lançada';
  if (!notaLancada(materia.p1)) return 'aguardando P1';
  return 'para média 5';
};

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

const getGradeStatus = (materia, mediaFinal) => {
  if (!notaLancada(mediaFinal.valor)) return { label: 'Cursando', tone: 'neutral' };
  if (mediaFinal.valor >= MEDIA_APROVACAO) return { label: 'Aprovado', tone: 'success' };
  return notaLancada(materia.substitutiva)
    ? { label: 'Reprovado', tone: 'danger' }
    : { label: 'Precisa de substitutiva', tone: 'warning' };
};

const getSubstitutivaInfo = (materia) => {
  if (notaLancada(materia.substitutiva)) {
    return { value: formatNota(materia.substitutiva), detail: 'nota lançada', tone: 'default' };
  }
  if (!notaLancada(materia.p2)) {
    return { value: 'Aguardando P2', detail: 'cálculo após a nota', tone: 'accent' };
  }
  const mediaFinal = calcularMediaFinal(materia);
  if (mediaFinal.valor >= MEDIA_APROVACAO) {
    return { value: 'Dispensada', detail: 'média suficiente', tone: 'success' };
  }
  const substitutiva = calcularSubstitutivaNecessaria(materia);
  return {
    value: substitutiva.nota > NOTA_MAXIMA ? 'Acima de 10' : `Precisa ${formatNota(substitutiva.nota)}`,
    detail: `substituir ${substitutiva.alvo}`,
    tone: substitutiva.nota > NOTA_MAXIMA ? 'danger' : 'accent',
  };
};

const getDetailMessage = (materia, mediaFinal) => {
  if (!notaLancada(materia.p1)) return 'Aguardando lançamento da P1.';
  if (!notaLancada(materia.p2)) return 'Sem necessidade de substitutiva no momento.';
  if (mediaFinal.valor >= MEDIA_APROVACAO) return `${mediaFinal.origem}. Média suficiente no momento.`;
  if (notaLancada(materia.substitutiva)) return 'Substitutiva lançada e média final calculada.';
  return 'Substitutiva recomendada para tentar alcançar a média mínima.';
};

export default function BoletimScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { dashboard, disciplines, error, grades, loading, logout, refresh } = useUniver();
  const [expandedId, setExpandedId] = useState(null);
  const theme = getThemeColors(isDarkMode);

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: logout, style: 'destructive' },
    ]);
  };

  if (loading && grades.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusView isDarkMode={isDarkMode} message="Carregando boletim..." />
      </SafeAreaView>
    );
  }

  if (error && grades.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusView error={error} isDarkMode={isDarkMode} onRetry={refresh} />
      </SafeAreaView>
    );
  }

  const statusSummary = grades.reduce(
    (acc, materia) => {
      const mediaFinal = calcularMediaFinal(materia);
      const status = getGradeStatus(materia, mediaFinal);
      acc[status.tone] = (acc[status.tone] ?? 0) + 1;
      return acc;
    },
    { success: 0, warning: 0, danger: 0, neutral: 0 }
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader
        isDarkMode={isDarkMode}
        onLogout={handleLogout}
        onToggleTheme={toggleTheme}
        subtitle={dashboard?.dateLabel ?? 'Semestre 2026.1'}
        title="Boletim de Notas"
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryGrid}>
          <SummaryMetric title="Disciplinas" value={String(grades.length)} detail="Médias individuais" theme={theme} />
          <SummaryMetric title="Frequência mínima" value="75%" detail="Média mínima: 5.0" theme={theme} />
          <View style={[styles.summaryWide, { backgroundColor: theme.card, borderColor: theme.border }, theme.shadow]}>
            <Text style={[styles.metricTitle, { color: theme.subText }]}>Situação por disciplina</Text>
            <View style={styles.badgeRow}>
              <ToneBadge tone="success" label={`${statusSummary.success} Aprovadas`} />
              <ToneBadge tone="warning" label={`${statusSummary.warning} Em atenção`} />
              <ToneBadge tone="danger" label={`${statusSummary.danger} Reprovadas`} />
            </View>
            <Text style={[styles.metricDetail, { color: theme.subText }]}>
              Notas e cálculo ficam nos detalhes.
            </Text>
          </View>
        </View>

        {grades.map((materia, index) => {
          const expanded = expandedId === materia.id;
          const mediaFinal = calcularMediaFinal(materia);
          const gradeColor = getGradeColor(mediaFinal.valor, theme);
          const status = getGradeStatus(materia, mediaFinal);
          const progressColor = materia.freq >= 75 ? colors.success : colors.warning;
          const classDetails = disciplines.current.find((item) => item.cod === materia.cod) ?? {};
          const substitutivaInfo = getSubstitutivaInfo(materia);

          return (
            <Animatable.View key={materia.id} animation="fadeInUp" duration={animation.duration} delay={100 + index * 70}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setExpandedId(expanded ? null : materia.id)}
                style={[styles.gradeCard, { backgroundColor: theme.card, borderColor: theme.border }, theme.shadow]}
              >
                <View style={styles.gradeHeader}>
                  <View style={styles.subjectInfo}>
                    <Text style={[styles.subjectTitle, { color: theme.text }]}>{materia.nome}</Text>
                    <Text style={[styles.subjectSub, { color: theme.subText }]}>{materia.cod}</Text>
                  </View>

                  <View style={styles.gradeSummary}>
                    <ToneBadge tone={status.tone} label={status.label} />
                    <View style={styles.gradeValueRow}>
                      <Text style={[styles.gradeBig, { color: gradeColor }]}>
                        {formatNota(mediaFinal.valor, 'Pendente')}
                      </Text>
                      <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={theme.subText} />
                    </View>
                  </View>
                </View>

                <View style={styles.freqLine}>
                  <Text style={[styles.freqLabel, { color: theme.subText }]}>Frequência</Text>
                  <Text style={[styles.freqValue, { color: progressColor }]}>{materia.freq}%</Text>
                </View>

                <View style={styles.progressContainer}>
                  <View style={[styles.progressBarBg, { backgroundColor: theme.progressTrack }]}>
                    <View style={[styles.progressBarFill, { width: `${Math.min(materia.freq, 100)}%`, backgroundColor: progressColor }]} />
                    <View style={styles.marker75} />
                  </View>
                  <View style={styles.markerLabels}>
                    <Text style={[styles.markerText, { color: theme.subText }]}>0%</Text>
                    <Text style={styles.marker75Text}>75% mínimo</Text>
                    <Text style={[styles.markerText, { color: theme.subText }]}>100%</Text>
                  </View>
                </View>

                {expanded && (
                  <View style={styles.expandedArea}>
                    <View style={styles.detailCardsGrid}>
                      <GradeDetailCard
                        detail="P1"
                        icon="1"
                        isDarkMode={isDarkMode}
                        label="P1"
                        theme={theme}
                        value={formatNota(materia.p1)}
                      />
                      <GradeDetailCard
                        detail={getP2Detail(materia)}
                        icon="2"
                        isDarkMode={isDarkMode}
                        label="P2"
                        theme={theme}
                        tone={!notaLancada(materia.p2) && notaLancada(materia.p1) ? 'accent' : 'default'}
                        value={formatP2(materia)}
                      />
                      <GradeDetailCard
                        detail={substitutivaInfo.detail}
                        icon="sync"
                        isDarkMode={isDarkMode}
                        label="Substitutiva"
                        theme={theme}
                        tone={substitutivaInfo.tone}
                        value={substitutivaInfo.value}
                      />
                      <GradeDetailCard
                        detail={mediaFinal.origem}
                        icon="school"
                        isDarkMode={isDarkMode}
                        label="Média final"
                        theme={theme}
                        tone={notaLancada(mediaFinal.valor) ? (mediaFinal.valor >= MEDIA_APROVACAO ? 'success' : 'danger') : 'final'}
                        value={formatNota(mediaFinal.valor)}
                      />
                    </View>

                    <View style={[styles.detailMessage, { backgroundColor: theme.cardAlt }]}>
                      <Text style={[styles.detailMessageText, { color: theme.subText }]}>
                        {getDetailMessage(materia, mediaFinal)}
                      </Text>
                    </View>

                    {(classDetails.sala || classDetails.turma) && (
                      <View style={styles.classMetaRow}>
                        {classDetails.sala && (
                          <Text style={[styles.classMetaText, { color: theme.subText }]}>
                            <Text style={[styles.classMetaStrong, { color: theme.text }]}>Sala: </Text>
                            {classDetails.sala}
                          </Text>
                        )}
                        {classDetails.turma && (
                          <Text style={[styles.classMetaText, { color: theme.subText }]}>
                            <Text style={[styles.classMetaStrong, { color: theme.text }]}>Turma: </Text>
                            {classDetails.turma}
                          </Text>
                        )}
                      </View>
                    )}
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

function SummaryMetric({ detail, theme, title, value }) {
  return (
    <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }, theme.shadow]}>
      <Text style={[styles.metricTitle, { color: theme.subText }]}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={[styles.metricDetail, { color: theme.subText }]}>{detail}</Text>
    </View>
  );
}

function ToneBadge({ label, tone }) {
  const tones = {
    success: { bg: '#dff7ec', fg: colors.success },
    warning: { bg: '#fff1d6', fg: colors.warning },
    danger: { bg: '#f7dce2', fg: colors.primaryDark },
    neutral: { bg: '#eef0f3', fg: colors.mutedText },
  };
  const current = tones[tone] ?? tones.neutral;

  return (
    <View style={[styles.toneBadge, { backgroundColor: current.bg }]}>
      <Text style={[styles.toneBadgeText, { color: current.fg }]}>{label}</Text>
    </View>
  );
}

function GradeDetailCard({ detail, icon, isDarkMode, label, theme, tone = 'default', value }) {
  const isFinal = tone === 'final';
  const toneColor = {
    accent: colors.primarySoft,
    danger: colors.danger,
    default: theme.text,
    final: isDarkMode ? '#ff5b6f' : colors.primaryDark,
    success: colors.success,
  }[tone] ?? theme.text;

  return (
    <View
      style={[
        styles.detailCard,
        {
          backgroundColor: isFinal ? (isDarkMode ? '#2a1820' : '#fff4f6') : theme.cardAlt,
          borderColor: isFinal ? (isDarkMode ? '#6f3040' : '#f0c7cf') : theme.border,
        },
      ]}
    >
      <View style={styles.detailCardHeader}>
        <View style={[styles.detailIcon, { backgroundColor: isDarkMode ? '#3b2030' : '#f7dce2' }]}>
          {Number.isNaN(Number(icon)) ? (
            <Ionicons name={icon} size={13} color={colors.primarySoft} />
          ) : (
            <Text style={styles.detailIconText}>{icon}</Text>
          )}
        </View>
        <Text style={[styles.detailCardLabel, { color: theme.subText }]} numberOfLines={1}>{label}</Text>
      </View>
      <Text style={[styles.detailCardValue, { color: toneColor }]} numberOfLines={2}>{value}</Text>
      <Text style={[styles.detailCardDetail, { color: theme.subText }]} numberOfLines={2}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ...sharedStyles,
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: 145,
    borderWidth: 1,
    borderRadius: uiTheme.radius.md,
    padding: 12,
  },
  summaryWide: {
    flex: 1.25,
    minWidth: 170,
    borderWidth: 1,
    borderRadius: uiTheme.radius.md,
    padding: 12,
  },
  metricTitle: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0,
  },
  metricValue: { color: colors.primaryDark, fontSize: 26, fontWeight: '900', marginTop: 8, marginBottom: 4 },
  metricDetail: { fontSize: 11, lineHeight: 15, marginTop: 6 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  gradeCard: {
    padding: 18,
    borderRadius: uiTheme.radius.md,
    borderWidth: 1,
    marginBottom: 14,
  },
  gradeHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  subjectInfo: { flex: 1, minWidth: 0, paddingRight: 6 },
  subjectTitle: { fontSize: 17, fontWeight: '900' },
  subjectSub: { fontSize: 12, marginTop: 4 },
  gradeSummary: {
    alignItems: 'flex-end',
    gap: 8,
    minWidth: 132,
    maxWidth: 210,
  },
  gradeValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gradeBig: { fontSize: 28, fontWeight: '900' },
  toneBadge: {
    borderRadius: uiTheme.radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 5,
    alignSelf: 'flex-end',
  },
  toneBadgeText: { fontSize: 10, fontWeight: '900' },
  freqLine: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 14 },
  freqLabel: { fontSize: 13 },
  freqValue: { fontSize: 13, fontWeight: '900' },
  progressContainer: { marginTop: 8 },
  progressBarBg: {
    height: 7,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarFill: { height: 7, borderRadius: 6 },
  marker75: {
    position: 'absolute',
    left: '75%',
    top: -2,
    bottom: -2,
    width: 3,
    backgroundColor: colors.warning,
  },
  markerLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  markerText: { fontSize: 10 },
  marker75Text: { fontSize: 10, color: colors.warning, fontWeight: '900' },
  expandedArea: { marginTop: 14 },
  detailCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailCard: {
    flex: 1,
    minWidth: 118,
    borderRadius: uiTheme.radius.sm,
    borderWidth: 1,
    padding: 9,
  },
  detailCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  detailIcon: {
    width: 21,
    height: 21,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailIconText: { color: colors.primarySoft, fontSize: 12, fontWeight: '900' },
  detailCardLabel: {
    flex: 1,
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  detailCardValue: { fontSize: 16, fontWeight: '900', lineHeight: 20 },
  detailCardDetail: { fontSize: 10, fontWeight: '800', lineHeight: 13, marginTop: 1 },
  detailMessage: {
    borderRadius: uiTheme.radius.sm,
    padding: 10,
    marginTop: 10,
  },
  detailMessageText: { fontSize: 11, fontWeight: '800', lineHeight: 15 },
  classMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 10,
  },
  classMetaText: { fontSize: 11, fontWeight: '800' },
  classMetaStrong: { fontWeight: '900' },
  warningText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 12,
  },
});
