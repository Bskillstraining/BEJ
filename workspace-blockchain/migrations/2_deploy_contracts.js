const SimpleStorage = artifacts.require('SimpleStorage.sol');

module.exports = async (deployer, network, accounts) => {
    await deployer.deploy(SimpleStorage);
}
