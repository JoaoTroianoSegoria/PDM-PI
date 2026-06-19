import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import StatusView from '../components/StatusView';
import { animation, colors, getThemeColors, sharedStyles, theme as uiTheme } from '../styles/styles';
import { useTheme } from '../contexts/ThemeContext';
import { useUniver } from '../contexts/UniverContext';

export default function DisciplinasScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { dashboard, disciplines, error, loading, logout, refresh } = useUniver();
  const { width } = useWindowDimensions();
  const [abaAtual, setAbaAtual] = useState('atuais');
  const theme = getThemeColors(isDarkMode);
  const isTable = width >= 760;

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: logout, style: 'destructive' },
    ]);
  };

  if (loading && disciplines.current.length === 0 && disciplines.history.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusView isDarkMode={isDarkMode} message="Carregando disciplinas..." />
      </SafeAreaView>
    );
  }

  if (error && disciplines.current.length === 0 && disciplines.history.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusView error={error} isDarkMode={isDarkMode} onRetry={refresh} />
      </SafeAreaView>
    );
  }

  const items = abaAtual === 'atuais' ? disciplines.current : disciplines.history;
  const countLabel = abaAtual === 'atuais'
    ? `${disciplines.current.length} cadastradas`
    : `${disciplines.history.length} concluídas`;
  const getTabTextStyle = (isActive) => [styles.tabText, { color: isActive ? colors.white : theme.subText }, isActive && styles.activeTabText];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader
        isDarkMode={isDarkMode}
        onLogout={handleLogout}
        onToggleTheme={toggleTheme}
        subtitle={dashboard?.dateLabel ?? 'Disciplinas matriculadas'}
        title="Minhas Disciplinas"
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={50}>
          <View style={styles.toolbar}>
            <View style={[styles.tabContainer, { backgroundColor: theme.tabContainer, borderColor: theme.border }]}>
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

            <Text style={[styles.countText, { color: theme.subText }]}>{countLabel}</Text>
          </View>
        </Animatable.View>

        <View style={styles.listTitleRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {abaAtual === 'atuais' ? 'Listagem de Disciplinas' : 'Histórico Acadêmico'}
          </Text>
        </View>

        {isTable ? (
          <Animatable.View animation="fadeInUp" duration={animation.duration} delay={120}>
            <View style={[styles.table, { backgroundColor: theme.card, borderColor: theme.border }, theme.shadow]}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeadText, styles.colSubject]}>Disciplina</Text>
                <Text style={[styles.tableHeadText, styles.colProfessor]}>Professor</Text>
                <Text style={[styles.tableHeadText, styles.colSchedule]}>Dias e horários</Text>
                <Text style={[styles.tableHeadText, styles.colRoom]}>
                  {abaAtual === 'atuais' ? 'Local' : 'Resultado'}
                </Text>
              </View>

              {items.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.tableRow,
                    { backgroundColor: index % 2 === 0 ? theme.card : theme.cardAlt },
                    index === items.length - 1 && styles.tableRowLast,
                  ]}
                >
                  <View style={styles.colSubject}>
                    <Text style={[styles.subjectName, { color: theme.text }]}>{item.nome}</Text>
                    <Text style={styles.subjectCode}>{item.cod}</Text>
                  </View>
                  <Text style={[styles.tableCellText, styles.colProfessor, { color: theme.text }]}>{item.prof}</Text>
                  <Text style={[styles.tableCellText, styles.colSchedule, { color: theme.text }]}>{item.horario}</Text>
                  <View style={styles.colRoom}>
                    {abaAtual === 'atuais' ? (
                      <Text style={[styles.tableCellText, { color: theme.text }]}>{item.sala}</Text>
                    ) : (
                      <View style={styles.resultBlock}>
                        <StatusBadge status={item.status} />
                        <Text style={[styles.noteText, { color: theme.text }]}>Nota {item.nota}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </Animatable.View>
        ) : (
          items.map((item, index) => (
            <Animatable.View key={item.id} animation="fadeInUp" duration={animation.duration} delay={120 + index * 70}>
              <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }, theme.shadow]}>
                <View style={styles.cardHeaderBetween}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={[styles.subjectName, { color: theme.text }]}>{item.nome}</Text>
                    <Text style={styles.subjectCode}>{item.cod}</Text>
                  </View>
                  {abaAtual === 'atuais' ? (
                    <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.badgeText}>{item.turma}</Text>
                    </View>
                  ) : (
                    <StatusBadge status={item.status} />
                  )}
                </View>

                <InfoLine icon="person-outline" text={item.prof} theme={theme} />
                {abaAtual === 'atuais' ? (
                  <>
                    <InfoLine icon="time-outline" text={item.horario} theme={theme} />
                    <InfoLine icon="location-outline" text={item.sala} theme={theme} />
                  </>
                ) : (
                  <>
                    <InfoLine icon="calendar-outline" text={`Semestre letivo: ${item.semestre}`} theme={theme} />
                    <InfoLine icon="ribbon-outline" text={`Nota final: ${item.nota}`} theme={theme} />
                  </>
                )}
              </View>
            </Animatable.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoLine({ icon, text, theme }) {
  return (
    <View style={styles.infoLine}>
      <Ionicons name={icon} size={17} color={colors.primary} />
      <Text style={[styles.infoText, { color: theme.subText }]}>{text}</Text>
    </View>
  );
}

function StatusBadge({ status }) {
  const isApproved = String(status).toLowerCase().includes('aprov');
  return (
    <View style={[styles.statusBadge, { backgroundColor: isApproved ? '#dff7ec' : colors.primaryTint }]}>
      <Text style={[styles.statusBadgeText, { color: isApproved ? colors.success : colors.primaryDark }]}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ...sharedStyles,
  toolbar: {
    alignItems: 'stretch',
    marginBottom: 4,
  },
  tabContainer: {
    ...sharedStyles.tabContainer,
    alignSelf: 'stretch',
    width: '100%',
  },
  tab: {
    ...sharedStyles.tab,
    flex: 1,
  },
  countText: { fontSize: 12, fontWeight: '800', alignSelf: 'flex-end', marginTop: -8 },
  listTitleRow: { marginBottom: 12 },
  table: {
    borderWidth: 1,
    borderRadius: uiTheme.radius.md,
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: colors.primaryDark,
    flexDirection: 'row',
    minHeight: 46,
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  tableHeadText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 72,
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(127, 127, 127, 0.12)',
  },
  tableRowLast: { borderBottomWidth: 0 },
  colSubject: { flex: 1.45, paddingRight: 12 },
  colProfessor: { flex: 1.05, paddingRight: 12 },
  colSchedule: { flex: 0.95, paddingRight: 12 },
  colRoom: { flex: 1.1 },
  tableCellText: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  card: {
    borderWidth: 1,
    borderRadius: uiTheme.radius.md,
    padding: 16,
    marginBottom: 14,
  },
  cardHeaderBetween: {
    ...sharedStyles.cardHeaderBetween,
    flexWrap: 'wrap',
  },
  subjectName: { fontSize: 16, fontWeight: '900' },
  subjectCode: { fontSize: 12, color: colors.primary, fontWeight: '900', marginTop: 4 },
  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 9,
  },
  infoText: { fontSize: 13, lineHeight: 18, flex: 1 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: uiTheme.radius.pill,
    alignSelf: 'flex-start',
  },
  statusBadgeText: { fontSize: 11, fontWeight: '900' },
  resultBlock: { gap: 6 },
  noteText: { fontSize: 13, fontWeight: '900' },
});
