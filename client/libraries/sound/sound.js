import config from '../../config/config'

export class Sound {
  playSound(filename) {
    var audio = new Audio(config.soundLocation + filename);
    audio.play();
  }
}

var sound = new Sound();
export default sound;
