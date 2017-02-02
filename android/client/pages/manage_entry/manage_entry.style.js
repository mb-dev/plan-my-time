import React, {
  StyleSheet,
} from 'react-native';
import globalStyles from '../style.global';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  row: {
    paddingTop: 2,
    paddingBottom: 2,
  },
  toggleContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  switchText: {
    color: 'black',
  },
  ...globalStyles,
});

export default styles;
