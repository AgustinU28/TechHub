import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getDatabase, ref, get, child } from 'firebase/database';
import FlatCard from '../components/FlatCard.jsx';
import HeaderCategory from '../components/HeaderCategory.jsx';

export default function CategoriesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Función para cargar categorías desde Firebase
  const fetchCategories = async () => {
    try {
      const database = getDatabase();
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'categories'));
      
      if (snapshot.exists()) {
        const categoriesData = Object.values(snapshot.val());
        setCategories(categoriesData);
        console.log('Categorías cargadas exitosamente');
      } else {
        console.log('No se encontraron categorías');
      }
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderCategory = ({ item, index }) => (
    <View style={[styles.cardContainer, { marginTop: index === 0 ? 0 : 15 }]}>
      <FlatCard
        title={item.title}
        image={item.image}
        onPress={() => {
          navigation.navigate('Products', { 
            categoryId: item.id, 
            categoryTitle: item.title 
          });
        }}
      />
    </View>
  );

  const ListHeaderComponent = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.welcomeCard}
      >
        <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
        <Text style={styles.welcomeSubtitle}>
          Descubre nuestras categorías y encuentra lo que buscas
        </Text>
      </LinearGradient>
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No hay categorías disponibles</Text>
      <Text style={styles.emptySubtitle}>
        Intenta actualizar la página deslizando hacia abajo
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderCategory 
        showBackButton={navigation.canGoBack()} 
      />
      
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#667eea', '#764ba2']}
            tintColor="#667eea"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    marginBottom: 20,
  },
  welcomeCard: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 25,
    borderRadius: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#ffffff90',
    lineHeight: 22,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  cardContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
});