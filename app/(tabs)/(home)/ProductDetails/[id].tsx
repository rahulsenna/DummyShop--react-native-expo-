import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, useColorScheme } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import { Product } from "@/src/types/Product";

const ProductDetailsScreen: React.FC = () => {

  


  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: true, title: product?.title });
  }, [navigation, product]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    axios.get(`https://dummyjson.com/products/${id}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false); 
      });
  };


  const styles = createStyles(colorScheme!);

  if (loading ) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const renderItem = ( item: Product ) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.productDetails}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
    </View>
  );

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Product not found.</Text>
      </View>
    );
  }

  return (renderItem(product));
  
};

const createStyles = (colorScheme: 'light' | 'dark') => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
  },
  loadingText: {
    color: colorScheme === 'dark' ? '#fff' : '#000',
  },
  list: {
    padding: 10,
    backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
  },
  productContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
    borderRadius: 5,
    shadowColor: colorScheme === 'dark' ? '#fff' : '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  productDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? '#fff' : '#000',
  },
  description: {
    fontSize: 14,
    color: colorScheme === 'dark' ? '#ccc' : '#666',
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    color: colorScheme === 'dark' ? '#fff' : '#000',
    marginTop: 10,
  },
});

export default ProductDetailsScreen;
