import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CourseItem = {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
};

type Props = {
  item: CourseItem;
  index: number;
  locked: boolean;
  onPress: (item: CourseItem) => void;
};

const CourseCard: React.FC<Props> = ({ item, index, locked, onPress }) => {
  const handlePress = locked ? undefined : () => onPress(item);

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={[styles.card, locked && styles.locked]}
      activeOpacity={locked ? 1 : 0.7}
    >
      <View style={styles.circle}>
        <Text style={styles.circleText}>{String(index + 1).padStart(2, '0')}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.duration}>{item.duration}</Text>
      </View>
      {locked ? (
        <Ionicons name="lock-closed-outline" size={20} color="#ccc" />
      ) : (
        <Ionicons name="play-circle-outline" size={20} color="#007bff" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  locked: {
    backgroundColor: '#f5f5f5',
  },
  circle: {
    backgroundColor: '#E6EEFF',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    color: '#003F88',
    fontWeight: '600',
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 2,
  },
  duration: {
    color: '#999',
    fontSize: 13,
  },
});

export default CourseCard;
