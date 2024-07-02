const SHA256 = require("crypto-js/SHA256");

module.exports = class Block {
    constructor(index, timestamp, data, prevHash=' ') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.getHash();
    }
    
    getHash() {
        return SHA256(this.index + this.timestamp + this.prevHash + JSON.stringify(this.data)).toString();
    }
}
