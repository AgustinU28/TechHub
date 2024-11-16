import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native'; 
import { onAuthStateChanged } from 'firebase/auth';
import { ref, query, orderByKey, limitToLast, onValue } from 'firebase/database';
import { auth, db } from '../db/firebaseConfig';

const ReceiptScreen = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [purchaseData, setPurchaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    let unsubscribeDB = () => {};

    if (currentUser) {
      const purchaseRef = query(
        ref(db, `receipts/${currentUser.uid}`),
        orderByKey(),
        limitToLast(1)
      );
      
      unsubscribeDB = onValue(purchaseRef, (snapshot) => {
        if (snapshot.exists()) {
          // Convertir el objeto de Firebase a un array y tomar el último elemento
          const receipts = Object.entries(snapshot.val());
          const [id, data] = receipts[0];
          setPurchaseData({ id, ...data });
        } else {
          setPurchaseData(null);
        }
      }, (error) => {
        console.error('Error fetching purchase data:', error);
        setPurchaseData(null);
        setLoading(false);
      });
    }

    return () => unsubscribeDB();
  }, [currentUser]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.title}</Text>
        {item.mainImage && (
          <Image
            source={{ uri: item.mainImage }}
            style={styles.itemImage}
            resizeMode="contain"
          />
        )}
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemDetail}>Cantidad: {item.quantity}</Text>
        <Text style={styles.itemDetail}>Precio unitario: ${item.price.toLocaleString()}</Text>
        <Text style={styles.itemTotal}>
          Subtotal: ${(item.price * item.quantity).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.message}>Por favor, inicia sesión para ver tus compras</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Ir al Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recibo de Compra</Text>

      {purchaseData ? (
        <>
          <Text style={styles.date}>
            Fecha: {new Date(purchaseData.date).toLocaleString()}
          </Text>
          <FlatList
            data={purchaseData.items}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total Final: ${purchaseData.totalAmount.toLocaleString()}
            </Text>
          </View>
        </>
      ) : (
        <Text style={styles.message}>No hay compras registradas</Text>
      )}

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Categories')}
      >
        <Text style={styles.buttonText}>Volver al inicio</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  itemDetails: {
    marginLeft: 10,
  },
  itemDetail: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 5,
  },
  totalContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#2c3e50',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ReceiptScreen;