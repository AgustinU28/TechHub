import React from 'react';
import { View, SafeAreaView, Text, StyleSheet, ImageBackground, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HeaderCategory({ title, showBackButton = false, rightComponent }) {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ImageBackground
            source={require('../img/logo.png')}
            style={styles.logo}
            resizeMode="cover"
          >
            {typeof title === 'string' ? (
              <Text style={styles.headerText}>{title}</Text>
            ) : (
              title
            )}
          </ImageBackground>
        </View>

        {rightComponent && <View style={styles.rightComponent}>{rightComponent}</View>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    height: 150,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  logo: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rightComponent: {
    position: 'absolute',
    right: 16,
  },
});
