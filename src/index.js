import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MetaMaskUIProvider } from '@metamask/sdk-react-ui';
import './css/index.css'

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  <React.StrictMode>
    <MetaMaskUIProvider sdkOptions={{
      dappMetadata: {
        name: "Example React UI Dapp",
        url: window.location.host,
      }
      // Other options
    }}>
      <App />
    </MetaMaskUIProvider>
  </React.StrictMode>
);