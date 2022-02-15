// SPDX-License-Identifier: MIT

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.1;

contract Ownable {
  address internal _owner;

  constructor() {
    _owner = msg.sender;
  }

  function owner() public view virtual returns (address) {
    return _owner;
  }

  modifier onlyOwner {
    require(msg.sender == _owner, "Ownable: caller is not the owner");
    _;
  }

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  function transferOwnership(address newOwner) public virtual onlyOwner {
    require(newOwner != address(0), "Ownable: new owner is the zero address");
    _transferOwnership(newOwner);
  }

  function _transferOwnership(address newOwner) public onlyOwner {
    address oldOwner = _owner;
    _owner = newOwner;
    emit OwnershipTransferred(oldOwner, newOwner);
  }
}