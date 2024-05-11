import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, FlatList, Pressable, TextInput } from 'react-native';
import {  collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function adminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const updatedUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(updatedUsers);
      const filterResults = updatedUsers.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filterResults); 
    });

    return () => unsubscribe(); 
  }, [searchTerm]); 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
            {/* <Pressable onPress={() => handleDeleteUser(item.email)} style={styles.deleteButton}>
              <Ionicons name="trash-bin-outline" size={24} color="red" />
            </Pressable> */}
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No users found</Text>}
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
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 4,
    borderRadius: 5,
  },
});
