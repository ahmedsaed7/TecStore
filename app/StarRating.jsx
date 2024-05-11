import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StarRating = ({ rating, onRatingChange }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => onRatingChange(i)}>
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={24}
            color={i <= rating ? '#FFD700' : '#000'}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return <View style={{ flexDirection: 'row' }}>{renderStars()}</View>;
};

export default StarRating;