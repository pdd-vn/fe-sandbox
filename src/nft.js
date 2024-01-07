import './css/App.css';
import React, { useState } from 'react'

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

export function NFTCard({ nft_img_url, nft_price, onLend, onClaim }) {
  let lend_button = (nft_price != null) ? (
    <button onClick={onLend} className="lend-button">
      {`Lend ${nft_price} DC`}
    </button>
  ) : <></>

  return (
    <>
      <NFTImage nft_img_url={nft_img_url} />
      <div className="button-container">
        {lend_button}
        <button onClick={onClaim} className="claim-button">
          Claim
        </button>
      </div>
    </>
  );
};