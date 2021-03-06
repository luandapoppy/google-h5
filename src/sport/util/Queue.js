class Queue {

    constructor(items) {
        this.items = items || [];
    }

    // ε₯ε
    enqueue(ele) {
        this.items.push(ele);
    }

    // εΊε
    dequeue() {
        this.items.shift();
    }

    front() {
        return this.items[0];
    }

    clear() {
        this.items = [];
    }

    getByIndex(i) {
        return this.items[i];
    }

    get size() {
        return this.items.length;
    }

    get isEmpty() {
        return !this.items.length;
    }

    print() {
        console.log(this.items.toString());
    }
}

export default Queue;