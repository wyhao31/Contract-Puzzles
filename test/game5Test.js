const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    return { game };
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // good luck
    const threshold = '0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf';
    let wallet;
    while (1) {
      wallet = ethers.Wallet.createRandom();
      if (wallet.address < threshold) {
        wallet = wallet.connect(ethers.provider);

        // Send a few ethers to the new account, in order to
        // pay the tx gas.
        await ethers.provider.getSigner(0).sendTransaction({
          to: wallet.address,
          value: ethers.utils.parseEther('1')
        });
        break;
      }
    }

    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
