import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { getDatabase, ref, get, child } from 'firebase/database';
import FlatCard from '../components/FlatCard.jsx';
import HeaderCategory from '../components/HeaderCategory.jsx';

export default function CategoriesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderCategory = ({ item }) => (
    <FlatCard
      title={item.title}
      image={item.image}
      onPress={() => {
        // Después de seleccionar una categoría, redirige al TabNavigator
        navigation.replace('TabNavigator');
        // También puedes pasarle los datos de la categoría a la siguiente pantalla si es necesario
        navigation.navigate('Products', { 
          categoryId: item.id, 
          categoryTitle: item.title 
        });
      }}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header con el botón de cerrar sesión */}
      <HeaderCategory 
        showBackButton={navigation.canGoBack()} 
      />
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: '2%'
  },
  listContainer: {
    padding: '4%'
  }
});