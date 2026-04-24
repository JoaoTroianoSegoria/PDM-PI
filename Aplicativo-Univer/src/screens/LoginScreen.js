import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, KeyboardAvoidingView, Platform, Alert, Image // Importado o Image
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  // Lógica de validação de CPF (Algoritmo de dígitos verificadores)
  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove não números
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false; // Tamanho e números repetidos
    
    let soma = 0;
    let resto;
    
    // Valida 1º dígito
    for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    // Valida 2º dígito
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  };

  const handleLogin = () => {
    // 1. Valida Usuário (apenas números e total de 10)
    if (usuario.length !== 10 || isNaN(usuario)) {
      Alert.alert("Erro no Usuário", "O usuário deve conter exatamente 10 números.");
      return;
    }

    // 2. Valida Senha (apenas números, total de 11 e lógica de CPF)
    if (senha.length !== 11 || isNaN(senha)) {
      Alert.alert("Erro na Senha", "A senha deve conter exatamente 11 números.");
      return;
    }

    if (!validarCPF(senha)) {
      Alert.alert("Senha Inválida", "Os números da senha não formam um CPF válido pelo cálculo matemático.");
      return;
    }

    // Se tudo passar, loga no sistema
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <View style={styles.logoContainer}>
          {/* AQUI ESTÁ A MUDANÇA: Substituído XX Mark pela sua Image */}
          <Image 
            source={require('../../assets/logo.png')} // AJUSTE O NOME DO ARQUIVO AQUI SE PRECISAR
            style={styles.logoImage} // Estilo da imagem definido abaixo
            resizeMode="contain" // Mantém a proporção sem cortar
          />
          <Text style={styles.title}>UniPortal</Text>
          <Text style={styles.subtitle}>Login</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Usuário (10 dígitos)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="0000000000" 
            value={usuario}
            onChangeText={setUsuario}
            keyboardType="numeric" 
            maxLength={10} 
          />
          
          <Text style={styles.label}>Senha (CPF - 11 dígitos)</Text>
          <TextInput 
            style={styles.input} 
            secureTextEntry 
            placeholder="000.000.000-00" 
            value={senha}
            onChangeText={setSenha}
            keyboardType="numeric" 
            maxLength={11} 
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
            <Text style={styles.buttonLoginText}>ENTRAR</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Alert.alert("Suporte", "Procure a secretaria da faculdade.")}>
            <Text style={styles.forgotPassword}>Esqueci a senha</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#A60000' },
  inner: { flex: 1, justifyContent: 'center', padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  // NOVO: Estilo para o Logo na tela de Login (Maior)
  logoImage: { width: 150, height: 150, marginBottom: 10 }, 
  title: { fontSize: 40, color: '#fff', fontWeight: 'bold' },
  subtitle: { fontSize: 22, color: '#fff', fontWeight: '600', marginTop: 5 },
  formContainer: { backgroundColor: '#fff', padding: 25, borderRadius: 12 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#444', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 12, marginBottom: 20, fontSize: 16 },
  buttonLogin: { backgroundColor: '#B90000', padding: 15, borderRadius: 6, alignItems: 'center', marginBottom: 15 },
  buttonLoginText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  forgotPassword: { color: '#B90000', textAlign: 'center', fontWeight: '600', textDecorationLine: 'underline' }
});