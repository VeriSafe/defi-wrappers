pragma solidity 0.5.8;
pragma experimental ABIEncoderV2;

/**
 * @title ERC20 interface
 * @dev see https://eips.ethereum.org/EIPS/eip-20
 */
interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);

    function approve(address spender, uint256 value) external returns (bool);

    function transferFrom(address from, address to, uint256 value) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address who) external view returns (uint256);

    function allowance(address owner, address spender) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface iiToken {
    function tokenPrice()
        external
        view
        returns (uint256 price);

    function avgBorrowInterestRate()
        external
        view
        returns (uint256);

    function borrowInterestRate()
        external
        view
        returns (uint256);

    function supplyInterestRate()
        external
        view
        returns (uint256);

    function marketLiquidity()
        external
        view
        returns (uint256);
        
    function balanceOf(address who) external view returns (uint256);
}

contract TokenData {

    struct TokenDataItems {
        uint256 tokenPrice;
        uint256 avgBorrowInterestRate;
        uint256 borrowInterestRate;
        uint256 supplyInterestRate;
        uint256 marketLiquidity;
    }
    
    struct TokenDataItemsAndUnderlying {
        uint256 tokenPrice;
        uint256 avgBorrowInterestRate;
        uint256 borrowInterestRate;
        uint256 supplyInterestRate;
        uint256 marketLiquidity;
        uint256 allowance;
        uint256 balance;
        uint256 balanceUnderlying;
    }

    function getiTokenData(
        address iTokenAddress)
        public
        view
        returns (TokenDataItems memory tokenData)
    {
        iiToken token = iiToken(iTokenAddress);

        tokenData.tokenPrice = token.tokenPrice();
        tokenData.avgBorrowInterestRate = token.avgBorrowInterestRate();
        tokenData.borrowInterestRate = token.borrowInterestRate();
        tokenData.supplyInterestRate = token.supplyInterestRate();
        tokenData.marketLiquidity = token.marketLiquidity();
    }
    
     function getBatchiTokensData(
        address[] memory iTokensAddressess)
        public
        view
        returns (TokenDataItems[] memory tokenData)
    {
        for(uint i=0; i< iTokensAddressess.length; i++){
           iiToken token = iiToken(iTokensAddressess[i]);
           tokenData[i].tokenPrice = token.tokenPrice();
           tokenData[i].avgBorrowInterestRate = token.avgBorrowInterestRate();
           tokenData[i].borrowInterestRate = token.borrowInterestRate();
           tokenData[i].supplyInterestRate = token.supplyInterestRate();
           tokenData[i].marketLiquidity = token.marketLiquidity();
     	}
      
    }
    
     function getBatchiTokensAndUnderlying(
        address ethAccount,
        address[] memory iTokensAddressess,
        address[] memory erc20TokensAddressess)
        public
        view
        returns (TokenDataItemsAndUnderlying[] memory tokenData)
    {
        require(iTokensAddressess.length == erc20TokensAddressess.length, "Lenght of arrays must be equal equal");
        for(uint i=0; i< iTokensAddressess.length; i++){
           iiToken token = iiToken(iTokensAddressess[i]);
           IERC20 erc20Token = IERC20(erc20TokensAddressess[i]);
           tokenData[i].tokenPrice = token.tokenPrice();
           tokenData[i].avgBorrowInterestRate = token.avgBorrowInterestRate();
           tokenData[i].borrowInterestRate = token.borrowInterestRate();
           tokenData[i].supplyInterestRate = token.supplyInterestRate();
           tokenData[i].marketLiquidity = token.marketLiquidity();
           tokenData[i].allowance = erc20Token.allowance(ethAccount, iTokensAddressess[i]);
           tokenData[i].balance = token.balanceOf(ethAccount);
           tokenData[i].balanceUnderlying = erc20Token.balanceOf(ethAccount);
     	}
      
    }
}