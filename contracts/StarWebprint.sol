pragma solidity ^0.5.0;

contract StarWebprint {
    event SendReceipt(uint indexed _id, address _from, uint _amount, string _message);

    mapping(uint => address) public messageIdFromMapping;
    uint public numDonors;
    uint public totalEarned;
    address payable public donateTo = 0xc7464dbcA260A8faF033460622B23467Df5AEA42;

    function sendNewMessage(string memory message) public payable {
        require(totalEarned <= totalEarned+msg.value, 'Integer Overflow, Aborting');
        require(msg.value >= 0.1 ether, 'Minimum of 0.1 Ether required. Aborting');
        messageIdFromMapping[numDonors] = msg.sender;       
        emit SendReceipt(numDonors, msg.sender, msg.value, message);
        numDonors++;
        donateTo.transfer(msg.value);
    }

}