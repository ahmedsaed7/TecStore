import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions, Image, Alert } from 'react-native';
import { getAuth, onAuthStateChanged ,signOut } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc  } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Ionicons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';


const windowWidth = Dimensions.get('window').width;

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({}); 
  const [currentlyEditing, setCurrentlyEditing] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        const userId = authenticatedUser.uid;
        try {
          const usersRef = collection(db, 'users');
          const userQuery = query(usersRef, where('userId', '==', userId));
          const querySnapshot = await getDocs(userQuery);
  
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUser(userData);
  
            // Initialize formData with expected keys to avoid undefined values
            setFormData({
              name: userData.name || '',
              email: userData.email || '',
              Age: userData.Age || '',
              gender: userData.gender || '',
              Phone: userData.Phone || '',
            });
  
            if (userData.image) {
              setProfileImage(userData.image);
            }
          } else {
            console.warn('User not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setProfileImage(null);
      }
    });
  
    return () => unsubscribe();
  }, []);

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const imageResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!imageResult.canceled && imageResult.assets[0].uri) {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, 'users'), where('name', '==', user.name))
        );
        if (querySnapshot.empty) {
          alert('User not found.');
          return;
        }

        const docRef = querySnapshot.docs[0].ref;

        await updateDoc(docRef, {
          image: imageResult.assets[0].uri,
        });

        setProfileImage(imageResult.assets[0].uri);
      } catch (error) {
        console.error('Error updating user document:', error);
      }
    } else {
      console.log('Image selection canceled or URI not present:', imageResult);
    }
  };
  
  const handleSaveChanges = async () => {
    if (!user) {
      console.error('User object is undefined');
      Alert.alert('Error', 'User data is missing');
      return;
    }

    if (!formData.name || !formData.email) {
      console.error('Required fields are undefined');
      Alert.alert('Error', 'Required fields are missing');
      return;
    }

    try {
      const userId = user.userId;
      if (!userId) {
        Alert.alert('User ID is undefined');
        return;
      }

      const userQuery = query(collection(db, 'users'), where('userId', '==', userId)); // Check userId is not undefined
      const querySnapshot = await getDocs(userQuery);
      if (querySnapshot.empty) {
        alert('User not found.');
        return;
      }

      const docRef = querySnapshot.docs[0].ref;

      await updateDoc(docRef, {
        name: formData.name,
        email: formData.email,
        Age: formData.Age || '', // Ensure field is not undefined
        gender: formData.gender || '', // Ensure field is not undefined
        Phone: formData.Phone || '', // Ensure field is not undefined
      });

      setUser(formData); // Update user data
      setCurrentlyEditing(false); // Disable editing mode
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating user document:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <View style={styles.signInPrompt}>
        <Text style={styles.promptText}>Please sign in</Text>
        <Pressable style={styles.signInButton}  onPress={() => router.push('/login')}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </Pressable>
      </View>
    );
  }
  
  return (
    <ScrollView>
    <View style={styles.container}>
    {user ? (
      <View style={styles.profileBox}>
        <View style={styles.imageContainer}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../../../assets/images/th.jpg')}
            style={styles.profileImage}
            />
          <Pressable onPress={handleImageUpload} style={styles.cameraIcon}>
            <Ionicons name="camera" size={24} color="white" />
          </Pressable>
        </View>

        <View style={styles.userInfo}>
          {['name', 'email', 'Age', 'gender', 'Phone'].map((field) => (
            <View key={field} style={styles.fieldContainer}>
              {currentlyEditing === field ? (
                <TextInput
                style={styles.input}
                value={formData[field]}
                onChangeText={(text) => setFormData({ ...formData, [field]: text })}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                onBlur={() => setCurrentlyEditing(null)} // Exit edit mode when focus is lost
                />
              ) : (
                <Text style={styles.userText}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}: {user[field]}
                </Text>
              )}
              <Pressable
                style={styles.editIcon}
                onPress={() => setCurrentlyEditing(field)} // Start editing this field
                >
                <Ionicons name="create-outline" size={24} color="gray" />
              </Pressable>
            </View>
          ))}
        </View>

        {currentlyEditing && (
          <Pressable style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        )}
      </View>
    ) : (
      <View style={styles.signInPrompt}>
        <Text style={styles.promptText}>Please sign in</Text>
        <Pressable style={styles.signInButton} onPress={() => router.push('login')}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </Pressable>
      </View>
    )}
      <View>
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
           <Text style={styles.signOutButtonText}>Sign Out</Text>
        </Pressable>
      </View>
  </View>
</ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  profileBox: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: windowWidth * 0.3, // Adjust the image size based on the screen width
    height: windowWidth * 0.3,
    borderRadius: (windowWidth * 0.3) / 2, // Ensure the image is always a circle
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -10,
    right: 90,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    padding: 5,
  },
  userInfo: {
    alignItems: 'left',
    padding: 20,
  },
  userText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  editIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  input: {
    borderColor: '#D1D5DB',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 18,
    color: '#333',
    width: '90%', // Adjust the input width based on the screen width
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    width: '50%', // Adjust the button width based on the screen width
  },
  signOutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
    width: '50%', // Adjust the button width based on the screen width
  },
  signInPrompt: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
  },
  promptText: {
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 15,
  },
  signInButton: {
    backgroundColor: "#0a4a7c",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    width: '50%', // Adjust the button width based on the screen width
  },
  signInButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Profile;
