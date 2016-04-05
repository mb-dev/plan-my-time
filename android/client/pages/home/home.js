import React, {
  Component,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import Button from 'react-native-button'

class PlanMyTime extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Plan My Time
        </Text>
        <Text style={styles.instructions}>
          Current Task: ???
        </Text>
        <Text style={styles.instructions}>
          Next Task: ???
        </Text>
        <Text style={styles.instructions}>
          Add a new task:
        </Text>
        <TextInput>

        </TextInput>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

