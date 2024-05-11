import React, { useEffect, useState } from 'react';
import {Text,View,StyleSheet,SafeAreaView,FlatList,Pressable,TextInput,ScrollView,Dimensions,ActivityIndicator} from 'react-native';
import {collection,onSnapshot} from 'firebase/firestore';
import { db } from '../../../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Item from '../../Item';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Slider from '../../slider';

const { width } = Dimensions.get('window');

const Home = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [filteredLaptops, setFilteredLaptops] = useState([]);
  const [filteredPopular, setFilteredPopular] = useState([]);
  const [filteredLatest, setFilteredLatest] = useState([]);
  const [filteredPhones, setFilteredPhones] = useState([]);
  const [filteredAccessories, setFilteredAccessories] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Products'), (snapshot) => {
      const fetchedProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(fetchedProducts); 

      const popular = fetchedProducts.filter((item) => item.category === 'popular');
      const latest = fetchedProducts.filter((item) => item.category === 'latest');
      const laptops = fetchedProducts.filter((item) => item.category === 'laptop');
      const phones = fetchedProducts.filter((item) => item.category === 'phone');
      const accessories = fetchedProducts.filter((item) => item.category === 'accessories');

      setFilteredPopular(
        popular.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      setFilteredLatest(
        latest.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      setFilteredLaptops(
        laptops.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      setFilteredPhones(
        phones.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      setFilteredAccessories(
        accessories.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      setLoading(false); 
    });

    return () => unsubscribe(); 
  }, [searchTerm]); 

  const renderProduct = ({ item }) => (
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
        {/* Header Section */}
        <View style={styles.header}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
          <Pressable
            style={styles.cardButton}
            onPress={() => router.push('/card')}
          >
            <Ionicons name="cart-outline" size={40} color="#0a4a7c" />
          </Pressable>
        </View>

        {/* Slider Section */}
        <View style={styles.slider}>
          <Slider />
        </View>

        {/* Latest products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Latest Products
          </Text>
          <FlatList
            data={filteredLatest}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            horizontal={true}
            ListEmptyComponent={
              <View >
              <ActivityIndicator size={50}></ActivityIndicator>
            </View>
            }
          />
        </View>

        {/* Most popular products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Most Popular
          </Text>
          <FlatList
            data={filteredPopular}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            horizontal={true}
            ListEmptyComponent={
              <View>
              <ActivityIndicator size={50}></ActivityIndicator>
            </View>
            }
          />
        </View>

        {/* Laptops Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Laptops
            <Pressable onPress={() => router.push(`/categories?category=laptop`)}>
              <Text style={styles.see}>see more {'>>'} </Text>
            </Pressable>
          </Text>
          <FlatList
            data={filteredLaptops}
            horizontal={true}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View>
              <ActivityIndicator size={50}></ActivityIndicator>
            </View>
            }
          />
        </View>

        {/* Phones Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Phones
            <Pressable onPress={() => router.push(`/categories?category=phone`)}>
              <Text style={styles.see}>see more {'>>'}</Text>
            </Pressable>
          </Text>
          <FlatList
            data={filteredPhones}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            horizontal={true}
            ListEmptyComponent={
              <View>
              <ActivityIndicator size={50}></ActivityIndicator>
            </View>
            }
          />
        </View>

        {/* Accessories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Accessories
            <Pressable onPress={() => router.push(`/categories?category=accessories`)}>
              <Text style={styles.see}>see more {'>>'}</Text>
            </Pressable>
          </Text>
          <FlatList
            data={filteredAccessories}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            horizontal={true}
            ListEmptyComponent={
              <View>
              <ActivityIndicator size={50}></ActivityIndicator>
              </View>
            }
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
  },
  see: {
    color: '#0a4a7c',
    textDecorationLine: 'underline',
    fontSize: 12,
  },
});

export default Home;
