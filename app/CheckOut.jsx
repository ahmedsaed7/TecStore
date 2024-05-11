import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, Pressable, Alert, TextInput } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc, addDoc, Timestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'expo-router'; 

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userId, setUserId] = useState(null);
    const [address, setAddress] = useState('');
    const router = useRouter();
    const [totalPrice, setTotalPrice] = useState(0);
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userId = user.uid;
                setUserId(userId);
                await fetchCartAndUserData(userId);
            } else {
                setUserId(null);
            }
        });
    
        return () => unsubscribe();
    }, []);
    
    const fetchCartAndUserData = async (userId) => {
        if (userId) {
            const [cartItems, userData] = await Promise.all([fetchCartData(userId), fetchUserData(userId)]);
            setCartItems(cartItems);
            calculateTotalPrice(cartItems);
        }
    };
    
    const fetchCartData = async (userId) => {
        const cartQuery = query(collection(db, 'Cart'), where('userId', '==', userId));
        const cartSnapshot = await getDocs(cartQuery);
        const items = [];
        for (const cartDoc of cartSnapshot.docs) {
            const cartData = cartDoc.data();
            const productDoc = await getDoc(doc(db, 'Products', cartData.productId));
            const productData = productDoc.data();
            if (productData) {
                items.push({
                    id: cartDoc.id,
                    name: productData.name,
                    price: productData.price,
                    image: productData.imageUrl,
                    userId: cartData.userId,
                    quantity: cartData.quantity,
                });
            }
        }
        return items;
    };
    
    const fetchUserData = async (userId) => {
        const usersQuery = query(collection(db, 'users'), where('userId', '==', userId));
        const userSnapshot = await getDocs(usersQuery);
        if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            setUserEmail(userData.email || '');
            setUserName(userData.name || '');
            setUserPhone(userData.Phone || '');
            return userData;
        }
    };
    
    const calculateTotalPrice = (cartItems) => {
        let total = 0;
        cartItems.forEach(item => {
            total += item.price * item.quantity;
        });
        setTotalPrice(total);
    };

    const handleConfirm = async () => {
        Alert.alert(
            'Confirm Order',
            'The products will be delivered. Proceed?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel pressed'),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        try {
                            const salesRef = collection(db, 'Sales');
                            const timestamp = Timestamp.now();
                            for (const item of cartItems) {
                                await addDoc(salesRef, {
                                    userId: userId,
                                    userName: userName,
                                    userEmail: userEmail,
                                    userPhone: userPhone, // Include phone number
                                    address: address,
                                    productName: item.name,
                                    price: item.price,
                                    quantity: item.quantity,
                                    imageUrl: item.image,
                                    timestamp: timestamp,
                                });
                            }
                            const cartQuery = query(collection(db, 'Cart'), where('userId', '==', userId));
                            const cartSnapshot = await getDocs(cartQuery);
                            for (const doc of cartSnapshot.docs) {
                                await deleteDoc(doc.ref);
                            }
                            router.back();
                        } catch (error) {
                            console.error('Error creating sales record:', error);
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Checkout</Text>
            <View style={styles.userInfoContainer}>
                <Text style={styles.userInfoLabel}>User Email:</Text>
                <Text style={styles.userInfoText}>{userEmail}</Text>
                <Text style={styles.userInfoLabel}>Name:</Text>
                <Text style={styles.userInfoText}>{userName}</Text>
                <Text style={styles.userInfoLabel}>Phone:</Text>
                <Text style={styles.userInfoText}>{userPhone}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your address"
                    onChangeText={setAddress}
                    value={address}
                />
            </View>
            <View style={{ alignItems: 'center', paddingBottom: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'red' }}>Whole Price : {totalPrice} EGY</Text>
            </View>
            <FlatList
                style={styles.productList}
                data={cartItems}
                renderItem={({ item }) => (
                    <View style={styles.productItem}>
                        <Text>{item.name}</Text>
                        <Text>{item.price} EGY</Text>
                        <Text>Quantity : {item.quantity}</Text>
                        <Image source={{ uri: item.image }} style={styles.image} />
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
            <View style={styles.buttonContainer}>
                <Pressable onPress={() => router.replace('Cart')}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                </Pressable>
                <Pressable onPress={handleConfirm}>
                    <Text style={styles.confirmButton}>Confirm</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        paddingTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: "100%",
        height: 150,
        borderRadius: 10,
        marginLeft: 'auto',
        marginBottom: 'auto',
        resizeMode: 'contain'
    },
    userInfoContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    userInfoLabel: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 5,
    },
    userInfoText: {
        marginBottom: 10,
        fontSize: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    productList: {
        flexGrow: 1,
    },
    productItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    confirmButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Checkout;
