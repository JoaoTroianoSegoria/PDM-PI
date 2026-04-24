import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  // Função centralizada para fazer o login
  const handleLogin = () => {
    // Aqui você futuramente validaria o usuário e senha
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* KeyboardAvoidingView evita que o teclado cubra os inputs no Android/iOS */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoMark}>XX</Text>
          <Text style={styles.title}>UniPortal</Text>
          <Text style={styles.subtitle}>Login</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Usuário</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Digite seu usuário" 
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
          />
          
          <Text style={styles.label}>Senha</Text>
          <TextInput 
            style={styles.input} 
            secureTextEntry 
            placeholder="Digite sua senha" 
            value={senha}
            onChangeText={setSenha}
            // Faz o "Enter" do teclado enviar o formulário
            returnKeyType="done"
            onSubmitEditing={handleLogin} 
          />

          {/* Botão de Entrar que faltava */}
          <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
            <Text style={styles.buttonLoginText}>ENTRAR</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {/* Lógica de esqueci a senha */}}>
            <Text style={styles.forgotPassword}>Esqueci a senha</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B90000',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoMark: {
    fontSize: 80,
    color: '#fff',
    fontWeight: '100',
  },
  title: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: '#fff', 
    padding: 25,
    borderRadius: 12,
    elevation: 5, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  buttonLogin: {
    backgroundColor: '#B90000',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonLoginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPassword: {
    color: '#B90000',
    textAlign: 'center',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});