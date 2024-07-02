const SHA256 = require("crypto-js/SHA256");

class Block {
    constructor(index, timestamp, data, prevHash=' ') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.createHash();
        this.nonce = 0;
    }

    createHash() {
        return SHA256(this.index + this.timestamp + this.prevHash + this.nonce + JSON.stringify(this.data)).toString();
    }

    // Simply proof-of-work algorithm that checks that every block's hash contains
    // [difficulty] number of leading zeroes.
    // Increments nonce value to refresh hash and meet difficulty restraint
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.createHash();
        }
    }
}

module.exports = Block;