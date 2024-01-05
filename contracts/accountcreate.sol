// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract AccountCreate {
    struct Account {
        uint256 balance;
        string username;
        string email;
        string pan;
        string phoneNumber;
        uint256 dob;
    }

    mapping(address => Account) public accounts;

    function createAccount(
        string memory _username,
        string memory _email,
        string memory _pan,
        string memory _phoneNumber,
        uint256 _dob
    ) external {
        require(accounts[msg.sender].balance == 0, "Account already exists");

        Account memory newAccount = Account({
            balance: 0,
            username: _username,
            email: _email,
            pan: _pan,
            phoneNumber: _phoneNumber,
            dob: _dob
        });

        accounts[msg.sender] = newAccount;
    }
}

