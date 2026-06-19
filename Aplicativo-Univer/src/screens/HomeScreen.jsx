import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import StatusView from '../components/StatusView';
import { animation, colors, getThemeColors, sharedStyles, theme as uiTheme } from '../styles/styles';
import { useTheme } from '../contexts/ThemeContext';
import { useUniver } from '../contexts/UniverContext';

const MEDIA_APROVACAO = 5;
const PESO_P1 = 0.4;
const PESO_P2 = 0.6;

const notaLancada = (nota) => typeof nota === 'number' && !Number.isNaN(nota);

function getMediaFinal({ p1, p2, substitutiva }) {
  if (!notaLancada(p1) || !notaLancada(p2)) return null;

  const medias = [p1 * PESO_P1 + p2 * PESO_P2];
  if (notaLancada(substitutiva)) {
    medias.push(substitutiva * PESO_P1 + p2 * PESO_P2);
    medias.push(p1 * PESO_P1 + substitutiva * PESO_P2);
  }

  return Math.max(...medias);
}

function buildSemesterSummary({ activeLoan, grades, pendingInvoice, totalDisciplines }) {
  const graded = grades
    .map((grade) => ({ ...grade, media: getMediaFinal(grade) }))
    .filter((grade) => grade.media !== null);
  const approved = graded.filter((grade) => grade.media >= MEDIA_APROVACAO && grade.freq >= 75).length;
  const attention = grades.filter((grade) => {
    const media = getMediaFinal(grade);
    return grade.freq < 75 || media === null || media < MEDIA_APROVACAO;
  }).length;
  const pendingNotes = grades.filter((grade) => !notaLancada(grade.p1) || !notaLancada(grade.p2)).length;
  const pendingItems = [pendingInvoice, activeLoan].filter(Boolean).length;

  if (grades.length === 0) {
    return {
      title: `${totalDisciplines} disciplinas em andamento.`,
      text: 'As informações do semestre ainda estão sendo carregadas. Confira boletim e disciplinas para acompanhar notas e frequência.',
      approved,
      attention,
      pendingItems,
    };
  }

  const title = attention > 0
    ? `${attention} disciplina${attention === 1 ? '' : 's'} exigem atenção.`
    : 'Semestre em situação tranquila.';

  const text = [
    `${approved} de ${grades.length} disciplinas já aparecem em condição favorável pelo boletim.`,
    pendingNotes > 0
      ? `${pendingNotes} ainda dependem de lançamento de notas.`
      : 'As médias lançadas já podem ser acompanhadas por disciplina.',
    pendingItems > 0
      ? `${pendingItems} pendência${pendingItems === 1 ? '' : 's'} precisam ser verificadas.`
      : 'Não há pendências principais no momento.',
  ].join(' ');

  return { title, text, approved, attention, pendingItems };
}

