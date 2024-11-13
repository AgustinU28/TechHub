import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, get, child } from 'firebase/database';  // Correcta importación
import { database } from '../db/firebaseConfig.jsx';  // Importamos la instancia de la base de datos
import Header from '../components/Header.jsx';
import Search from '../components/Search.jsx';

export default function ProductsScreen({ route }) {
  const { categoryTitle } = route.params;
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Función para cargar productos desde Firebase
  const fetchProducts = async () => {
    try {
      const dbRef = ref(database);  // Usamos la referencia de la base de datos
      const snapshot = await get(child(dbRef, 'products'));  // Obtenemos los productos
      if (snapshot.exists()) {
        setProducts(Object.values(snapshot.val()));  // Almacenamos los productos en el estado
      } else {
        console.log('No se encontraron productos');
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  useEffect(() => {
    fetchProducts();  // Llamamos a la función al cargar el componente
  }, []);

  const filteredProducts = useMemo(() => {
    const categoryProducts = products.filter(
      product => product.category === categoryTitle.toLowerCase()
    );
    
    if (!searchQuery) return categoryProducts;

    return categoryProducts.filter(product =>
      (product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [products, categoryTitle, searchQuery]);

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.mainImage }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('ProductDetails', { product: item })}
        >
          <Text style={styles.buttonText}>Ver más detalles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title={categoryTitle} />
      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingVertical: 20 },
  productCard: { flexDirection: 'row', marginVertical: 10, backgroundColor: '#fff', padding: 10 },
  productImage: { width: 100, height: 100 },
  productDetails: { flex: 1, paddingLeft: 10 },
  button: { backgroundColor: '#6200ea', padding: 10, borderRadius: 5, marginTop: 10 },
  buttonText: { color: '#fff' },
});
