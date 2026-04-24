import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export default function CarteirinhaScreen() {
  // Puxando o tema para a tela de Carteirinha
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: () => navigation.replace('Login'), style: "destructive" }
    ]);
  };
  // Cores dinâmicas
  const bgColor = isDarkMode ? '#121212' : '#f5f5f5';
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  const cardColor = isDarkMode ? '#1e1e1e' : '#ffffff';
  const subTextColor = isDarkMode ? '#aaaaaa' : '#666666';
  const borderColor = isDarkMode ? '#333333' : '#B90000';

  return (
<SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="person-circle-outline" size={40} color="#fff" />
          </TouchableOpacity>
          <View style={styles.userTextContainer}>
            <Text style={styles.headerTitle}>UniPortal</Text>
            <Text style={styles.headerGreeting}>Olá, João</Text>
          </View>
        </View>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons name={isDarkMode ? "sunny" : "moon"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>Carteirinha Estudantil</Text>
        <Text style={[styles.subtitle, { color: subTextColor }]}>Documento de Identificação</Text>

        <View style={styles.idCard}>
          <View style={styles.photoContainer}>
            <View style={styles.photoPlaceholder}>
              <Ionicons name="person" size={50} color="#fff" />
            </View>
          </View>
          <View style={styles.idInfo}>
            <Text style={styles.userName}>João</Text>
            <Text style={styles.userRA}>RA: 2512130067</Text>
            <Text style={styles.userCourse}>Ciência da Computação</Text>
            <View style={styles.idFooter}>
               <View>
                 <Text style={styles.label}>Semestre Atual</Text>
                 <Text style={styles.value}>5º Semestre</Text>
               </View>
               <View>
                 <Text style={styles.label}>Válido até:</Text>
                 <Text style={styles.value}>12/2027</Text>
               </View>
            </View>
          </View>
        </View>

        <View style={[styles.field, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Ionicons name="finger-print-outline" size={20} color="#B90000" />
          <View style={styles.fieldTexts}>
            <Text style={[styles.fieldLabel, { color: subTextColor }]}>Matrícula</Text>
            <Text style={[styles.fieldValue, { color: textColor }]}>2512130067</Text>
          </View>
        </View>

        <View style={styles.qrContainer}>
          <Text style={[styles.qrLabel, { color: subTextColor }]}>QR Code de Validação</Text>
          <View style={[styles.qrBox, { backgroundColor: cardColor, borderColor: borderColor }]}>
            <Ionicons name="qr-code-outline" size={100} color={textColor} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { backgroundColor: '#B90000', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userTextContainer: { marginLeft: 10 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerGreeting: { color: '#fff', fontSize: 14 },
  content: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 12, marginBottom: 20 },
  idCard: { backgroundColor: '#FF4D4D', borderRadius: 15, flexDirection: 'row', padding: 15, marginBottom: 20 },
  photoPlaceholder: { width: 80, height: 100, backgroundColor: '#333', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  idInfo: { flex: 1, marginLeft: 15 },
  userName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  userRA: { color: '#fff', fontSize: 12 },
  userCourse: { color: '#fff', fontSize: 12, marginBottom: 10 },
  idFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#eee', fontSize: 10 },
  value: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  field: { flexDirection: 'row', padding: 15, borderRadius: 10, borderWidth: 1, alignItems: 'center', marginBottom: 10 },
  fieldTexts: { marginLeft: 15 },
  fieldLabel: { fontSize: 10 },
  fieldValue: { fontSize: 16, fontWeight: 'bold' },
  qrContainer: { alignItems: 'center', marginTop: 20 },
  qrLabel: { fontSize: 12, marginBottom: 10 },
  qrBox: { padding: 20, borderWidth: 1, borderRadius: 10 }
});