export default function HomeScreen({ navigation }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const { dashboard, disciplines, error, grades, loading, logout, refresh, user } = useUniver();
  const theme = getThemeColors(isDarkMode);
  const isCompact = width < 720;

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: logout, style: 'destructive' },
    ]);
  };

  if (loading && !dashboard) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusView isDarkMode={isDarkMode} message="Carregando portal..." />
      </SafeAreaView>
    );
  }

  if (error && !dashboard) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusView error={error} isDarkMode={isDarkMode} onRetry={refresh} />
      </SafeAreaView>
    );
  }

  const student = dashboard?.student ?? user ?? {};
  const firstName = student.firstName ?? student.name?.split(' ')[0] ?? 'Aluno';
  const todayClass = dashboard?.todayClass;
  const pendingInvoice = dashboard?.pendingInvoice;
  const activeLoan = dashboard?.activeLoan;
  const totalDisciplines = disciplines.current.length || grades.length;
  const frequenciaMedia =
    grades.length > 0
      ? Math.round(grades.reduce((sum, grade) => sum + (grade.freq ?? 0), 0) / grades.length)
      : 0;
  const dateLabel = dashboard?.dateLabel ?? 'Agenda acadêmica';
  const semesterSummary = buildSemesterSummary({
    activeLoan,
    grades,
    pendingInvoice,
    totalDisciplines,
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader
        isDarkMode={isDarkMode}
        onLogout={handleLogout}
        onToggleTheme={toggleTheme}
        subtitle={dateLabel}
        title={`Olá, ${firstName}`}
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={50}>
          <View style={[styles.heroCard, isCompact && styles.heroCardCompact, { backgroundColor: colors.primary }, theme.shadow]}>
            <View style={styles.heroTextBlock}>
              <Text style={styles.heroEyebrow}>Resumo do semestre</Text>
              <Text style={styles.heroTitle}>{semesterSummary.title}</Text>
              <Text style={styles.heroText}>{semesterSummary.text}</Text>
            </View>

            <View style={[styles.heroSide, isCompact && styles.heroSideCompact]}>
              <View style={styles.heroMiniGrid}>
                <HeroMini label="Favoráveis" value={String(semesterSummary.approved)} />
                <HeroMini label="Atenção" value={String(semesterSummary.attention)} />
                <HeroMini label="Pendências" value={String(semesterSummary.pendingItems)} />
              </View>
              <TouchableOpacity style={styles.heroButton} onPress={() => navigation.navigate('Boletim')}>
                <Text style={styles.heroButtonText}>Ver boletim</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.primaryDark} />
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>

        <View style={styles.summaryGrid}>
          <SummaryCard
            icon="calendar"
            iconBg={isDarkMode ? '#3a1d2a' : '#f7dce2'}
            iconColor={colors.primary}
            label="Aulas hoje"
            value={todayClass ? '1' : '0'}
            detail="Disciplinas programadas"
            theme={theme}
          />
          <SummaryCard
            icon="checkmark-circle"
            iconBg={isDarkMode ? '#17342a' : '#dff7ec'}
            iconColor={colors.success}
            label="Frequência média"
            value={`${frequenciaMedia}%`}
            detail="Média nas disciplinas"
            theme={theme}
          />
          <SummaryCard
            icon="book"
            iconBg={isDarkMode ? '#1d2b49' : '#e2eafd'}
            iconColor={colors.info}
            label="Disciplinas"
            value={String(totalDisciplines)}
            detail={`${semesterSummary.attention} exigem atenção`}
            theme={theme}
          />
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>Agenda acadêmica</Text>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Aulas de hoje</Text>
          </View>
        </View>

        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={120}>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, theme.shadow]}>
            {todayClass ? (
              <>
                <View style={styles.cardHeaderBetween}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={[styles.subjectText, { color: theme.text }]}>{todayClass.subjectName}</Text>
                    <Text style={[styles.profText, { color: theme.subText }]}>{todayClass.professor}</Text>
                  </View>
                  <View style={[styles.badgeSoft, { backgroundColor: colors.primaryTint }]}>
                    <Text style={[styles.badgeSoftText, { color: colors.primaryDark }]}>{todayClass.timeRange}</Text>
                  </View>
                </View>
                <View style={styles.infoLine}>
                  <Ionicons name="location-outline" size={17} color={colors.primary} />
                  <Text style={[styles.infoText, { color: theme.subText }]}>{todayClass.room}</Text>
                </View>
              </>
            ) : (
              <>
                <Text style={[styles.subjectText, { color: theme.text }]}>Nenhuma aula cadastrada para hoje</Text>
                <Text style={[styles.infoText, { color: theme.subText }]}>
                  Aproveite para revisar suas disciplinas ou conferir o boletim.
                </Text>
              </>
            )}
          </View>
        </Animatable.View>

        {(pendingInvoice || activeLoan) && (
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>Atenção</Text>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Pendências</Text>
            </View>
          </View>
        )}

        {pendingInvoice && (
          <Animatable.View animation="fadeInUp" duration={animation.duration} delay={160}>
            <View style={[styles.alertCard, { backgroundColor: theme.card, borderColor: theme.border }, theme.shadow]}>
              <View style={styles.cardHeaderBetween}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[styles.subjectText, { color: theme.text }]}>Cobrança</Text>
                  <Text style={[styles.infoText, { color: theme.subText }]}>Mensalidade {pendingInvoice.mes}</Text>
                </View>
                <View style={[styles.badgeSoft, { backgroundColor: '#fff1d6' }]}>
                  <Text style={[styles.badgeSoftText, { color: '#c56800' }]}>{pendingInvoice.status}</Text>
                </View>
              </View>
              <Text style={[styles.infoText, { color: theme.text }]}>Vencimento: {pendingInvoice.vencimento}</Text>
              <Text style={[styles.valueText, { color: theme.text }]}>{pendingInvoice.valor}</Text>
              <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Faturas')}>
                <Text style={styles.primaryButtonText}>Ver faturas</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        )}

        {activeLoan && (
          <Animatable.View animation="fadeInUp" duration={animation.duration} delay={200}>
            <View style={[styles.alertCard, { backgroundColor: theme.card, borderColor: theme.border }, theme.shadow]}>
              <View style={styles.cardHeaderBetween}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[styles.subjectText, { color: theme.text }]}>Biblioteca</Text>
                  <Text style={[styles.infoText, { color: theme.subText }]}>{activeLoan.title}</Text>
                </View>
                <View style={[styles.badgeSoft, { backgroundColor: colors.primaryTint }]}>
                  <Text style={[styles.badgeSoftText, { color: colors.primaryDark }]}>{activeLoan.delayText}</Text>
                </View>
              </View>
              <Text style={[styles.infoText, { color: theme.text }]}>Prazo: {activeLoan.dueDate}</Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => Alert.alert('Devolução', 'Dirija-se ao balcão da biblioteca para devolver o exemplar.')}
              >
                <Text style={styles.primaryButtonText}>Realizar devolução</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function HeroMini({ label, value }) {
  return (
    <View style={styles.heroMini}>
      <Text style={styles.heroMiniValue}>{value}</Text>
      <Text style={styles.heroMiniLabel}>{label}</Text>
    </View>
  );
}

