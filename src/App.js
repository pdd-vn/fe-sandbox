import './App.css';
import React, { useState } from 'react'
import { MetaMaskButton } from "@metamask/sdk-react-ui";

function App() {
  const nftImages = Array(10).fill('https://cdn-icons-png.flaticon.com/512/4155/4155897.png');
  const nftPrices = Array(10).fill(666);

  const NFTImage = ({ nft_img_url }) => {
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
        {/* {
          true && (
            <div className='nft-info'>
              Only visible when hovering div
            </div>
          )
        } */}
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


  const NFTCard = ({ nft_img_url, nft_price, onLend, onClaim }) => {
    return (
      <>
        <NFTImage nft_img_url={nft_img_url} />
        <div className="button-container">
          <button onClick={onLend} className="lend-button">
            Lend {nft_price} ETH
          </button>
          <button onClick={onClaim} className="claim-button">
            Claim
          </button>
        </div>
      </>
    );
  };

  const handleLend = (nftId) => {
    console.log(`Buy button clicked for NFT ${nftId}`);
    // Add your logic for buying the specific NFT here
  };

  const handleClaim = (nftId) => {
    console.log(`Like button clicked for NFT ${nftId}`);
    // Add your logic for liking the specific NFT here
  };

  return (
    <div className="App" >
      <div className="metamask-button">
        <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
      </div>
      <div className="nft-gallery">
        {nftImages.map((imgUrl, index) => (
          <div key={index} className="nft-frame">
            <NFTCard
              nft_img_url={imgUrl}
              nft_price={nftPrices[index]}
              onLend={() => handleLend(index)}
              onClaim={() => handleClaim(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
