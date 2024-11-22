import React, { useCallback } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Image, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../components/CartContext.jsx';
import { ref, push } from 'firebase/database';
import { auth, db } from '../db/firebaseConfig';

const TrashIcon = () => (
  <View style={styles.trashIcon}>
    <View style={styles.trashTop} />
    <View style={styles.trashBottom} />
    <View style={styles.trashLine} />
    <View style={[styles.trashLine, { top: 6 }]} />
    <View style={[styles.trashLine, { top: 10 }]} />
  </View>
);

export default function CartScreen() {
  const { 
    cartItems, 
    removeFromCart, 
    incrementQuantity, 
    decrementQuantity, 
    getTotalPrice,
    clearCart 
  } = useCart();
  const navigation = useNavigation();

  const handleFinishPurchase = async () => {
    try {
      if (!auth.currentUser) {
        Alert.alert(
          "Inicio de sesión requerido",
          "Por favor, inicia sesión para finalizar la compra",
          [{ text: "OK" }]
        );
        return;
      }

      if (cartItems.length === 0) {
        Alert.alert(
          "Carrito vacío",
          "Agrega productos antes de finalizar la compra",
          [{ text: "OK" }]
        );
        return;
      }

      const receipt = {
        items: cartItems,
        totalAmount: getTotalPrice(),
        date: new Date().toISOString(),
        userId: auth.currentUser.uid
      };

      // Guardar el recibo en Firebase
      const receiptRef = ref(db, `receipts/${auth.currentUser.uid}`);
      await push(receiptRef, receipt);

      // Limpiar el carrito
      clearCart();

      // Navegar a la pantalla de recibo
      navigation.navigate('Receipt');

      Alert.alert(
        "¡Compra exitosa!",
        "Tu compra ha sido procesada correctamente",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
      Alert.alert(
        "Error",
        "Hubo un error al procesar tu compra. Por favor, intenta de nuevo.",
        [{ text: "OK" }]
      );
    }
  };

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
          <TouchableOpacity onPress={handleFinishPurchase} style={styles.finishButton}>
            <Text style={styles.finishButtonText}>Finalizar Compra</Text>
          </TouchableOpacity>
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
    backgroundColor: '#f5f5f5',
  },
  finishButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 16,
    flex: 1,               
    justifyContent: 'center', 
    alignItems: 'center',     
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: '#555',
  },
  productStock: {
    fontSize: 14,
    marginTop: 4,
  },
  itemQuantity: {
    fontSize: 14,
    marginTop: 4,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  controlButton: {
    backgroundColor: '#ddd',
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  controlButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
  },
  removeButton: {
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
