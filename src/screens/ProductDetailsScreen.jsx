import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../components/CartContext.jsx';

export default function ProductDetailsScreen({ route }) {
  const { product } = route.params;
  const { addToCart } = useCart();
  const navigation = useNavigation();

  const handleAddToCart = () => {
    addToCart(product);
    navigation.navigate('Cart');
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.mainImage }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{product.title}</Text>

        {/* Mostrando el precio */}
        {product.price ? (
          <Text style={styles.price}>${product.price.toLocaleString()}</Text>
        ) : (
          <Text style={styles.price}>Precio no disponible</Text>
        )}

        {/* Mostrando la descripción corta */}
        {product.shortDescription ? (
          <Text style={styles.shortDescription}>{product.shortDescription}</Text>
        ) : (
          <Text style={styles.shortDescription}>Descripción corta no disponible</Text>
        )}

        {/* Mostrando la descripción larga */}
        {product.longDescription ? (
          <Text style={styles.longDescription}>{product.longDescription}</Text>
        ) : (
          <Text style={styles.longDescription}>Descripción larga no disponible</Text>
        )}

        {/* Botón para agregar al carrito */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleAddToCart}
          accessibilityLabel={`Agregar ${product.title} al carrito`}
          accessibilityHint="Añade este producto a tu carrito de compras"
        >
          <Text style={styles.buttonText}>Agregar al carrito</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  details: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    color: '#4A148C',
    marginBottom: 10,
  },
  shortDescription: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  longDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4A148C',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
