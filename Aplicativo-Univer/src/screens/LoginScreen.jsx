import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUniver } from '../contexts/UniverContext';
import { colors } from '../styles/styles';

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
        <Animatable.View animation="fadeInDown" duration={900} style={styles.logoContainer}>
          <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.title}>UniPortal</Text>
          <Text style={styles.subtitle}>Login</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={600} delay={100} style={styles.formContainer}>
          <Text style={styles.label}>Usuário (10 dígitos)</Text>
          <TextInput
            style={styles.input}
            placeholder="Matrícula - 10 dígitos"
            value={usuario}
            onChangeText={setUsuario}
            keyboardType="numeric"
            maxLength={10}
          />

          <Text style={styles.label}>Senha (CPF - 11 dígitos)</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="CPF - 11 dígitos"
            value={senha}
            onChangeText={setSenha}
            keyboardType="numeric"
            maxLength={11}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin} disabled={submitting}>
            <Text style={styles.buttonLoginText}>{submitting ? 'ENTRANDO...' : 'ENTRAR'}</Text>
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
  container: { flex: 1, backgroundColor: colors.primaryDark },
  inner: { flex: 1, justifyContent: 'center', padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoImage: { width: 150, height: 150, marginBottom: 10 },
  title: { fontSize: 40, color: colors.white, fontWeight: 'bold' },
  subtitle: { fontSize: 22, color: colors.white, fontWeight: '600', marginTop: 5 },
  formContainer: { backgroundColor: colors.white, padding: 25, borderRadius: 12 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#444', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 12, marginBottom: 20, fontSize: 16 },
  buttonLogin: { backgroundColor: colors.primary, padding: 15, borderRadius: 6, alignItems: 'center', marginBottom: 15 },
  buttonLoginText: { color: colors.white, fontWeight: 'bold', fontSize: 16 },
  forgotPassword: { color: colors.primary, textAlign: 'center', fontWeight: '600', textDecorationLine: 'underline' },
});
