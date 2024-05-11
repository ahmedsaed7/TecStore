import { Dimensions, StyleSheet, Text, View , Image} from 'react-native'
import React, { useState } from 'react'
import Carousel from 'react-native-reanimated-carousel'

export default function AppCarousel() {

    const width = Dimensions.get('window').width
    const [pagingEnabled , setPagingEnabled] = useState(true)
    
    const list = [ 
        {
            id: 1,
            title: 'First Item',
            image: require('../assets/images/Image1.png')
        },{
            id: 2,
            title: 'Second Item',
            image:  require('../assets/images/Image2.webp')
        },{
            id: 3,
            title: 'Third Item',
            image: require('../assets/images/Image3.png')
        },{
            id: 3,
            title: 'Fourth Item',
            image: require('../assets/images/Image1.png')
        },{
            id: 4,
            title: 'Fifth Item',
            image: require('../assets/images/Image1.png')
        }
        ]
    return (
        <View style={{ flex: 1}}>
            <Carousel
                width = {width /1.15}
                height = {width /2}
                data = { list }
                autoPlay={true}
                pagingEnabled={pagingEnabled}
                scrollAnimationDuration={1000}
                renderItem={({ item }) => (
            <View style={styles.CarouselItem}>
                <Image style={styles.img} source={item.image}/>
            </View>
                )}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    CarouselItem: {
    width : '100%',
    flex: 1,
    justifyContent: 'center', 
    overflow: 'hidden',
    alignItems: 'center',
    },
    img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    }
    })