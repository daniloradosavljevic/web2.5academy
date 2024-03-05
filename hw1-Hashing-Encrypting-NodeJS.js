// HomeWork1 

//Using Hash class in NodeJS
const {
    createHash,
  } = require('crypto');
 
  const hash = createHash('md5');
  
  original_data = 'Data to be hashed';
  console.log('Original data: ' + original_data);
  hash.update(original_data);

  hashed_data = hash.digest('hex')
  console.log('hashed: '+ hashed_data);
 
  // Encrypting the hash with node-rsa package
  const NodeRSA = require('node-rsa');
  const key = new NodeRSA({b: 512});
 
  const data = hashed_data;
  const encrypted = key.encrypt(data, 'base64');
  console.log('encrypted: ', encrypted);
  const decrypted = key.decrypt(encrypted, 'utf8');
  console.log('decrypted: ', decrypted);
