import {Sprite} from "../base/Sprite.js";

export class Birds extends Sprite{
  constructor() {
      const image = Sprite.getImage("birds");
      super(image,
          0, 0,
          image.width, image.height,
          0, 0,
          image.width, image.height);

      //小鸟图片三个元素，小鸟宽34，高24，上下10，左右9
      this.clippingX = [
          9, 9 + 34 + 18, 9 + 34 + 18 + 34 + 18
      ]
      this.birdWidth = 34;
      this.birdHeight = 24;
      this.clippingY = [10, 10, 10];
      this.clippingWidth = [this.birdWidth, this.birdWidth, this.birdWidth];
      this.clippingHeight = [this.birdHeight, this.birdHeight, this.birdHeight];
      this.birdX = window.innerWidth / 4;
      this.birdsX = [this.birdX, this.birdX, this.birdX];
      this.birdY = window.innerHeight / 2;
      this.birdsY = [this.birdY, this.birdY, this.birdY];
      this.birdsWidth = [this.birdWidth, this.birdWidth, this.birdWidth];
      this.birdsHeight = [this.birdHeight, this.birdHeight, this.birdHeight];
      this.birdIndex = 0;
      this.birdCount = 0;
  }

  draw() {
      this.birdSpeed = 0.1;
      this.birdCount += this.birdSpeed;
      this.birdIndex = Math.floor(this.birdCount) % this.birdsWidth.length;
      super.draw(this.img,
          this.clippingX[this.birdIndex], this.clippingY[this.birdIndex],
          this.clippingWidth[this.birdIndex], this.clippingHeight[this.birdIndex],
          this.birdsX[this.birdIndex], this.birdsY[this.birdIndex],
          this.birdsWidth[this.birdIndex], this.birdsHeight[this.birdIndex]
          )
  }
}