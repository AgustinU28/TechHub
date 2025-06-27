import React, { useCallback } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Image, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../components/CartContext.jsx';
import { ref, push } from 'firebase/database';
import { auth, db } from '../db/firebaseConfig';

const TrashIcon = () => (
  <View style={styles.trashIcon}>
    <View style={styles.trashHandle} />
    <View style={styles.trashLid}>
      <View style={styles.trashLidHandle} />
    </View>
    <View style={styles.trashBody}>
      <View style={styles.trashLine} />
      <View style={[styles.trashLine, styles.trashLineCenter]} />
      <View style={[styles.trashLine, styles.trashLineRight]} />
    </View>
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

    const stockColor = item.stock > 0 ? '#27AE60' : '#E74C3C';
    const itemTotal = item.price * item.quantity;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          {item.mainImage && (
            <Image
              source={{ uri: item.mainImage }}
              style={styles.itemImage}
              resizeMode="cover"
            />
          )}
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle} numberOfLines={2}>{item.title || 'Untitled Item'}</Text>
          <Text style={styles.itemPrice}>${(item.price || 0).toLocaleString()}</Text>
          <View style={styles.stockContainer}>
            <View style={[styles.stockIndicator, { backgroundColor: stockColor }]} />
            <Text style={[styles.productStock, { color: stockColor }]}>
              {item.stock > 0 ? `${item.stock} disponibles` : 'Sin stock'}
            </Text>
          </View>
          <Text style={styles.itemTotal}>Total: ${itemTotal.toLocaleString()}</Text>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item.id)}>
            <TrashIcon />
          </TouchableOpacity>
          <View style={styles.quantityControls}>
            <TouchableOpacity onPress={() => decrementQuantity(item.id)} style={styles.controlButton}>
              <Text style={styles.controlButtonText}>−</Text>
            </TouchableOpacity>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityText}>{item.quantity}</Text>
            </View>
            <TouchableOpacity onPress={() => incrementQuantity(item.id)} style={styles.controlButton}>
              <Text style={styles.controlButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [decrementQuantity, incrementQuantity, removeFromCart]);

  return (
    <View style={styles.container}>
      {Array.isArray(cartItems) && cartItems.length > 0 ? (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Mi Carrito</Text>
            <Text style={styles.headerSubtitle}>{cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}</Text>
          </View>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => (item && item.id) ? item.id.toString() : Math.random().toString()}
            renderItem={renderItem}
            extraData={cartItems}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total del Carrito</Text>
              <Text style={styles.totalText}>
                ${getTotalPrice().toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity onPress={handleFinishPurchase} style={styles.finishButton}>
              <Text style={styles.finishButtonText}>Finalizar Compra</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtitle}>Agrega algunos productos para comenzar</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: 90,
    height: 90,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F8F9FA',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#212529',
    lineHeight: 22,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 8,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  productStock: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  actionsContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 12,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    shadowColor: '#E74C3C',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 4,
  },
  controlButton: {
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  controlButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
  },
  quantityContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
  },
  totalText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#28A745',
  },
  finishButton: {
    backgroundColor: '#28A745',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#28A745',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 24,
  },
  trashIcon: {
    width: 18,
    height: 20,
    position: 'relative',
    alignItems: 'center',
  },
  trashHandle: {
    position: 'absolute',
    top: 0,
    width: 10,
    height: 2,
    backgroundColor: '#E74C3C',
    borderRadius: 1,
    zIndex: 3,
  },
  trashLid: {
    position: 'absolute',
    top: 2,
    width: 16,
    height: 3,
    backgroundColor: '#E74C3C',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    zIndex: 2,
  },
  trashLidHandle: {
    position: 'absolute',
    top: -2,
    left: 5,
    width: 6,
    height: 2,
    backgroundColor: '#E74C3C',
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  },
  trashBody: {
    position: 'absolute',
    top: 5,
    width: 14,
    height: 15,
    backgroundColor: '#E74C3C',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 2,
  },
  trashLine: {
    width: 1.5,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 0.5,
  },
  trashLineCenter: {
    marginLeft: 0,
  },
  trashLineRight: {
    marginLeft: 0,
  },
});