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
	let gridSize = Math.min(window.innerHeight * .7,window.innerWidth * .8);
	let gridDims = Koji.config.gameSettings.gridSize;
	let cellImageSize = gridSize/gridDims - 2*(gridDims-1);
	//game screen
	let activeImage = Koji.config.gameSettings.activeImage;
	activeImage = `${activeImage}?width=${cellImageSize}&fit=bounds`;

	let inactiveImage = Koji.config.gameSettings.inactiveImage;
	inactiveImage = `${inactiveImage}?width=${cellImageSize}&fit=bounds`;

	let victoryImageSize = Math.floor(window.innerWidth/3) - window.innerWidth*.1;
	let victoryImage = Koji.config.gameSettings.victoryImage;
	victoryImage = `${victoryImage}?width=${victoryImageSize}&fit=bounds`;
	//tutorial screen
	cellImageSize = gridSize/3 - 4;
	let activeTut = Koji.config.gameSettings.activeImage;
	activeTut = `${activeTut}?width=${cellImageSize}&fit=bounds`;

	let inactiveTut = Koji.config.gameSettings.inactiveImage;
	inactiveTut = `${inactiveTut}?width=${cellImageSize}&fit=bounds`;
	this.setState({active:activeImage,inactive:inactiveImage,victory:victoryImage,tutActive:activeTut,tutInactive:inactiveTut});
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
        return(<GameScreen width={Koji.config.gameSettings.gridSize} height={Koji.config.gameSettings.gridSize} 
        audio={this.state.audio} victory={this.state.victory} active={this.state.active} inactive={this.state.inactive}/>);
    }
    if(this.state.view === 'tutorial') {
        return(<TutorialScreen audio={this.state.audio} active={this.state.tutActive} inactive={this.state.tutInactive}/>)
    }
    return null;
  }
}

export default App;
