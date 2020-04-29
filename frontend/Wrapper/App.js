import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Koji from '@withkoji/vcc';
import WebFont from 'webfontloader';

import TitleScreen from './TitleScreen.js';
import GameScreen from './GameScreen.js';
import TutorialScreen from './TutorialScreen.js';

import AudioManager from './AudioManager.js';

const GameScreenWrapper = styled.div`
  display: ${({ show }) => show ? 'block' : 'none'}
`;

// Note: Putting the image url inside the styled component
// causes the image to be re-downloaded even when re-renders
// aren't triggered
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

class App extends PureComponent {
  state = {
    view: 'title',
    audio:new AudioManager()
  };

  componentDidMount() {
    document.getElementById("root").style.height = window.innerHeight+'px';
    window.setAppView = view => { this.setState({ view }); }
    // Set the font; fallback to Roboto
    this.loadFont();
  }

  componentDidUpdate() {
    if (Koji.config.general.fontFamily.family !== document.body.style.fontFamily) {
      this.loadFont();
    }
  }

  loadFont = () => {
    WebFont.load({ google: { families: [Koji.config.general.fontFamily.family] } });
    document.body.style.fontFamily = Koji.config.general.fontFamily.family;
  };

  render() {
    if(this.state.view === 'title') {
      return(<TitleScreen audio={this.state.audio}/>);
    }
	if(this.state.view === 'game') {
        return(<GameScreen width={Koji.config.gameSettings.gridWidth} height={Koji.config.gameSettings.gridHeight} audio={this.state.audio}/>);
    }
    if(this.state.view === 'tutorial') {
        return(<TutorialScreen audio={this.state.audio}/>)
    }
    return null;
  }
}

export default App;
