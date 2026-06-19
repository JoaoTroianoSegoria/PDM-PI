import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useUniver } from '../contexts/UniverContext';
import { colors, getThemeColors, theme as uiTheme } from '../styles/styles';

const routeIcons = {
  Início: ['home', 'home-outline'],
  Inicio: ['home', 'home-outline'],
  Disciplinas: ['book', 'book-outline'],
  Boletim: ['bar-chart', 'bar-chart-outline'],
  Carteirinha: ['id-card', 'id-card-outline'],
  Faturas: ['document-text', 'document-text-outline'],
};

function getInitials(name = 'Aluno') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function UniPortalTabBar({ descriptors, isSidebar, navigation, state }) {
  const { isDarkMode } = useTheme();
  const { dashboard, logout, studentCard, user } = useUniver();
  const insets = useSafeAreaInsets();
  const theme = getThemeColors(isDarkMode);
  const student = dashboard?.student ?? studentCard ?? user ?? {};
  const displayName = student.name ?? user?.name ?? 'Aluno';
  const registration = student.registration ?? user?.registration ?? 'RA';

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: logout, style: 'destructive' },
    ]);
  };

  const renderRoute = (route, index) => {
    const focused = state.index === index;
    const { options } = descriptors[route.key];
    const label = options.tabBarLabel ?? options.title ?? route.name;
    const [activeIcon, inactiveIcon] = routeIcons[route.name] ?? ['ellipse', 'ellipse-outline'];
    const iconColor = isSidebar
      ? focused || !isDarkMode
        ? colors.white
        : '#c8c0c7'
      : colors.white;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!focused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    if (isSidebar) {
      return (
        <TouchableOpacity
          key={route.key}
          accessibilityRole="button"
          accessibilityState={focused ? { selected: true } : {}}
          onPress={onPress}
          style={[
            styles.sidebarItem,
            focused && {
              backgroundColor: isDarkMode ? '#311a25' : 'rgba(255, 255, 255, 0.15)',
              borderColor: isDarkMode ? colors.primarySoft : 'rgba(255, 255, 255, 0.35)',
            },
          ]}
        >
          {focused && <View style={styles.activeRail} />}
          <Ionicons name={focused ? activeIcon : inactiveIcon} size={20} color={iconColor} />
          <Text
            style={[
              styles.sidebarItemText,
              { color: isDarkMode && !focused ? '#f0e9ee' : colors.white },
              focused && styles.sidebarItemTextActive,
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={focused ? { selected: true } : {}}
        onPress={onPress}
        style={[
          styles.bottomItem,
          focused && {
            backgroundColor: isDarkMode ? '#311a25' : 'rgba(255, 255, 255, 0.15)',
            borderColor: isDarkMode ? colors.primarySoft : 'rgba(255, 255, 255, 0.35)',
          },
        ]}
      >
        {focused && <View style={styles.bottomActiveRail} />}
        <Ionicons name={focused ? activeIcon : inactiveIcon} size={21} color={iconColor} />
        <Text
          style={[
            styles.bottomLabel,
            { color: isDarkMode && !focused ? '#f0e9ee' : colors.white },
            focused && styles.bottomLabelActive,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  if (!isSidebar) {
    return (
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: isDarkMode ? '#070b12' : theme.sidebar,
            borderTopColor: isDarkMode ? '#1d2330' : theme.sidebarBorder,
            paddingBottom: Math.max(insets.bottom, 8),
          },
        ]}
      >
        <LinearGradient
          pointerEvents="none"
          colors={
            isDarkMode
              ? ['#250812', '#180a14', '#0d0f18', '#070b12']
              : ['#ad1830', '#b51d35', '#bd2c42', '#d97a86']
          }
          locations={isDarkMode ? [0, 0.38, 0.74, 1] : [0, 0.6, 0.88, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.mobileGradient}
        />
        {state.routes.map(renderRoute)}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.sidebar,
        {
          backgroundColor: theme.sidebar,
          borderRightColor: theme.sidebarBorder,
          paddingTop: insets.top + 14,
          paddingBottom: insets.bottom + 14,
        },
      ]}
    >
      <View style={styles.brandRow}>
        <View style={[styles.logoMark, { backgroundColor: isDarkMode ? colors.primary : 'rgba(255, 255, 255, 0.18)' }]}>
          <Text style={styles.logoText}>U</Text>
        </View>
        <View style={styles.brandTexts}>
          <Text style={styles.brandTitle} numberOfLines={1}>UniPortal</Text>
          <Text style={[styles.brandSub, { color: theme.sidebarMuted }]} numberOfLines={1}>Ambiente acadêmico</Text>
        </View>
      </View>

      <View
        style={[
          styles.userCard,
          {
            backgroundColor: theme.sidebarPanel,
            borderColor: theme.sidebarBorder,
          },
        ]}
      >
        <View style={[styles.avatar, { backgroundColor: isDarkMode ? colors.primary : colors.white }]}>
          <Text style={[styles.avatarText, { color: isDarkMode ? colors.white : colors.primaryDark }]}>
            {getInitials(displayName)}
          </Text>
        </View>
        <View style={styles.userTexts}>
          <Text style={styles.userName} numberOfLines={1}>{displayName}</Text>
          <Text style={[styles.userRa, { color: theme.sidebarMuted }]} numberOfLines={1}>RA {registration}</Text>
        </View>
      </View>

      <View style={styles.navList}>{state.routes.map(renderRoute)}</View>

      <TouchableOpacity
        style={[
          styles.logoutButton,
          {
            backgroundColor: isDarkMode ? '#353a43' : 'rgba(255, 255, 255, 0.15)',
          },
        ]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color={colors.white} />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 264,
    borderRightWidth: 1,
    paddingHorizontal: 14,
    overflow: 'hidden',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  logoMark: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: colors.white, fontSize: 16, fontWeight: '900' },
  brandTexts: { flex: 1, minWidth: 0 },
  brandTitle: { color: colors.white, fontSize: 21, fontWeight: '900' },
  brandSub: { fontSize: 12, fontWeight: '700', marginTop: 1 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: uiTheme.radius.lg,
    padding: 14,
    marginBottom: 20,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 14, fontWeight: '900' },
  userTexts: { flex: 1, minWidth: 0 },
  userName: { color: colors.white, fontSize: 15, fontWeight: '900' },
  userRa: { fontSize: 12, fontWeight: '700', marginTop: 3 },
  navList: {
    gap: 8,
    flex: 1,
  },
  sidebarItem: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
    overflow: 'hidden',
  },
  activeRail: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 3,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: colors.white,
  },
  sidebarItemText: { fontSize: 15, fontWeight: '800', flex: 1 },
  sidebarItemTextActive: { fontWeight: '900' },
  logoutButton: {
    minHeight: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  logoutText: { color: colors.white, fontSize: 15, fontWeight: '900' },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 8,
    paddingHorizontal: 8,
    minHeight: 70,
    overflow: 'hidden',
  },
  mobileGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#070b12',
  },
  bottomItem: {
    flex: 1,
    zIndex: 1,
    minWidth: 0,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    overflow: 'hidden',
    paddingHorizontal: 2,
  },
  bottomActiveRail: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: 3,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: colors.white,
  },
  bottomLabel: { fontSize: 10, fontWeight: '800', maxWidth: '100%' },
  bottomLabelActive: { fontWeight: '900' },
});
