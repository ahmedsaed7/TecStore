import {collection,addDoc,updateDoc,deleteDoc,query,where,getDocs,doc,} from "firebase/firestore";
import { db } from "../firebase";


const ratesCollection = collection(db, "rates");

const addRate = async (rateData) => {
  try {
    await addDoc(ratesCollection, rateData);
    console.log("Rate added successfully.");
  } catch (error) {
    console.error("Error adding rate:", error);
  }
};

const getAverageRate = async (productId) => {
  try {
    const querySnapshot = await getDocs(
      query(ratesCollection, where("productId", "==", productId))
    );

    let totalStars = 0;
    let count = 0;

    querySnapshot.forEach((doc) => {
      const rateData = doc.data();
      totalStars += rateData.rate;
      count++;
    });

    if (count === 0) {
      return 0;
    }

    return totalStars / count;
  } catch (error) {
    console.error("Error calculating average rate:", error);
    return 0;
  }
};

const deleteRate = async (userId, productId) => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, "rates"),
        where("userId", "==", userId),
        where("productId", "==", productId)
      )
    );

    if (!querySnapshot.empty) {
      const rateDoc = querySnapshot.docs[0];
      await deleteDoc(rateDoc.ref);
      console.log("Rate deleted successfully.");
    } else {
      console.log("No matching rate found.");
    }
  } catch (error) {
    console.error("Error deleting rate:", error);
  }
};


const getAllRates = async (productId) => {
  try {
    const querySnapshot = await getDocs(
      query(ratesCollection, where("productId", "==", productId))
    );

    const rates = [];
    querySnapshot.forEach((doc) => {
      rates.push({ id: doc.id, ...doc.data() });
    });

    return rates;
  } catch (error) {
    console.error("Error getting all rates:", error);
    return [];
  }
};

const getRateByUserIdAndProductId = async (userId,ProductId) => {
  try {
    const querySnapshot = await getDocs(
      query(ratesCollection, where("userId", "==", userId),
      where("productId", "==", ProductId))
    );

    const rates = [];
    querySnapshot.forEach((doc) => {
      rates.push({ id: doc.id, ...doc.data() });
    });

    return rates;
  } catch (error) {
    console.error("Error getting rates by userId:", error);
    return 0;
  }
};
const checkUserRating = async (userId, productId) => {
  try {
    const ratingSnapshot = await getDocs(
      query(
        collection(db, "rates"),
        where("userId", "==", userId),
        where("productId", "==", productId)
      )
    );
    // console.log("rate = "+!ratingSnapshot.empty)
    return !ratingSnapshot.empty;
  } catch (error) {
    console.error('Error checking user rating:', error);
    throw error;
  }
};

export { addRate, getAverageRate, deleteRate, getAllRates, getRateByUserIdAndProductId,checkUserRating };
