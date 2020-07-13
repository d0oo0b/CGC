/*
Author: Shen Hong
Email: shenhaws@amazon.com
*/

var msg =  {
     "code100" : "100: Call mint() successfully"
    ,"code191" : "191: No permission to mint"
    ,"code200" : "200: Call send() successfully"
    ,"code220" : "220: Call sendLc() successfully"
    ,"code221" : "221: There is aleady have the bill, bill repeated or insufficient balance"
    ,"code230" : "230: Call finishLc() successfully"
    ,"code231" : "231: Can not find the bill need to be finished"
    ,"code291" : "291: The Lc doc mismatch"
}



var dbClient;
dbClient = new AWS.DynamoDB();
if (dbClient) {
    console.log("Info log:"+"DynamoDB connected");
} else {
    console.log("Error log:"+"DynamoDB client is NULL");
}

var kinesis = new AWS.Kinesis();
var o_record;
if (kinesis) {
    console.log("Info log:"+"Kinesis connected");
    
} else {
    console.log("Error log:"+"Kinesis client is NULL");
}


        
if (typeof web3 !== 'undefined') {
web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("https://MC2bank-a.shenqianyu.com"));
}
web3.eth.defaultAccount = web3.eth.accounts[0];
var MC2Coin = web3.eth.contract(JSON.parse('[{"constant":true,"inputs":[],"name":"minter","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"t_balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"bills","outputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"bid","type":"uint256"},{"name":"amount","type":"uint256"},{"name":"status","type":"uint256"},{"name":"lc","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"f_balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Sent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"codeNo","type":"string"}],"name":"CommonEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"from_balance","type":"uint256"},{"indexed":false,"name":"to_balance","type":"uint256"},{"indexed":false,"name":"f_balance","type":"uint256"},{"indexed":false,"name":"t_balance","type":"uint256"}],"name":"BalanceEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"v1","type":"uint256"},{"indexed":false,"name":"v2","type":"uint256"},{"indexed":false,"name":"v3","type":"bool"}],"name":"DebugEvent","type":"event"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"send","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"bid","type":"uint256"},{"name":"amount","type":"uint256"},{"name":"lcs","type":"string"}],"name":"sendLc","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"bid","type":"uint256"},{"name":"amount","type":"uint256"},{"name":"lcs","type":"string"}],"name":"finishLc","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"bid","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"checkBill","outputs":[{"name":"status","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]')).at("xxxxxxxxxxx");
var MC2Accounts = web3.eth.accounts;
$.each(MC2Accounts, function(key, value){
    $("#MC2Account_select").append("<option value='"+value+"'>["+key+"]:"+value+"</option>");
});

$("#MC2Account_select").change(function(){
    if (dbClient) {
        var params = {Key:{"account_id":{S:$("#MC2Account_select").val()}},TableName: "MC2_bank_a"};
        dbClient.getItem(params, function(err, data) {
            if (err) 
		        console.log("Error log:"+err);
            else
		        $("#available_balance").val(data.Item == null || data.Item.balance == null ? 0 : data.Item.balance.N);
		        $("#frozen_balance").val(data.Item == null || data.Item.f_balance == null ? 0 : data.Item.f_balance.N);
		        $("#transitting_balance").val(data.Item == null || data.Item.t_balance == null ? 0 : data.Item.t_balance.N);
        });
    }
});

$("#pay_button").click(function(){
    try{
        rt = web3.personal.unlockAccount($("#MC2Account_select").val(), $("#passphrase").val(), 10);
        consoleBlock("Info log: Unlock account "+$("#MC2Account_select").val()+" returns "+rt);
        console.log("Info log: Unlock account "+$("#MC2Account_select").val()+" returns "+rt);
        //CommonEvent(string codeNo)
        var commonEvent = MC2Coin.CommonEvent();

        commonEvent.watch(function(error, result){
            if (!error) {
                consoleBlock("Info log: "+eval("msg.code"+result.args.codeNo));
                console.log("Info log: "+eval("msg.code"+result.args.codeNo));
            }else {
                consoleBlock("Error log:"+error);
                console.log("Info log: "+eval("msg.code"+result.args.codeNo));
            }
            commonEvent.stopWatching();
        });

        //sendLc(address to, uint bid, uint amount, string lcs)
        var rt = MC2Coin.sendLc($("#beneficiary_account").val()
                            , $("#bill_id").val()
                            , $("#bill_amount").val()
                            , $("#lc_doc").val()
                            , {from:$("#MC2Account_select").val()
                                , gas:$("#gas").val()
                                , gasPrice:$("#gasPrice").val()
                              }
        );
        consoleBlock("Info log: This transaction is sending to address:"+rt);
        console.log("Info log: This transaction is sending to address:"+rt);

        
    } catch (err){
        consoleBlock("Error log:"+err);
        console.log("Error log:"+err);
    }
});

