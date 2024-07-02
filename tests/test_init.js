const Block = require('../src/block.js');
const BlockChain = require('../src/chain.js');
// import Block from "../src/block.js";
// import BlockChain from "../src/chain.js";

let crossingCoin = new BlockChain();

first = new Block(1, "2024-07-02", {from: "Jane Doe", to: "John Smith", quantity: 1.0345})
crossingCoin.addNew(first)

console.log(JSON.stringify(crossingCoin, null, 1));
