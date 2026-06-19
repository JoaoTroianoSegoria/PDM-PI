import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import StatusView from '../components/StatusView';
import { animation, colors, getThemeColors, sharedStyles } from '../styles/styles';
import { useTheme } from '../contexts/ThemeContext';
import { useUniver } from '../contexts/UniverContext';

export default function DisciplinasScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { disciplines, error, loading, logout, refresh } = useUniver();
  const [abaAtual, setAbaAtual] = useState('atuais');
  const theme = getThemeColors(isDarkMode);

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
                {disciplines.current.length} disciplinas matriculadas
              </Text>
            </Animatable.View>

            {disciplines.current.map((item, index) => (
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

            {disciplines.history.map((item, index) => (
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
