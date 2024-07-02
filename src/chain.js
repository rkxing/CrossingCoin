const Block = require("./block.js");

module.exports = class BlockChain {
    constructor() {
        this.chain = [this.createGenesis()];
    }

    // Genesis is the original block + start of the blockchain 
    // Must be hardcoded
    // Created today, Tuesday 2024-07-02 @ 16:02 CDT 
    createGenesis() {
        return new Block(0, "2024-07-02", "Genesis Block", "0");
    }
    
    getLatest() {
        return this.chain[this.chain.length - 1];
    }
    
    addNew(newBlock) {
        newBlock.prevHash = this.getLatest.prevHash;
        newBlock.hash = newBlock.getHash();
        this.chain.push(newBlock);
    }
}
