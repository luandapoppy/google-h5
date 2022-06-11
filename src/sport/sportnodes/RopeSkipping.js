import BaseSport from "./BaseSport"
import FloatPosition from '../util/FloatPosition'

const jumpMiniCount = 6;
const jumpValue = 1.2;

class RopeSkipping extends BaseSport {

    constructor() {
        super();
        this.jumpState = 0;    // 运动趋势，0-平稳，1-上升，2-下降
        this.bCanAdd = false;
    }

    sportCheck(person) {
        console.log("-----------child sportCheck start----------------");
        super.sportCheck(person);
        var position = new FloatPosition((person[1][0] + person[2][0]) / 2, (person[1][1] + person[2][1]) / 2)
        var isAddSportCode = this.checkPosNetJump(position);
        if (isAddSportCode) {
            this.sportCode += 1;
        }
        console.log("-----------child sportCheck end----------------");
    }

    // 波动检测
    checkPosNetJump(floatPosition) {
        let size = this.pointsQueue.size;
        // 入队
        this.pointsQueue.enqueue(floatPosition);
        if (size < jumpMiniCount) {
            return false
        }
        // 出队
        if (size > jumpMiniCount) {
            this.pointsQueue.dequeue();
        }
        // 判断波动
        var nextPosition = this.pointsQueue.getByIndex(size - 1);
        var previewPosition = this.pointsQueue.getByIndex(size - 3);
        var offset = nextPosition.y - previewPosition.y;

        if (offset < - jumpValue) {
            this.jumpState = 1
            this.bCanAdd = true
            // bJumpPoint = true
        }
        else if (offset > jumpValue) {
            this.jumpState = 2
            // bJumpPoint = true
            if (this.bCanAdd) {
                this.bCanAdd = false
                return true
            }
        }
        return false;
    }
}

export default RopeSkipping;