import React, { useRef, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  TextStyle,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface AnimatedButtonProps {
  text?: string;
  minWidth?: number;
  maxWidth?: number;
  height?: number;
  borderRadius?: number;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: TextStyle['fontWeight'];
  onPress?: () => void;
  disabled?: boolean;
  shadowOpacity?: number;
  iconColor?: string;
  arrowColor?: string;
  iconSize?: number;
  iconName?: string;
  paddingHorizontal?: number;
  testID?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  text = "Get Started",
  minWidth = 120,
  maxWidth = Dimensions.get('window').width * 0.9,
  height = 60,
  borderRadius = 30,
  backgroundColor = "#0961F5",
  textColor = "white",
  fontSize = 18,
  fontFamily = "Jost",
  fontWeight = "600",
  onPress,
  disabled = false,
  shadowOpacity = 0.3,
  iconColor = "white",
  arrowColor = "#0961F5",
  iconSize = 24,
  iconName = "arrow-forward",
  paddingHorizontal = 20,
  testID,
}) => {
  // Animation refs
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // State for dynamic width calculation
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(minWidth);

  // Calculate button width based on text content
  useLayoutEffect(() => {
    const calculatedWidth = Math.min(
      Math.max(textWidth + height + paddingHorizontal * 2, minWidth),
      maxWidth
    );
    setContainerWidth(calculatedWidth);
  }, [textWidth, minWidth, maxWidth, height, paddingHorizontal]);

  const handleTextLayout = (event: LayoutChangeEvent) => {
    setTextWidth(event.nativeEvent.layout.width);
  };

  const handlePress = () => {
    if (disabled) return;

    // Press animation
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onPress?.();
      });
    });

    // Arrow animation
    Animated.sequence([
      Animated.timing(translateX, {
        toValue: 5,
        duration: 150,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 150,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Text style configuration
  const textStyle: TextStyle = {
    color: textColor,
    fontSize,
    fontFamily,
    fontWeight,
    includeFontPadding: false,
    textAlign: 'center',
  };

  // Button container style
  const containerStyle: Animated.AnimatedProps<ViewStyle> = {
    minWidth,
    maxWidth,
    width: containerWidth,
    height,
    borderRadius,
    backgroundColor: disabled ? '#cccccc' : backgroundColor,
    shadowOpacity,
    transform: [{ scale }],
    opacity,
    paddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  // Icon container style
  const iconContainerStyle: Animated.AnimatedProps<ViewStyle> = {
    width: height * 0.7,
    height: height * 0.7,
    borderRadius: height * 0.35,
    backgroundColor: iconColor,
    transform: [{ translateX }],
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Animated.View style={[styles.container, containerStyle]}>
        {/* Invisible text for measurement */}
        <Text 
          style={[textStyle, styles.measureText]}
          onLayout={handleTextLayout}
          numberOfLines={1}
        >
          {text}
        </Text>
        
        {/* Visible text */}
        <Text 
          style={[textStyle, styles.visibleText]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {text}
        </Text>

        {/* Icon */}
        <Animated.View style={[styles.iconContainer, iconContainerStyle]}>
          <Icon
            name={iconName}
            size={iconSize}
            color={arrowColor}
            style={styles.icon}
          />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  measureText: {
    position: 'absolute',
    opacity: 0,
  },
  visibleText: {
    flex: 1,
    marginRight: 10,
  },
  iconContainer: {
    position: 'relative',
  },
  icon: {
    marginLeft: 3,
  },
});

export default React.memo(AnimatedButton);



// use formate 
 {/* Default button */}
      // <AnimatedButton 
      //   text="Get Started"
      //   onPress={() => console.log('Pressed')}
      // />

      {/* Button with long text */}
      // <AnimatedButton 
      //   text="Continue to the next screen"
      //   backgroundColor="#4CAF50"
      //   onPress={() => console.log('Long text button pressed')}
      // />

      {/* Custom sized button */}
      // <AnimatedButton 
      //   text="Small"
      //   minWidth={80}
      //   height={40}
      //   fontSize={14}
      //   iconSize={18}
      //   onPress={() => console.log('Small button pressed')}
      // />

      {/* Disabled button */}
      // <AnimatedButton 
      //   text="Disabled"
      //   disabled={true}
      //   onPress={() => console.log("Won't trigger")}
      // />