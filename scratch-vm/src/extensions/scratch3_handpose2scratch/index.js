const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const tf = require('@tensorflow/tfjs-core');
const tfconv = require('@tensorflow/tfjs-converter');
const handpose = require('@tensorflow-models/handpose');

const Message = {
  getX: {
    'ja': '[LANDMARK] 番目のx座標',
    'ja-Hira': '[LANDMARK] ばんめのxざひょう',
    'en': 'x of landmark: [LANDMARK]'
  },
  getY: {
    'ja': '[LANDMARK] 番目のy座標',
    'ja-Hira': '[LANDMARK] ばんめのyざひょう',
    'en': 'y of landmark: [LANDMARK]'
  },
  videoToggle: {
    'ja': 'ビデオを[VIDEO_STATE]にする',
    'ja-Hira': 'ビデオを[VIDEO_STATE]にする',
    'en': 'turn video [VIDEO_STATE]'
  },
  on: {
    'ja': '入',
    'ja-Hira': 'いり',
    'en': 'on'
  },
  off: {
    'ja': '切',
    'ja-Hira': 'きり',
    'en': 'off'
  },
  video_on_flipped: {
    'ja': '左右反転',
    'ja-Hira': 'さゆうはんてん',
    'en': 'on flipped',
  },
}
const AvailableLocales = ['en', 'ja', 'ja-Hira'];

class Scratch3Handpose2ScratchBlocks {
    get LANDMARK_MENU () {
      landmark_menu = [];
      for (let i = 0; i <= 20; i++) {
        landmark_menu.push({text: String(i), value: String(i)})
      }
      return landmark_menu;
    }

    get VIDEO_MENU () {
      return [
          {
            text: Message.off[this._locale],
            value: 'off'
          },
          {
            text: Message.on[this._locale],
            value: 'on'
          },
          {
            text: Message.video_on_flipped[this._locale],
            value: 'on-flipped'
          }
      ]
    }

    constructor (runtime) {
        this.runtime = runtime;

        this.landmarks = [];

        let video = document.createElement("video");
        video.width = 480;
        video.height = 360;
        video.autoplay = true;
        video.style.display = "none";

        video.addEventListener('loadeddata', (event) => {
          alert('During loading Handpose model the browser gets stuck, but please wait for a while.')
          handpose.load().then(model => {
            setInterval(() => {
              model.estimateHands(video).then(hands => {
                hands.forEach(hand => {
                  this.landmarks = hand.landmarks;
                });
              });
            }, 200);
          });
        });

        let media = navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

        media.then((stream) => {
            video.srcObject = stream;
        });

        this.runtime.ioDevices.video.enableVideo();
    }

    getInfo () {
        this._locale = this.setLocale();

        return {
            id: 'handpose2scratch',
            name: 'Handpose2Scratch',
            blocks: [
                {
                    opcode: 'getX',
                    blockType: BlockType.REPORTER,
                    text: Message.getX[this._locale],
                    arguments: {
                        LANDMARK: {
                            type: ArgumentType.STRING,
                            menu: 'landmark',
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'getY',
                    blockType: BlockType.REPORTER,
                    text: Message.getY[this._locale],
                    arguments: {
                        LANDMARK: {
                            type: ArgumentType.STRING,
                            menu: 'landmark',
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'videoToggle',
                    blockType: BlockType.COMMAND,
                    text: Message.videoToggle[this._locale],
                    arguments: {
                        VIDEO_STATE: {
                            type: ArgumentType.STRING,
                            menu: 'videoMenu',
                            defaultValue: 'off'
                        }
                    }
                }
            ],
            menus: {
              landmark: {
                acceptReporters: true,
                items: this.LANDMARK_MENU
              },
              videoMenu: {
                acceptReporters: true,
                items: this.VIDEO_MENU
              }
            }
        };
    }

    getX (args) {
      if (this.landmarks[parseInt(args.LANDMARK, 10)]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.landmarks[parseInt(args.LANDMARK, 10)][0] * 0.75);
        } else {
          return 240 - this.landmarks[parseInt(args.LANDMARK, 10)][0] * 0.75;
        }
      } else {
        return "";
      }
    }

    getY (args) {
      if (this.landmarks[parseInt(args.LANDMARK, 10)]) {
        return 180 - this.landmarks[parseInt(args.LANDMARK, 10)][1] * 0.75;
      } else {
        return "";
      }
    }

    videoToggle (args) {
      let state = args.VIDEO_STATE;
      if (state === 'off') {
        this.runtime.ioDevices.video.disableVideo();
      } else {
        this.runtime.ioDevices.video.enableVideo();
        this.runtime.ioDevices.video.mirror = state === "on";
      }
    }

    setLocale() {
      let locale = formatMessage.setup().locale;
      if (AvailableLocales.includes(locale)) {
        return locale;
      } else {
        return 'en';
      }
    }
}

module.exports = Scratch3Handpose2ScratchBlocks;
