const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
require('@tensorflow/tfjs-core');
require('@tensorflow/tfjs-converter');
require('@tensorflow/tfjs-backend-webgl');
const handpose = require('@tensorflow-models/handpose');

const Message = {
  getX: {
    'ja': '[LANDMARK] のx座標',
    'ja-Hira': '[LANDMARK] のxざひょう',
    'en': 'x of [LANDMARK]'
  },
  getY: {
    'ja': '[LANDMARK] のy座標',
    'ja-Hira': '[LANDMARK] のyざひょう',
    'en': 'y of [LANDMARK]'
  },
  videoToggle: {
    'ja': 'ビデオを [VIDEO_STATE] にする',
    'ja-Hira': 'ビデオを [VIDEO_STATE] にする',
    'en': 'turn video [VIDEO_STATE]'
  },
  setRatio: {
    'ja': '倍率を [RATIO] にする',
    'ja-Hira': 'ばいりつを [RATIO] にする',
    'en': 'set ratio to [RATIO]'
  },
  setInterval: {
    'ja': '認識を [INTERVAL] 秒ごとに行う',
    'ja-Hira': 'にんしきを [INTERVAL] びょうごとにおこなう',
    'en': 'Label once every [INTERVAL] seconds'
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
    'en': 'on flipped'
  },
  please_wait: {
    'ja': '準備に時間がかかります。少しの間、操作ができなくなりますがお待ち下さい。',
    'ja-Hira': 'じゅんびにじかんがかかります。すこしのあいだ、そうさができなくなりますがおまちください。',
    'en': 'Setup takes a while. The browser will get stuck, but please wait.'
  },
  landmarks: [
    {
      'ja': '手首',
      'ja-Hira': 'てくび',
      'en': 'wrist'
    },
    {
      'ja': '親指の根元',
      'ja-Hira': 'おやゆびのねもと',
      'en': 'the base of thumb'
    },
    {
      'ja': '親指の第2関節',
      'ja-Hira': 'おやゆびのだい2かんせつ',
      'en': 'the 2nd joint of thumb'
    },
    {
      'ja': '親指の第1関節',
      'ja-Hira': 'おやゆびのだい1かんせつ',
      'en': 'the 1st joint of thumb'
    },
    {
      'ja': '親指の先端',
      'ja-Hira': 'おやゆびのさき',
      'en': 'thumb'
    },
    {
      'ja': '人差し指の第3関節',
      'ja-Hira': 'ひとさしゆびのだい3かんせつ',
      'en': 'the 3rd joint of index finger'
    },
    {
      'ja': '人差し指の第2関節',
      'ja-Hira': 'ひとさしゆびのだい2かんせつ',
      'en': 'the 2nd joint of index finger'
    },
    {
      'ja': '人差し指の第1関節',
      'ja-Hira': 'ひとさしゆびのだい1かんせつ',
      'en': 'the 1st joint of index finger'
    },
    {
      'ja': '人差し指の先端',
      'ja-Hira': 'ひとさしゆびのせんたん',
      'en': 'index finger'
    },
    {
      'ja': '中指の第3関節',
      'ja-Hira': 'なかゆびのだい3かんせつ',
      'en': 'the 3rd joint of middle finger'
    },
    {
      'ja': '中指の第2関節',
      'ja-Hira': 'なかゆびのだい2かんせつ',
      'en': 'the 2nd joint of middle finger'
    },
    {
      'ja': '中指の第1関節',
      'ja-Hira': 'なかゆびのだい1かんせつ',
      'en': 'the 1st joint of middle finger'
    },
    {
      'ja': '中指の先端',
      'ja-Hira': 'なかゆびのせんたん',
      'en': 'middle finger'
    },
    {
      'ja': '薬指の第3関節',
      'ja-Hira': 'くすりゆびのだい3かんせつ',
      'en': 'the 3rd joint of ring finger'
    },
    {
      'ja': '薬指の第2関節',
      'ja-Hira': 'くすりゆびのだい2かんせつ',
      'en': 'the 2nd joint of ring finger'
    },
    {
      'ja': '薬指の第1関節',
      'ja-Hira': 'くすりゆびのだい1かんせつ',
      'en': 'the 1st joint of ring finger'
    },
    {
      'ja': '薬指の先端',
      'ja-Hira': 'くすりゆびのせんたん',
      'en': 'ring finger'
    },
    {
      'ja': '小指の第3関節',
      'ja-Hira': 'こゆびのだい3かんせつ',
      'en': 'the 3rd joint of little finger'
    },
    {
      'ja': '小指の第2関節',
      'ja-Hira': 'こゆびのだい2かんせつ',
      'en': 'the 2nd joint of little finger'
    },
    {
      'ja': '小指の第1関節',
      'ja-Hira': 'こゆびのだい1かんせつ',
      'en': 'the 1st joint of little finger'
    },
    {
      'ja': '小指の先端',
      'ja-Hira': 'こゆびのせんたん',
      'en': 'little finger'
    }
  ]
}
const AvailableLocales = ['en', 'ja', 'ja-Hira'];

