import React, { useEffect, useState } from 'react';
import {Text,View,StyleSheet,SafeAreaView,FlatList,Pressable,TextInput,Animated,Modal,Image,} from 'react-native';
import { getDocs, collection, onSnapshot, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAuth, signOut } from 'firebase/auth';
import { useLocalSearchParams, router } from 'expo-router';
import Item from '../Item';
import AddProduct from '../admins/addProduct';
import EditProduct from '../admins/editProduct';
import deleteIcon from '../../assets/images/delete-vector-icon.jpg'
import { Ionicons } from '@expo/vector-icons';

export default function adminProduct() {
  const { username } = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Products'), (snapshot) => {
      const updatedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(updatedData); // Set the full data array

      // Apply filtering logic when data is updated
      const filterResults = updatedData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filterResults); // Update filtered data
    });

    return () => unsubscribe(); // Clean up when the component unmounts
  }, [searchTerm]); 

  const handleDelete = async (productName) => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'Products'), where('name', '==', productName))
      );
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditProductModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {username && (
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </Pressable>
      )}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>
      <Pressable style={styles.addButton} onPress={() => setShowAddProductModal(true)}>
        <Text style={styles.buttonText}>Add Product</Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddProductModal}
        onRequestClose={() => setShowAddProductModal(false)}
      >
        <View style={styles.modalContainer}>
          <AddProduct />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEditProductModal}
        onRequestClose={() => setShowEditProductModal(false)}
      >
        <View style={styles.modalContainer}>
          <EditProduct product={selectedProduct} onClose={() => setShowEditProductModal(false)} />
        </View>
      </Modal>
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <Animated.View style={styles.itemContainer}>
            <View style={styles.productInfo}>
              <Item style={styles.image}
                name={item.name}
                price={item.price}
                image={item.imageUrl}
                productId={item.id}
              />
            </View>
            <View>
              <Pressable onPress={() => handleDelete(item.name)} style={styles.deleteButton}>
                <Image source={deleteIcon} style={styles.deleteIcon} />
              </Pressable>
              <Pressable onPress={() => handleEditProduct(item)} style={styles.updateButton}>
                <Text style={styles.updateText}>Update..</Text>
                <Ionicons name="arrow-forward-outline" size={24} color="white" style={styles.icon} />
              </Pressable>
            </View>
          </Animated.View>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#F0F0F0',
  },
  image: {
    resizeMode: "contain"
  },
  signOutButton: {
    backgroundColor: '#FF6347',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signOutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    borderRadius: 10,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '70%'
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  productInfo: {
    flex: 1,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    width: 30,
    height: 30,
  },
  updateButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateText: {
    color: 'black',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontWeight: 'bold',
    textDecorationLine: "underline", 
    fontWeight:'900',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
  },
});
