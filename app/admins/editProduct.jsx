import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { updateDoc, query, collection, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Ionicons } from '@expo/vector-icons'; 

const EditProduct = ({ product, onClose }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [imageUrl, setImageUrl] = useState(product.imageUrl);
  const [category, setcategory] = useState('');

  const handleUpdateProduct = async () => {
    try {
      if (!name.trim() || !price.trim()) {
        alert('Please fill in all fields.');
        return;
      }

      const querySnapshot = await getDocs(
        query(collection(db, 'Products'), where('name', '==', product.name))
      );

      if (querySnapshot.empty) {
        alert('Product not found.');
        return;
      }

      const docRef = querySnapshot.docs[0].ref;

      await updateDoc(docRef, {
        name: name.trim(),
        price: parseFloat(price.trim()),
        imageUrl: imageUrl.trim(),
        category: category.trim(),
      });

      alert('Product updated successfully');
      onClose(); // Close the modal or navigate back
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Product Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />
      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
      />
      <Text style={styles.label}>category</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter category"
        value={category}
        onChangeText={setcategory}
      />
      {/* Update button with arrow icon */}
      <Pressable style={styles.updateButton} onPress={handleUpdateProduct}>
        <Text style={styles.buttonText}>Update Product</Text>
        <Ionicons name="arrow-forward-outline" size={24} color="white" style={styles.icon} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    backgroundColor: '#F0F0F0',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  updateButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row', 
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10, 
  },
  icon: {
    marginLeft: 10, 
  },
});

export default EditProduct;
