import {Component, OnInit} from '@angular/core';
import {PlayerService} from "./player.service";
import {Observable} from "rxjs";

@Component({
    selector: 'player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
    private trackData;
    private isPlaying = false;
    private isPaused = false;
    private artistName;
    private songName;
    private audioEl: any;
    private imgEl;
    private currSongIndex = 0;
    private elapsedTime = '00:00';
    private remainingTime = '00:00';
    private remainingTimeFixed;
    private totalSeconds;
    private totalSecondsElapsed = 0;
    private countDown;
    private totalProgressElapsed = 0;p
    private progressBarWidth = 300;
    private totalSecondsFixed;
    private widthSecondsRatio;
    private isNextSong = false;
    private isPrevSong = false;
    private songs = [{
        soundSrc: 'assets/sounds/Broke_For_Free_Night_Owl.mp3',
        imgSrc: "assets/broke_for_free.png",
        id: '42377'
    },
        {
            soundSrc: 'assets/sounds/Bloodgod_Hammerite.mp3',
            imgSrc: "assets/blood_god.png",
            id: '159214'
        },
        {
            soundSrc: 'assets/sounds/Lee_Rosevere_The_Nightmare.mp3',
            imgSrc: "assets/lee-rosevere.png",
            id: '158768'
        }];
    constructor(private playerService: PlayerService) {}
    ngOnInit() {
        this.setSongDetails();
        this.getCurrSongData();
    }

    getCurrSongData() {
        this.playerService.getTrackData(this.songs[this.currSongIndex].id).subscribe((data) => {
            this.trackData = data;
            this.setSongDetails();
            if (this.isNextSong || this.isPrevSong) {
                this.playTrack();
                this.isNextSong = false;
                this.isPrevSong = false;
            }
        });
    }

    getPreviousTrack() {
        if (this.currSongIndex > 0) {
            this.isPrevSong = true;
            this.resetPlayer();
            this.currSongIndex = this.currSongIndex - 1;
            this.getCurrSongData();
        }
    }

    getNextTrack() {
        if (this.currSongIndex < 2) {
            this.isNextSong = true;
            this.resetPlayer();
            this.currSongIndex = this.currSongIndex + 1;
            this.getCurrSongData();
        }
    }

    playTrack() {
        this.isPlaying = true;
        if (!this.isPaused) {
            this.setSongDetails();
        }
        this.audioEl.play();
        this.startCountDown();
        this.isPaused = false;
    }

    pauseTrack() {
        this.isPaused = true;
        this.isPlaying = false;
        this.audioEl.pause();
        this.stopCountDown();
    }

    setSongDetails() {
        if (this.trackData) {
            this.artistName = this.trackData.artist_name;
            this.songName = this.trackData.track_title;
            this.remainingTime = this.trackData.track_duration;
            this.remainingTimeFixed = this.trackData.track_duration;
        }
        this.setSongSrc();
        this.setSongImgSrc();
        this.setTotalSeconds();
    }

    setSongSrc() {
        this.audioEl = document.getElementById('myAudio');
        this.audioEl.src = this.songs[this.currSongIndex].soundSrc;
    }

    setSongImgSrc() {
        this.imgEl = document.querySelector('.main');
        this.imgEl.src = this.songs[this.currSongIndex].imgSrc;
    }

    setTotalSeconds() {
        let durationStr = this.remainingTime;
        let minutes = parseInt(durationStr.slice(1, 2));
        let seconds = parseInt(durationStr.slice(3, 5));
        this.totalSeconds = minutes * 60 + seconds;
        this.totalSecondsFixed = this.totalSeconds;
    }

    startCountDown() {
        this.widthSecondsRatio = (this.progressBarWidth / this.totalSecondsFixed);
        this.countDown = setInterval(() => {
            if (this.elapsedTime === this.remainingTimeFixed) {
                return this.resetPlayer();
            }
            this.setTimeRemaining();
            this.setTimeElapsed();
            this.growProgressBar();
        }, 1000);
    }

    stopCountDown() {
        clearInterval(this.countDown);
    }

    setTimeRemaining() {
        this.totalSeconds = this.totalSeconds - 1;
        let minutesDecimal = (this.totalSeconds / 60).toString();
        let minutes = minutesDecimal.slice(0, 1);
        let secondsDecimal = '0' + minutesDecimal.slice(1);
        let seconds: any = Math.round(parseFloat(secondsDecimal) * 60);
        if (seconds.toString().length === 2) {
            this.remainingTime = '0' + minutes + ':' + seconds;
        } else {
            this.remainingTime = '0' + minutes + ':0' + seconds;
        }
    }

    setTimeElapsed() {
        this.totalSecondsElapsed = this.totalSecondsElapsed + 1;
        let minutes = parseInt(this.elapsedTime.slice(1, 2));
        let seconds: any = parseInt(this.elapsedTime.slice(4, 5));
        seconds = this.totalSecondsElapsed;
        if (seconds.toString() === '60') {
            minutes = minutes + 1;
            this.totalSecondsElapsed = 0;
            seconds = this.totalSecondsElapsed;
            this.elapsedTime = '0' + minutes + ':0' + seconds;
        }
        if (seconds.toString().length === 2) {
            this.elapsedTime = '0' + minutes + ':' + seconds;
        } else {
            this.elapsedTime = '0' + minutes + ':0' + seconds
        }
    }

    resetPlayer() {
        if (!this.remainingTime || this.remainingTime === '00:00') {
            this.remainingTime = this.remainingTimeFixed;
        }
        this.stopCountDown();
        this.elapsedTime = '00:00';
        this.totalSecondsElapsed = 0;
        this.shrinkProgressBar();
    }

    growProgressBar() {
        this.totalProgressElapsed = this.totalProgressElapsed + this.widthSecondsRatio;
        document.getElementById('progress').style.width = this.totalProgressElapsed + 'px';
    }

    shrinkProgressBar() {
        this.totalProgressElapsed = 0;
        document.getElementById('progress').style.width = this.totalProgressElapsed + 'px';
    }
}
