import React from 'react';
import { Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUniver } from '../contexts/UniverContext';
import { colors, getThemeColors, sharedStyles } from '../styles/styles';

export default function AppHeader({
  eyebrow = 'Portal do aluno',
  isDarkMode,
  onLogout,
  onToggleTheme,
  subtitle,
  title,
}) {
  const { dashboard, studentCard, user } = useUniver();
  const { width } = useWindowDimensions();
  const theme = getThemeColors(isDarkMode);
  const compact = width < 900;
  const student = dashboard?.student ?? studentCard ?? user ?? {};
  const displayName = student.name ?? user?.name ?? 'Aluno';
  const firstName = student.firstName ?? displayName.split(' ')[0] ?? 'Aluno';
  const course = student.course ?? 'Ciência da Computação';
  const semester = student.currentSemester ?? '5º Semestre';
  const headerTitle = title ?? `Olá, ${firstName}`;

  if (compact) {
    return (
      <View style={[sharedStyles.mobileHeader, { backgroundColor: theme.background, borderBottomColor: theme.divider }]}>
        <View style={[sharedStyles.mobileTopBar, { backgroundColor: theme.sidebar }]}>
          <View style={sharedStyles.brandBlock}>
            <View style={[sharedStyles.logoMark, { backgroundColor: 'rgba(255, 255, 255, 0.18)' }]}>
              <Text style={sharedStyles.logoMarkText}>U</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={sharedStyles.brandName} numberOfLines={1}>UniPortal</Text>
              <Text style={sharedStyles.brandSub} numberOfLines={1}>Olá, {firstName}</Text>
            </View>
          </View>

          <View style={sharedStyles.mobileHeaderActions}>
            <TouchableOpacity
              onPress={onLogout}
              style={[sharedStyles.mobileIconButton, { backgroundColor: 'rgba(255, 255, 255, 0.12)' }]}
              accessibilityLabel="Sair"
            >
              <Ionicons name="log-out-outline" size={21} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onToggleTheme}
              style={[sharedStyles.mobileIconButton, { backgroundColor: 'rgba(255, 255, 255, 0.12)' }]}
              accessibilityLabel="Alternar tema"
            >
              <Ionicons name={isDarkMode ? 'sunny-outline' : 'moon'} size={21} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={sharedStyles.mobilePageTitle}>
          {!!eyebrow && <Text style={sharedStyles.eyebrow}>{eyebrow}</Text>}
          <Text style={[sharedStyles.mobileTitle, { color: theme.title }]} numberOfLines={1}>
            {headerTitle}
          </Text>
          {!!subtitle && (
            <Text style={[sharedStyles.mobileSubtitle, { color: theme.subText }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[sharedStyles.pageHeader, { backgroundColor: theme.background, borderBottomColor: theme.divider }]}>
      <View style={sharedStyles.pageHeaderRow}>
        <View style={sharedStyles.pageHeaderText}>
          {!!eyebrow && <Text style={sharedStyles.eyebrow}>{eyebrow}</Text>}
          <Text style={[sharedStyles.title, { color: theme.title }]} numberOfLines={2}>
            {headerTitle}
          </Text>
          {!!subtitle && (
            <Text style={[sharedStyles.subtitle, { color: theme.subText }]} numberOfLines={2}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={sharedStyles.headerActions}>
          <View style={[sharedStyles.chip, { backgroundColor: colors.primary }]}>
            <Text style={sharedStyles.chipText}>{semester}</Text>
          </View>
          <View style={[sharedStyles.chip, { backgroundColor: theme.chip }]}>
            <Text style={sharedStyles.chipText} numberOfLines={1}>{course}</Text>
          </View>
          <TouchableOpacity
            onPress={onToggleTheme}
            style={[
              sharedStyles.themeToggle,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            accessibilityLabel="Alternar tema"
          >
            <Ionicons name={isDarkMode ? 'sunny-outline' : 'moon'} size={16} color={theme.text} />
            <Text style={[sharedStyles.themeToggleText, { color: theme.text }]}>
              {isDarkMode ? 'Claro' : 'Escuro'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
