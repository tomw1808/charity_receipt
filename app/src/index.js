import Web3 from "web3";

import {
  default as contract
} from 'truffle-contract'
import metaCoinArtifact from "../../build/contracts/StarWebprint.json";

var SendMessage = contract(metaCoinArtifact);

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      SendMessage.setProvider(this.web3.currentProvider);
      // get contract instance
      const networkId = await web3.eth.net.getId();
      console.log(networkId);
      const deployedNetwork = metaCoinArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        metaCoinArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.refreshBalance();
      
    window.dispatchEvent(event);
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  refreshBalance: async function() {
    
  },

  sendDonation: async function() {
    const amount = parseFloat(document.getElementById("amount").value);
    const message = document.getElementById("message").value;

    this.setStatus("Initiating transaction... (please wait)");

    
    let instance = await SendMessage.deployed()
    await instance.sendNewMessage(message,{ from: this.account, value: this.web3.utils.toWei(amount.toString(), 'ether') });

    this.setStatus("Transaction complete!");
    this.refreshBalance();
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
  addToStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message+"<br />"+status.innerHTML;
  },
  getMeta: function() {
    return this.meta;
  },
  getWeb3: function() {
    return this.web3;
  },
  listDonors: function() {
    const donorsTextarea = document.getElementById("donorsList");
    this.meta.getPastEvents('SendReceipt', {fromBlock:0, toBlock:'latest'}).then(events => {
      events.forEach(element => {
        console.log(element);
        donorsTextarea.value = web3.fromWei(element.returnValues._amount.toString(),'ether') + " Ether\r\n" + "From: "+element.returnValues._from+"\r\n-----------------------\r\n" + element.returnValues._message + "\r\n-----------------------\r\n\r\n" + donorsTextarea.value;
      });
  });
  }
};

window.App = App;

var event = document.createEvent('Event');

// Define that the event name is 'build'.
event.initEvent('build', true, true);

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/a6e318d2abb348e8a3c320d5ac133170"),
    );
  }

  App.start();
});
