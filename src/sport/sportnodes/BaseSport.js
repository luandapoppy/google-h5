import Queue from '../util/Queue'

class BaseSport {

    constructor() {
        // 运动个数/得分
        this.sportCode = 0;
        this.pointsQueue = new Queue();
    }

    sportDeal(person) {
        console.log("-----------parent deal start----------------");
        this.sportCheck(person);
        console.log("-----------parent deal end----------------");
    }

    sportCheck(person) {
        console.log("-----------parent sportCheck start----------------");

        console.log("-----------parent sportCheck end----------------");
    }
}

export default BaseSport;