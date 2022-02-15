// SPDX-License-Identifier: MIT

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.1;

import "hardhat/console.sol";
import "./IERC20.sol";
import "./Ownable.sol";
import "./SafeMath.sol";

// This is the main building block for smart contracts.
contract Token is IERC20, Ownable {
  // Some string type variables to identify the token.
  // The `public` modifier makes a variable readable from outside the contract.
  string public name;
  string public symbol;
  uint256 public decimals;

  // The fixed amount of tokens stored in an unsigned integer type variable.
  uint256 public amount;

  mapping(address => uint256) balances;
  mapping(address => mapping (address => uint256)) allowed;

  using SafeMath for uint256;

  /**
  * Contract initialization.
  *
  * The `constructor` is executed only once when the contract is created.
  */
  constructor(uint256 _amount, uint256  _decimals, string memory _name, string memory _symbol) {
    // The amount is assigned to transaction sender, which is the account
    // that is deploying the contract.
    name = _name;
    symbol = _symbol;
    amount = _amount;
    decimals = _decimals;
    balances[msg.sender] = amount;
    _owner = msg.sender;
  }

  function balanceOf(address tokenOwner) public override view returns (uint256) {
    return balances[tokenOwner];
  }

  function totalSupply() public view virtual override returns (uint256) {
    return amount;
  }

  function transfer(address receiver, uint256 numTokens) public override returns (bool) {
    require(numTokens <= balances[msg.sender]);
    balances[msg.sender] = balances[msg.sender].sub(numTokens);
    balances[receiver] = balances[receiver].add(numTokens);
    emit Transfer(msg.sender, receiver, numTokens);
    return true;
  }

  function approve(address delegate, uint256 numTokens) public override returns (bool) {
    allowed[msg.sender][delegate] = numTokens;
    emit Approval(msg.sender, delegate, numTokens);
    return true;
  }

  function allowance(address owner, address delegate) public override view returns (uint) {
    return allowed[owner][delegate];
  }

  function transferFrom(address owner, address buyer, uint256 numTokens) public override returns (bool) {
    require(numTokens <= balances[owner], "Not having enough token");
    require(numTokens <= allowed[owner][msg.sender], "Not having enough allowance");

    // Start transfer amount
    balances[owner] = balances[owner].sub(numTokens);
    allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
    balances[buyer] = balances[buyer].add(numTokens);

    emit Transfer(owner, buyer, numTokens);
    return true;
  }
}