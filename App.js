import React from 'react';
import {
  Platform, Animated, Dimensions, Keyboard, StyleSheet, TextInput, UIManager 
} from 'react-native';

const { State: TextInputState } = TextInput;
const animatedTimingDuration = 300;

export default class App extends React.Component {
  state = {
    shift: new Animated.Value(0)
  }

  componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

  render() {
    const { shift } = this.state;

    return (
      <Animated.View style={[styles.container, {transform: [{translateY: shift}]}]}>
        <TextInput
          placeholder="A"
          style={styles.textInput}
        />
        <TextInput
          placeholder="B"
          style={styles.textInput}
        />
        <TextInput
          placeholder="C"
          style={styles.textInput}
        />
        <TextInput
          placeholder="D"
          style={styles.textInput}
        />
        <TextInput
          placeholder="E"
          style={styles.textInput}
        />
      </Animated.View>
    );
  }

  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();

    UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
      const gapMinus = Platform.OS === 'ios' ? 20: 0;
      console.log('gap', gap);
      
      if (gap >= 0) {
        return;
      }

      Animated.timing(this.state.shift, {
        toValue: gap-gapMinus,
        duration: animatedTimingDuration,
        useNativeDriver: true
      }).start();
    })
  }

  handleKeyboardDidHide = () => {
    Animated.timing(this.state.shift, {
      toValue: 0,
      duration: animatedTimingDuration,
      useNativeDriver: true
    }).start();
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray',
    flex: 1,
    height: '100%',
    justifyContent: 'space-around',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  textInput: {
    backgroundColor: 'white',
    height: 40,
  }
});
