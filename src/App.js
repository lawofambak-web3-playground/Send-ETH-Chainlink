import React from 'react';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractAbi from './PriceConsumerV3.json';

// Deployed contract address of Chainlink price feed
const contractAddress = "0x0e73739227a18569ecaf8f95b5bc6ecab2d99860";

function App() {

  // Creation of state variables
  const [accounts, setAccounts] = useState([]);
  const [price, setPrice] = useState("");

  // Check if wallet is connected
  const connectAccounts = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccounts(accounts);
      } else {
        window.alert("Need crypto wallet installed.")
      }
    } catch (error) {
      window.alert(error.message);
    }
  }

  // Function that retrieves ETH/USD price from Chainlink price feed (Rinkeby)
  const getEthPrice = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractAbi.abi, provider);

      let ethPrice = await contract.getLatestPrice();
      ethPrice = (ethPrice / 10 ** 8).toFixed(2);
      setPrice(ethPrice);
    } catch {
      setPrice("n/a");
    }
  }

  // Function to send ETH with two parameters: address and amount (from form)
  const sendPayment = async (address, amount) => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const networkName = (await provider.getNetwork()).name;

      // Checks if user is connected to Rinkeby network
      if (networkName === "rinkeby") {
        try {
          const signer = provider.getSigner();
          ethers.utils.getAddress(address);

          const ether = parseFloat(amount) / parseFloat(price);

          const tx = await signer.sendTransaction({
            to: address,
            value: ethers.utils.parseEther(ether.toString())
          });
          console.log(`Sent ${ether} ETH to ${address}!`);
        } catch (error) {
          window.alert(error.message);
        }
      } else {
        window.alert("Connect to Rinkeby network.")
      }
    } catch (error) {
      window.alert(error.message);
    }
  };

  // Function for submitting form that triggers sendPayment function with given data
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const address = data.get("address");
    const amount = data.get("amount");

    await sendPayment(address, amount);
  };

  // Runs getEthPrice function when page loads to display current ETH/USD price
  useEffect(() => {
    getEthPrice();
  }, []);

  return (
    <div>
      {accounts.length ? (
        <div className="App">
          <form className="transactionForm" onSubmit={handleSubmit}>
            <div>
              <label className="currencyLabel">Currency: ETH/USD</label>
              <label className="networkLabel">Rinkeby</label>
            </div>
            <label className="priceLabel">Price of ETH: ${price}</label>
            <label>Recipient Address</label>
            <input name="address" type="text" className="formInput" />
            <label className="amountLabel">Amount to Send in USD</label>
            <input name="amount" type="text" className="formInput" />
            <button type="submit" className="sendButton">Send Transaction</button>
          </form>
        </div>
      ) : (
        <div className="NotConnectedApp">
          <label className="buttonLabel">Send some ETH on the Rinkeby network</label>
          <button className="connectButton" onClick={connectAccounts}>Connect Wallet</button>
        </div>
      )}
    </div >
  );
}

export default App;