class Scratch3Handpose2ScratchBlocks {
    get LANDMARK_MENU () {
      landmark_menu = [];
      for (let i = 1; i <= 21; i++) {
        landmark_menu.push({text: `${Message.landmarks[i - 1][this._locale]} (${i})`, value: String(i)})
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

    get INTERVAL_MENU () {
      return [
          {
            text: '0.1',
            value: '0.1'
          },
          {
            text: '0.2',
            value: '0.2'
          },
          {
            text: '0.5',
            value: '0.5'
          },
          {
            text: '1.0',
            value: '1.0'
          }
      ]
    }

    get RATIO_MENU () {
      return [
          {
            text: '0.5',
            value: '0.5'
          },
          {
            text: '0.75',
            value: '0.75'
          },
          {
            text: '1',
            value: '1'
          },
          {
            text: '1.5',
            value: '1.5'
          },
          {
            text: '2.0',
            value: '2.0'
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
        this.video = video;
        this.ratio = 0.75;
        this.interval = 200;

        this.video.addEventListener('loadeddata', (event) => {
          alert(Message.please_wait[this._locale]);
          handpose.load().then(model => {
            this.model = model;
            this.timer = setInterval(() => {
              this.model.estimateHands(this.video).then(hands => {
                hands.forEach(hand => {
                  this.landmarks = hand.landmarks;
                });
              });
            }, this.interval);
          });
        });

        let media = navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

        media.then((stream) => {
            this.video.srcObject = stream;
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
                            defaultValue: '1'
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
                            defaultValue: '1'
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
                },
                {
                    opcode: 'setRatio',
                    blockType: BlockType.COMMAND,
                    text: Message.setRatio[this._locale],
                    arguments: {
                        RATIO: {
                            type: ArgumentType.STRING,
                            menu: 'ratioMenu',
                            defaultValue: '0.75'
                        }
                    }
                },
                {
                    opcode: 'setInterval',
                    blockType: BlockType.COMMAND,
                    text: Message.setInterval[this._locale],
                    arguments: {
                        INTERVAL: {
                            type: ArgumentType.STRING,
                            menu: 'intervalMenu',
                            defaultValue: '0.2'
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
              },
              ratioMenu: {
                acceptReporters: true,
                items: this.RATIO_MENU
              },
              intervalMenu: {
                acceptReporters: true,
                items: this.INTERVAL_MENU
              }
            }
        };
    }

    getX (args) {
      let landmark = parseInt(args.LANDMARK, 10) - 1;
      if (this.landmarks[landmark]) {
        if (this.runtime.ioDevices.video.mirror === false) {
          return -1 * (240 - this.landmarks[landmark][0] * this.ratio);
        } else {
          return 240 - this.landmarks[landmark][0] * this.ratio;
        }
      } else {
        return "";
      }
    }

    getY (args) {
      let landmark = parseInt(args.LANDMARK, 10) - 1;
      if (this.landmarks[landmark]) {
        return 180 - this.landmarks[landmark][1] * this.ratio;
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

    setRatio (args) {
      this.ratio = parseFloat(args.RATIO);
    }

    setInterval (args) {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.interval = args.INTERVAL * 1000;
      this.timer = setInterval(() => {
        this.model.estimateHands(this.video).then(hands => {
          hands.forEach(hand => {
            this.landmarks = hand.landmarks;
          });
        });
      }, this.interval);
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
