import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { db } from '../../../firebase';
import { doc, getDoc, collection, query, where, onSnapshot, deleteDoc , getDocs} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function favorite() {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (authenticatedUser) => {
      setUserId(authenticatedUser ? authenticatedUser.uid : null);
    });
    let unsubscribeFavorites = null; 
    if (userId) {
      const favoritesQuery = query(collection(db, 'Favorites'), where('userId', '==', userId));
      unsubscribeFavorites = onSnapshot(favoritesQuery, (snapshot) => {
        const favorites = snapshot.docs.map((doc) => ({
          productId: doc.data().productId,
        }));
        setFavoriteItems(favorites); 
      });
    }
    return () => {
      unsubscribeAuth(); 
      if (unsubscribeFavorites) {
        unsubscribeFavorites(); 
      }
    };
  }, [userId]);

  const removeFavorite = async (productId) => {
    try {
      const q = query(
        collection(db, 'Favorites'),
        where('productId', '==', productId),
        where('userId', '==', userId)
      );
        const snapshot = await getDocs(q);
        for (const doc of snapshot.docs) {
        await deleteDoc(doc.ref);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Favorites</Text>
      <FlatList
        data={favoriteItems}
        renderItem={({ item }) => (
          <FavoriteItem
            key={item.productId}
            productId={item.productId}
            onRemove={() => removeFavorite(item.productId)}
          />
        )}
        keyExtractor={(item) => item.productId}
        ListEmptyComponent={<Text>Your favorites list is empty</Text>}
      />
    </View>
  );
}

function FavoriteItem({ productId, onRemove }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'Products', productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct(productSnap.data());
        } else {
          console.log("Product not found for productId:", productId);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return null;
  }

  return (
    <View style={styles.favoriteItem}>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.price}>Price: ${product.price}</Text>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#dedede',
  },
  text: {
    fontSize: 32,
    marginBottom: 10,
  },
  favoriteItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  image: {
    width: '50%',
    height: 200,
    left: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  removeButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
