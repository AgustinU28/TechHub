import React, { useCallback } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../components/CartContext.jsx';

// Componente de icono de basura personalizado
const TrashIcon = () => (
  <View style={styles.trashIcon}>
    <View style={styles.trashTop} />
    <View style={styles.trashBottom} />
    <View style={styles.trashLine} />
    <View style={[styles.trashLine, {top: 6}]} />
    <View style={[styles.trashLine, {top: 10}]} />
  </View>
);

export default function CartScreen() {
  const { cartItems, removeFromCart, incrementQuantity, decrementQuantity, getTotalPrice } = useCart();
  const navigation = useNavigation();

  const renderItem = useCallback(({ item }) => {
    if (!item || typeof item !== 'object') {
      console.error('Invalid item in cart:', item);
      return null;
    }
  
    const stockColor = item.stock > 0 ? 'green' : 'red';
    const itemTotal = item.price * item.quantity;

    return (
      <View style={styles.itemContainer}>
        {item.mainImage && (
          <Image 
            source={{ uri: item.mainImage }} 
            style={styles.itemImage}
            resizeMode="contain"
          />
        )}
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>{item.title || 'Untitled Item'}</Text>
          <Text style={styles.itemPrice}>Precio: ${(item.price || 0).toLocaleString()}</Text>
          <Text style={[styles.productStock, { color: stockColor }]}>
            {item.stock > 0 ? `Stock: ${item.stock}` : 'Sin stock'}
          </Text>
          <Text style={styles.itemQuantity}>Cantidad: {(item.quantity || 0).toString()}</Text>
          <Text style={styles.itemTotal}>Total: ${itemTotal.toLocaleString()}</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity onPress={() => decrementQuantity(item.id)} style={styles.controlButton}>
              <Text style={styles.controlButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => incrementQuantity(item.id)} style={styles.controlButton}>
              <Text style={styles.controlButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item.id)}>
            <TrashIcon />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [decrementQuantity, incrementQuantity, removeFromCart]);

  return (
    <View style={styles.container}>
      {Array.isArray(cartItems) && cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => (item && item.id) ? item.id.toString() : Math.random().toString()}
            renderItem={renderItem}
            extraData={cartItems}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total del Carrito: ${getTotalPrice().toLocaleString()}
            </Text>
          </View>
        </>
      ) : (
        <Text style={styles.emptyText}>Tu carrito está vacío.</Text>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  itemImage: {
    width: '30%',
    height: 80,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#888',
  },
  productStock: {
    fontSize: 16,
    marginBottom: 8,
  },
  itemQuantity: {
    fontSize: 16,
    marginBottom: 8,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  controlButton: {
    backgroundColor: '#ddd',
    padding: 8,
    borderRadius: 4,
  },
  controlButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 16,
    fontSize: 16,
  },
  removeButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  totalContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 16,
  },
  trashIcon: {
    width: 20,
    height: 20,
    position: 'relative',
  },
  trashTop: {
    position: 'absolute',
    top: 0,
    left: 3,
    width: 14,
    height: 3,
    backgroundColor: 'red',
  },
  trashBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 20,
    height: 16,
    backgroundColor: 'red',
    borderRadius: 2,
  },
  trashLine: {
    position: 'absolute',
    top: 2,
    left: 7,
    width: 2,
    height: 12,
    backgroundColor: 'white',
  },
});