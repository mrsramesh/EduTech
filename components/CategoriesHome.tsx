import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Dimensions,
  Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CATEGORY_WIDTH = (width - 48) / 3.5;

const Categories = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('Arts & Humanities');
  const scaleAnim = new Animated.Value(1);

  const categories = [
    '3D Design',
    'Arts & Humanities',
    'Graphic Design',
    'Web Dev',
    'Mobile Dev',
    'Data Science'
  ];

  const handlePress = (category: string) => {
    setActiveCategory(category);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      })
    ]).start();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore Categories</Text>
        <TouchableOpacity 
          onPress={() => router.push('/category')}
          style={styles.seeAllButton}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <Ionicons name="chevron-forward" size={16} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {/* Categories Horizontal Scroll */}
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CATEGORY_WIDTH + 12}
      >
        {categories.map((category) => (
          <Pressable
            key={category}
            onPress={() => handlePress(category)}
          >
            <Animated.View
              style={[
                styles.categoryCard,
                activeCategory === category && styles.activeCategoryCard,
                {
                  transform: [{ scale: activeCategory === category ? scaleAnim : 1 }]
                }
              ]}
            >
              <View style={[
                styles.iconContainer,
                activeCategory === category && styles.activeIconContainer
              ]}>
                <Ionicons 
                  name={getCategoryIcon(category)} 
                  size={20} 
                  color={activeCategory === category ? '#FFF' : '#4A90E2'} 
                />
              </View>
              <Text 
                style={[
                  styles.categoryText,
                  activeCategory === category && styles.activeCategoryText
                ]}
                numberOfLines={2}
              >
                {category}
              </Text>
            </Animated.View>
          </Pressable>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

// Helper function for category icons
const getCategoryIcon = (category: string) => {
  switch(category) {
    case '3D Design': return 'cube';
    case 'Arts & Humanities': return 'brush';
    case 'Graphic Design': return 'color-palette';
    case 'Web Dev': return 'globe';
    case 'Mobile Dev': return 'phone-portrait';
    case 'Data Science': return 'analytics';
    default: return 'bookmark';
  }
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Inter-Bold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  scrollContent: {
    paddingRight: 16,
  },
  categoryCard: {
    width: CATEGORY_WIDTH,
    height: 120,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDEDED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeCategoryCard: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
    shadowColor: '#4A90E2',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74,144,226,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  activeCategoryText: {
    color: '#FFF',
  },
});

export default Categories;