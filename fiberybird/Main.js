import {Background} from "./js/runtime/Background.js";
import {Land} from "./js/runtime/Land.js";
import {ResourceLoader} from "./js/base/ResourceLoader.js";
import {DataStore} from "./js/base/DataStore.js";
import {Director} from "./js/Director.js";
import {DownPencil} from "./js/runtime/DownPencil.js";
import {UpPencil} from "./js/runtime/UpPencil.js";
import {Birds} from "./js/player/Birds.js";

// 初始化整个游戏的精灵，作为游戏开始的入口
export class Main {
  constructor() {
      //this.canvas = wx.createCanvas();
    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.dataStore = DataStore.getInstance();
    this.director = Director.getInstance();
    const loader = ResourceLoader.create();
    loader.onLoaded(map => this.onResourceFirstLoaded(map));
  }

  onResourceFirstLoaded(map) {
      this.dataStore.ctx = this.ctx;
      this.dataStore.map = map;//存放可以消除的资源数据
      this.init();
  }

  init() {
      this.dataStore.put("background", Background)
          .put("land", Land)
          .put("pencils", [])
          .put("birds", Birds);
      this.dataStore.isGameOver = false;//游戏结束标识
      this.director.createPencil();
      this.director.run();
  }
}