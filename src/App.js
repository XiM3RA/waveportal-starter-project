import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

const getEthereumObject = () => window.ethereum;

const findMetaMaskAccount = async () => {
    try {
        const ethereum = getEthereumObject();
        if (!ethereum) {
            console.error("Make sure you have Metamask!");
            return null;
        }

        console.log("We have the Ethereum object", ethereum);
        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            return account;
        } else {
            console.error("No authorized account found");
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};


const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [waveMessage, setWaveMessage] = useState("");

  const contractAddress = "0xc3904bd196A1d602Cd477f169087da9310f6DF5F";
  const contractABI = abi.abi;


  const wave = async (event) => {
    try {
        const { ethereum } = window;
        console.log("gsegdsg");

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

            let count = await wavePortalContract.getTotalWaves();
            console.log("Retreived total wave count...", count.toNumber());

            const waveTxn = await wavePortalContract.wave(waveMessage);
            setWaveMessage("");
            console.log("Mining...", waveTxn.hash);

            await waveTxn.wait();
            console.log("Mined -- ", waveTxn.hash);

            count = await wavePortalContract.getTotalWaves();
            console.log("Retreived total wave count...", count.toNumber());
        } else {
            console.log("Ethereum object doesn't exist!");
        }
    } catch (error) {
        console.log(error);
    }
  }

  const getAllWaves = async () => {
      try {
          const { ethereum } = window;
          if (ethereum) {
              const provider = new ethers.providers.Web3Provider(ethereum);
              const signer = provider.getSigner();
              const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

              const waves = await wavePortalContract.getAllWaves();

              let wavesCleaned = [];
              waves.forEach(wave => {
                  wavesCleaned.push({
                      address: wave.waver,
                      timestamp: new Date(wave.timestamp * 1000),
                      message: wave.message
                  });
              });

              setAllWaves(wavesCleaned);
          } else {
              console.log("Ethereum object doesn't exist!")
          }
      } catch (error) {
          console.log(error);
      }
  }

    const connectWallet = async () => {
        try {
            const ethereum = getEthereumObject();
            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(async () => {
        const account = await findMetaMaskAccount();
        if (account !== null) {
            setCurrentAccount(account);
            getAllWaves();
        }
    }, []);

    const updateMessage = (event) => {
        setWaveMessage(event.target.value);
    }


  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hello there!
        </div>

        <div className="bio">
        I am Charles so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>


        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
            <input className="waveText" type="text" placeholder="Your message here..." onChange={updateMessage} >
            </input>


        {!currentAccount && (
            <button className="waveButton" onClick={connectWallet}>
                Connect Wallet
            </button>
        )}
      {allWaves.map((wave, index) => {
          return (
              <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
              </div>)
      })}

      </div>
    </div>
  );
}

export default App;
