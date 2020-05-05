import React, { PureComponent } from 'react';
import styled, {keyframes} from 'styled-components';
import Koji from '@withkoji/vcc';

import hextoHSL from './UtilityFunctions.js'

let BackButton = styled.button`
	margin-top:40px;
    width:80px;
    height:80px;
    padding:10px;
    border-radius:200px;
    background-color:rgb(50,50,50);
    display:flex;
    justify-content:center;
    align-items:center;
    border:1px solid rgba(0,0,0,.20);
    outline:0;
    &:hover {
        background-color:rgb(20,20,20);
    }
`;

let BackImage = styled.img`
    height:40px;
    width:auto;
    color:black;
`;

let DimCell = styled.div`
	background-color:rgb(240,240,240);
	background-image:url("${Koji.config.gameSettings.inactiveImage}");
	background-position:center;
	background-size:cover;
	width:100%;
	height:100%;
`;

let LitCell = styled.div`
	background-color:rgb(240,240,240);
	background-image:url("${Koji.config.gameSettings.activeImage}");
	background-position:center;
	background-size:cover;
	width:100%;
	height:100%;
`;

let TargetKeyFrames = keyframes`
	0% {
		height:40%;
		width:40%;
	}
	100% {
		height:60%;
		width:60%;
	}
`;

let TargetIndicator = styled.img`
	animation:${TargetKeyFrames} .75s ease-in alternate infinite;
`;

let CheckButton = styled.div`
	width:80px;
	height:80px;
	border-radius:200px;
	border:3px solid rgb(70,70,70);
    margin-bottom:40px;
    color:rgb(70,70,70);
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:3em;
`;

let ActiveCheck = styled(CheckButton)`
    background-color:rgb(20,255,20);
	border:1px solid rgba(0,0,0,.2);
    color:white;
`;

class TutorialScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state={completed:false}
	}
	render() {
		let PageDiv = styled.div`
            width:100%;
            height:100%;
            display:flex;
            align-items:center;
            justify-content:space-between;
            flex-direction:column;
            background-color:${Koji.config.gameSettings.background.backgroundColor};
        `;
       	let cellCount = 3;
		let gridSize = Math.min(window.innerHeight * .7,window.innerWidth * .8);
       	let Grid = styled.div`
			position:fixed;
			top:${window.innerHeight/2 - gridSize/2}px;
			display:grid;
			grid-template-columns:repeat(${cellCount}, 1fr);
			grid-template-rows:repeat(${cellCount}, 1fr);
            width:${gridSize + 'px'}
            height:${gridSize + 'px'};
            border:10px solid rgb(40,40,40);
            border-radius:4px;	
            box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
            grid-gap:2px;
            background-color:black;
		`;
        let cellBorderSize = gridSize/cellCount*.1;
		let TargetLit = styled(LitCell)`
			background-image:url();
            display:flex;
            justify-content:center;
            align-items:center;
			&:hover {
				background-color:rgb(150,150,150);
			}
		`;
		let cells = this.state.completed ? [[0,0,0],[0,0,0],[0,0,0]] : [[0,1,0],[1,2,1],[0,1,0]];
		return(
			<PageDiv>
			    <BackButton onClick={() => {this.props.audio.playAudio(2); window.setAppView("title")}}><BackImage src={Koji.config.general.backButton.buttonImage} /></BackButton>
			    <Grid>
                {
                    cells.map((row,rowIndex) => {
                        return(
                            row.map((cellValue,cellIndex) => {
                            	switch(cellValue) {
                            		case 0:
                            			return <DimCell />;
                            		case 1:
                            			return <LitCell />;
                            		case 2:
                            			return <TargetLit onClick={() => {this.props.audio.playAudio(2); this.props.audio.playAudio(1); this.setState({completed:true})}}><TargetIndicator src={Koji.config.gameSettings.activeImage}/></TargetLit>
                            	}
                            })
                        )
                    })
                }
                </Grid>
			    {this.state.completed ? <ActiveCheck onClick={() => {this.props.audio.playAudio(2); window.setAppView("title")}}>&#10003;</ActiveCheck> : <CheckButton>&#10003;</CheckButton>}
			</PageDiv>
		);
	}
}

export default TutorialScreen;