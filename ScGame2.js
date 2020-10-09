function clamp(_val, _min, _max) {
    return (Math.min(Math.max(_val, _min), _max))
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(Math.floor(r)) + componentToHex(Math.floor(g)) + componentToHex(Math.floor(b));
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

floatyDate = new Date();
function FloatyColour(r, g, b, r_variation, g_variation, b_variation, timeScale) {
    let _sinFactor = (Math.sin(floatyDate.now * timeScale));
    return rgbToHex(clamp(r + (r_variation * _sinFactor), 0, 255), clamp(g + (g_variation * _sinFactor), 0, 255), clamp(b + (b_variation * _sinFactor), 0, 255));
}

videoPauseForInput = false;
videoPauseForUser = false;
videoPaused = false;
videoTimestamps = null;
videoInstance = null;
videoSceneIndex = 1;
videoSceneMin = 1;
videoSceneMax = 10;
videoSceneCheckpoint = 1;
videoPosition = 0;
videoTintRed = 255;
videoTintGreen = 255;
videoTintBlue = 255;
videoTint = rgbToHex(255, 255, 255);

musicInstance = null;
musicVolumeMin = 0.1;
musicVolumeMax = 0.6;
musicVolume = musicVolumeMin;
musicPlaytimeLast = null;
musicCreditsPlayed = false;

buttonPause = null;

creditsString = "\nA GAME BY MATTHEW BRAMBALLO\n\nGRAPHICS\nMatthew Bramballo\n\nMUSIC\nMatthew Bramballo\n\nSOUND EFFECTS\nMatthew Bramballo\n\nART\nMatthew Bramballo\n\nCUTSCENES\nMatthew Bramballo\n\nMARKETING\nMATTHEW BRAMBALLO\n\nPROFESSIONAL PORN\nMATTHEW BRAMBALLO\n\n\nTHANKS FOR PLAYING\nMY GAME"
creditsInstance = null;

function MusicPlay(_scene, _musicKey)    {
    if (musicInstance != null)  {
        musicInstance.pause();
        musicInstance.destroy();
    }

    musicInstance = _scene.sound.add(_musicKey).setLoop(true);
    musicInstance.play({
        volume: musicVolume
    });
}

function MusicStop()    {
    if (musicInstance != null)  {
        musicInstance.pause();
        musicInstance.destroy();
        musicInstance = null;
    }
}

buttonsArray = [];

function Scene2Init() {
    videoPauseForInput = false;
    videoPauseForSound = false;
    videoTimestamps = null;
    videoInstance = null;
    videoSceneIndex = 1;
    videoSceneMin = 1;
    videoSceneMax = 10;
    videoPosition = 0;
    videoTint = rgbToHex(255, 255, 255);
}

function SceneGoto(_sceneIndex) {
    _sceneIndex = clamp(_sceneIndex, videoSceneMin, videoSceneMax)
    console.log("Scene Was " + videoSceneIndex + ", Is Now " + _sceneIndex)
    videoSceneIndex = _sceneIndex;
    let _sceneNewTime = videoTimestamps[videoSceneIndex] + 0.05;
    videoInstance.setCurrentTime(_sceneNewTime);
    videoPosition = _sceneNewTime;
}

function SceneButtonsAddArray(_sceneHolder, _arrayButtons) {
    let _buttonPosX = 32;
    let _buttonPosY = (1080 - 96);
    videoPauseForInput = true;
    videoInstance.isPaused(true);
    videoInstance.setCurrentTime(videoTimestamps[videoSceneIndex + 1] - 0.1)
    for (let i = 0; i < _arrayButtons.length; i++) {
        let _buttonInfoObject = _arrayButtons[i];
        let _buttonText = _buttonInfoObject.Text;
        let _buttonScene = _buttonInfoObject.Scene;
        let _buttonInstance = new TextButton(_sceneHolder,_buttonPosX,_buttonPosY,_buttonText,{},()=>{
            SceneGoto(_buttonScene);
            SceneButtonsDestroy();
            videoPauseForInput = false;
        }
        )
        buttonsArray.push(_buttonInstance)
        _buttonPosY -= 64;
    }
}

function SceneButtonsDestroy() {
    while (buttonsArray.length > 0) {
        let buttonInstance = buttonsArray[0];
        buttonInstance.destroy();
        buttonsArray.shift();
    }
}

class ScGame2 extends Phaser.Scene {
    constructor() {
        super("playGame2")
    }

    create() {
        this.keyQuit = this.input.keyboard.addKey(27);

        Scene2Init();
        videoTimestamps = [null, 0, 27.560, 35.452, 45.145, 51.985, 117.417, 126.543, 136.419, 206.072, 225.375, 229.612];
        videoInstance = this.add.video(960, 540, "videoGame2").setDepth(-5)
        videoInstance.play()
        MusicPlay(this, "Music3");

        buttonPause = new SpriteButton(this, 96, 96, "sButtonPause", () => {
            videoPauseForUser = !videoPauseForUser;
            if (videoPauseForUser)  {
                buttonPause.setTexture("sButtonPlay");
            }   else    {
                buttonPause.setTexture("sButtonPause");
            }
        }).setDepth(5);
    }

    update() {

        if (this.keyQuit.isDown)    {
            window.close();
        }

        // Clamp Bounds
        videoSceneIndex = Math.min(videoSceneIndex, 19);
        videoSceneIndex = Math.max(videoSceneIndex, 1)

        // Pause Video if Music Stops or Waiting for Input, Resume Otherwise
        if (videoPauseForUser || videoPauseForInput) {
            videoInstance.setPaused(true);
            videoPaused = true;
            videoTint = 0xa8ebff;

            if (videoPauseForUser)  {
                musicVolume = clamp(musicVolume - 0.001, 0, musicVolumeMax)
            }   else    {
                buttonPause.buttonEnabled = false;
                musicVolume = clamp(musicVolume + 0.01, 0, musicVolumeMax)
            }
        } else {
            buttonPause.buttonEnabled = true;
            videoTint = 0xffffff;
            if (videoInstance.isPaused()) {
                videoInstance.setPaused(false);
                videoPaused = false;
            }
            musicVolume = clamp(musicVolume - 0.02, musicVolumeMin, 1)
        }

        //Tint Video
        videoInstance.tint = videoTint;

        //Music
        if (musicInstance != null)  {
            musicInstance.setVolume(musicVolume);
        }

        // Outerbounds Detection
        if (videoPaused == false) {
            if (videoPosition > (videoTimestamps[videoSceneIndex + 1] - 0.1)) {
                switch (videoSceneIndex) {
                case 1:
                    SceneGoto(2);
                    break;
                case 2:
                    videoSceneCheckpoint = 2;
                    SceneButtonsAddArray(this, [
                        {
                            Text: "hang around like a monkey",
                            Scene: 3
                        }, {
                            Text: "look around",
                            Scene: 5
                        }, {
                            Text: "cry",
                            Scene: 4
                        }
                    ])
                    break;
                case 3:
                    SceneGoto(10);
                    break;
                case 4:
                    SceneGoto(10);
                    break;
                case 5:
                    SceneGoto(6);
                    break;
                case 6:
                    videoSceneCheckpoint = 6;
                    SceneButtonsAddArray(this, [
                        {
                            Text: "drive the car",
                            Scene: 7
                        }, {
                            Text: "take the drugs",
                            Scene: 8
                        }
                    ])
                    break;
                case 7:
                    SceneGoto(10);
                    break;
                case 8:
                    MusicStop();
                    SceneGoto(9);
                    break;
                case 9:
                    MusicStop();
                    this.scene.start("menuGame")
                    break;
                case 10:
                    SceneGoto(videoSceneCheckpoint);
                    break;
                }
                
            }
        }
        videoPosition = videoInstance.getCurrentTime();

        gameInstance.scale.pageAlignHorizontally = true;
        gameInstance.scale.pageAlignVertically = true;
        gameInstance.scale.refresh();
    }
}
