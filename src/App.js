import './css/App.css';
import React, { useState, useEffect } from 'react'
import {
  MetaMaskButton, useAccount,
  useSDK,
  useSignMessage
} from '@metamask/sdk-react-ui';
import {
  NFTCard
} from './show-nfts.js';
import { machine_addr, erc20_addr } from './config.js';
const ethers = require("ethers");
const typechain = require("nft-lending-machine");

function App() {
  useEffect(() => {
    getNFTsList();
  }, []);

  const [listNft, setListNft] = useState([]);
  const getNFTsList = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const machine = typechain.LendingMachine__factory.connect(machine_addr, provider);

      const signer = provider.getSigner();
      const balance = await typechain.LME20T__factory.connect(erc20_addr, provider).balanceOf(signer.getAddress());
      console.log(`signer balance: ${balance}`)

      const nftList = await machine.list_nfts();
      let list = [];
      nftList.forEach(async (e) => {
        list.push({
          img_url: await machine.tokenURI(e.token_id),
          token_id: e.token_id,
          owner: e.owner,
          price: (e.is_deposited) ? e.price : null,
          tmp_owner: e.tmp_owner,
          is_deposited: e.is_deposited
        })
        setListNft(prev => [...list]);
      });
    } catch (error) {
      console.log(error)
    }
  }

  let [mintQueue, setMintQueue] = useState([]);
  const MintNFT = () => {
    const [uri, setUri] = useState("");

    const handleSubmit = async (event) => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      event.preventDefault();
      let new_item = {
        uri: uri,
        owner: await signer.getAddress()
      }
      setMintQueue([...mintQueue, new_item])
      console.log(mintQueue)
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


  useEffect(() => {
    updateNFTsList();
  }, [mintQueue]);
  const updateNFTsList = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const machine = typechain.LendingMachine__factory.connect(machine_addr, provider);
      const signer = provider.getSigner()

      mintQueue.forEach(async (e) => {
        if (e.uri.match(/\.(jpeg|jpg|gif|png)$/) != null) {
          await machine.connect(signer).mint_new_nft(e.uri)
          console.log(`Current num nfts: ${await machine.connect(signer).get_num_nfts()}`)
        } else {
          console.log(`Invalid image uri: ${e.uri}`)
        }
      })
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
              nft_id={nft.token_id}
              nft_owner={nft.owner}
              nft_tmp_owner={nft.tmp_owner}
              nft_is_deposited={nft.is_deposited}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
