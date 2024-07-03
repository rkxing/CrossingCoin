const Transaction = require('../src/transaction.js');
const Block = require('../src/block.js');
const BlockChain = require('../src/chain.js');

let crossingCoin = new BlockChain();

firstTransaction = new Transaction("Jane Doe", "John Smith", 1.0345);
firstBlock = new Block(1, Date.now(), firstTransaction);
crossingCoin.addNewBlock(firstBlock);

console.log(JSON.stringify(crossingCoin, null, 2));
