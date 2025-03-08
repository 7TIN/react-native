import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  PanResponder,
  TouchableWithoutFeedback,
} from 'react-native';
import DrawerContent from '../components/DrawerContent';
import HomeScreen from '../screens/HomeScreen';
import { colors } from '../styles/theme';

// Get screen dimensions
const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.7; // Drawer takes 70% of screen width

const CustomDrawer: React.FC = () => {
  // Animation value for drawer position
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Function to open drawer
  const openDrawer = () => {
    setIsDrawerOpen(true);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Function to close drawer
  const closeDrawer = () => {
    Animated.timing(translateX, {
      toValue: -DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsDrawerOpen(false);
    });
  };

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal movements greater than 10 units
        return !isDrawerOpen && Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 50;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow opening from left edge (first 20% of screen)
        if (gestureState.moveX < width * 0.2 || isDrawerOpen) {
          let newPosition = gestureState.dx - DRAWER_WIDTH;
          // Clamp the position between -DRAWER_WIDTH and 0
          newPosition = Math.max(-DRAWER_WIDTH, Math.min(newPosition, 0));
          translateX.setValue(newPosition);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If swiped more than 1/3 of drawer width, open it
        if (gestureState.dx > DRAWER_WIDTH / 3) {
          openDrawer();
        } else {
          closeDrawer();
        }
      },
    })
  ).current;

  // Calculate opacity for the overlay based on drawer position
  const overlayOpacity = translateX.interpolate({
    inputRange: [-DRAWER_WIDTH, 0],
    outputRange: [0, 0.5],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.main} {...panResponder.panHandlers}>
        <HomeScreen onMenuPress={openDrawer} />
      </View>
      
      {/* Overlay - closes drawer when tapped */}
      {isDrawerOpen && (
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <Animated.View 
            style={[
              styles.overlay, 
              { opacity: overlayOpacity }
            ]} 
          />
        </TouchableWithoutFeedback>
      )}
      
      {/* Drawer */}
      <Animated.View 
        style={[
          styles.drawer, 
          { transform: [{ translateX }] }
        ]}
      >
        <DrawerContent />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: colors.background,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
});

export default CustomDrawer;