$("#claim_button").click(function(){
    try{
        rt = web3.personal.unlockAccount($("#MC2Account_select").val(), $("#passphrase_p").val(), 10);
        consoleBlock("Info log: Unlock account "+$("#MC2Account_select").val()+" returns "+rt);
        console.log("Info log: Unlock account "+$("#MC2Account_select").val()+" returns "+rt);
        
        //CommonEvent(string codeNo)
        var commonEvent = MC2Coin.CommonEvent();

        commonEvent.watch(function(error, result){
            if (!error) {
                consoleBlock("Info log: "+eval("msg.code"+result.args.codeNo));
                console.log("Info log: "+eval("msg.code"+result.args.codeNo));
            }else {
                consoleBlock("Error log:"+error);
                console.log("Error log:"+error);
            }
            commonEvent.stopWatching();
        });

        //finishLc(address from, uint bid, uint amount, string lcs)
        var rt = MC2Coin.finishLc($("#pay_account").val()
                            , $("#bill_id_p").val()
                            , $("#bill_amount_p").val()
                            , $("#lc_doc_p").val()
                            , {from:$("#MC2Account_select").val()
                                , gas:$("#gas").val()
                                , gasPrice:$("#gasPrice").val()
                              }
        );
        consoleBlock("Info log: This transaction is sending to address:"+rt);
        console.log("Info log: This transaction is sending to address:"+rt);
        
    } catch (err){
        consoleBlock("Error log:"+err);
        console.log("Error log:"+err);
    }
});
//BalanceEvent(address from, address to, uint from_balance, uint to_balance, uint f_balance, uint t_balance)
var balanceEvent = MC2Coin.BalanceEvent();

balanceEvent.watch(function(error, result){
    if (!error) {
        if (kinesis) {
            var record = {
                Data: JSON.stringify({
                    account: result.args.from,
                    amount: 1,
                    time: new Date()
                }),
                PartitionKey: 'partition-MC2',
                StreamName: 'kinesisdatastream'
            };
            o_record = record;
            setInterval('putrecord(o_record)',3000);
        }
        if (dbClient) {
            var params = {
                            Key:{
                                "account_id":{S:result.args.from}
                            }, 
                            TableName: "MC2_bank_a",
                            ExpressionAttributeValues:{
                                ":b":{N:result.args.from_balance.toString(10)},
                                ":fb":{N:result.args.f_balance.toString(10)},
                                //":a":{S:result.args.from}
                            },
                            UpdateExpression: "SET balance = :b, f_balance = :fb",
                            //ConditionExpression: "account_id = :a",
                            ReturnValues:"ALL_NEW"
                
            };
            dbClient.updateItem(params, function(err, data) {
                if (err) {
			        console.log("Error log 1 :"+err);
                } else {
			        console.log("Info log: DB update 1");
                }
            });
            
            var params = {
                            Key:{
                                "account_id":{S:result.args.to}
                            }, 
                            TableName: "MC2_bank_a",
                            ExpressionAttributeValues:{
                                ":b":{N:result.args.to_balance.toString(10)},
                                ":tb":{N:result.args.t_balance.toString(10)},
                                //":a":{S:result.args.to}
                            },
                            UpdateExpression: "SET balance = :b, t_balance = :tb",
                            //ConditionExpression: "account_id = :a",
                            ReturnValues:"ALL_NEW"
                
            };
            
            dbClient.updateItem(params, function(err, data) {
                if (err) {
			        console.log("Error log 2 :"+err);
                } else {
			        console.log("Info log: DB update 2");
                }
            });
        }
    }else {
        consoleBlock("Error log:"+error);
        console.log("Error log:"+error);
    }
    //balanceEvent.stopWatching();
});

function putrecord(record)
{
    kinesis.putRecord(record,function(err, data) {
                  if (err) console.log(err, err.stack); // an error occurred
                  else     console.log(data);           // successful response
            });
}

/*
var commonEvent = MC2Coin.CommonEvent();
commonEvent.watch(function(error, result){
    if (!error) {
        consoleBlock("Info log: "+eval("msg.code"+result.args.codeNo));
        console.log("Info log: "+eval("msg.code"+result.args.codeNo));
    }else {
        consoleBlock("Error log:"+error);
        console.log("Info log: "+eval("msg.code"+result.args.codeNo));
    }
    //commonEvent.stopWatching();
});
*/