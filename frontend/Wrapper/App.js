import React, { PureComponent } from 'react';
import styled from 'styled-components';
import GameScreen from './Screens/Game';
import PostGameScreen from './Screens/PostGame';
import PreGameScreen from './Screens/PreGame';
import LeaderboardModal from './Modals/Leaderboard';
import Koji from '@withkoji/vcc';
import Modal from 'react-modal';
import WebFont from 'webfontloader';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${({ backgroundColor, backgroundImage, backgroundImageMode }) => {
    if (backgroundImage && backgroundImage !== '') {
      return `url("${backgroundImage}?auto=format,compress&fit=max&h=${window.innerHeight * 2}&w=${window.innerWidth * 2}") no-repeat center center / ${backgroundImageMode}`;
    }
    return backgroundColor;
  }}
  overflow: hidden;
`;

const GameScreenWrapper = styled.div`
  display: ${({ show }) => show ? 'block' : 'none'}
`;

// Set the root element for our modal
Modal.setAppElement('#root');

class App extends PureComponent {
  state = {
    initView: Koji.config.general.debug.startScreen,
    leaderBoardModalIsOpen: false,
    outcome: undefined,
    score: 0,
    templateConfig: {
      soundEnabled: true,
    },
    view: Koji.config.general.debug.startScreen,
  };

  componentDidMount() {
    // Expose the setScore function
    window.setScore = score => this.setState({ score });

    // Set the font; fallback to Roboto
    this.loadFont();
  }

  componentDidUpdate() {
    if (this.state.initView !== Koji.config.general.debug.startScreen) {
      this.setState({ initView: Koji.config.general.debug.startScreen, view: Koji.config.general.debug.startScreen });
    }

    if (Koji.config.general.fontFamily !== document.body.style.fontFamily) {
      this.loadFont();
    }
  }

  loadFont = () => {
    WebFont.load({ google: { families: [Koji.config.general.fontFamily.family] } });
    document.body.style.fontFamily = Koji.config.general.fontFamily.family;
  };

  getTemplateConfig = () => ({
    ...this.state.templateConfig,
  });

  setTemplateConfig = (newConfig) => {
    this.setState({
      templateConfig: {
        ...this.state.templateConfig,
        ...newConfig,
      }
    });
  }

  render() {
    return (
      <Container
        backgroundImage={Koji.config.general.backgroundImage}
        backgroundImageMode={Koji.config.general.backgroundImageMode}
      >
        {
          this.state.view === 'preGame' &&
          <PreGameScreen
            setAppView={view => this.setState({ view })}
            setTemplateConfig={this.setTemplateConfig}
            templateConfig={this.state.templateConfig}
          />
        }

        <GameScreenWrapper show={this.state.view === 'game'}>
          <GameScreen
            view={this.state.view === 'game'}
            getAppView={() => this.state.view}
            setAppView={view => this.setState({ view })}
            getTemplateConfig={this.getTemplateConfig}
            setOutcome={outcome => this.setState({ outcome })}
            setScore={score => this.setState({ score })}
          />
        </GameScreenWrapper>

        {
          this.state.view === 'postGame' &&
          <PostGameScreen
            outcome={this.state.outcome}
            showLeaderboard={() => this.setState({ leaderBoardModalIsOpen: true })}
            score={this.state.score}
            setAppView={view => this.setState({ view })}
          />
        }
        <LeaderboardModal
          isOpen={this.state.leaderBoardModalIsOpen}
          onCloseClick={() => this.setState({ leaderBoardModalIsOpen: false })}
        />
      </Container>
    );
  }
}

export default App;
