import Web3 from "web3";

// import {
//   default as contract
// } from 'truffle-contract'
import metaCoinArtifact from "../../build/contracts/StarWebprint.json";

// var SendMessage = contract(metaCoinArtifact);

const App = {
  web3: null,
  account: null,
  meta: null,
  isWatchingEvents: false,
  startWatchingEvents: false,
  metaMaskProvider: false,
  balance: 0,
  numDonors: 0,
  lastEvent: null,

  start: async function() {
    const { web3 } = this;

    try {
      // SendMessage.setProvider(this.web3.currentProvider);
      // get contract instance
      const networkId = await web3.eth.net.getId();
      // console.log(networkId);
      const deployedNetwork = metaCoinArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        metaCoinArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      
      
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  refreshBalance: async function() {
    const balanceP = document.getElementById("balance");
    balanceP.innerHTML = "<strong>Already "+App.web3.utils.fromWei(App.balance.toString(),"ether")+" Ether from "+App.numDonors+" Donors!</strong>";
  },

  sendDonation: async function() {
    const amount = parseFloat(document.getElementById("amount").value);
    const message = document.getElementById("message").value;

    this.setStatus("Initiating transaction... (please wait)");

    
    // let instance = await SendMessage.deployed()
    // await instance.sendNewMessage(message,{ from: this.account, value: this.web3.utils.toWei(amount.toString(), 'ether') });
    const { sendNewMessage } = this.meta.methods;
    await sendNewMessage(message).send({ from: this.account, value: this.web3.utils.toWei(amount.toString(), 'ether') });


    this.setStatus("Transaction complete!");
    s
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
  addToStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message+status.innerHTML;
  },
  getMeta: function() {
    return this.meta;
  },
  getWeb3: function() {
    return this.web3;
  },
  listDonors: function() {
    const donorsTextarea = document.getElementById("donorsList");
    this.meta.getPastEvents('SendReceipt', {fromBlock:7134000, toBlock:'latest'}).then(events => {
      events.forEach(event => {
        App.balance += parseInt(event.returnValues._amount);
        App.numDonors++;
        donorsTextarea.value = App.web3.utils.fromWei(event.returnValues._amount.toString(),'ether') + " Ether\r\n" + "From: "+event.returnValues._from+'\r\nhttps://etherscan.io/tx/'+event.transactionHash+ "\r\n" + event.returnValues._message + "\r\n-------------------------------\r\n" + donorsTextarea.value;
    });
    
    App.refreshBalance();
    App.watchDonorEvents();
  });
  },
  watchDonorEvents: function() {
    console.log("watchDonorEvents started");
    

    App.web3._provider.on('error', () => {
      App.isWatchingEvents = false
        App.watchDonorEvents()
      })
      App.web3._provider.on('end', () => {
        App.isWatchingEvents = false
        App.watchDonorEvents()
      })
    
    if (App.isWatchingEvents) return

    if (App.web3._provider.connected || App.metaMaskProvider) {
      App.isWatchingEvents = true;
      const donorsTextarea = document.getElementById("donorsList");
      App.meta.events.SendReceipt({fromBlock:'latest'}, function(error, event) {
        console.log(event);
        
        App.balance += parseInt(event.returnValues._amount);
        App.numDonors++;
        App.refreshBalance();
        donorsTextarea.value = App.web3.utils.fromWei(event.returnValues._amount.toString(),'ether') + " Ether\r\n" + "From: "+event.returnValues._from+'\r\nhttps://etherscan.io/tx/'+event.transactionHash+ "\r\n" + event.returnValues._message + "\r\n-------------------------------\r\n" + donorsTextarea.value;
    });
      console.log("Event listener Started");
    } else {
      console.log('Delay restartWatchEvents')
      setTimeout(App.watchDonorEvents, 3 * 1000)
    }
    
  },
  testPrint: function() {
    startPrint("This is a test-receipt","https://vomtom.at");
  },
  listenPrinter: function() {
    App.startWatchingEvents = true;
    window.addEventListener("build", function() {
        document.getElementById('status').innerHTML = "Got Meta";
        App.meta.getPastEvents('SendReceipt', {fromBlock:7134000, toBlock:'latest'}).then(events => {
            events.forEach(element => {
                App.addToStatus(App.getWeb3().utils.fromWei(element.returnValues._amount.toString(),'ether') + " Ether<br />" + "From: "+element.returnValues._from+"<br>" + element.returnValues._message+"<hr />");
                App.lastEvent = element;
            });
        });
        App.listenPrinterEvents();
    });
  },
  printLastReceipt: function() {
    startPrint(App.getWeb3().utils.fromWei(App.lastEvent.returnValues._amount.toString(),'ether') + " Ether\r\n" + "From: "+App.lastEvent.returnValues._from+"\r\n-----------------------\r\n" + App.lastEvent.returnValues._message,'https://etherscan.io/tx/'+App.lastEvent.transactionHash);
  },
  listenPrinterEvents: function() {
    console.log("listenPrinterEvents started");
    /*App.web3._provider.on('error', () => {
      console.log("Error in Provider, aborting");
      App.isWatchingEvents = false
        App.listenPrinterEvents()
      })
      App.web3._provider.on('end', () => {
        
      console.log("End in Provider, aborting");
        App.isWatchingEvents = false
        App.listenPrinterEvents()
      })
    */
    if (App.isWatchingEvents) return

    if (App.web3._provider.connected || App.metaMaskProvider) {
      App.isWatchingEvents = true;
      App.meta.events.SendReceipt({fromBlock:'latest'}, function(error, element) {
        App.addToStatus(App.getWeb3().utils.fromWei(element.returnValues._amount.toString(),'ether') + " Ether<br />" + "From: "+element.returnValues._from+"<br>" + element.returnValues._message+"<hr />");
        startPrint(App.getWeb3().utils.fromWei(element.returnValues._amount.toString(),'ether') + " Ether\r\n" + "From: "+element.returnValues._from+"\r\n-----------------------\r\n" + element.returnValues._message,'https://etherscan.io/tx/'+element.transactionHash);
    });
      console.log("Event listener listenPrinterEvents started");
    } else {
      console.log('Delay restartWatchEvents')
      setTimeout(App.listenPrinterEvents, 3 * 1000)
    }
  },
  initFallbackWeb3: function() {
    const provider = new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws/v3/a6e318d2abb348e8a3c320d5ac133170")
    App.web3 = new Web3(provider);
    App.web3._provider.on('connect', () => {
      
    App.start();
      console.log('WS Connected. GREAT!')
    });
    App.web3._provider.on('error', e => {
      console.error('WS Error', e);
      App.isWatchingEvents = false;
      //alert("Lost Connection: Error" + e);
      App.initFallbackWeb3();
    })
    App.web3._provider.on('end', () => {
      
      App.isWatchingEvents = false;
      console.error('WS End');
      
      //alert("Lost Connection: End");
      App.initFallbackWeb3();
    })
  }
};

window.App = App;

var event = document.createEvent('Event');

// Define that the event name is 'build'.
event.initEvent('build', true, true);

//https://github.com/ethereum/web3.js/issues/1354

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    App.metaMaskProvider = true;
    window.ethereum.enable(); // get permission to access accounts
    
    App.start();
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.initFallbackWeb3();
  }

});
