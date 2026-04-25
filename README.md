# 🎓 UniPortal - Protótipo de Aplicativo Universitário

O **UniPortal** é um protótipo de aplicativo móvel desenvolvido para facilitar a vida acadêmica dos estudantes. O projeto foca em uma interface intuitiva, interativa e funcional, permitindo que o aluno gerencie suas notas, frequências, horários e faturas em um único lugar.

Este projeto faz parte do **Projeto Integrador (PI)** da faculdade IESB. 

## Esse trabalho foi desenvolvido por:
João Otavio Troiano Segoria.<br>
João Pedro Gonçalves Campos Silva.<br>
Gabriel Castagnaro Macêdo.<br>
 
## 🚀 Funcionalidades:

O aplicativo conta com um fluxo completo de navegação e as seguintes telas interativas:

* **Login**: Tela de entrada com validação de campos e suporte a envio pelo teclado.
* **Início (Home)**: Visão geral da grade do dia, avisos de aulas e cobranças pendentes com navegação direta.
* **Disciplinas**: Lista detalhada das matérias do semestre atual e aba de histórico de disciplinas concluídas.
* **Boletim**: Visualização de desempenho com médias gerais, frequências e gráficos de distribuição de notas.
* **Carteirinha Estudantil**: Documento de identificação digital com QR Code de validação.
* **Faturas**: Gerenciamento financeiro com abas para faturas pendentes e histórico de pagamentos realizados.

### 🌗 Diferenciais
* **Modo Escuro (Dark Mode) Universal**: Implementado via Context API, permitindo alternar o tema em qualquer tela do app através do ícone no cabeçalho.
* **Navegação Fluida**: Utilização de `Stack Navigator` para o fluxo de autenticação e `Bottom Tab Navigator` para o menu principal.
* **Ergonomia e Responsividade**: Implementação do componente `KeyboardAvoidingView` garantindo que o teclado do celular não sobreponha os campos de texto durante o login, além do uso de `SafeAreaView` para respeitar os entalhes (notches) das telas de dispositivos modernos.
* **Identidade Visual Consistente**: Uso padronizado da cor principal (Vermelho `#B90000`) guiando a atenção do usuário em botões primários, contornos de cards e cabeçalhos.

## 🛠️ Tecnologias utilizadas até agora:

O projeto foi construído utilizando as seguintes tecnologias:

* **[React Native](https://reactnative.dev/)** - Framework para desenvolvimento mobile.
* **[Expo](https://expo.dev/)** - Plataforma para facilitação do desenvolvimento e testes.
* **[React Navigation](https://reactnavigation.org/)** - Biblioteca oficial para navegação entre telas.
* **[Expo Vector Icons](https://icons.expo.fyi/)** - Conjunto de ícones (Ionicons) para interface.
* **Context API** - Gerenciamento de estado global para o tema (Modo Escuro).

## 💻 Como Rodar o Projeto

### Pré-requisitos
* Node.js instalado.
* Expo Go instalado no celular ou Android Studio configurado (Emulador).

### Instalação

1. Clone o repositório:
   ```bash
   git clone [https://github.com/joaotroianosegoria/pdm-pi.git](https://github.com/joaotroianosegoria/pdm-pi.git)


2.Acesse a pasta do projeto:
````
cd Aplicativo-Univer
Instale as dependências:
````
3.Instale as dependências:
````
Bash
npm install
Inicie o servidor do Expo:
````
4.Inicie o servidor do Expo:
````
Bash
npx expo start
````
