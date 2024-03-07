const { error } = require("console");
const crypto = require("crypto");
const NodeRSA = require('node-rsa');

class Transaction {
  constructor(from, to, amount, pk) {
    this.from = from;
    this.to = to;
    this.pk = pk;
    this.amount = amount.toString();
    this.signature = this.sign();
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto.createHash('sha256').update(this.from).update(this.to).update(this.amount.toString()).update(this.pk).update(this.signature).digest('hex');
  }

  sign() {
    const key = new NodeRSA({ b: 512 });
    const dataToSign = this.from + this.to + this.amount;
    return key.sign(dataToSign, 'hex');
  }
}

class Block {
  constructor(index, timestamp, transactions, previous_hash) {
    this.index = typeof index === "number" ? index.toString() : index;
    this.timestamp = timestamp.toString();
    this.transactions = transactions;
    this.previous_hash = previous_hash;

    this.hash = this.calculateHash();
  }

  calculateHash() {
    const dataString = this.transactions.map(transaction => transaction.hash).join('');
    return crypto.createHash('sha256').update(this.index).update(this.timestamp).update(dataString).update(this.previous_hash).digest('hex');
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.balances = {};
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), [], "0");
  }

  addBlock(newBlock) {
    if (newBlock.previous_hash !== this.getLatestBlock().hash) throw new Error();
    if (newBlock.hash !== newBlock.calculateHash()) throw new Error();
    if (newBlock.timestamp < this.getLatestBlock().timestamp) throw new Error();
    this.updateBalances(newBlock);
    this.chain.push(newBlock);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  isValid() {
    let previousTimestamp;
    let previousHash;

    for (const block of this.chain) {
      if (previousHash === undefined && previousTimestamp === undefined) {
        previousHash = block.hash;
        previousTimestamp = block.timestamp;
        continue;
      } else {
        if (previousHash !== block.previous_hash) return false;
        if (previousTimestamp > block.timestamp) return false;
        if (block.hash !== block.calculateHash()) return false;

        previousHash = block.hash;
        previousTimestamp = block.timestamp;
      }
    }

    return true;
  }

  updateBalances(newBlock) { 
    const balances = {};

    for (const transaction of newBlock.transactions) { 
      if (balances[transaction.from] === undefined || balances[transaction.to] === undefined) {
        balances[transaction.from] = 0;
        balances[transaction.to] = 0;
      }
      balances[transaction.from] -= parseFloat(transaction.amount);
      balances[transaction.to] += parseFloat(transaction.amount);
    }

    console.log('Balances after update:');
    for (const address in balances) {
      console.log(`${address}: ${balances[address]}`);
    }
  }
}

const blockchain = new Blockchain();
const privateKey = 'privatekey1';
blockchain.addBlock(new Block(
  blockchain.chain.length,
  Date.now(),
  [new Transaction('adresa1', 'adresa2', 0.2, privateKey)],
  blockchain.getLatestBlock().hash
));
console.log(blockchain);
