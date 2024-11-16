import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, get, child } from 'firebase/database';
import { db } from '../db/firebaseConfig'; // Cambiamos database por db
import Header from '../components/Header.jsx';
import Search from '../components/Search.jsx';

export default function ProductsScreen({ route }) {
  const { categoryTitle } = route.params;
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función mejorada para cargar productos desde Firebase
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, 'products'));
      
      if (snapshot.exists()) {
        const productsData = snapshot.val();
        const productsArray = Object.entries(productsData).map(([id, data]) => ({
          id,
          ...data
        }));
        setProducts(productsArray);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
      setError('No se pudieron cargar los productos. Por favor, intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image 
        source={{ uri: item.mainImage }} 
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productDetails}>
        <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('ProductDetails', { product: item })}
        >
          <Text style={styles.buttonText}>Ver más detalles</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={categoryTitle} />
      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.noProductsText}>
            No se encontraron productos en esta categoría
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    padding: 10,
  },
  productCard: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 4,
  },
  productDetails: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ea',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6200ea',
    padding: 12,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noProductsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});