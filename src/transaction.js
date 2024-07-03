const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
    /**
     *
     * @param {string} from
     * @param {string} to
     * @param {number} amt
     */
    constructor(from, to, amt) {
        this.from = from;
        this.to = to;
        this.amt = amt;
        this.timestamp = Date.now();
        this.signature = null;
    }

    /**
     * Computes hash for this transaction
     *
     * @returns {string}
     */
    createHash() {
        return crypto.createHash('sha256').update(this.from + this.to + this.amt + this.timestamp).digest('hex');
    }

    /**
     * Signs transaction with a key. Creates a signature for this transaction
     *
     * @param {string} key
     */
    sign(key) {
        if (key.getPublic('hex') !== this.from) {
            throw new Error('Invalid key: does not match wallet\n');
        }

        const hash = this.createHash();
        this.signature = key.sign(hash, 'base64').toDER('hex');
    }

    /**
     * Checks that the transaction signature is valid and unmodified
     *
     * @returns {boolean}
     */
    checkSignature() {
        if (this.from === null) { // mining reward, so always valid
            return true;
        }

        if (this.signature === null || this.signature.length === 0) {
            throw new Error("Transaction is unsigned: signature not found\n");
        }

        const publicKey = ec.keyFromPublic(this.from, 'hex');
        return publicKey.verify(this.createHash(), this.signature);
    }
}

module.exports = Transaction;