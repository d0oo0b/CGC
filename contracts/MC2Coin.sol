pragma solidity ^0.4.0;
pragma experimental ABIEncoderV2;

/*
Author: Shen Hong

*/


contract MC2Coin {
    // The keyword "public" makes those variables
    // readable from outside.
    address public minter;
    mapping (address => uint) public balances;  //Available Balance
    mapping (address => uint) public f_balances;//Frozen Balance
    mapping (address => uint) public t_balances;//Balance In Transit

    struct bill { // Struct
        address from;
        address to;
        uint bid;
        uint amount;
        uint status; //0:new; 1:finished; 2:withdraw
        bytes32 lc;
    }
    mapping (bytes32 => bill) public bills;

    // Events allow light clients to react on
    // changes efficiently.
    event Sent(address from, address to, uint amount);
    event CommonEvent(string codeNo);
    event BalanceEvent(address from, address to, uint from_balance, uint to_balance, uint f_balance, uint t_balance);
    
    event DebugEvent(uint v1, uint v2, bool v3);
    
    string constant code100 = "100"; //Call mint() successfully
    string constant code191 = "191"; //No permission to mint
    string constant code200 = "200"; //Call send() successfully
    string constant code220 = "220"; //Call sendLc() successfully
    string constant code221 = "221"; //Call sendLc() failed, bill repeated or insufficient balance
    string constant code230 = "230"; //Call finishLc() successfully
    string constant code231 = "231"; //Can not find the bill need to be finished
    string constant code291 = "291"; //The Lc doc mismatch
    
    
    // This is the constructor whose code is
    // run only when the contract is created.
    constructor() public {
        minter = msg.sender;
    }

    function mint(address receiver, uint amount) public {
        if (msg.sender != minter) {
            emit CommonEvent(code191);
            return;
        }
        balances[receiver] += amount;
        emit CommonEvent(code100);
        emit BalanceEvent(receiver, receiver, balances[receiver], balances[receiver], f_balances[receiver], t_balances[receiver]);
    }

    function send(address receiver, uint amount) public {
        if (balances[msg.sender] < amount) return;
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }

    function sendLc(address to, uint bid, uint amount, string lcs) public {
        bytes32 index32 = keccak256(abi.encodePacked(msg.sender, to, bid, amount));
        bill myBill = bills[index32];
        if (myBill.bid == 0 && balances[msg.sender] >= amount) {
            myBill.bid = bid;
            myBill.from = msg.sender;
            myBill.to = to;
            balances[msg.sender] = balances[msg.sender] - amount;
            f_balances[msg.sender] = f_balances[msg.sender] + amount;
            t_balances[to] = t_balances[to] + amount;
            myBill.amount = amount;
            myBill.status = 0;
            myBill.lc = keccak256(abi.encodePacked(lcs));
            emit CommonEvent(code220);
            emit BalanceEvent(msg.sender, to, balances[msg.sender], balances[to], f_balances[msg.sender], t_balances[to]);
            // emit DebugEvent(balances[msg.sender], myBill.amount, balances[msg.sender] >= myBill.amount);
        } else {
            emit CommonEvent(code221);
        }
    }
    
    /*
    function withdraw(address to, uint bid, uint amount) public {
        return;
    }
    */
    
    function finishLc(address from, uint bid, uint amount, string lcs) public {
        bytes32 index32 = keccak256(abi.encodePacked(from, msg.sender, bid, amount));
        bill myBill = bills[index32];
        if (myBill.bid == 0 || myBill.status != 0) {
            emit CommonEvent(code231);
            // emit DebugEvent(myBill.bid, myBill.status, myBill.status != 0);
        } else {
            if (myBill.lc == keccak256(abi.encodePacked(lcs))) {
                balances[msg.sender] = balances[msg.sender] + myBill.amount;
                t_balances[msg.sender] = t_balances[msg.sender] - myBill.amount;
                f_balances[from] = f_balances[from] - myBill.amount;
                myBill.status = 1;
                emit CommonEvent(code230);
                emit BalanceEvent(from, msg.sender, balances[from], balances[msg.sender], f_balances[from], t_balances[msg.sender]);
            } else {
                emit CommonEvent(code291);
            }
        }
    }
    
    function checkBill(address from, address to, uint bid, uint amount) public view returns (uint status){
        bytes32 vindex = keccak256(abi.encodePacked(from, to, bid, amount));
        status = bills[vindex].status;
    }
}
