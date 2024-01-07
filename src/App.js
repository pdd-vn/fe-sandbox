import './css/App.css';
import React, { useState, useEffect } from 'react'
import {
  MetaMaskButton, useAccount,
  useSDK,
  useSignMessage
} from '@metamask/sdk-react-ui';
import {
  NFTCard
} from './nft.js';
const ethers = require("ethers");
const typechain = require("nft-lending-machine");

// Sepolia testnet
// const owner_addr = "0xf505B2b47BaC8849584915588bA3C0a01bd72206"
// const erc20_addr = "0x27566bEb67F55a12860bc3DaA50fF57B3dE76183"
// const machine_addr = "0x6168c921c5425859F64a21940bC9841521cf0284"

// Local testnet
const owner_addr = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
const erc20_addr = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1"
const machine_addr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

function App() {
  let mint_queue = [];
  const MintNFT = () => {
    const [uri, setUri] = useState("");

    const handleSubmit = async (event) => {
      event.preventDefault();
      mint_queue.push(uri)
    }

    return <>
      <div className="mint-container">
        <div className="mint-form">
          <form onSubmit={handleSubmit}>
            <label>
              <input type="text" value={uri} onChange={(e) => setUri(e.target.value)} className='mint-uri-text-box' />
            </label>
            <input type="submit" value="Mint NFT" className="mint-button" />
          </form>
        </div>
      </div></>
  }

  const handleLend = (nftId) => {
    console.log(`Buy button clicked for NFT ${nftId}`);
    // Add your logic for buying the specific NFT here
  };

  const handleClaim = (nftId) => {
    console.log(`Like button clicked for NFT ${nftId}`);
    // Add your logic for liking the specific NFT here
  };

  useEffect(() => {
    getNFTsList();
  }, []);

  const [listNft, setListNft] = useState([]);
  const getNFTsList = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const machine = typechain.LendingMachine__factory.connect(machine_addr, provider);

      const nftList = await machine.list_nfts();
      let list = [];
      nftList.forEach(async (e) => {
        list.push({
          img_url: await machine.tokenURI(e.token_id),
          price: (e.is_deposited) ? e.price : null,
          token_id: e.token_id
        })
        setListNft(prev => [...list]);
      });
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="App" >
      <div className="function-bar-container">
        <MintNFT />
        <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
      </div>
      <div className="nft-gallery">
        {listNft.map((nft, index) => (
          <div key={index} className="nft-frame">
            <NFTCard
              nft_img_url={nft.img_url}
              nft_price={nft.price}
              onLend={() => handleLend(nft.token_id)}
              onClaim={() => handleClaim(nft.token_id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
