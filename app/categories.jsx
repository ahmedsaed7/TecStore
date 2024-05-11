import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Dimensions, ScrollView, SafeAreaView, TextInput, Pressable } from 'react-native';
import { useLocalSearchParams  , useRouter} from 'expo-router';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Ionicons } from '@expo/vector-icons';
import Item from './Item';

const { width } = Dimensions.get('window');

const CategoriesPage = () => {
  const { category } = useLocalSearchParams(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [categoryItems, setCategoryItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAndFilterItems = async () => {
      try {
        const q = query(collection(db, 'Products'), where('category', '==', category));
        const querySnapshot = await getDocs(q);
        
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCategoryItems(items); 
        
        const results = searchTerm
          ? items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
          : items; 

        setFilteredData(results); 
      } catch (error) {
        console.error('Error fetching or filtering items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFilterItems(); 
  }, [category, searchTerm]); 

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Item
        name={item.name}
        price={item.price}
        image={item.imageUrl}
        productId={item.id}
      />
    </View>
  );

  return (
    <ScrollView style={styles.scrollContainer}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header1}>
        <Pressable style={styles.backButton} onPress={() => router.back()} >
        <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.title}>Category: {category}</Text>
        </View>
        <View style={styles.header}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
          <Pressable
            style={styles.cardButton}
            onPress={() => console.log('Card Button Pressed')}
          >
            <Ionicons name="cart-outline" size={40} color="#0a4a7c" />
          </Pressable>
        </View>
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          horizontal={false}
          ListEmptyComponent={<Text>No items found for this category.</Text>}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    backButton: {
        padding: 10,
        color : '#0a4a7c',
        marginRight : 20,
      },
        header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      },
      header1: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'center',
        marginBottom: 20,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color : '#0a4a7c',
      },
      itemActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'left',
      },
      searchInput: {
        flex: 1,
        fontSize: 16,
        borderRadius: 10,
        borderColor: '#0a4a7c',
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
      },
      scrollContainer: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: 'lightgray',
      },
      safeContainer: {
        padding: 20,
      },
      slider: {
        marginBottom: 20,
      },
      section: {
        marginBottom: 20,
      },
      sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      itemContainer: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
        marginBottom: 10,
      },
      itemActions: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // Align items on the left
      },
      emptyText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#666',
        alignSelf: 'center',
      },
      cardButton: {
        marginLeft: 10,
      },
      itemContainer: {
        width: (width - 60) / 2,
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: 'white',
        marginLeft: 10,
      },
});

export default CategoriesPage;

