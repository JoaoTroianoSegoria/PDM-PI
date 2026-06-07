import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import { animation, colors, getThemeColors, sharedStyles } from '../styles/styles';
import { useTheme } from '../contexts/ThemeContext';

export default function HomeScreen({ navigation }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const theme = getThemeColors(isDarkMode, {
    border: isDarkMode ? colors.darkBorder : colors.homeLightBorder,
  });

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: () => navigation.replace('Login'), style: 'destructive' },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <AppHeader isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onLogout={handleLogout} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.dateText, { color: theme.subText }]}>Sexta-feira, 13 de março de 2026</Text>
        <Text style={[styles.sectionTitle, styles.homeSectionTitle, { color: theme.text }]}>Sua grade de hoje</Text>

        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={50}>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <Text style={styles.cardTitle}>Aula de Hoje</Text>
            </View>
            <Text style={[styles.subjectText, { color: theme.text }]}>Projeto integrador</Text>
            <Text style={[styles.profText, { color: theme.subText }]}>Prof. Marcelo Alves Farias</Text>
            <Text style={[styles.infoText, { color: theme.subText }]}>
              <Ionicons name="time-outline" /> 11:00 - 12:15
            </Text>
            <Text style={[styles.infoText, { color: theme.subText }]}>
              <Ionicons name="location-outline" /> Sala B5 - Bloco J
            </Text>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeIn" duration={900} delay={150}>
          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.subText }]}>Pendências & Serviços</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={50}>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.cardHeaderBetweenCenter}>
              <View style={styles.rowCenter}>
                <Ionicons name="card-outline" size={20} color={colors.primary} />
                <Text style={styles.cardTitle}>Cobranças</Text>
              </View>
              <View style={styles.badgeRed}>
                <Text style={styles.badgeText}>Pendente</Text>
              </View>
            </View>
            <Text style={[styles.subjectText, { color: theme.text }]}>Mensalidade Março/2026</Text>
            <Text style={[styles.infoText, { color: theme.subText }]}>Vencimento: 20/03/2026</Text>
            <Text style={[styles.valueText, { color: theme.text }]}>Valor: R$ 850,00</Text>
            <TouchableOpacity style={[styles.primaryButton, styles.buttonRed]} onPress={() => navigation.navigate('Faturas')}>
              <Text style={styles.primaryButtonText}>Ir para faturas</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={animation.duration} delay={50}>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, marginBottom: 40 }]}>
            <View style={styles.cardHeaderBetweenCenter}>
              <View style={styles.rowCenter}>
                <Ionicons name="library-outline" size={20} color={colors.primary} />
                <Text style={styles.cardTitle}>Biblioteca</Text>
              </View>
              <View style={styles.badgeRed}>
                <Text style={styles.badgeText}>Atrasado 4 dias</Text>
              </View>
            </View>
            <Text style={[styles.subjectText, { color: theme.text }]}>Algoritmos e Estruturas de Dados</Text>
            <Text style={[styles.infoText, styles.infoTextSpaced, { color: theme.subText }]}>
              <Ionicons name="alert-circle-outline" /> Prazo: 19/03/2026
            </Text>
            <TouchableOpacity
              style={[styles.primaryButton, styles.buttonRed]}
              onPress={() => Alert.alert('Devolução', 'Dirija-se ao balcão da biblioteca para devolver o exemplar.')}
            >
              <Text style={styles.primaryButtonText}>Realizar devolução</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ...sharedStyles,
  dateText: { fontSize: 12 },
  homeSectionTitle: { marginBottom: 15, marginTop: 5 },
  card: { borderWidth: 1, borderRadius: 8, padding: 15, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardHeaderBetweenCenter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: colors.primary, marginLeft: 5 },
  subjectText: { fontSize: 16, fontWeight: 'bold' },
  profText: { fontSize: 14, marginBottom: 10 },
  infoText: { fontSize: 14, marginBottom: 5 },
  infoTextSpaced: { marginTop: 5, marginBottom: 15 },
  valueText: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', marginVertical: 10 },
  badgeRed: { backgroundColor: colors.danger, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  buttonRed: { padding: 10, borderRadius: 5 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 10, fontSize: 12, fontWeight: '600' },
});
