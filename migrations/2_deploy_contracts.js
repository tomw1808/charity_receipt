const WebPrint = artifacts.require("StarWebprint");

module.exports = function(deployer) {
  deployer.deploy(WebPrint);
};
