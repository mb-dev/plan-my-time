import React, {
  BackAndroid,
  Navigator,
  Component,
} from 'react-native';

import Home from '../home/home';
import TagSelector from '../tag_selector/tag_selector';
import Settings from '../settings/settings';
import ManageEntryPage from '../manage_entry/manage_entry';

export default class Index extends Component {
  router(route, navigator) {
    console.log("Render scene", route.name);

    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (navigator && navigator.getCurrentRoutes().length > 1) {
        navigator.pop();
        return true;
      }
      return false;
    });

    if (route.name === 'home') {
      return <Home navigator={navigator} />;
    }
    if (route.name === 'select-tag') {
      return <TagSelector navigator={navigator} />;
    }
    if (route.name === 'settings') {
      return <Settings navigator={navigator} />;
    }
    if (route.name === 'manage-task') {
      return <ManageEntryPage navigator={navigator} date={route.date} line={route.line} />;
    }
    return null;
  }
  render() {
    return (
      <Navigator
        style={{flex: 1}}
        initialRoute={{name: 'home', index: 0}}
        renderScene={this.router}
      />
    );
  }
}

