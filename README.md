# MC2

My cool coin(aka: CGC) is a demo for Smart LC solution on Ethereum.
This demo is build on AWS with Cognito, DynamoDB, Kinesis.

## File structure

```
|-MC2
	|-node_modules				[ Node.js Modules ]
	|-index.js					[ Http server and router]
	|-wallet.html				[ Ethereum wallet application UI]
	|-static			
		|-wallet.js				[ Ethereum wallet application script. Call the smart contract 
								of Ethereum through the web3 library. Use AWS SDK to operate 
								DynamoDB, Kinesis and other services.]
		|-util.js				[ UTIL Script. Authenticate users through Cognito.]
	|-contracts
		|-MC2Coin.txt			[ Smart contract]
	|-Queries
		|-accountQuery			[ Query interface]
	|-package-lock.json			[ As package.json]
	|-package.json				[ Configration of WEB3]
		

```

## Deploy contract with truffle

#### truffle initialization

```
mkdir MC2Coin
cd MC2Coin
truffle unbox MC2Coin
```


#### Modify truffle.js

```
module.exports = {
  // Refer to <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks:{
    live:{
      host:"127.0.0.1",
      port:60545,
      network_id:"123456",
	  gas:3000000
    }
  }

};
```


#### Compile

```
truffle compile
```


#### Deploy

```
truffle migrate --network live
```

output

```
Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x20527de6bc7ef8f0320f7b89faf648f991aecfd65f6979e4b9b7f0acc399271a
  Migrations: 0xbd1786642cc3ac971dfd588d425e80b57b6c34a4
Saving successful migration to network...
  ... 0xbb564ee5ef152fe262a28ea8ef56b7680d0ad35459356ff57f3f024617ef9f7c
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying ConvertLib...
  ... 0xa7865f3d8e8888abdde4266773d8ed20cb96735e571686292bcb59646bf2d173
  ConvertLib: 0xc53d3562425c35bac21f8e5be7943b070a2b857f
  Linking ConvertLib to MC2Coin
  Deploying MC2Coin...
  ... 0x6fe8a4d7c469106f90a8e51eccbf5a8552577a0f0a67d733a772f7adf591b213
  MetaCoin: 0xdb5494c8ac5529d1b48622fe8ea88a4d315a32cb
Saving successful migration to network...
  ... 0x4d025ebdeb3840449b506a48fc923dfb78bb84738490cf9f4cf9f255a4ead437
Saving artifacts...
```

## Demo

![](https://github.com/d0oo0b/CGC/blob/master/static/demo.png)
![](https://github.com/d0oo0b/CGC/blob/master/static/arch.png)

```
|-MC2
	|-static			
		|-media1.mp4			[ Demo video ]


```


