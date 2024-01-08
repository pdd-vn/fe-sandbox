import './css/App.css';
import React, { useState } from 'react'
import { machine_addr, owner_addr, erc20_addr } from './config';
const ethers = require("ethers");
const typechain = require("nft-lending-machine");

function NFTImage({ nft_img_url, nft_id, nft_lend_duration, nft_is_deposited }) {
  const lend_duration = (nft_is_deposited) ? (
    <>
      <div className='info-key'>Lend duration:</div><div className='info-value'>{`${nft_lend_duration} days`}</div>
    </>) : <></>

  return (
    <div className="nft-card">
      <img src={nft_img_url} alt="NFT" className="nft-image" />
      <div className='nft-info'>
        <div className='info-container'>
          <div className='info-item'>
            <div className='info-key'>Id:</div><div className='info-value'>{`${nft_id}`}</div>
            {/* {lend_duration} */}
          </div>
        </div>
      </div>
    </div>
  )
}

export function NFTCard({ nft_img_url, nft_price, nft_id, nft_owner, nft_tmp_owner, nft_is_deposited, nft_lend_duration }) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const [deposit_amount, set_deposit_amount] = useState(0);
  const [lend_duration, set_lend_duration] = useState(0);

  const signer = provider.getSigner();
  const erc20 = typechain.LME20T__factory.connect(erc20_addr, provider);
  const contract_owner = provider.getSigner(owner_addr);
  const machine = typechain.LendingMachine__factory.connect(machine_addr, provider);

  const [signer_addr, set_signer_addr] = useState("")
  signer.getAddress().then(result => set_signer_addr(result));

  // console.log(`++++++++++++++++++++++++++++++++++++++++++++++++`)
  // console.log(`price of ${nft_id}: ${nft_price}`)
  // console.log(`tmp owner of ${nft_id}: ${nft_tmp_owner}`)
  // console.log(`owner of ${nft_id}: ${nft_owner}`)
  // console.log(`current signer: ${signer_addr}`)
  // console.log(`is_deposited ${nft_id}: ${nft_is_deposited}`)

  const onLend = async () => {
    console.log(`Lend button clicked for NFT ${nft_id}`);
    if (signer != nft_owner) {
      await erc20.connect(signer).approve(machine_addr, nft_price);
      await machine.connect(signer).lend(nft_id);
      console.log(`Lended ${nft_id} with ${nft_price} LME20T`);
    }
  };

  const onClaim = async () => {
    console.log(`Claim button clicked for NFT ${nft_id}`);
    if (signer_addr == nft_tmp_owner) {
      await machine.connect(contract_owner).approve(signer_addr, nft_id);
      await machine.connect(signer).claim(nft_id);
      console.log(`Claimed ${nft_id}`);
    }
  };

  const onDeposit = async (event) => {
    event.preventDefault();
    if (signer_addr == nft_owner) {
      console.log(`try depositing...`)
      await machine.connect(signer).deposit(nft_id, deposit_amount, lend_duration);
      console.log(`Deposited ${nft_id} with ${deposit_amount} for ${lend_duration} days`);
    }
  };

  const onRepay = async () => {
    console.log(`Repay button cliked for NFT ${nft_id}`)
    if (signer_addr == nft_owner) {
      await erc20.connect(signer).approve(machine_addr, nft_price);
      await machine.connect(contract_owner).approve(signer_addr, nft_id);
      await machine.connect(signer).repay(nft_id);
      console.log(`Repayed ${nft_id} with ${nft_price} LME20T`);
    }
  }

  let lend_button = <></>;
  if (nft_price != null && signer_addr != nft_owner && nft_is_deposited && nft_tmp_owner == 0) {
    lend_button = (
      <button onClick={onLend} className="nft-card-button">
        {`Lend ${nft_price} LME2T`}
      </button>
    )
  } else if (nft_tmp_owner != 0) {
    lend_button = (
      <button className="nft-card-static-button">
        Lended
      </button>
    )
  }

  let deposit_button = <></>;
  if (nft_price == null && signer_addr == nft_owner && !nft_is_deposited && nft_tmp_owner == 0) {
    deposit_button = (
      <form onSubmit={onDeposit}>
        <label>
          <input type="text" value={(deposit_amount == 0) ? null : deposit_amount} onChange={(e) => set_deposit_amount(e.target.value)} className='nft-card-text-box' placeholder='amount' />
          <input type="text" value={(lend_duration == 0) ? null : lend_duration} onChange={(e) => set_lend_duration(e.target.value)} className='nft-card-text-box' placeholder='duration' />
        </label >
        <input type="submit" value="Deposit" className="nft-card-button" />
      </form >
    )
  } else if (nft_tmp_owner == 0 && nft_is_deposited || nft_tmp_owner != 0) {
    deposit_button = (
      <button className="nft-card-static-button">
        Deposited
      </button>
    )
  }

  let claim_button = (
    nft_price != null && nft_is_deposited && signer_addr == nft_tmp_owner
  ) ? (
    <button onClick={onClaim} className="nft-card-button">
      Claim
    </button>
  ) : <></>

  let repay_button = (
    signer_addr == nft_owner && nft_tmp_owner != 0
  ) ? (
    <button onClick={onRepay} className="nft-card-button">
      Repay
    </button>
  ) : <></>

  return (
    <>
      <NFTImage nft_img_url={nft_img_url} nft_id={nft_id} nft_lend_duration={nft_lend_duration} nft_is_deposited={nft_is_deposited} />
      <div className="nft-button-container">
        {lend_button}
        {deposit_button}
        {claim_button}
        {repay_button}
      </div>
    </>
  );
};