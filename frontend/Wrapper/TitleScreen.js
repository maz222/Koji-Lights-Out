import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Koji from '@withkoji/vcc';

import hextoHSL from './UtilityFunctions.js'

class TitleScreen extends React.Component {
    constructor(props) {
        super(props);
        let sessionMute = sessionStorage.getItem('isMuted');
        if(sessionMute === undefined || sessionMute === 'true') {
            sessionMute = true;
        }
        else {
            sessionMute = false;
        }
        this.props.audio.muted = sessionMute;
        this.state = {muted:sessionMute};
    }
    componentWillUnmount() {
        sessionStorage.setItem('isMuted',this.state.muted);
    }
    render() {
        const VCC = Koji.config.titleScreen;
        let pageColor = VCC.background.backgroundColor;
        let pageImage = VCC.background.backgroundImage;
        pageImage = pageImage == undefined ? "" : pageImage;
        console.log(pageImage);
        let PageDiv = styled.div`
            height:100%;
            width:100%;
            display:flex;
            justify-content:center;
            background-size:cover;
            background-image:url(${pageImage});
            background-color:${pageColor};
        `;
        let WrapperDiv = styled.div`
            width:${Math.min(window.innerWidth, 600)}px
            height:100%;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:space-around;
            flex-direction:column;
        `;
        let SoundImage = styled.img`
        	height:30px;
        	width:auto;
        `;
        let StyledSoundButton = styled.button`
            position:absolute;
            top:25px;
            right:25px;
            background-color:rgba(0,0,0,.3);
            width:60px;
            height:60px;
            border-radius:100px;
            border:0;
            display:flex;
            justify-content:center;
            align-items:center;
            &:hover{
            	background-color:rgba(0,0,0,.5);
            }
        `;
        let imgUrl = this.state.muted ? Koji.config.general.soundButton.offImage : Koji.config.general.soundButton.onImage;
        let SoundButton = <StyledSoundButton onClick={() => {
            this.props.audio.muted = !this.props.audio.muted;
            this.props.audio.playAudio(2);
            this.setState({muted:!this.state.muted});
            }}><SoundImage src={imgUrl}></SoundImage></StyledSoundButton>;

        let playText = VCC.playButton.content;
        let playColor = VCC.playButton.color;
        let playBackgroundColor = VCC.playButton.backgroundColor;
        let playHoverColor = hextoHSL(playBackgroundColor);
        playHoverColor[2] = Math.max(0,playHoverColor[2]-20);
        playHoverColor = `hsl(${playHoverColor[0]},${playHoverColor[1]}%,${playHoverColor[2]}%)`;
        let StyledPlayButton = styled.button`
            background-color:${playBackgroundColor};
            color:${playColor};
            font-size:1.5em;
            width:calc(80% - 20px);
            padding:20px;
            border-radius:4px;
            box-shadow: 0 0 0 4pt rgba(20,20,20,1);
            border:1px solid rgba(0,0,0,.25);
            &:hover {
            	background-color:${playHoverColor};
            }
        `;
        let PlayButton = <StyledPlayButton onClick={() => {this.props.audio.playAudio(2); window.setAppView("game")}}>{playText}</StyledPlayButton>;

        let tutorialText = VCC.howToPlayButton.content;
        let tutorialColor = VCC.howToPlayButton.color;
        let tutorialBackgroundColor = VCC.howToPlayButton.backgroundColor;
        let tutorialHoverColor = hextoHSL(tutorialBackgroundColor);
        tutorialHoverColor[2] = Math.max(0,tutorialHoverColor[2]-20);
        tutorialHoverColor = `hsl(${tutorialHoverColor[0]},${tutorialHoverColor[1]}%,${tutorialHoverColor[2]}%)`;
        let StyledTutorialButton = styled.button`
            background-color:${tutorialBackgroundColor};
            color:${tutorialColor};
            font-size:1.25em;
            width:calc(80% - 20px);
            padding:10px;
            border:0;
            border-radius:4px;
            box-shadow: 0 0 0 2pt rgba(0,0,0,.1);
            &:hover{
            	background-color:${tutorialHoverColor};
            	box-shadow: 0 0 0 0;;
            }
        `;
        let TutorialButton = <StyledTutorialButton onClick={() => {this.props.audio.playAudio(2); window.setAppView("tutorial")}}>{tutorialText}</StyledTutorialButton>;

        let StyledLogo = styled.img`
        	max-width:100%;
        	height:auto;
        `;
        let StyledTitle = styled.h1`
        	max-width:100%;
        	height:auto;
        	font-size:2em;
        	color:${VCC.title.color};
        `;
        let image = VCC.title.logo;
        let titleText = VCC.title.content;
        let titleColor = VCC.title.color;

        return(
            <PageDiv>
                {SoundButton}
                <WrapperDiv>
	                {image == "" || image == undefined? 
	                    <StyledTitle>{titleText}</StyledTitle> :
	                    <StyledLogo src={image}></StyledLogo>
	                }
	                {PlayButton}
	                {TutorialButton}
                </WrapperDiv>
            </PageDiv>
        );
    }
}

export default TitleScreen;