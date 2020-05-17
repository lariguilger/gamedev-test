const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
  @property(cc.Node)
  machine = null;

  @property({ type: cc.AudioClip })
  audioClick = null;

  private block = false;

  private result = null;

  start(): void {
    this.machine.getComponent('Machine').createMachine();
  }

  update(): void {
    if (this.block && this.result != null) {
      this.informStop();
      this.result = null;
    }
  }

  click(): void {
    cc.audioEngine.playEffect(this.audioClick, false);

    if (this.machine.getComponent('Machine').spinning === false) {
      this.block = false;
      this.machine.getComponent('Machine').spin();
      this.requestResult();
    } else if (!this.block) {
      this.block = true;
      this.machine.getComponent('Machine').lock();
    }
  }

  async requestResult(): Promise<void> {
    this.result = null;
    this.result = await this.getAnswer();
  }
  getRandInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }
  getRandReel() {
    const reelResult = []
    for (let index = 0; index < 3; index++) {
      reelResult.push(this.getRandInt(0,29));      
    }
    return reelResult
  }

  getAnswer(): Promise<Array<Array<number>>> {
    const slotResult = [];
    return new Promise<Array<Array<number>>>(resolve => {
      setTimeout(() => {
        const rand = this.getRandInt(1, 100);
        console.log(rand);
        if( rand <= 7 ){
          const line1 = this.getRandInt(0,29);
          const line2 = this.getRandInt(0,29);
          const line3 = this.getRandInt(0,29);
          resolve([[line1, line2, line3],[line1, line2, line3],[line1, line2, line3],[line1, line2, line3],[line1, line2, line3]]);
        }
        else if( rand <= 17 ){
          const line1 = this.getRandInt(0,2);
          const line2 = this.getRandInt(0,2);
          const sortedNum1 = this.getRandInt(0,29);
          const sortedNum2 = this.getRandInt(0,29);
          const randResult = [this.getRandReel(), this.getRandReel(), this.getRandReel(), this.getRandReel(), this.getRandReel()] // get random results
          for (let index = 0; index < 5; index++) {
            randResult[index][line1] = sortedNum1; //change tiles in one selected line to match
            randResult[index][line2] = sortedNum2; //change tiles in one selected line to match
          }
          resolve(randResult);
        }
        else if( rand <= 50 ){
          const line = this.getRandInt(0,2);
          const sortedNum = this.getRandInt(0,29);
          const randResult = [this.getRandReel(), this.getRandReel(), this.getRandReel(), this.getRandReel(), this.getRandReel()] // get random results
          for (let index = 0; index < 5; index++) {
            randResult[index][line] = sortedNum; //change tiles in one selected line to match
          }
          resolve(randResult);
        }
        else {
          resolve(slotResult);
        }
      }, 1000 + 500 * Math.random());
    });
  }

  informStop(): void {
    const resultRelayed = this.result;
    this.machine.getComponent('Machine').stop(resultRelayed);
  }
}
