import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; 

const Sells = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const salesRef = collection(db, 'Sales');
        const salesSnapshot = await getDocs(salesRef);
  
        const sales = salesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
  
        sales.sort((a, b) => b.timestamp - a.timestamp);
  
        setSalesData(sales);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };
  
    fetchSalesData();
  }, []);
  

  const formatTimestamp = (timestamp) => {
    const date = timestamp.toDate(); 
    return date.toLocaleString(); 
  };

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={salesData}
        renderItem={({ item }) => (
          <View style={styles.saleItem}>
            <View style={styles.textContainer}>
              <Text style={styles.label}>IN:</Text>
              <Text style={styles.value}>{formatTimestamp(item.timestamp)}</Text>
              <Text style={styles.label}>User Name:</Text>
              <Text style={styles.value}>{item.userName}</Text>
              <Text style={styles.label}>User Email:</Text>
              <Text style={styles.value}>{item.userEmail}</Text>
              <Text style={styles.label}>User Address:</Text>
              <Text style={styles.value}>{item.address}</Text>
              <Text style={styles.label}>Phone Number:</Text>
              <Text style={styles.value}>{item.userPhone}</Text>
              <Text style={styles.label}>Product Name:</Text>
              <Text style={styles.value}>{item.productName}</Text>
              <Text style={styles.label}>Price:</Text>
              <Text style={styles.value}>{item.price} EGY</Text>
              <Text style={styles.label}>Quantity:</Text>
              <Text style={styles.value}>{item.quantity}</Text>
            </View>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  saleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 5,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    marginBottom: 10,
  },
});

export default Sells;
