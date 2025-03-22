Welcome to this **Solana NFT DApp** – a decentralized platform designed to create and manage NFTs on the Solana blockchain. Built with modern web technologies and powered by the Metaplex ecosystem, this DApp simplifies NFT management with a sleek, user-friendly interface.

---

## ✨ Features

- **Create NFTs**: Effortlessly mint NFTs with metadata, royalties, and more.
- **Manage NFTs**: Update metadata or burn NFTs directly from the connected wallet.
- **Custom Attributes**: Add traits and metadata to personalize your NFTs.
- **IPFS Integration**: Leverage Pinata for secure and decentralized storage.
- **Wallet Integration**: Connect and interact with your Solana wallet via Wallet Adapter.
- **Real-time Updates**: React-based interface with smooth animations for a seamless experience.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v15)
- **UI Framework**: [TailwindCSS](https://tailwindcss.com/)
- **Blockchain Tools**:
  - [Solana Web3.js](https://solana-labs.github.io/solana-web3.js)
  - [Metaplex Umi](https://docs.metaplex.com/umi)
  - [Metaplex Token Metadata](https://docs.metaplex.com/token-metadata)
  - [Metaplex Core](https://docs.metaplex.com/core)
- **State Management**: [React Hook Form](https://react-hook-form.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or later)
- **npm**
- **Solana Wallet** (e.g., Phantom, Solflare)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/mintopia.git
cd mintopia
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

```bash
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_api_key
```

### Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the app locally.
