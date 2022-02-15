`SafeMath.sol`: Implementing SafeMath library, preventing underflow and overflow in smart contracts when performing transactions.

`Ownable.sol`: Implementing ownership characteristics of a token (can be transferred only by the owner)

`IERC20.sol`: Implementing "Transfer & Approve" functionality of a token

`Token.sol`: Our token as an ERC20 standard token (simplified version), inheriting from Ownable, implementing interface IERC20. The full version from OpenZeppelin is available [here](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol)

`TokenSale.sol`: Our token sale contract, implementing the buying process with USDT

Deployment Flow:

1. Compile `Token.sol` and create a pair of token: `KEEY` (Max: 2500, Decimal: 0) & `USDT` (Max: as big as possible, Decimal: 6)
2. Deploy `TokenSale.sol` contract by passing the 2 token address as parameters
3. Approve `KEEY` token with admin account (which minted the first 2500 token), and the `TokenSale` contract to use the token
