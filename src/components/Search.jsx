import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Search({ searchQuery, setSearchQuery, onSearch }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={24} color="#888" style={styles.icon} />
      <TextInput
        style={[styles.input, { height: 48 }]}
        placeholder="Buscar productos"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Buscar" onPress={onSearch} color="#6200ea" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  icon: {
    marginRight: 10,
  },
});
