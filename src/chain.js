const Block = require("./block.js");

class BlockChain {
    constructor() {
        this.chain = [this.createGenesis()];
        this.difficulty = 3;
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
        newBlock.prevHash = this.getLatest().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    checkValidity() {
        for(let i = 1; i < this.chain.length; i++) {
            const curr = this.chain[i];
            const prev = this.chain[i - 1];

            if (curr.hash !== curr.createHash() || curr.prevHash !== prev.hash) {
                return false;
            }
        }

        return true;
    }
}

module.exports = BlockChain;