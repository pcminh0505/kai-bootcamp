// SPDX-License-Identifier: MIT

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.1;

import "hardhat/console.sol";
import "./Ownable.sol";
import "./Token.sol";
import "./SafeMath.sol";
import "./IERC20.sol";

contract TokenSale is Ownable {
  using SafeMath for uint256;

  IERC20 public KEEY;
  IERC20 public USDT;
  uint256 public constant FIXED_BUY_PRICE = 10000 * 10 ** 6;
  uint256 public constant MAX_CAP = 2500;
  uint256 public totalBought;

  constructor(address _KEEYAddress, address _USDTAddress) {
    KEEY = IERC20(_KEEYAddress);
    USDT = IERC20(_USDTAddress);
    _owner = msg.sender;
  }

  // Function to transfer from admin wallet (who mint the token) -> Sale contract
  function initializeSale(uint256 amount) public {
    require(amount <= KEEY.balanceOf(msg.sender), "Balance is not enough for fund");
    KEEY.transferFrom(msg.sender, address(this), amount);
  }

  event BuyKEEY(address addr, uint256 amount);
  function buyKEEY(uint256 USDTAmount) external payable {
    require(USDT.allowance(msg.sender, address(this)) >= USDTAmount, "Not approved enough USDT balance for the contract");
    require(_checkIntegerUSDTValue(USDTAmount), "Input USDT value is not divisible by price");

    uint256 _KEEYAmount = _getKEEYFromUSDT(USDTAmount);
    require(_KEEYAmount <= getRemainingKEEYInPool(), "Exceed the available KEEY amount.");

    USDT.transferFrom(msg.sender, owner(), USDTAmount);
    
    KEEY.transfer(msg.sender, _KEEYAmount);
    
    totalBought = totalBought.add(_KEEYAmount);
    
    emit BuyKEEY(msg.sender, _KEEYAmount);
  } 


  function getRemainingKEEYInPool() public view returns (uint256) {
    if (MAX_CAP >= totalBought) {
      return MAX_CAP - totalBought;
    } else {
      return 0;
    }
  }

  function emergencyWithdrawKeey(uint256 _amount) external onlyOwner {
    if(KEEY.balanceOf(address(this)) > _amount) {
        KEEY.transfer(owner(),_amount);
    } else {
        KEEY.transfer(owner(),KEEY.balanceOf(address(this)));
    }
  }

  /* Verifies USDT value is divisible by price */
  function _checkIntegerUSDTValue(uint value) private pure returns (bool) {
    return (value % FIXED_BUY_PRICE == 0);
  }
  

  function _getKEEYFromUSDT(uint256 USDTAmount) pure private returns(uint256 _amount) {
    return USDTAmount / FIXED_BUY_PRICE;
  }
}