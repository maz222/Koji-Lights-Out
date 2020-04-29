import React, { PureComponent } from 'react';
import styled, {keyframes} from 'styled-components';
import Koji from '@withkoji/vcc';

import hextoHSL from './UtilityFunctions.js'


//change hover to slightly opaque 'light' image
let DimCell = styled.div`
	background-color:${Koji.config.gameSettings.inactiveColor};
	width:100%;
	height:100%;
`;

let LitCell = styled.div`
	background-color:${Koji.config.gameSettings.activeColor};
	width:100%;
	height:100%;
`;

let BackButton = styled.button`
	margin-top:40px;
	left:20px;
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

class GameScreen extends React.Component {
	//props
		//width - width of game grid
		//height - height of game grid
	constructor(props) {
		super(props);
		this.state = {level:this.buildLevel(props.width,props.height),newGrid:true};
	}
	componentDidMount() {
		this.props.audio.playAudio(0);
	}
	componentWillUnmount() {
    	this.props.audio.stopAll();
	}
	checkBounds(row,col) {
		return(row >= 0 && row < this.props.height && col >= 0 && col < this.props.width);
	}
	buildLevel(width,height) {
        let level = [];
		for(let y=0;y<height;y++) {
			level.push([]);
			for(let x=0;x<width;x++) {
				level[y].push(false);
			}
		}        
		let numToggles = Math.max(1,Math.round(Math.random()*width*height*.25));
		let toggles = [];
		for(let i=0; i<numToggles; i++) {
			let row = Math.round(Math.random() * (height-1));
			let col = Math.round(Math.random() * (width-1));
			toggles.push([row,col]);
			let cells = [[row,col],[row+1,col],[row-1,col],[row,col+1],[row,col-1]];
			for(var c in cells) {
				if(this.checkBounds(cells[c][0],cells[c][1])) {
					level[cells[c][0]][cells[c][1]] = !level[cells[c][0]][cells[c][1]];
				}
			}
		}
		console.log(toggles);
        //return [[false,true,false],[true,true,true],[false,true,false]];
        return level;
	}
	setNewLevel() {
		this.state.level = this.buildLevel(this.props.width,this.props.height);
		this.state.newGrid = true;
		this.forceUpdate();	
	}
	toggleCell(row,col) {
		this.props.audio.playAudio(2);
		this.state.newGrid = false;

		let cells = [[row,col],[row+1,col],[row-1,col],[row,col+1],[row,col-1]];
		for(var c in cells) {
			if(this.checkBounds(cells[c][0],cells[c][1])) {
				this.state.level[cells[c][0]][cells[c][1]] = !this.state.level[cells[c][0]][cells[c][1]];
			}
		}

		//check if level is completed
		if(this.checkLevel()) {
			this.props.audio.playAudio(1);
			this.setNewLevel();
		}
		this.forceUpdate();
	}
	checkLevel() {
		for(var i in this.state.level) {
			for(var j in this.state.level[i]) {
				if(this.state.level[i][j]) {
					return false;
				}
			}
		}
		return true;
	}
	render() {
		let pageColor = Koji.config.gameSettings.background.backgroundColor;
        let pageImage = Koji.config.gameSettings.background.backgroundImage;
        pageImage = pageImage == undefined ? "" : pageImage;
        let PageDiv = styled.div`
            width:100%;
            height:100%;
            display:flex;
            align-items:center;
            justify-content:space-between;
            flex-direction:column;
            background-color:${pageColor};
            background-image:url${pageImage}
            background-size: cover;
        `;

		let cellCount = Math.max(this.state.level[0].length,this.state.level.length);
		let gridSize = Math.min(window.innerHeight * .7,window.innerWidth * .8);

		let cellBorderSize = gridSize/cellCount*.1;
		let BorderLit = styled(LitCell)`
			&:hover {
				border:${cellBorderSize}px solid ${Koji.config.gameSettings.inactiveColor};
			}
		`;
		let BorderDim = styled(DimCell)`
			&:hover {
				border:${cellBorderSize}px solid ${Koji.config.gameSettings.activeColor};
			}
		`;
		let gridKeyFrame = keyframes`
			0% {
				height:0px;
				width:0px;
			}
			100% {
				width:${gridSize + 'px'}
            	height:${gridSize + 'px'}
			}
		`;
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
		let AnimatedGrid = styled(Grid)`
		    animation:${gridKeyFrame} .5s ease-in-out;
		`
		let GameGrid = this.state.newGrid ? AnimatedGrid : Grid;

        let playHoverColor = hextoHSL(Koji.config.gameSettings.puzzleButton.backgroundColor);
        playHoverColor[2] = Math.max(0,playHoverColor[2]-20);
        playHoverColor = `hsl(${playHoverColor[0]},${playHoverColor[1]}%,${playHoverColor[2]}%)`;
		let NewPuzzleButton = styled.button`
			margin-bottom:40px;
            font-size:1.5em;
			width:${gridSize +'px'};
			padding:10px;
			border-radius:4px;
            box-shadow: 0 0 0 4pt rgba(40,40,40,1);
            border:1px solid rgba(0,0,0,.25);
            outline:0;
			background-color:${Koji.config.gameSettings.puzzleButton.backgroundColor};
			color:${Koji.config.gameSettings.puzzleButton.color};
			&:hover {
				background-color:${playHoverColor};
			}
		`;

		return(
            <PageDiv>
            <BackButton onClick={() => {this.props.audio.playAudio(2); window.setAppView("title")}}><BackImage src={Koji.config.general.backButton.buttonImage} /></BackButton>
                <GameGrid>
                {
                    this.state.level.map((row,rowIndex) => {
                        return(
                            row.map((isCellLit,cellIndex) => {
                                return(isCellLit ? <BorderLit onClick={() => this.toggleCell(rowIndex,cellIndex)}/> : <BorderDim onClick={() => this.toggleCell(rowIndex,cellIndex)}/>);
                            })
                        )
                    })
                }
                </GameGrid>
                <NewPuzzleButton onClick={() => this.setNewLevel()}>{Koji.config.gameSettings.puzzleButton.content}</NewPuzzleButton>
            </PageDiv>
		);
	}
}

export default GameScreen;