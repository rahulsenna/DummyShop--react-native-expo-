import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, useColorScheme, ActivityIndicator, Pressable } from 'react-native';
import axios from 'axios';
import { FlashList } from '@shopify/flash-list';
import { ErrorBoundaryProps, Link } from 'expo-router';

import { Product } from "@/src/types/Product";

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Text>{props.error.message}</Text>
      <Text onPress={props.retry}>Try Again?</Text>
    </View>
  );
}

const ProductListScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const colorScheme = useColorScheme();
  const limit = 20;

  useEffect(() => {
    loadProducts(skip, limit);
  }, []);

  const loadProducts = (skip: number, limit: number) => {
    axios.get<{ products: Product[], total: number }>(`https://dummyjson.com/products?skip=${skip}&limit=${limit}`)
      .then(response => {
        setProducts(prevProducts => [...prevProducts, ...response.data.products]);
        setLoading(false);
        setLoadingMore(false);
        if (response.data.products.length < limit) {
          setHasMore(false);
        }
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
        setLoadingMore(false);
      });
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      setSkip(prevSkip => prevSkip + limit);
      loadProducts(skip + limit, limit);
    }
  };

  const styles = createStyles(colorScheme!);

  if (loading && products.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Product }) => (
    <Link 
    href={{
      pathname: 'ProductDetails/[id]',
      params: { id: item.id },
    }}
     asChild>
      <Pressable>

    <View style={styles.productContainer}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.productDetails}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
    </View>
    </Pressable>
    </Link>
  );

  return (
    <FlashList
      estimatedItemSize={189}
      data={products}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} /> : null}
    />
  );
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

export default ProductListScreen;
