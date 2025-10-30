# SecureCraft: Encrypted Canvas

<div align="center">

**A Fully Homomorphic Encryption (FHE) powered decentralized application for creating and storing encrypted artwork on-chain**

[![License](https://img.shields.io/badge/License-BSD_3--Clause--Clear-blue.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.27-blue)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.26.0-yellow)](https://hardhat.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Why SecureCraft?](#why-securecraft)
- [The Privacy Problem in Blockchain](#the-privacy-problem-in-blockchain)
- [Technology Stack](#technology-stack)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Smart Contract](#smart-contract)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Deployment](#deployment)
  - [Running the Frontend](#running-the-frontend)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Security Considerations](#security-considerations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Resources](#resources)
- [Acknowledgments](#acknowledgments)

---

## Overview

**SecureCraft** is a pioneering decentralized application that demonstrates the practical implementation of **Fully Homomorphic Encryption (FHE)** in Web3. It allows users to create encrypted drawings on a 4x4 canvas, store them securely on the blockchain, and decrypt them privately in their browser - all without revealing the content to anyone else, including network validators or node operators.

This project serves as both a functional dApp and an educational reference implementation for developers interested in building privacy-preserving applications using [Zama's FHEVM](https://www.zama.ai/fhevm) (Fully Homomorphic Encryption Virtual Machine).

### What Makes This Special?

Unlike traditional blockchain applications where all data is publicly visible, SecureCraft leverages **Fully Homomorphic Encryption** to keep your drawings completely private on-chain. The encrypted data can only be decrypted by you, the owner, making it perfect for demonstrating how FHE can solve the blockchain privacy problem.

---

## Key Features

### Core Functionality

- **User Registration**: Register with a memorable username to participate in the community
- **Encrypted Drawing Creation**: Select from 16 unique tile designs (emojis) to create a 4x4 artwork
- **On-Chain Encryption**: All drawings are encrypted client-side using FHE before being stored on the blockchain
- **Private Decryption**: Only the owner can decrypt their drawings, and decryption happens entirely in the browser
- **Community Gallery**: View registered users and see who has created encrypted artwork (without seeing the actual content)
- **Zero Knowledge Storage**: The blockchain stores encrypted data without ever knowing the plaintext

### Technical Highlights

- **Client-Side Encryption**: All encryption happens in the user's browser using Zama's FHE library
- **Smart Contract Integration**: Solidity smart contracts with native FHE support via FHEVM
- **Modern Web3 Stack**: Built with React, TypeScript, Wagmi, and RainbowKit for seamless wallet integration
- **Gas Optimized**: Efficient bit-masking to store 16 tile selections in a single `euint32`
- **Type-Safe**: Full TypeScript support with auto-generated contract types via TypeChain
- **Developer-Friendly**: Comprehensive Hardhat development environment with testing and deployment scripts

---

## Why SecureCraft?

### The Privacy Advantage

| Traditional Blockchain | SecureCraft with FHE |
|------------------------|----------------------|
| All data is public | Data is encrypted on-chain |
| Anyone can read stored values | Only owner can decrypt |
| Privacy requires off-chain solutions | Privacy is native and on-chain |
| Limited sensitive data use cases | Enables private data applications |
| Validators see everything | Validators see encrypted data only |

### Use Cases & Applications

While SecureCraft demonstrates the concept with encrypted drawings, the same technology can power:

- **Private Voting Systems**: Cast encrypted votes that can only be tallied, not viewed individually
- **Confidential DeFi**: Trade and transfer tokens without revealing balances or amounts
- **Healthcare Records**: Store medical data on-chain with patient privacy
- **Sealed-Bid Auctions**: Submit encrypted bids that remain hidden until reveal time
- **Private Gaming**: On-chain games with hidden state (fog of war, private hands, etc.)
- **Confidential Business Logic**: Execute private smart contract computations

---

## The Privacy Problem in Blockchain

### Traditional Blockchain Transparency

Blockchain technology is inherently transparent - every transaction, every state change, and every piece of data stored on-chain is visible to everyone. While this transparency provides security and verifiability, it creates significant privacy challenges:

1. **Financial Privacy**: All wallet balances and transaction amounts are public
2. **Business Confidentiality**: Companies can't store sensitive business logic or data on-chain
3. **Personal Information**: Users risk exposing private information
4. **Competitive Disadvantage**: Strategies and positions are visible to competitors

### Traditional "Solutions" and Their Limitations

#### Off-Chain Computation
- **Problem**: Defeats the purpose of decentralization; requires trust in centralized servers
- **Issue**: Data leaves the blockchain, losing verifiability and censorship resistance

#### Zero-Knowledge Proofs (ZKPs)
- **Limitation**: Prove statements without revealing data, but can't perform computations on encrypted data
- **Use Case**: Great for identity and verification, not for general computation

#### Mixing Services
- **Problem**: Only obfuscate transaction flows, don't provide true computational privacy
- **Issue**: Often centralized and can be regulated or shut down

### The FHE Solution

**Fully Homomorphic Encryption** enables computation directly on encrypted data without ever decrypting it. This means:

- Data stays encrypted on the blockchain
- Smart contracts can perform operations on encrypted values
- Results remain encrypted and can only be decrypted by authorized parties
- No trusted third parties required
- True decentralization with privacy

SecureCraft demonstrates this by allowing the smart contract to store and manage encrypted drawings without ever knowing what they contain.

---

## Technology Stack

### Smart Contracts & Blockchain

| Technology | Version | Purpose |
|------------|---------|---------|
| **Solidity** | 0.8.27 | Smart contract programming language |
| **FHEVM** | 0.8.0 | Zama's Fully Homomorphic Encryption library for Solidity |
| **Hardhat** | 2.26.0 | Ethereum development environment |
| **TypeChain** | 8.3.2 | Generate TypeScript bindings from smart contracts |
| **Hardhat Deploy** | 0.11.45 | Deployment system for smart contracts |
| **Ethers.js** | 6.15.0 | Ethereum JavaScript library |

### Frontend & User Interface

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI framework |
| **TypeScript** | 5.8.3 | Type-safe JavaScript |
| **Vite** | 7.1.6 | Fast build tool and dev server |
| **Wagmi** | 2.17.0 | React Hooks for Ethereum |
| **RainbowKit** | 2.2.8 | Beautiful wallet connection UI |
| **TanStack Query** | 5.89.0 | Data fetching and state management |
| **Viem** | 2.37.6 | TypeScript interface for Ethereum |

### Encryption & Privacy

| Technology | Version | Purpose |
|------------|---------|---------|
| **TFHE** | Latest | Fully Homomorphic Encryption library (WASM) |
| **Zama Relayer SDK** | 0.2.0 | Client-side decryption relay service |
| **Encrypted Types** | 0.0.4 | TypeScript types for encrypted values |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code quality and consistency |
| **Prettier** | Code formatting |
| **Solhint** | Solidity linting |
| **Hardhat Gas Reporter** | Gas usage analysis |
| **Solidity Coverage** | Test coverage analysis |
| **Mocha + Chai** | Testing framework |

---

## How It Works

### The Encryption Flow

1. **User Creates Drawing**
   - User selects tiles on a 4x4 canvas (16 positions)
   - Selection is encoded as a 32-bit integer using bit masking
   - Each bit represents whether a tile is selected (1) or not (0)

2. **Client-Side Encryption**
   - The selection integer is encrypted using Zama's FHE library
   - Encryption happens entirely in the user's browser
   - A cryptographic proof (`inputProof`) is generated
   - An encrypted handle (`externalEuint32`) is created

3. **On-Chain Storage**
   - The encrypted handle and proof are submitted to the smart contract
   - Smart contract verifies the proof and stores the encrypted value
   - The plaintext selection is never sent to the blockchain
   - Only encrypted data exists on-chain

4. **Private Decryption**
   - User requests decryption of their stored drawing
   - A temporary key pair is generated in the browser
   - User signs an EIP-712 message proving ownership
   - Zama's relayer service assists in decryption (without learning the plaintext)
   - Decrypted data is displayed locally in the browser

### The Smart Contract Logic

```solidity
// Simplified contract structure
contract EncryptedCanvas {
    struct PlayerData {
        string username;           // Public username
        euint32 selection;         // Encrypted drawing (FHE encrypted)
        bool registered;           // Registration status
        bool hasSelection;         // Has submitted a drawing
    }

    mapping(address => PlayerData) private players;

    // Register with a username
    function registerPlayer(string calldata username) external;

    // Store encrypted drawing
    function updateSelection(
        externalEuint32 encryptedSelectionHandle,
        bytes calldata inputProof
    ) external;

    // Retrieve player data (selection remains encrypted)
    function getPlayer(address playerAddress) external view returns (...);
}
```

### Bit Masking for Efficient Storage

To efficiently store 16 tile selections in a single 32-bit integer:

```typescript
// Encoding: Convert array of selected tiles [1, 5, 9] to bitmask
function encodeSelection(tiles: number[]): number {
  return tiles.reduce((mask, tile) => mask | (1 << (tile - 1)), 0);
}
// Result: 0b100010001 = 273

// Decoding: Convert bitmask back to array of selected tiles
function decodeSelection(mask: number): number[] {
  const tiles: number[] = [];
  for (let i = 0; i < 16; i++) {
    if ((mask & (1 << i)) !== 0) tiles.push(i + 1);
  }
  return tiles;
}
// Input: 273 → Output: [1, 5, 9]
```

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────┐  │
│  │   React UI   │─────▶│ FHE Encrypt  │─────▶│  Wagmi   │  │
│  │  (4x4 Canvas)│◀─────│ FHE Decrypt  │◀─────│  Wallet  │  │
│  └──────────────┘      └──────────────┘      └──────────┘  │
│         │                     │                     │        │
│         │                     │                     │        │
└─────────┼─────────────────────┼─────────────────────┼────────┘
          │                     │                     │
          │                     │                     │
          ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Blockchain Network                       │
│                     (Sepolia / Local)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              ┌──────────────────────────┐                   │
│              │  EncryptedCanvas.sol     │                   │
│              │  ─────────────────────   │                   │
│              │  • registerPlayer()      │                   │
│              │  • updateSelection()     │                   │
│              │  • getPlayer()           │                   │
│              │  • getRegisteredPlayers()│                   │
│              └──────────────────────────┘                   │
│                         │                                   │
│                         │                                   │
│              ┌──────────▼──────────┐                        │
│              │   Encrypted State    │                        │
│              │   (euint32 values)   │                        │
│              └─────────────────────┘                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                          │
                          │
                          ▼
              ┌─────────────────────┐
              │  Zama FHE Relayer   │
              │  (Decryption Help)  │
              └─────────────────────┘
```

### Data Flow

```
Creation Flow:
User Interface → Select Tiles → Encode Bitmask → FHE Encrypt →
Generate Proof → Send Transaction → Store on Blockchain

Decryption Flow:
Request Decrypt → Generate Keypair → Sign EIP-712 Message →
Call Relayer → Decrypt Locally → Display in Browser
```

---

## Smart Contract

### EncryptedCanvas.sol

The core smart contract provides the following functionality:

#### Functions

##### `registerPlayer(string calldata username)`
- Registers a new user with a username
- Initializes empty encrypted selection
- Sets up FHE permissions for the player
- Emits `PlayerRegistered` event

##### `updateSelection(externalEuint32 encryptedSelectionHandle, bytes calldata inputProof)`
- Verifies the encrypted input proof
- Stores the encrypted selection for the sender
- Updates FHE access permissions
- Emits `SelectionUpdated` event

##### `getPlayer(address playerAddress)`
- Returns player data including username, registration status, and encrypted selection
- Encrypted selection remains encrypted in the response

##### `getRegisteredPlayers()`
- Returns array of all registered player addresses
- Used to populate the community gallery

#### Security Features

- **Access Control**: Only registered players can update selections
- **FHE Permissions**: Explicit permission management for encrypted values
- **Input Validation**: Username requirements and registration checks
- **Custom Errors**: Gas-efficient error handling

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20 or higher
  ```bash
  node --version  # Should be >= 20.0.0
  ```

- **npm**: Version 7 or higher (comes with Node.js)
  ```bash
  npm --version   # Should be >= 7.0.0
  ```

- **Git**: For cloning the repository
  ```bash
  git --version
  ```

- **MetaMask** or another Web3 wallet browser extension

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/securecraft.git
   cd securecraft
   ```

2. **Install smart contract dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd app
   npm install
   cd ..
   ```

### Configuration

#### 1. Environment Variables for Smart Contracts

Set up your environment variables using Hardhat's configuration vars:

```bash
# Set your wallet mnemonic (12 or 24 words)
npx hardhat vars set MNEMONIC
# Paste your mnemonic when prompted

# Set Infura API key for Sepolia network access
npx hardhat vars set INFURA_API_KEY
# Get one at https://infura.io

# Optional: Set Etherscan API key for contract verification
npx hardhat vars set ETHERSCAN_API_KEY
# Get one at https://etherscan.io/apis
```

Alternatively, create a `.env` file (make sure it's in `.gitignore`):

```bash
PRIVATE_KEY=your_private_key_here
INFURA_API_KEY=your_infura_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

#### 2. Compile Smart Contracts

```bash
npm run compile
```

This will:
- Compile all Solidity contracts
- Generate TypeScript types via TypeChain
- Create artifacts in the `artifacts/` directory

#### 3. Run Tests

```bash
# Run all tests on local network
npm run test

# Run tests with gas reporting
REPORT_GAS=true npm run test

# Run tests with coverage
npm run coverage
```

### Deployment

#### Deploy to Local Network

1. **Start a local Hardhat node**
   ```bash
   npm run chain
   ```

2. **In a new terminal, deploy the contracts**
   ```bash
   npm run deploy:localhost
   ```

3. **Note the deployed contract address** - you'll need this for the frontend

#### Deploy to Sepolia Testnet

1. **Ensure you have Sepolia ETH** in your wallet
   - Get testnet ETH from a [Sepolia faucet](https://sepoliafaucet.com/)

2. **Deploy to Sepolia**
   ```bash
   npm run deploy:sepolia
   ```

3. **Verify the contract on Etherscan** (optional)
   ```bash
   npm run verify:sepolia <CONTRACT_ADDRESS>
   ```

4. **Run integration tests on Sepolia**
   ```bash
   npm run test:sepolia
   ```

### Running the Frontend

1. **Configure the contract address**

   Edit `app/src/config/contracts.ts` and update with your deployed contract address:

   ```typescript
   export const CONTRACT_ADDRESS = '0xYourDeployedContractAddress' as const;
   ```

2. **Start the development server**
   ```bash
   cd app
   npm run dev
   ```

3. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Connect your MetaMask wallet
   - Make sure you're on the correct network (Localhost or Sepolia)

4. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

---

## Usage Guide

### 1. Connect Your Wallet

- Click "Connect Wallet" in the header
- Select your preferred wallet (MetaMask, Coinbase Wallet, etc.)
- Approve the connection request
- Ensure you're on the correct network

### 2. Register Your Username

- Enter a memorable username in the registration form
- Click "Register"
- Approve the transaction in your wallet
- Wait for transaction confirmation

### 3. Create Your Encrypted Drawing

- Click on tiles to select them (click again to deselect)
- Each tile has a unique emoji and color
- Select as many or as few tiles as you want
- Click "Save Drawing" when ready
- Approve the transaction
- Your drawing is now encrypted and stored on-chain

### 4. Decrypt Your Drawing

- In the "My Encrypted Drawing" section, click "Decrypt Drawing"
- Sign the EIP-712 message to prove ownership
- Your drawing will be decrypted locally in your browser
- Only you can see the decrypted result

### 5. Explore the Community Gallery

- View all registered users
- See who has created encrypted drawings
- Note: You can't see others' drawings - they remain private

---

## Project Structure

```
securecraft/
├── contracts/               # Solidity smart contracts
│   └── EncryptedCanvas.sol # Main FHE-enabled contract
│
├── deploy/                  # Hardhat deployment scripts
│   └── deploy.ts           # Contract deployment logic
│
├── tasks/                   # Custom Hardhat tasks
│   ├── accounts.ts         # Account management utilities
│   └── encryptedCanvas.ts  # Canvas interaction tasks
│
├── test/                    # Smart contract tests
│   ├── EncryptedCanvas.ts         # Local network tests
│   └── EncryptedCanvasSepolia.ts  # Sepolia integration tests
│
├── app/                     # Frontend React application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── CanvasApp.tsx    # Main application component
│   │   │   └── Header.tsx       # Navigation header
│   │   │
│   │   ├── config/          # Configuration files
│   │   │   ├── contracts.ts     # Contract address & ABI
│   │   │   └── wagmi.ts         # Wagmi configuration
│   │   │
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useEthersSigner.ts  # Ethers signer hook
│   │   │   └── useZamaInstance.ts  # FHE instance hook
│   │   │
│   │   ├── styles/          # CSS stylesheets
│   │   │   ├── App.css
│   │   │   ├── CanvasApp.css
│   │   │   └── Header.css
│   │   │
│   │   ├── App.tsx          # Root component
│   │   └── main.tsx         # Application entry point
│   │
│   ├── public/              # Static assets
│   ├── index.html           # HTML template
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.ts       # Vite configuration
│   └── tsconfig.json        # TypeScript configuration
│
├── hardhat.config.ts        # Hardhat configuration
├── package.json             # Root dependencies
├── tsconfig.json            # TypeScript configuration
├── .gitignore               # Git ignore rules
├── LICENSE                  # BSD-3-Clause-Clear license
└── README.md                # This file
```

---

## Security Considerations

### Smart Contract Security

1. **Access Control**: Only registered users can update their selections
2. **Input Validation**: Username and selection validation at the contract level
3. **FHE Permission Management**: Explicit control over who can access encrypted data
4. **Gas Optimization**: Efficient storage and computation patterns

### Frontend Security

1. **Client-Side Encryption**: Encryption happens in the browser before data leaves the client
2. **Wallet Security**: Integration with secure wallet providers via RainbowKit
3. **HTTPS Only**: Always use HTTPS in production for the frontend
4. **No Private Key Storage**: Private keys never leave the user's wallet

### FHE Security Guarantees

1. **Computational Security**: Based on the hardness of lattice problems (RLWE)
2. **Ciphertext Indistinguishability**: Encrypted data reveals no information about plaintext
3. **Homomorphic Properties**: Operations on encrypted data don't leak information
4. **Owner-Only Decryption**: Only the owner with the correct key can decrypt

### Known Limitations

1. **Relayer Dependency**: Decryption requires Zama's relayer service (currently centralized)
2. **Gas Costs**: FHE operations are more expensive than regular operations
3. **Computation Time**: Encryption and decryption take longer than plaintext operations
4. **Network Support**: Currently limited to FHEVM-enabled networks (Sepolia testnet)

### Best Practices

- Never share your private keys or mnemonic
- Always verify contract addresses before interacting
- Use a hardware wallet for production/mainnet deployments
- Audit smart contracts before deploying to mainnet
- Keep dependencies up to date for security patches

---

## Roadmap

### Phase 1: Foundation (Current)
- [x] Core smart contract with FHE support
- [x] Basic canvas drawing interface
- [x] User registration system
- [x] Encrypted storage and retrieval
- [x] Community gallery
- [x] Sepolia testnet deployment

### Phase 2: Enhanced Features (Q2 2025)
- [ ] **Larger Canvas**: Support for 8x8, 16x16 grids
- [ ] **Color Palette**: Allow users to add custom colors to tiles
- [ ] **Drawing History**: Track multiple versions of drawings
- [ ] **Export Functionality**: Download decrypted drawings as images
- [ ] **Sharing Mechanism**: Share encrypted drawings with specific addresses
- [ ] **Gas Optimization**: Further optimize FHE operations for lower costs

### Phase 3: Social & Gaming (Q3 2025)
- [ ] **Collaborative Canvas**: Multiple users contribute to shared encrypted artwork
- [ ] **Drawing Challenges**: Weekly themes and competitions
- [ ] **NFT Integration**: Mint encrypted drawings as NFTs
- [ ] **Voting System**: Community votes on best encrypted artwork
- [ ] **Reputation System**: Track user contributions and activity
- [ ] **Drawing Marketplace**: Buy/sell encrypted drawings

### Phase 4: Advanced Privacy Features (Q4 2025)
- [ ] **Selective Reveal**: Reveal parts of drawing to specific users
- [ ] **Time-Locked Decryption**: Automatically reveal after certain time
- [ ] **Multi-Party Computation**: Collaborative computation on encrypted drawings
- [ ] **Zero-Knowledge Proofs**: Prove properties without revealing content
- [ ] **Threshold Decryption**: Require multiple keys to decrypt
- [ ] **Privacy-Preserving Analytics**: Aggregate statistics without revealing individual data

### Phase 5: Production & Scaling (2026)
- [ ] **Mainnet Deployment**: Deploy to Ethereum mainnet with FHE support
- [ ] **L2 Integration**: Support for FHE-enabled Layer 2 networks
- [ ] **Decentralized Relayer**: Remove dependency on centralized relayer
- [ ] **Mobile Application**: Native iOS and Android apps
- [ ] **API Development**: Public API for developers to build on top
- [ ] **Developer SDK**: Easy-to-use SDK for FHE canvas applications

### Research & Innovation
- [ ] Explore compressed FHE for reduced gas costs
- [ ] Investigate new FHE schemes for faster operations
- [ ] Research homomorphic image processing techniques
- [ ] Develop FHE-based multiplayer games
- [ ] Create educational content and tutorials

---

## Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or sharing ideas, your help is appreciated.

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/securecraft.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Run tests**
   ```bash
   npm run test
   npm run lint
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Wait for review and address feedback

### Development Guidelines

- **Code Style**: Follow the existing TypeScript and Solidity style
- **Testing**: Maintain or improve test coverage
- **Documentation**: Update README and inline comments
- **Commits**: Use conventional commit messages
- **Gas Optimization**: Be mindful of gas costs in smart contracts

### Areas for Contribution

- Smart contract improvements and optimizations
- Frontend UI/UX enhancements
- Additional test coverage
- Documentation improvements
- Bug fixes and security patches
- New features from the roadmap
- Performance optimizations
- Accessibility improvements

---

## License

This project is licensed under the **BSD-3-Clause-Clear License**.

See the [LICENSE](LICENSE) file for full license text.

### What This Means

- ✅ You can use this code for commercial projects
- ✅ You can modify and distribute the code
- ✅ You must include the copyright notice
- ✅ You must include the license text
- ❌ The license explicitly excludes patent rights
- ❌ No warranty or liability from the authors

---

## Resources

### Official Documentation

- **FHEVM Documentation**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **Zama GitHub**: [https://github.com/zama-ai](https://github.com/zama-ai)
- **Hardhat Documentation**: [https://hardhat.org/docs](https://hardhat.org/docs)
- **Wagmi Documentation**: [https://wagmi.sh](https://wagmi.sh)
- **RainbowKit Documentation**: [https://www.rainbowkit.com](https://www.rainbowkit.com)

### Learning Resources

- **FHE Basics**: [Zama's FHE Introduction](https://www.zama.ai/post/what-is-fully-homomorphic-encryption)
- **FHEVM Quick Start**: [https://docs.zama.ai/protocol/solidity-guides/getting-started/quick-start-tutorial](https://docs.zama.ai/protocol/solidity-guides/getting-started/quick-start-tutorial)
- **Solidity Documentation**: [https://docs.soliditylang.org](https://docs.soliditylang.org)
- **React Documentation**: [https://react.dev](https://react.dev)

### Community & Support

- **Zama Discord**: [https://discord.gg/zama](https://discord.gg/zama)
- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/securecraft/issues)
- **Twitter/X**: Follow [@zama_fhe](https://twitter.com/zama_fhe) for updates

### Related Projects

- **FHEVM Templates**: [https://github.com/zama-ai/fhevm-hardhat-template](https://github.com/zama-ai/fhevm-hardhat-template)
- **FHEVM Contracts**: [https://github.com/zama-ai/fhevm-contracts](https://github.com/zama-ai/fhevm-contracts)
- **Awesome FHE**: [https://github.com/jonaschn/awesome-he](https://github.com/jonaschn/awesome-he)

---

## Acknowledgments

### Built With

- **[Zama](https://www.zama.ai/)** - For pioneering FHEVM and making FHE accessible to developers
- **[Hardhat](https://hardhat.org/)** - For the excellent Ethereum development environment
- **[React Team](https://react.dev/)** - For the powerful UI library
- **[Wagmi](https://wagmi.sh/)** - For the comprehensive React Hooks for Ethereum
- **[Rainbow](https://www.rainbowkit.com/)** - For the beautiful wallet connection UI

### Inspiration

This project was inspired by the need to demonstrate practical applications of Fully Homomorphic Encryption in Web3. We believe that privacy is a fundamental right, and FHE is a revolutionary technology that can bring true privacy to blockchain applications.

### Special Thanks

- The Zama team for their groundbreaking work on FHEVM
- The Ethereum community for continuous innovation
- All contributors and users of SecureCraft
- The open-source community for making projects like this possible

---

<div align="center">

**Built with ❤️ using FHEVM**

[Website](#) • [Documentation](#) • [Discord](#) • [Twitter](#)

⭐ Star us on GitHub if you find this project useful!

</div>
