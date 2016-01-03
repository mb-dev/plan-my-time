import React from 'react';
import {RouteHandler} from 'react-router'

import Header      from '../../components/header/header'
import Footer      from '../../components/footer/footer'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <RouteHandler/>
        <Footer />
      </div>
    )
  }
}
