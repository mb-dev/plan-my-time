import React, {
  StyleSheet,
} from 'react-native';
import globalStyles from '../style.global';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  dateString: {
    fontWeight: 'bold',
    marginBottom: 1,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  refreshBtn: {
  },
  toolbarButton: {
    width: 70,
  },
  entryRow: {
    padding: 5,
    backgroundColor: '#ffffff',
  },
  entryRowEven: {
    backgroundColor: '#dddddd',
  },
  ...globalStyles,
});

export default styles;
