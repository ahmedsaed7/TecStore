import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image , Pressable , } from 'react-native';
import { useLocalSearchParams } from "expo-router";
import {query, collection , where , getDocs, doc, getDoc, updateDoc, addDoc  } from "firebase/firestore";
import { db } from '../firebase'; 
import StarRating from "./StarRating";
import {addRate , deleteRate , getAverageRate , checkUserRating, getRateByUserIdAndProductId} from "./Rates";
import { Ionicons } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


export default function PressedItem( ) {
  
  const { productId } = useLocalSearchParams();
  const [itemData, setItemData] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [product, setProduct] = useState([]);
  const [userId, setUserId] = useState(null);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        const userId = authenticatedUser.uid;
        setUserId(userId);
      } else {
        setUserId(null);
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (userId) {
      async function fetchData() {
        fetchRateByUserIdAndProductId();
        checkUserRatingStatus();
        setHasRated(hasRated);
        fetchProduct();
        fetchAverageRating();
      }
      fetchData();
    }
  }, [userId]);

  const toggleCart = async (productId) => {
    try {
      if (!userId) {
        alert('Please sign in to add items to your cart');
        return;
      }
  
      const cartQuery = query(
        collection(db, 'Cart'),
        where('userId', '==', userId),
        where('productId', '==', productId)
      );
      const cartSnapshot = await getDocs(cartQuery);
  
      if (!cartSnapshot.empty) {
        const cartDoc = cartSnapshot.docs[0];
        const { quantity: currentQuantity } = cartDoc.data();
        await updateDoc(cartDoc.ref, { quantity: currentQuantity + 1 });
      } else {
        const data = {
          userId,
          productId,
          quantity: 1,
        };
        await addDoc(collection(db, 'Cart'), data);
      }
  
      console.log('Product added to cart successfully');
  
    } catch (error) {
      console.error('Error toggling cart:', error);
    }
  };
  

  const fetchProduct = async () => {
    const fetchedProduct = await getProductById(id);
    setProduct(fetchedProduct);
  };

  const fetchRateByUserIdAndProductId = async () => {
    try {
      const fetchedRates = await getRateByUserIdAndProductId(userId, productId);
      const rateQuantities = fetchedRates.map((rate) => rate.rate);
      setRating(rateQuantities);
    } catch (error) {
      console.error("Error fetching rates by user ID and product ID:", error);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      if (!userId) {
        alert('Please sign in to submit a rating.');
        return;
      }
      const newRate = {
        userId: userId,
        productId: productId,
        rate: rating, 
      };
      await addRate(newRate);
      await fetchAverageRating();
      await checkUserRatingStatus();
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleRatingDelete = async () => {
    try {
      await deleteRate(userId, productId);
      fetchAverageRating();
      checkUserRatingStatus();
      setRating(0);
      setHasRated(false);
    } catch (error) {
      console.error("Error deleting rating:", error);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const avgRating = await getAverageRate(productId);
      setAverageRating(avgRating);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  const checkUserRatingStatus = async () => {
    try {
      const hasUserRated = await checkUserRating(userId, productId);
      setHasRated(hasUserRated);
    } catch (error) {
      console.error("Error checking user rating status:", error);
    }
  };

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
        <Pressable Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
         </Pressable>
        {itemData ? (
          <>
          {itemData && (
            <View style={styles.imageContainer}>
            <Image source={{ uri: itemData.imageUrl }} style={styles.image} />
            </View>
          )}
            <Text style={styles.name}>{itemData.name}</Text>
            <Text style={styles.price}>${itemData.price}</Text>

            <StarRating rating={rating} onRatingChange={setRating} />
              {hasRated ? (
                <Pressable style={styles.buttonAction} onPress={handleRatingDelete}>
                  <Text style={styles.buttonText}>Delete Rating</Text>
                </Pressable>
              ) : (
                <Pressable style={styles.buttonAction} onPress={handleRatingSubmit}>
                  <Text style={styles.buttonText}>Submit Rating</Text>
                </Pressable>
              )}
            <Text style={{ fontWeight: "bold" }}>
              Average Rating: {averageRating}
            </Text>
            <Pressable style={styles.buttonAdd} onPress={() => toggleCart(productId)}>
              <Text style={styles.buttonText}>Add To Cart</Text>
            </Pressable>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </View>
  );  
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"lightgray",
      // alignItems: 'center',
      paddingTop: 30,
    },
    textContainer: {
      marginTop: 10,
      paddingHorizontal: 20 ,
    },
    name: {
      fontSize: 25,
      fontWeight: 'bold',
    },
    price: {
      fontSize: 18,
      color: '#888',
      marginBottom: 20,
    },
    image: {
      width: '100%', 
      height: '100%', 
      borderRadius: 20,
      resizeMode: 'contain'
    },
    imageContainer: {
      marginTop: 20,
      position: "relative",
      width: "100%",
      height: "40%",
    },  
    buttonAdd: {
      backgroundColor: "#636970",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 12,
      marginTop: 30,
      width: 300,
    },
    buttonAction: {
      backgroundColor: "red",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 12,
      marginTop: 30,
      marginBottom: 30,
      width: '100%',
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
    },
    backButton: {
      position: "absolute",
      left: 10,
    },
  });