import React, { Component, createElement } from 'react';

const toCamelCase = str =>
  `-${str}`.replace(/-([a-z])/g, g => g[1].toUpperCase());

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { feature: null };
  }

  async componentDidMount() {
    const featureName = toCamelCase(window.location.hash.slice(1));
    const { default: feature } = await import(`./features/${featureName}`);

    this.setState({ feature });
  }

  render() {
    const { feature } = this.state;

    if (feature !== null) {
      return <div>{createElement(this.state.feature)}</div>;
    }

    return null;
  }
}

export default App;
