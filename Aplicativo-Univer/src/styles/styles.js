export const colors = {
  primary: '#B90000',
  primaryDark: '#A60000',
  danger: '#FF3B30',
  success: '#4CAF50',
  white: '#ffffff',
  darkText: '#333333',
  mutedText: '#666666',
  lightBackground: '#f5f5f5',
  darkBackground: '#121212',
  lightCard: '#ffffff',
  invoiceCardLight: '#D9D9D9',
  darkCard: '#1e1e1e',
  darkBorder: '#333333',
  lightBorder: '#B90000',
  homeLightBorder: '#ffcccc',
  tabLight: '#e0e0e0',
  tabDark: '#333333',
};

export const getThemeColors = (isDarkMode, overrides = {}) => ({
  background: isDarkMode ? colors.darkBackground : colors.lightBackground,
  text: isDarkMode ? colors.white : colors.darkText,
  card: isDarkMode ? colors.darkCard : colors.lightCard,
  subText: isDarkMode ? '#aaaaaa' : colors.mutedText,
  border: isDarkMode ? colors.darkBorder : colors.lightBorder,
  tabContainer: isDarkMode ? colors.tabDark : colors.tabLight,
  activeTab: colors.primary,
  ...overrides,
});

export const animation = {
  duration: 400,
};

export const sharedStyles = {
  container: { flex: 1 },
  content: { padding: 20 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 24,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusText: {
    color: colors.mutedText,
    fontSize: 14,
    textAlign: 'center',
  },

  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 20,
  },
  logoContainer: { marginRight: 10, width: 25, height: 25 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  profileButton: { justifyContent: 'flex-start' },
  userTextContainer: { marginLeft: 10 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
  headerGreeting: { color: colors.white, fontSize: 14 },
  themeButton: { marginLeft: 'auto' },

  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 12, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },

  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  cardHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  tabContainer: { flexDirection: 'row', borderRadius: 8, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  tabText: { color: colors.mutedText, fontWeight: 'bold' },
  activeTabText: { color: colors.white, fontWeight: 'bold' },

  badge: { backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: 'bold' },

  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  primaryButtonText: { color: colors.white, fontWeight: 'bold' },
};
