import React, {
  Navigator,
  Component,
} from 'react-native';

import Home from '../home/home';
import TagSelector from '../tag_selector/tag_selector';
import Settings from '../settings/settings';

export default class Index extends Component {
  renderScene(route, navigator) {
    console.log("Render scene", route.name);
    if (route.name === 'home') {
      return <Home navigator={navigator} />;
    }
    if (route.name === 'select-tag') {
      return <TagSelector navigator={navigator} />;
    }
    if (route.name === 'settings') {
      return <Settings navigator={navigator} />;
    }
    return null;
  }
  render() {
    return (
      <Navigator
        style={{ flex: 1 }}
        initialRoute={ { name: 'home', index: 0 } }
        renderScene={ this.renderScene }
      />
    );
  }
}

