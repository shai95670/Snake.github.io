//Snake factory function
// change to new class syntax 
export default class BodyPart {
    constructor(x, y) {
      this.width = 20;
      this.height = 20;
      this.color = 'green';
      this.speedX = 5;
      this.speedY = 5;
      this.x = x;
      this.y = y;
    }
}