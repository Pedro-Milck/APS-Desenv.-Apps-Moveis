import 'react-native-gesture-handler';
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function CardComida(props) {
  return (
    <View style={styles.card}>
      <Image source={props.foto} style={styles.cardImage} />
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{props.nome}</Text>
        <Text style={styles.cardSubtitle}>{props.preco}</Text>
      </View>
      <View style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </View>
    </View>
  );
}

// Tela inicial
function HomeScreen({ navigation }) {

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.containerHome}>
        <View style={styles.homeHeader}>
          <Image source={require('./assets/krusty.avif')} style={styles.image} />
        </View>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Preencha para fazer seu pedido:</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor="#999"
            onChangeText={setNome}
            value={nome}
          />
          <TextInput
            style={styles.input}
            placeholder="Seu telefone"
            keyboardType="phone-pad"
            placeholderTextColor="#999"
            onChangeText={setTelefone}
            value={telefone}
          />
          <TouchableOpacity
            style={[styles.mainButton, telefone.length === 0 && styles.mainButtonDisabled]}
            onPress={() => navigation.navigate('Welcome', { nome, telefone })}
            disabled={telefone.length === 0}
          >                    
            <Text style={styles.mainButtonText}>Ver Cardápio</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Tela do cardápio
function WelcomeScreen({ navigation, route }) {
  const { nome } = route.params;
  const [carrinho, setCarrinho] = useState([]);
  const [numeroPedido] = useState(`#${Math.floor(Math.random() * 1000000)}`);
  const adicionarAoCarrinho = (item) => {
    setCarrinho([...carrinho, item]);
    Toast.show({ type: 'success', text1: `${item.nome} adicionado!` });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.menuHeader}>
        <Text style={styles.menuHeaderTitle}>Olá, {nome}!</Text>
        <Text style={styles.menuHeaderSubtitle}>Adicione os itens ao seu pedido:</Text>
      </View>
      <ScrollView contentContainerStyle={styles.menuList}>
        <TouchableOpacity onPress={() => adicionarAoCarrinho({ nome: 'O Clássico', preco: 23.99, foto: require('./assets/burger.jpeg') })}>
          <CardComida nome="O Clássico" preco="R$ 23,99" foto={require('./assets/burger.jpeg')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => adicionarAoCarrinho({ nome: 'Batata Frita', preco: 15.99, foto: require('./assets/batata.png') })}>
          <CardComida nome="Batata Frita" preco="R$ 15,99" foto={require('./assets/batata.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => adicionarAoCarrinho({ nome: 'Milk Shake', preco: 11.99, foto: require('./assets/shake.jpeg') })}>
          <CardComida nome="Milk Shake" preco="R$ 11,99" foto={require('./assets/shake.jpeg')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => adicionarAoCarrinho({ nome: 'Condimentos', preco: 0.00, foto: require('./assets/condimentos.png') })}>
          <CardComida nome="Condimentos" preco="Grátis" foto={require('./assets/condimentos.png')} />
        </TouchableOpacity>
      </ScrollView>      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ShopCart', { itensPedidos: carrinho, numeroPedido })}
      >
        <Image source={require('./assets/shopcart.png')} style={styles.fabIcon} />
        {carrinho.length > 0 && (
          <View style={styles.fabBadge}>
            <Text style={styles.fabBadgeText}>{carrinho.length}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

// Tela do carrinho
function ShopCartScreen({ navigation, route }) {
 const { numeroPedido , telefone} = route.params; 
 const [itens, setItens] = useState(route.params.itensPedidos);

  let total = 0;
    itens.forEach((item) => {
    total = total + item.preco;
  });

  const removerItem = (index) => {
    const novosItens = [...itens];
    novosItens.splice(index, 1);
    setItens(novosItens);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={[styles.menuHeader, { alignItems: 'center' }]}>
        <Text style={styles.menuHeaderTitle}>Seu Pedido</Text>
        <Text style={styles.menuHeaderSubtitle}>{numeroPedido}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.menuList}>
        {itens.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>
            Nenhum item no carrinho.
          </Text>
        ) : (
          itens.map((item, index) => (
            <View key={index} style={styles.card}>
              <Image source={item.foto} style={styles.cardImage} />
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{item.nome}</Text>
                <Text style={styles.cardSubtitle}>
                  R$ {item.preco}
                </Text>
              </View>
              <TouchableOpacity style={styles.removeButton} onPress={() => removerItem(index)}>
                <Text style={styles.removeButtonText}>-</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total: R$ {total}
        </Text>
        <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('Final', {numeroPedido, telefone})}>
          <Text style={styles.mainButtonText}>Finalizar Pedido-></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
function FinalScreen({ navigation, route }) {
  const { numeroPedido , telefone} = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center', padding: 30 }}>

      <Image source={require('./assets/motoboy.png')} style={styles.image} />

      <View style={[styles.menuHeader, { alignItems: 'center', width: '100%', borderRadius: 12 }]}>
        <Text style={styles.menuHeaderTitle}>Seu pedido {numeroPedido} foi efetuado com sucesso!</Text>
        <Text style={styles.menuHeaderSubtitle}>Verifique seu número {telefone} para acompanhar a entrega</Text>
      </View>      
      <TouchableOpacity
        style={[styles.mainButton, { width: '100%', marginTop: 30 }]}
        onPress={() => navigation.popToTop()}
      >
        <Text style={styles.mainButtonText}>Fazer novo pedido</Text>
      </TouchableOpacity>
    </View>
  );
}
// Pilha de navegação
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#E44332' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ title: 'Cardápio' }} />
        <Stack.Screen name="ShopCart" component={ShopCartScreen} options={{ title: 'Carrinho' }} />
        <Stack.Screen name="Final" component={FinalScreen} options={{ headerShown: false}} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  // Tela Inicial
  containerHome: {
    flexGrow: 1,
    backgroundColor: '#E44332',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeHeader: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  formCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingTop: 35,
    flex: 1,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderColor: '#E44332',
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  mainButton: {
    backgroundColor: '#E44332',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  mainButtonDisabled: {
    backgroundColor: '#ccc',
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  menuHeader: {
    backgroundColor: '#E44332',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  menuHeaderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuHeaderSubtitle: {
    fontSize: 14,
    color: '#ffd0cc',
    marginTop: 2,
  },
  menuList: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#E44332',
    marginTop: 4,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#E44332',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  removeButton: {
    backgroundColor: '#ff4444',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },

  // Botão flutuante
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    right: 24,
    bottom: 60,
    backgroundColor: '#E44332',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  fabBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FFC107',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabBadgeText: {
    color: '#333',
    fontSize: 11,
    fontWeight: 'bold',
  },

  totalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
});