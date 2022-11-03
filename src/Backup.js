import React, { useEffect } from "react";
import { ethers } from "ethers";
import './App.css';

const getEthereumObject = () => window.ethereum;

export default function App() {

  const wave = () => {
    
  }

  useEffect(() => {
      const ethereum = getEthereumObject();
      if (!ethereum) {
          console.log("Make sure you have metamask!");
      } else {
          console.log("We have the ethereum object", ethereum);
      }
  }, []);

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
      </div>
    </div>
  );
}
