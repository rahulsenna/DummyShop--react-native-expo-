import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, useColorScheme, ScrollView, FlatList } from 'react-native';
import axios from 'axios';
import { Link, Stack, useLocalSearchParams, useNavigation } from 'expo-router';

import { Product } from "@/src/types/Product";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FlashList } from '@shopify/flash-list';

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



  if (!product) {
    return (
    <>
    <Stack.Screen options={{ title: 'Oops!' }} />
    <ThemedView style={styles.loadingContainer}>
      <ThemedText type="title">Product not found.</ThemedText>
      <Link href="(tabs)/(home)/ProductDetails/3" style={styles.loadingText}>
        <ThemedText type="link">Get some Coffee!</ThemedText>
      </Link>
      <Link href="(tabs)/(home)/ProductList" style={styles.loadingText}>
        <ThemedText type="link">Go to home screen!</ThemedText>
      </Link>
    </ThemedView>
    </>
    );
  }


  return (

    <ScrollView contentContainerStyle={styles.container}>
           <FlashList
        data={product.images}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator
        horizontal
        renderItem={({ item }) => {
          console.log('Rendering image:', item); // Log each image URL
          return (
            <Image source={{ uri: item }} style={styles.thumbnail} />
          );
        }}
      />
    
    <Text style={styles.title}>{product.title}</Text>
    <Text style={styles.description}>{product.description}</Text>
    <Text style={styles.price}>${product.price.toFixed(2)}</Text>
    <Text style={styles.availability}>Availability: {product.availabilityStatus}</Text>
    <Text style={styles.warranty}>Warranty: {product.warrantyInformation}</Text>
    <Text style={styles.shipping}>Shipping: {product.shippingInformation}</Text>
    <Text style={styles.returnPolicy}>Return Policy: {product.returnPolicy}</Text>
    <Text style={styles.tags}>Tags: {product.tags.join(', ')}</Text>

    <View style={styles.reviewsContainer}>
      <Text style={styles.reviewsTitle}>Reviews:</Text>
      {product.reviews.length === 0 ? (
        <Text>No reviews available</Text>
      ) : (
        <FlashList
          estimatedItemSize={125}
          data={product.reviews}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.reviewItem}>
              <Text style={styles.reviewRating}>Rating: {item.rating}</Text>
              <Text style={styles.reviewComment}>{item.comment}</Text>
              <Text style={styles.reviewDate}>Date: {new Date(item.date).toLocaleDateString()}</Text>
              <Text style={styles.reviewReviewer}>By: {item.reviewerName}</Text>
            </View>
          )}
        />
      )}
    </View>
  </ScrollView>
  

  );
  
};

const createStyles = (colorScheme: 'light' | 'dark') => StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
  },
  loadingText: {
    color: colorScheme === 'dark' ? '#fff' : '#000',
  },
  thumbnail: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? '#fff' : '#000',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: colorScheme === 'dark' ? '#ccc' : '#000',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? '#fff' : '#000',
    marginBottom: 10,
  },
  availability: {
    fontSize: 16,
    color: colorScheme === 'dark' ? '#ccc' : '#000',
    marginBottom: 10,
  },
  warranty: {
    fontSize: 16,
    color: colorScheme === 'dark' ? '#ccc' : '#000',
    marginBottom: 10,
  },
  shipping: {
    fontSize: 16,
    color: colorScheme === 'dark' ? '#ccc' : '#000',
    marginBottom: 10,
  },
  returnPolicy: {
    fontSize: 16,
    color: colorScheme === 'dark' ? '#ccc' : '#000',
    marginBottom: 10,
  },
  tags: {
    fontSize: 16,
    color: colorScheme === 'dark' ? '#ccc' : '#000',
    marginBottom: 10,
  },
  reviewsContainer: {
    marginTop: 20,
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? '#fff' : '#000',
    marginBottom: 10,
  },
  reviewItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colorScheme === 'dark' ? '#555' : '#ddd',
    paddingBottom: 10,
  },
  reviewRating: {
    fontSize: 16,
    color: colorScheme === 'dark' ? '#fff' : '#000',
  },
  reviewComment: {
    fontSize: 16,
    color: colorScheme === 'dark' ? '#ccc' : '#000',
    marginBottom: 5,
  },
  reviewDate: {
    fontSize: 14,
    color: colorScheme === 'dark' ? '#aaa' : '#555',
    marginBottom: 5,
  },
  reviewReviewer: {
    fontSize: 14,
    color: colorScheme === 'dark' ? '#aaa' : '#555',
  },
});

export default ProductDetailsScreen;
