import { View, Text, StyleSheet, Image , Pressable } from "react-native";
import React, { useEffect , useState } from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import {Feather,AntDesign,MaterialIcons,Ionicons,} from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, } from 'firebase/firestore';
import { db } from '../../firebase';

const CustomDrawerContent = (props) => {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

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
            // Set the profile image if it exists in the user data
            if (userData.image) {
              setProfileImage(userData.image);
            }
          } else {
            console.log('User not found');
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

  return (
    <DrawerContentScrollView {...props} 
    style = {{backgroundColor : '#fff' }}>
      <View >
        {user ? (
          <View style={styles.userInfoWrapper}>
            <Image
              source={{uri : profileImage}}
              width={80}
              height={80}
              style={styles.userImg}
            />
          <View >
          <Text style={styles.userName}>Welcome! </Text>
          <Text style={styles.userName}>{user.name}</Text>
          </View>
        </View>
        ): (
          <View style={styles.signInPrompt}>
          <Text style={styles.promptText}>You need to sign in</Text>
          <Pressable style={styles.signInButton} onPress={() => router.push('login')}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </Pressable>
        </View>
        )
        }
      </View>
      <DrawerItem
        icon={({ color, size }) => (
          <AntDesign
            name="user"
            size={size}
            color={pathname == "/profile" ? "#fff" : "#000"}
          />
        )}
        label={"Profile"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/profile" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/profile" ? "#0a4a7c" : "#fff" }}
        onPress={() => {
          router.push("/(drawer)/(tabs)/profile");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <MaterialIcons
            name="favorite-outline"
            size={size}
            color={pathname == "/favorite" ? "#fff" : "#000"}
          />
        )}
        label={"Favourites"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/favorite" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/favorite" ? "#0a4a7c" : "#fff" }}
        onPress={() => {
          router.push("/favorite");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <Ionicons
            name="settings-outline"
            size={size}
            color={pathname == "/settings" ? "#fff" : "#000"}
          />
        )}
        label={"Settings"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/settings" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/settings" ? "#0a4a7c" : "#fff" }}
        onPress={() => {
          router.push("/settings");
        }}
      />
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />} 
    screenOptions={{headerShown: false}}
    >
    </Drawer>
  );
}

const styles = StyleSheet.create({
  promptText: {
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 15,
    alignSelf: 'center',
    marginTop: 15,
  },
  signInButton: {
    width:"60%",
    backgroundColor: "#0a4a7c",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  signInButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  userInfoWrapper: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  userImg: {
    borderRadius: 40,
  },
  userDetailsWrapper: {
    marginTop: 25,
    marginLeft: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,

  },
});