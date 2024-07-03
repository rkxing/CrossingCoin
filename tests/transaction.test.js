const assert = require('assert');
const Transaction = require('../src/transaction.js');
const Block = require('../src/block.js');
const BlockChain = require('../src/chain.js');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.genKeyPair();

let chain = new BlockChain();
const reward1 = new Transaction(null, myKey.getPublic('hex'), 5);
chain.pendingTransactions.push(reward1);
chain.minePending(myKey.getPublic('hex'));


const tx1 = new Transaction(myKey.getPublic('hex'), 'to1', 1);
tx1.sign(myKey);
assert(tx1.checkSignature());
chain.addNewTransaction(tx1);
chain.minePending(myKey.getPublic('hex'));


// console.log(JSON.stringify(chain, null, 2));
// console.log(chain.getWalletBalance(myKey.getPublic('hex')));
console.log(JSON.stringify(chain.getWalletTransactions(myKey.getPublic('hex')), null, 2));