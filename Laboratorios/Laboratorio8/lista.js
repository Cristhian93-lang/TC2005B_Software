const MAX = 100;

class Lista {
    constructor() {
        this.data = [];
        this.currentSize = 0;
    }
    
    insert(value) {
        if (this.currentSize < MAX) {
            this.data.push(value);
            this.currentSize++;
            return true;
        }
        return false;
    }

    print() {
        for (let i = 0; i < this.currentSize; i++) {
            console.log("[" + i + "] - " + this.data[i]);
        }
    }

    getCurrentSize() {
        return this.currentSize;
    }

    erase (){
        if (this.currentSize > 0) {
            console.log(this.data[this.currentSize - 1]);
            this.data.pop();
            this.currentSize--;
        } else {
            console.log("NO HAY ELEMENTOS");
        }
    }

    getData(index) {
        return this.data[index];
    }
}
module.exports = Lista;