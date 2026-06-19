import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUniver } from '../contexts/UniverContext';
import { colors, theme as uiTheme } from '../styles/styles';

export default function LoginScreen() {
  const { login } = useUniver();
  const [usuario, setUsuario] = useState('2512130067');
  const [senha, setSenha] = useState('52998224725');
  const [submitting, setSubmitting] = useState(false);

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10), 10)) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11), 10)) return false;

    return true;
  };

  const handleLogin = async () => {
    if (usuario.length !== 10 || isNaN(usuario)) {
      Alert.alert('Erro no Usuário', 'O usuário deve conter exatamente 10 números.');
      return;
    }

    if (senha.length !== 11 || isNaN(senha)) {
      Alert.alert('Erro na Senha', 'A senha deve conter exatamente 11 números.');
      return;
    }

    if (!validarCPF(senha)) {
      Alert.alert('Senha Inválida', 'Os números da senha não formam um CPF válido pelo cálculo matemático.');
      return;
    }

    setSubmitting(true);
    try {
      await login({
        registration: usuario,
        cpf: senha,
      });
    } catch (error) {
      Alert.alert('Não foi possível entrar', error.message ?? 'Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <Animatable.View animation="fadeInDown" duration={700} style={styles.brandPanel}>
          <View style={styles.brandHeader}>
            <View style={styles.logoMark}>
              <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
            </View>
            <View>
              <Text style={styles.title}>UniPortal</Text>
              <Text style={styles.subtitle}>Ambiente acadêmico</Text>
            </View>
          </View>

          <Text style={styles.eyebrow}>Sua jornada acadêmica em um só lugar</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={600} delay={100} style={styles.formContainer}>
          <Text style={styles.formTitle}>Bem-vindo de volta</Text>
          <Text style={styles.formSub}>Entre com seus dados institucionais para continuar.</Text>

          <Text style={styles.label}>Usuário (10 dígitos)</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua matrícula"
            placeholderTextColor="#91a4c7"
            value={usuario}
            onChangeText={setUsuario}
            keyboardType="numeric"
            maxLength={10}
          />

          <Text style={styles.label}>Senha (CPF - 11 dígitos)</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Digite seu CPF"
            placeholderTextColor="#91a4c7"
            value={senha}
            onChangeText={setSenha}
            keyboardType="numeric"
            maxLength={11}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin} disabled={submitting}>
            <Text style={styles.buttonLoginText}>{submitting ? 'Entrando...' : 'Entrar no portal'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Alert.alert('Suporte', 'Procure a secretaria.')}>
            <Text style={styles.forgotPassword}>Esqueci a senha</Text>
          </TouchableOpacity>
        </Animatable.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#11141a' },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 18,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
  },
  brandPanel: {
    backgroundColor: colors.primaryDark,
    borderRadius: uiTheme.radius.md,
    padding: 16,
    marginBottom: 14,
    overflow: 'hidden',
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  logoMark: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoImage: { width: 30, height: 30 },
  title: { fontSize: 20, color: colors.white, fontWeight: '900' },
  subtitle: { fontSize: 12, color: '#ffdce1', fontWeight: '700', marginTop: 1 },
  eyebrow: {
    color: '#ffe066',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 23,
    lineHeight: 28,
    fontWeight: '900',
  },
  heroText: {
    color: '#ffd9df',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: '#151a22',
    width: '100%',
    padding: 22,
    borderRadius: uiTheme.radius.lg,
    borderWidth: 1,
    borderColor: '#2c3441',
  },
  formTitle: { color: colors.white, fontSize: 28, fontWeight: '900' },
  formSub: { color: '#b6c4df', fontSize: 13, lineHeight: 19, marginTop: 6, marginBottom: 22 },
  label: { fontSize: 12, fontWeight: '900', color: colors.white, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#343b48',
    borderRadius: uiTheme.radius.md,
    padding: 14,
    marginBottom: 17,
    fontSize: 15,
    color: colors.white,
    backgroundColor: '#1a1f28',
  },
  buttonLogin: {
    backgroundColor: '#d62d46',
    padding: 15,
    borderRadius: uiTheme.radius.md,
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 15,
  },
  buttonLoginText: { color: colors.white, fontWeight: '900', fontSize: 14 },
  forgotPassword: { color: '#c8d5ef', textAlign: 'center', fontWeight: '800' },
});
