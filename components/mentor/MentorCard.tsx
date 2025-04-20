import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const MentorCard = ({ name, image, layout = 'grid' }: { name: string; image: any; layout?: 'grid' | 'list' }) => {
  return (
    <View style={layout === 'grid' ? styles.gridCard : styles.listCard}>
      <Image source={image} style={layout === 'grid' ? styles.gridImage : styles.listImage} />
      <Text style={layout === 'grid' ? styles.gridText : styles.listText}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  gridCard: {
    alignItems: 'center',
    width: 60,
    margin: 5,
  },
  gridImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  gridText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  listImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  listText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default MentorCard;