function SummaryCard({ detail, icon, iconBg, iconColor, label, theme, value }) {
  return (
    <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }, theme.shadow]}>
      <View style={[styles.summaryIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={styles.summaryValueRow}>
          <Text style={[styles.summaryLabel, { color: theme.subText }]} numberOfLines={1}>{label}</Text>
          <Text style={[styles.summaryValue, { color: theme.text }]}>{value}</Text>
        </View>
        <Text style={[styles.summaryDetail, { color: theme.subText }]}>{detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ...sharedStyles,
  heroCard: {
    borderRadius: uiTheme.radius.lg,
    padding: 22,
    marginBottom: 22,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 18,
  },
  heroCardCompact: {
    flexDirection: 'column',
  },
  heroTextBlock: { flex: 1, minWidth: 0 },
  heroEyebrow: {
    color: '#ffe66d',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0,
    marginBottom: 10,
  },
  heroTitle: { color: colors.white, fontSize: 24, lineHeight: 30, fontWeight: '900' },
  heroText: { color: '#ffe5e9', fontSize: 14, lineHeight: 21, marginTop: 8 },
  heroSide: {
    width: 250,
    justifyContent: 'space-between',
    gap: 14,
  },
  heroSideCompact: {
    width: '100%',
  },
  heroMiniGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  heroMini: {
    flex: 1,
    borderRadius: uiTheme.radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 9,
    paddingVertical: 10,
  },
  heroMiniValue: { color: colors.white, fontSize: 20, fontWeight: '900' },
  heroMiniLabel: { color: '#ffe5e9', fontSize: 10, fontWeight: '800', marginTop: 2 },
  heroButton: {
    backgroundColor: colors.white,
    borderRadius: uiTheme.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  heroButtonText: { color: colors.primaryDark, fontSize: 14, fontWeight: '900' },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 28,
  },
  summaryCard: {
    flex: 1,
    minWidth: 190,
    borderWidth: 1,
    borderRadius: uiTheme.radius.md,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryValueRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryLabel: { fontSize: 13 },
  summaryValue: { fontSize: 20, fontWeight: '900' },
  summaryDetail: { fontSize: 12, lineHeight: 16, marginTop: 6 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: uiTheme.radius.md,
    padding: 18,
    marginBottom: 22,
  },
  cardHeaderBetween: {
    ...sharedStyles.cardHeaderBetween,
    flexWrap: 'wrap',
  },
  alertCard: {
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderRadius: uiTheme.radius.md,
    padding: 18,
    marginBottom: 16,
  },
  subjectText: { fontSize: 18, fontWeight: '900' },
  profText: { fontSize: 14, marginTop: 6 },
  infoLine: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  infoText: { fontSize: 14, lineHeight: 20 },
  badgeSoft: {
    borderRadius: uiTheme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  badgeSoftText: { fontSize: 11, fontWeight: '900' },
  valueText: { fontSize: 24, fontWeight: '900', marginVertical: 14 },
});
