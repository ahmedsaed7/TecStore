// import { Dimensions, StyleSheet, Text, View , Image} from 'react-native'
// import React, { useState } from 'react'
// import Carousel from 'react-native-reanimated-carousel'

// export default function AppCarousel() {

//     const width = Dimensions.get('window').width
//     const [pagingEnabled , setPagingEnabled] = useState(true)
    
//     const list = [ 
//         {
//             id: 1,
//             title: 'First Item',
//             image: require('../assets/images/Image1.png')
//         },{
//             id: 2,
//             title: 'Second Item',
//             image:  require('../assets/images/Image2.webp')
//         },{
//             id: 3,
//             title: 'Third Item',
//             image: require('../assets/images/Image3.png')
//         },{
//             id: 3,
//             title: 'Fourth Item',
//             image: require('../assets/images/Image1.png')
//         },{
//             id: 4,
//             title: 'Fifth Item',
//             image: require('../assets/images/Image1.png')
//         }
//         ]
//     return (
//         <View style={{ flex: 1}}>
//             <Carousel
//                 width = {width /1.15}
//                 height = {width /2}
//                 data = { list }
//                 autoPlay={true}
//                 pagingEnabled={pagingEnabled}
//                 scrollAnimationDuration={1000}
//                 renderItem={({ item }) => (
//             <View style={styles.CarouselItem}>
//                 <Image style={styles.img} source={item.image}/>
//             </View>
//                 )}
//             />
//         </View>
//     )
// }
// const styles = StyleSheet.create({
//     CarouselItem: {
//     width : '100%',
//     flex: 1,
//     justifyContent: 'center', 
//     overflow: 'hidden',
//     alignItems: 'center',
//     },
//     img: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'contain',
//     }
//     })

import { Dimensions, StyleSheet, Text, View , Image} from 'react-native'
import React, { useState, useEffect } from 'react'
import Carousel from 'react-native-reanimated-carousel'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firebase configuration

export default function AppCarousel() {
    const width = Dimensions.get('window').width;
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsCollection = collection(db, 'Products');
                const querySnapshot = await getDocs(productsCollection);
                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProducts(productsData);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <View style={{ flex: 1}}>
            <Carousel
                width={width / 1.15}
                height={width / 2}
                data={products}
                autoPlay={true}
                scrollAnimationDuration={1000}
                renderItem={({ item }) => (
                    <View style={styles.carouselItem}>
                        <Image style={styles.img} source={{ uri: item.imageUrl }}/>
                        <View style={styles.textContainer}>
                            <Text style={styles.name}>{item.name}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    carouselItem: {
        width: '100%',
        flex: 1,
        justifyContent: 'center', 
        overflow: 'hidden',
        alignItems: 'center',
        flexDirection: 'row', // Align items horizontally
        backgroundColor: 'white',
    },
    img: {
        backgroundColor: 'white',
        width: '50%', // Adjust width of image
        height: '100%',
        resizeMode: 'contain',
    },
    textContainer: {
        width: '50%', // Adjust width of text container
        padding: 10, // Add padding for spacing
        
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center', // Center the text
    }
});
