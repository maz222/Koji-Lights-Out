import Koji from '@withkoji/vcc';
import {Howl, Howler} from 'howler';

class AudioManager {
	constructor() {
		const VCC = Koji.config.gameSettings;
		this.files = [];
		//load music [0]
		if(VCC.music != undefined && VCC.music != "") {
			this.files.push(
				new Howl({
					src:VCC.music,
					loop:true,
					volume:1
				})
			);
		}
		else {
			this.files.push(null);
		}
		//load level clear [1]
		if(VCC.levelClear != undefined && VCC.levelClear != "") {
			this.files.push(
				new Howl({
					src:VCC.levelClear,
					volume:1
				})
			);
		}
		else {
			this.files.push(null);
		}
		//load click [2]
		if(VCC.click != undefined && VCC.click != "") {
			this.files.push(
				new Howl({
					src:VCC.click,
					volume:1
				})
			);
		}
		else {
			this.files.push(null);
		}
        this.muted = false;
	}
	playAudio(index) {
		if(!this.muted && this.files[index] != null) {
			this.files[index].play();
		}
	}
	pauseAudio(index) {
		if(this.files[index] != null) {
			this.files[index].pause();
		}
	}
	stopAudio(index) {
		if(this.files[index] != null) {
			this.files[index].stop();
		}
	}
	pauseAll() {
		for(var i in this.files) {
			if(this.files[i] != null) {
				this.files[i].pause();
			}
		}
	}
	stopAll() {
		for(var i in this.files) {
			if(this.files[i] != null) {
				this.files[i].stop();
			}
		}		
	}
}

export default AudioManager;