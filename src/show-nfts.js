const dotenv = require('dotenv')
import './css/App.css';
import React, { useState } from 'react'
const ethers = require("ethers");
const typechain = require("nft-lending-machine");

function NFTImage({ nft_img_url }) {
  const [hover, setHover] = useState(false);
  const handleMouseOver = () => {
    setHover(true);
  };

  const handleMouseOut = () => {
    setHover(false);
  };

  return (
    <div className="nft-card" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <img src={nft_img_url} alt="NFT" className="nft-image" />
      <div className='nft-info'>
        <div className='info-container'>
          <div className='info-item'>
            <div className='info-key'>Name:</div><div className='info-value'>Dung</div>
          </div>
          <div className='info-item'>
            <div className='info-key'>Age:</div><div className='info-value'>10</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function NFTCard({ nft_img_url, nft_price, nft_id, nft_owner }) {
  const onLend = async (nftId) => {
    console.log(`Lend button clicked for NFT ${nftId}`);
    // Add your logic for buying the specific NFT here
  };

  const onClaim = async (nftId) => {
    console.log(`Claim button clicked for NFT ${nftId}`);
    // Add your logic for liking the specific NFT here
  };

  const onDeposit = async (event) => {
    event.preventDefault();
    console.log(`Deposit ${nft_id} with ${value}`);
  };

  let lend_button = (nft_price != null) ? (
    <button onClick={onLend} className="nft-card-button">
      {`Lend ${nft_price} DC`}
    </button>
  ) : <></>

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const [value, setValue] = useState(0);
  let deposit_button = (nft_price == null && signer.getAddress() == nft_owner) ? (
    <form onSubmit={onDeposit}>
      <label>
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className='nft-card-text-box' />
      </label>
      <input type="submit" value="Deposit" className="nft-card-button" />
    </form>
  ) : <></>

  let claim_button = (
    <button onClick={onClaim} className="nft-card-button">
      Claim
    </button>
  )

  return (
    <>
      <NFTImage nft_img_url={nft_img_url} />
      <div className="nft-button-container">
        {lend_button}
        {deposit_button}
        {claim_button}
      </div>
    </>
  );
};