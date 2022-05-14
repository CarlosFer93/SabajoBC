pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {

  event SetPurpose(address sender, string purpose, string name);

  string public purpose = "Building Unstoppable Apps!!!";
  string public name = "Fulanitop";


  constructor() payable {
    // what should we do on deploy?
  }

  function setPurpose(string memory newPurpose, string memory newName) public {
      purpose = newPurpose;
      name = newName;
      console.log(msg.sender,"set purpose to",purpose, name);
      emit SetPurpose(msg.sender, purpose, name);
  }

  // to support receiving ETH by default
  // Comment whe using with a wallet like metamask
  // receive() external payable {}
  // fallback() external payable {}
}
