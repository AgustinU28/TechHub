import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../components/CartContext.jsx';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen({ route }) {
  const { product } = route.params;
  const { addToCart } = useCart();
  const navigation = useNavigation();

  const handleAddToCart = () => {
    addToCart(product);
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagen del producto */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.mainImage }} style={styles.image} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.imageOverlay}
          />
        </View>

        {/* Contenido del producto */}
        <View style={styles.contentContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{product.title}</Text>
            <View style={styles.priceContainer}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.priceGradient}
              >
                <Text style={styles.priceSymbol}>$</Text>
                <Text style={styles.price}>
                  {product.price ? product.price.toLocaleString() : 'N/A'}
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Descripción corta */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={20} color="#667eea" />
              <Text style={styles.sectionTitle}>Resumen</Text>
            </View>
            <Text style={styles.shortDescription}>
              {product.shortDescription || 'Descripción corta no disponible'}
            </Text>
          </View>

          {/* Descripción larga */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text" size={20} color="#667eea" />
              <Text style={styles.sectionTitle}>Detalles</Text>
            </View>
            <Text style={styles.longDescription}>
              {product.longDescription || 'Descripción larga no disponible'}
            </Text>
          </View>

          {/* Características adicionales */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
              <Text style={styles.featureText}>Garantía incluida</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="rocket" size={24} color="#FF6B6B" />
              <Text style={styles.featureText}>Envío rápido</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="star" size={24} color="#FFC107" />
              <Text style={styles.featureText}>Calidad premium</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón fijo inferior */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleAddToCart}
          activeOpacity={0.8}
          accessibilityLabel={`Agregar ${product.title} al carrito`}
          accessibilityHint="Añade este producto a tu carrito de compras"
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.buttonGradient}
          >
            <Ionicons name="bag-add" size={24} color="#fff" />
            <Text style={styles.buttonText}>Agregar al carrito</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
    height: 350,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 100,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  title: {
    flex: 1,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    lineHeight: 32,
    marginRight: 15,
  },
  priceContainer: {
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  priceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  priceSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 2,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 8,
  },
  shortDescription: {
    fontSize: 16,
    color: '#667eea',
    fontStyle: 'italic',
    lineHeight: 24,
    backgroundColor: '#f8f9ff',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  longDescription: {
    fontSize: 16,
    color: '#555',
    lineHeight: 26,
    textAlign: 'justify',
  },
  featuresContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
    fontWeight: '500',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 20,
    paddingBottom: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  button: {
    width: '100%',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 25,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});