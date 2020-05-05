import React, { PureComponent } from 'react';
import styled, {keyframes} from 'styled-components';
import Koji from '@withkoji/vcc';

import hextoHSL from './UtilityFunctions.js'


//change hover to slightly opaque 'light' image
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

let BackButton = styled.button`
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

let LevelCounter = styled.h1`
    width:80px;
    height:80px;
    padding:10px;
    border-radius:200px;
    background-color:rgb(240,240,240);
    display:flex;
    justify-content:center;
    align-items:center;
    border:1px solid rgba(0,0,0,.20);
    outline:0;
    font-size:3em;
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
		this.state = {newGrid:true,justToggled:[],justSolved:false,solvedCount:0};
		this.state.level = this.buildLevel(props.width,props.height);
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
        let possibleCells = [];
		for(let y=0;y<height;y++) {
			level.push([]);
			for(let x=0;x<width;x++) {
				level[y].push(false);
				possibleCells.push([y,x]);
			}
		}     
		let numToggles = this.state.solvedCount;
		let toggles = [];
		while(toggles.length <= Math.min(numToggles,width*height)) {
			let randIndex = Math.floor(Math.random() * Math.floor(possibleCells.length));
			let cell = possibleCells[randIndex];
			let row = cell[0];
			let col = cell[1];
			possibleCells.splice(randIndex,1);
			toggles.push([row,col]);
			let cells = [[row,col],[row+1,col],[row-1,col],[row,col+1],[row,col-1]];
			for(var c in cells) {
				if(this.checkBounds(cells[c][0],cells[c][1])) {
					level[cells[c][0]][cells[c][1]] = !level[cells[c][0]][cells[c][1]];
				}
			}
		}
        //return [[false,true,false],[true,true,true],[false,true,false]];
        return level;
	}
	setNewLevel(solved=false) {
		this.state.level = this.buildLevel(this.props.width,this.props.height);
		this.state.newGrid = true;
		this.setState({justToggled:[],justSolved:solved});
		//this.forceUpdate();	
	}
	toggleCell(row,col) {
		this.state.justSolved = false;
		this.props.audio.playAudio(2);
		this.state.newGrid = false;
		this.state.justToggled = [];
		let cells = [[row,col],[row+1,col],[row-1,col],[row,col+1],[row,col-1]];
		for(var c in cells) {
			if(this.checkBounds(cells[c][0],cells[c][1])) {
				this.state.level[cells[c][0]][cells[c][1]] = !this.state.level[cells[c][0]][cells[c][1]];
				this.state.justToggled.push([cells[c][0],cells[c][1]]);
			}
		}

		//check if level is completed
		if(this.checkLevel()) {
			this.props.audio.playAudio(1);
			this.state.solvedCount += 1;
			this.setNewLevel(true);
		} 
		else {
			this.forceUpdate();
		}
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
            background-image:url(${pageImage});
            background-size: cover;
        `;

		let cellCount = Math.max(this.state.level[0].length,this.state.level.length);
		let gridSize = Math.min(window.innerHeight * .7,window.innerWidth * .8);

		let cellBorderSize = gridSize/cellCount*.1;
		let BorderLit = styled(LitCell)`
			&:hover {
				background-color:rgb(150,150,150);
			}
		`;
		let BorderDim = styled(DimCell)`
			&:hover {
				background-color:rgb(150,150,150);
			}
		`;
		let toggleKeyFrame = keyframes`
			0% {
				transform:scale(0);
			}
			100 % {
                transform:scale(1);
			}
		`;
		let ToggleDim = styled(BorderDim)`
			animation:${toggleKeyFrame} .25s ease-in-out;
		`
		let ToggleLit = styled(BorderLit)`
			animation:${toggleKeyFrame} .25s ease-in-out;
		`
		let gridKeyFrame = keyframes`
			0% {
                transform:scale(0);
			}
			100% {
                transform:scale(1);
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
            justify-items:center;
            align-items:center;
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

		let TopBar = styled.div`
			width:${gridSize + 'px'};
			margin-top:40px;
			display:flex;
			justify-content:space-around;
		`;


		const SPACING = window.innerWidth*.1;
        const VICTORY_SIZE = Math.floor(window.innerWidth/3);
        let VictoryKeyFrame = keyframes`
			0% {
				transform:translate(0px,0px) rotate(0deg);
			}
			100% {
				transform:translate(0,${window.innerHeight + VICTORY_SIZE*2}px) rotate(359deg);
			}
		`;
		let VictoryImage = styled.img`
			width:${VICTORY_SIZE - SPACING}px;
			height:auto;
			position:fixed;
			animation:${VictoryKeyFrame} 1s linear;
			top:-${Math.floor(window.innerWidth/3)}px;
		`;
		let victoryImages = [];
		if(this.state.justSolved) {
			for(let i=0;i<VICTORY_SIZE+1;i++) {
				victoryImages.push(i*VICTORY_SIZE + SPACING/2*(i));
			}
		}

		return(
            <PageDiv>
            <TopBar>
            	<BackButton onClick={() => {this.props.audio.playAudio(2); window.setAppView("title")}}><BackImage src={Koji.config.general.backButton.buttonImage} /></BackButton>
            	<LevelCounter>{this.state.solvedCount}</LevelCounter>
            </TopBar>
                <GameGrid>
                {
                    this.state.level.map((row,rowIndex) => {
                        return(
                            row.map((isCellLit,cellIndex) => {
                            	let toggled = false;
                            	for(var i in this.state.justToggled) {
                            		if(this.state.justToggled[i][0] == rowIndex && this.state.justToggled[i][1] == cellIndex) {
                            			toggled = true;
                            			break;
                            		}
                            	}
                            	if(isCellLit && toggled) {
                            		return(<ToggleLit onClick = {() => this.toggleCell(rowIndex,cellIndex)}/>);
                            	}
                            	if(!isCellLit && toggled) {
                            		return(<ToggleDim onClick = {() => this.toggleCell(rowIndex,cellIndex)}/>);
                            	}
                                return(isCellLit ? <BorderLit onClick={() => this.toggleCell(rowIndex,cellIndex)}/> : <BorderDim onClick={() => this.toggleCell(rowIndex,cellIndex)}/>);
                            })
                        )
                    })
                }
                </GameGrid>
                <NewPuzzleButton onClick={() => this.setNewLevel()}>{Koji.config.gameSettings.puzzleButton.content}</NewPuzzleButton>
                {
                	victoryImages.map((leftPos,index) => {
                		return(<VictoryImage style={{left:leftPos}} src={Koji.config.gameSettings.victoryImage}/>);
                	})
                }
            </PageDiv>
		);
	}
}

export default GameScreen;