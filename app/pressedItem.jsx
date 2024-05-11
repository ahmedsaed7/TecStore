import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase'; 

export default function PressedItem() {
  const { productId } = useLocalSearchParams();
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const docRef = doc(db, "Products", productId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          setItemData(data);
        } else {
          console.log('Item not found');
        }
      } catch (error) {
        console.error('Error fetching item data:', error);
      }
    };

    fetchItemData();
  }, [productId]);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {itemData ? (
          <>
            <Text style={styles.name}>{itemData.name}</Text>
            <Text style={styles.price}>${itemData.price}</Text>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
      {itemData && (
        <Image source={{ uri: itemData.imageUrl }} style={styles.image} />
      )}
    </View>
  );  
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#dedede",
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingVertical: 50,
      width: "100%",
    },
    textContainer: {
      marginTop: '10%',
      paddingHorizontal: 20 ,
    },
    name: {
      fontSize: 25,
      fontWeight: 'bold',
    },
    price: {
      fontSize: 18,
      color: '#888',
    },
    image: {
      width: "100%",
      height: 300,
      borderRadius: 10,
      marginLeft: 'auto',
      marginBottom: 'auto',
    },
  });
  