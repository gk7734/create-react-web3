# Create React Web3

[![npm](https://img.shields.io/npm/v/create-react-web3-cli)](https://www.npmjs.com/package/create-react-web3-cli)
[![license](https://img.shields.io/npm/l/create-react-web3-cli)](https://github.com/gk7734/create-react-web3/blob/main/LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/gk7734/create-react-web3)](https://github.com/gk7734/create-react-web3/issues)

**Easily and efficiently start your web3 project**

[Quick Start](#quick-start) | [Contributing](#contributing)

---

## Introduction

**Create React Web3** is a tool designed for everyone — from beginners entering the world of web3 to experienced developers.  
It helps you quickly bootstrap a React-based web3 application without the hassle of complex blockchain setup.

---

## Quick Start

```bash
npx create-react-web3-cli .
cd my-app

# Using Example
# Blockchain Setting
cd blockchain
npx hardhat compile
npx hardhat keystore set [network-name]_RPC_URL
npx hardhat keystore set [network-name]_PRIVATE_KEY
npx hardhat run scripts/deploy.ts --network [network-name]

# Client Setting
cd ../client
cd src/utils/
# config.ts -> Network RPC Add
# contract.ts -> your Contract Address Add
npm run dev
```

---

## Key Features

- 🚀 **Fast project setup**
- 🌐 **Intuitive file-based routing**
- 📦 **Optimized bundling & performance**
- 🎨 **Multiple styling options (CSS, Tailwind, Sass, etc.)**
- 🔌 **Extensible plugin architecture**

---

## Issues

If you encounter any bugs or have suggestions for improvement, please report them on the [Issues page](https://github.com/gk7734/create-react-web3/issues).

---

## Contributing

Contributions are welcome!  
For more details, please check the [CONTRIBUTING.md](https://github.com/gk7734/create-react-web3/blob/main/CONTRIBUTING.md) document.

---

## License

MIT
