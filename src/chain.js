const Block = require("./block");

class BlockChain {
    constructor() {
        this.chain = [this.createGenesis()];
        this.difficulty = 3; // number of leading zeroes to find in hashes
        this.pendingTransactions = [];
        this.miningReward = 10;
    }

    /**
     * Genesis is the original block + start of the blockchain
     * Must be hardcoded
     * Created today, Tuesday 2024-07-02 @ 16:02 CDT
     *
     * @returns {Block}
     */
    createGenesis() {
        return new Block(0, "2024-07-02", "Genesis Block", "0");
    }

    /**
     * Gets latest addition to the chain
     *
     * @returns {Block}
     */
    getLatest() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * Adds new block to the end of the chain
     *
     * @param {Block} newBlock
     */
    addNew(newBlock) {
        newBlock.prevHash = this.getLatest().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    /**
     * Checks that:
     * 1) all hashes are intact and not tampered with (including Genesis)
     * 2) all blocks' prevHash value corresponds to the preceding block's hash
     *
     * @returns {boolean}
     */
    checkValidity() {
        const genesis = JSON.stringify(this.createGenesis());
        if (genesis !== JSON.stringify(this.chain[0])) {
            return false;
        }

        // remaining blocks
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