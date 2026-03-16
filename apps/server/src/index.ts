import express from 'express';
import cors from 'cors';
import { GameEngine, PlayerInput } from '@arena-dash/engine';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const VALIDATOR_PRIVATE_KEY = process.env.VALIDATOR_PRIVATE_KEY;

app.post('/validate', async (req, res) => {
  if (!VALIDATOR_PRIVATE_KEY) {
    return res.status(500).json({ valid: false, error: 'Validator not configured' });
  }

  const { playerWallet, reportedScore, inputLog, seed } = req.body;

  try {
    const engine = new GameEngine({ seed, isServer: true });

    // Replay simulation
    for (const input of inputLog as PlayerInput[]) {
      engine.update(input);
    }

    const simulatedScore = engine.getScore();

    if (simulatedScore !== reportedScore) {
      return res.status(400).json({ valid: false, error: 'Score mismatch' });
    }

    // Generate EIP-712 Signature
    const wallet = new ethers.Wallet(VALIDATOR_PRIVATE_KEY);
    const timestamp = Math.floor(Date.now() / 1000);
    const currentSeason = 1;

    const messageHash = ethers.solidityPackedKeccak256(
      ['address', 'uint256', 'uint256', 'uint256'],
      [playerWallet, simulatedScore, timestamp, currentSeason]
    );

    const signature = await wallet.signMessage(ethers.getBytes(messageHash));

    res.json({
      valid: true,
      score: simulatedScore,
      timestamp,
      signature
    });
  } catch (error: any) {
    res.status(500).json({ valid: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Validator server running on port ${PORT}`);
});
