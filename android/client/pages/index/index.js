import React, {
  Navigator,
  Component,
} from 'react-native';

import Home from '../home/home'

class PlanMyTime extends Component {
  renderScene(route, navigator) {
    if (route.name == 'Home') {
      return <Home navigator={navigator} />
    }
    if (route.name == 'Settings') {
      return <Settings navigator={navigator} />
    }
  }
  render() {
    return (
      <Navigator
        style={{ flex: 1 }}
        initialRoute={{name: 'Home'}}
        renderScene={ this.renderScene }>
      </Navigator>
    );
  }
}

