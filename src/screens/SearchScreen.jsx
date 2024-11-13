import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Search from '../components/Search.jsx';
import { ref, get, child, database } from '../db/firebaseConfig';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();

  // Fetching products from Firebase Realtime Database
  const fetchProducts = async () => {
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'products'));
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val());
        setProducts(data);
      } else {
        console.log('No se encontraron productos en la base de datos');
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtrar productos basado en el query de búsqueda
  const handleSearch = () => {
    if (searchQuery) {
      const results = products.filter((product) =>
        (product.title && product.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={[styles.productCard, { width: width > 600 ? '48%' : '100%' }]}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image
        source={{ uri: item.mainImage || 'https://via.placeholder.com/150' }}
        style={styles.productImage}
      />
      <Text style={styles.productTitle}>{item.title || 'Sin título'}</Text>
      <Text style={styles.productDescription}>{item.description || 'Sin descripción'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Search
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          numColumns={width > 600 ? 2 : 1}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noResults}>
          {searchQuery ? 'No se encontraron productos.' : 'Escribe algo para buscar.'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '4%',
    backgroundColor: '#fff',
    marginTop: '2%',
  },
  listContainer: {
    padding: '2%',
  },
  productCard: {
    backgroundColor: '#f9f9f9',
    padding: '4%',
    marginVertical: '1%',
    borderRadius: 8,
    elevation: 2,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#555',
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
});
