(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        /**
        * @desc current album information
        * @type {Object}
        */
        var currentAlbum = Fixtures.getAlbum();
        /**
        * @desc Buzz object audio file
        * @type {Object}
        */
        var currentBuzzObject = null;
        /**
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        var setSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            };

            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });

            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                    SongPlayer.autoplay();
                });
            });

            SongPlayer.currentSong = song;
        };
        /**
        * @function playSong
        * @desc Plays audio file assigned to currentBuzzObject
        * @param {Object} song
        */
        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        };
        /**
        * @function stopSong
        * @desc Stops playing audio file assigned to currentBuzzObject
        * @param {Object} song
        */
        var stopSong = function(song) {
            currentBuzzObject.stop();
            song.playing = null;
        };
        /**
        * @function getSongIndex
        * @desc Gets index of current song
        * @param Current song
        * @return Index of current song
        */
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };
        /**
        * @desc Active song object from list of songs
        * @type {Object}
        */
        SongPlayer.currentSong = null;
        /**
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
        SongPlayer.currentTime = null;
        /**
        * @desc Current volume (0 to 100) of currently playing song
        * @type {Number}
        */
        SongPlayer.volume = 20;

        /**
        * @function SongPlayer.play
        * @desc Plays the selected song or restarts it after pause
        * @param {Object} song
        */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }
        };
        /**
        * @function SongPlayer.pause
        * @desc Pauses the selected song
        * @param {Object} song
        */
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        /**
        * @function SongPlayer.previous
        * @desc Plays song previous to the current one
        * @param {Object} song
        */
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;

            if (currentSongIndex < 0){
              stopSong();
            } else {
              var song = currentAlbum.songs[currentSongIndex];
              setSong(song);
              playSong(song);
            }
        };
        /**
        * @function SongPlayer.next
        * @desc Plays song that follows the current one
        * @param {Object} song
        */
        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;

            if (currentSongIndex >= currentAlbum.songs.length) {
              stopSong();
            } else {
              var song = currentAlbum.songs[currentSongIndex];
              setSong(song);
              playSong(song);
            }
        };

        SongPlayer.autoplay = function() {
            if (currentBuzzObject && SongPlayer.currentTime === SongPlayer.currentSong.duration) {
                SongPlayer.next();
            }
        };

        /**
        * @function setCurrentTime
        * @desc Set current time (in seconds) of currently playing song
        * @param {Number} time
        */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };

        SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
                SongPlayer.volume = currentBuzzObject.setVolume(volume);
            }
        };

        SongPlayer.mute = function() {
            if (currentBuzzObject) {
                SongPlayer.volume = currentBuzzObject.setVolume(0);
            }
        };

        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
