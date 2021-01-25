import React, { useEffect, useState } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faPlayCircle, 
    faStepForward,
    faStepBackward,
    faPauseCircle,
    faVolumeDown,
} from '@fortawesome/free-solid-svg-icons';


const Player = ({ 
    audioRef, 
    currentSong, 
    isPlaying, 
    setIsPlaying, 
    setSongInfo, 
    songInfo,
    songs,
    setCurrentSong,
    setSongs, 
}) => {
    const [activeVolume, setActiveVolume] = useState(false);
    //useEffect
    useEffect(() => {
        
        const newSongs = songs.map((song) => {
            if(song.id === currentSong.id) {
                return {
                    ...song,
                    active: true,
                };
            } else {
               return {
                   ...song,
                   active: false,
               }; 
            }
        });
        setSongs(newSongs);
    }, [currentSong]);
   
    //Event Handlers
    const playSongHandler = () => {
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(!isPlaying);
        } else {
            audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const getTime = (time) => {
        return(
            Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
        );
    };

    const dragHandler = (e) => {
        audioRef.current.currentTime = e.target.value;
        setSongInfo({...songInfo, currentTime: e.target.value});
    };

    const skipTrackHandler = async (direction) => {
      let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
      if (direction === "skip-forward") {
      await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
      }
      if (direction === "skip-back") {
        if ((currentIndex - 1) % songs.length === -1) {
           await setCurrentSong(songs[songs.length -1]);
            if (isPlaying) audioRef.current.play();
            return;
        }
        await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
      }
      if(isPlaying) audioRef.current.play();
    };

    const changeVolume = (e) => {
        let value = e.target.value;
        audioRef.current.volume = value;
        setSongInfo({ ...songInfo, volume: value });
      };
    
    return(
        <div className="player">
            <div className="time-control">
                <p>{getTime(songInfo.currentTime)}</p>
                <input 
                    min={0} 
                    max={songInfo.duration || 0} 
                    value={songInfo.currentTime} 
                    onChange={dragHandler}
                    type="range"
                />
                <p>{songInfo.duration ? 
                getTime(songInfo.duration) : '0:00'}</p>
            </div>
            <div className="play-control">
                <FontAwesomeIcon onClick={() => skipTrackHandler('skip-back')} 
                    className="skip-back" 
                    size="2x" 
                    icon={faStepBackward} 
                />
                <FontAwesomeIcon 
                    onClick={playSongHandler} 
                    className="play" 
                    size="3x" 
                    icon={isPlaying ? faPauseCircle : faPlayCircle} 
                />
                <FontAwesomeIcon 
                    className="skip-forward" 
                    size="2x" 
                    icon={faStepForward}
                    onClick={() => skipTrackHandler('skip-forward')} 
                />
                <FontAwesomeIcon
                    size="2x"
                    onClick={() => setActiveVolume(!activeVolume)}
                    icon={faVolumeDown}
                />
                    {activeVolume && (
                    <input
                        onChange={changeVolume}
                        value={songInfo.volume}
                        max="1"
                        min="0"
                        step="0.01"
                        type="range"
                    />
                )}  
            </div> 
        </div>
    );
}

export default Player;