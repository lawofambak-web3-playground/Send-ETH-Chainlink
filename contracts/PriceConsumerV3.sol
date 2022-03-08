// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "../chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {
    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Rinkeby
     * Aggregator: ETH/USD
     * Address: 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
     */
    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }
}

// Deployed contract address: 0x0e73739227a18569ecaf8f95b5bc6ecab2d99860
// https://rinkeby.etherscan.io/tx/0x0b3a26ebea34c766d61dcda13d36cab270d1e8103f8128b5527d367cb7361040
