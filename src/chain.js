const Block = require("./block");
const Transaction = require("./transaction");

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
    addNewBlock(newBlock) {
        newBlock.prevHash = this.getLatest().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    /**
     * Adds new transaction to list of pending transactions and verifies signature
     *
     * @param {Transaction} newTransaction
     */
    addNewTransaction(newTransaction) {
        if (!newTransaction.from || !newTransaction.to) {
            throw new Error('Transaction missing from or to address\n');
        }

        if (!newTransaction.checkSignature()) {
            throw new Error("Transaction signature invalid\n");
        }

        if (newTransaction.amt <= 0) {
            throw new Error("Transaction amount must be > 0\n");
        }

        const currBalance = this.getWalletBalance(newTransaction.from);
        if (newTransaction.amt > currBalance) {
            throw new Error("Insufficient funds to complete transaction\n");
        }

        const pendingOther = this.pendingTransactions.filter(t => t.from === newTransaction.from);
        if (pendingOther.length > 0) {
            let pendingAmt = 0;
            for (const t of pendingOther) {
                pendingAmt += t.amt;
            }

            if ((pendingAmt + newTransaction.amt) > currBalance) {
                throw new Error("Insufficient funds for pending transactions\n");
            }
        }

        this.pendingTransactions.push(newTransaction);
    }

    /**
     * Sends all pending transactions to a block to mine, then pushes the new block to the chain
     * Also creates and sends a reward transaction to the address given in param [rewardAddr]
     *
     * @param {string} rewardAddr
     */
    minePending(rewardAddr) {
        const reward = new Transaction(null, rewardAddr, this.miningReward);
        this.pendingTransactions.push(reward);

        const newBlock = new Block(this.getLatest().index + 1, Date.now(), this.pendingTransactions, this.getLatest().hash);
        newBlock.mineBlock(this.difficulty);

        this.chain.push(newBlock);
        this.pendingTransactions = [];
    }

    /**
     * Gets the balance of the specified wallet address
     *
     * @param {string} addr
     * @returns {number}
     */
    getWalletBalance(addr) {
        let balance = 0;

        for (const block of this.chain) {
            for (const t of block.transactions) {
                if (t.from === addr) {
                    balance -= t.amt;
                }
                if (t.to === addr) {
                    balance += t.amt;
                }
            }
        }

        return balance;
    }

    /**
     * Gets list of all transactions associated with the specified wallet address
     *
     * @param {string} addr
     * @returns {Transaction[]}
     */
    getWalletTransactions(addr) {
        let allTransactions = [];

        for (const block of this.chain) {
            for (const t of block.transactions) {
                if (t.from === addr || t.to === addr) {
                    allTransactions.push(t);
                }
            }
        }

        return allTransactions;
    }

    /**
     * Checks that:
     * 1) all hashes are intact and not tampered with (including Genesis)
     * 2) all blocks' prevHash value corresponds to the preceding block's hash
     * 3) all blocks' transactions are valid and intact
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

            if (!curr.checkTransactions() || curr.hash !== curr.createHash() || curr.prevHash !== prev.hash) {
                return false;
            }
        }

        return true;
    }
}

module.exports = BlockChain;