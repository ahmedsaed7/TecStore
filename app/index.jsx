// import React, { useState, useEffect } from 'react';
// import { getItemFor, storeData } from './isFirstTime';
// import {  router } from 'expo-router';
// import {view, Stylesheet , StatusBar , SafeAreaView} from "react-native";
// import { onAuthStateChanged } from "firebase/auth";
// import {auth} from "../firebase";

// const HAS_LAUNCHED = 'HAS_LAUNCHED';

// const Index = () => {
//   const [hasLaunched, setHasLaunched] = useState(null);

//   useEffect(() => {
//     const checkFirstLaunch = async () => {
//       const hasLaunchedValue = await getItemFor(HAS_LAUNCHED);
//       if (hasLaunchedValue) {
//         setHasLaunched(true);
//       } else {
//         await storeData(HAS_LAUNCHED, 'true');
//         setHasLaunched(false);
//       }
//     };

//     checkFirstLaunch().catch((error) => {
//       console.error(error);
//     });
//   }, []);

//   if (hasLaunched === null) {
//     return null;
//   }

//   return <>
//   {hasLaunched ? 
//     router.replace(`./Home`)
//     :
//     router.replace(`./welcome`)
//    }
//    </>;
// };

// export default Index;
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { AuthContext } from '../AuthContext';
import { getItemFor, storeData } from './isFirstTime';
import { router } from 'expo-router';

const HAS_LAUNCHED = 'HAS_LAUNCHED';

const Index = () => {
  const [hasLaunched, setHasLaunched] = useState(null);
  const { state } = useContext(AuthContext);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunchedValue = await getItemFor(HAS_LAUNCHED);
      if (hasLaunchedValue) {
        setHasLaunched(true);
      } else {
        await storeData(HAS_LAUNCHED, 'true');
        setHasLaunched(false);
      }
    };

    checkFirstLaunch().catch((error) => {
      console.error(error);
    });
  }, []);

  useEffect(() => {
    if (hasLaunched !== null && !state.loading) {
      if (hasLaunched) {
        if (state.isAuthenticated) {
          router.replace('./Home');
        } else {
          router.replace('./Home');
        }
      } 
      else {
        router.replace('./welcome');
      }
    }
  }, [hasLaunched, state.loading, state.isAuthenticated]);

  if (hasLaunched === null || state.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <StatusBar barStyle="default" />
      </View>
    );
  }

  return null;
};

export default Index;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

