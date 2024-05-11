import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Pressable } from 'react-native';
import { db } from '../firebase'; 
import { collection, query, where, onSnapshot, deleteDoc, getDocs, getDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (authenticatedUser) => {
      setUserId(authenticatedUser ? authenticatedUser.uid : null); 
    });
    let unsubscribeCart = null;
    if (userId) {
      const cartQuery = query(collection(db, 'Cart'), where('userId', '==', userId));
      unsubscribeCart = onSnapshot(cartQuery, (snapshot) => {
        const cartData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCartItems(cartData);
      });
    }

    return () => {
      unsubscribeAuth(); 
      if (unsubscribeCart) {
        unsubscribeCart(); 
      }
    };
  }, [userId]);

  const removeCartItem = async (productId) => {
    try {
      const q = query(
        collection(db, 'Cart'),
        where('productId', '==', productId),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      for (const doc of snapshot.docs) {
        await deleteDoc(doc.ref);
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      const checkoutTime = serverTimestamp();

      for (const item of cartItems) {
        const cartItemRef = doc(db, 'Cart', item.id);
        await updateDoc(cartItemRef, {
          quantity: item.quantity,
          checkoutTime: checkoutTime
        });
      }
      router.push('CheckOut');
    } catch (error) {
      console.error('Error updating cart items during checkout:', error);
    }
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  return (
    <View style={styles.container}>
      <Text></Text>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <CartItem
            key={item.productId}
            productId={item.productId}
            quantity={item.quantity}
            onRemove={() => removeCartItem(item.productId)}
            onUpdateQuantity={(newQuantity) => updateCartItemQuantity(item.productId, newQuantity)}
          />
        )}
        keyExtractor={(item) => item.productId}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.title}>Cart</Text>
            <Text>Your cart is empty</Text>
          </View>
        }
      />
      <Pressable onPress={handleCheckOut}>
        <Text style={styles.footer}>Check Out</Text>
      </Pressable>
    </View>
  );
}

function CartItem({ productId, quantity, onRemove, onUpdateQuantity }) {
  const [product, setProduct] = useState(null);
  const [itemQuantity, setItemQuantity] = useState(quantity);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'Products', productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct(productSnap.data());
        } else {
          console.log(`Product not found for productId: ${productId}`);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const increaseQuantity = () => {
    const newQuantity = itemQuantity + 1;
    setItemQuantity(newQuantity);
    onUpdateQuantity(newQuantity); 
  };

  const decreaseQuantity = () => {
    if (itemQuantity > 1) {
      const newQuantity = itemQuantity - 1;
      setItemQuantity(newQuantity);
      onUpdateQuantity(newQuantity); 
    }
  };

  if (!product) {
    return null;
  }

  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.price}>Price: ${product.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decreaseQuantity}>
            <Text style={styles.quantityButton}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{itemQuantity}</Text>
          <TouchableOpacity onPress={increaseQuantity}>
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>
        </View>
        <Pressable onPress={onRemove} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#dedede',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
  },
  footer: {
    backgroundColor: 'blue',
    color: 'white',
    padding: 15,
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    padding: 10,
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
  quantity: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover'
  },
  itemDetails: {
    marginLeft: 10,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    color: 'blue',
  },
});
