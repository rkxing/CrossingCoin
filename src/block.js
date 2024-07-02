const SHA256 = require("crypto-js/SHA256");
const Transaction = require("./transaction")

class Block {
    /**
     *
     * @param {number} index
     * @param {number} timestamp
     * @param {Transaction[]} transactions
     * @param {string} prevHash
     */
    constructor(index, timestamp, transactions, prevHash=' ') {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.prevHash = prevHash;
        this.hash = this.createHash();
        this.nonce = 0;
    }

    /**
     * Computes hash for this block
     *
     * @returns {string}
     */
    createHash() {
        return SHA256(this.index + this.timestamp + this.prevHash + this.nonce + JSON.stringify(this.transactions)).toString();
    }

    /**
     * Simply proof-of-work algorithm that checks that every block's hash contains
     * [difficulty] number of leading zeroes.
     * Increments nonce value to refresh hash and meet difficulty restraint
     *
     * @param {number} difficulty
     */
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.createHash();
        }
    }

    /**
     * Checks that all transactions in this block are valid (hash + signature intact)
     *
     * @returns {boolean}
     */
    checkTransactions() {
        for (const t of this.transactions) {
            if (!t.checkSignature()) {
                return false;
            }
        }

        return true;
    }
}

module.exports = Block;