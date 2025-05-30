# Kya Passport

A Trustworthy AI Credentialing App leveraging Cheqd DIDs & Verifiable Credentials

## Table of Contents
- [Overview](#overview)
- [Demo](#demo)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Environment Variables](#environment-variables)  
- [Usage](#usage)  
  1. [Create a DID](#create-a-did)  
  2. [Run AI Agent & Pin Output](#run-ai-agent--pin-output)  
  3. [Issue a Verifiable Credential](#issue-a-verifiable-credential)  
  4. [Verify a Credential](#verify-a-credential)  
- [API Reference](#api-reference)
- [Library Overview](#library-overview)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

Kya Passport is a Next.js hackathon MVP that demonstrates how to integrate AI-generated content with Web3 trust infrastructure using Cheqd’s DID (Decentralized Identifier) and Verifiable Credential Studio APIs. It allows users to:
	1.	Spin up an on-chain DID on Cheqd testnet.
	2.	Submit a prompt to an AI agent (OpenAI gpt-4o).
	3.	Pin the AI output as a DID-Linked Resource (DLR) on-chain.
	4.	Issue a JWT Verifiable Credential (VC) for the AI output.
	5.	Verify the issued VC via Cheqd Studio’s verify endpoint.

This flow showcases the power of transparent, verifiable AI for building trust in AI-driven systems.

## Key Features
- On-Chain DID Creation: Quick generation of a Cheqd DID using Studio API.
- AI Agent Integration: Runs prompts through OpenAI’s gpt-4o model.
- DID-Linked Resource (DLR): Anchors JSON data on Cheqd as an on-chain resource.
- Verifiable Credentials: Issues JWT-based VCs via Studio API.
- VC Verification: Provides a UI-driven verify flow against Studio.
- Zero Wallet Setup: No local wallet key management; uses Cheqd Studio’s API key.

## Architecture

Client (Next.js)  →  API Routes  →  lib/*  →  Cheqd Studio APIs & OpenAI

	1.Frontend (app/page.tsx): React hooks manage state for DID, prompt, AI output, VC issuance & verification. QR code for VC.
	2.API Routes (app/api/…/route.ts): Thin wrappers around lib/* functions.
	3.Library (lib/):
	•	cheqdStudio.ts: Main HTTP client for Studio endpoints (/did/create, /resource/create, /credential/issue, /credential/verify).
	•	agent.ts: Wraps OpenAI Chat model.
	•	vc.ts: High-level VC issue function returning full credential + JWT.
	•	pin.ts: (Optional) SDK-based pinning with CosmJS / Cheqd SDK.

⸻

## Getting Started

### Prerequisites
	•	Node.js v18+
	•	npm or yarn
	•	Cheqd Studio API Key (trial available at https://studio.cheqd.io)
	•	.env.local configured (see below)

### Installation

```
git clone https://github.com/meetguleria/kya-passport.git
cd kya-passport
npm install
# or yarn install
```

### Environment Variables

Create a .env.local in project root:

# Next.js
NEXT_PUBLIC_BASE_PATH=/

# OpenAI
OPENAI_API_KEY=sk-...

# Cheqd Studio
CHEQD_STUDIO_URL=https://studio.cheqd.io/api
CHEQD_API_KEY=your_studio_api_key

# (Optional) Cheqd RPC + mnemonic for SDK-based pin
CHEQD_RPC_URL=https://rpc.cheqd.network
MNEMONIC="your 24-word mnemonic"


⸻

Usage

npm run dev

Open http://localhost:3000 in your browser.

1. Create DID
	•	Click Create DID.
	•	Your new DID (e.g. did:cheqd:testnet:...) appears.

2. Run AI Agent & Pin Output
	•	Enter a prompt in the textarea.
	•	Click Run & Issue VC.
	•	AI agent response appears.
	•	Resource pinned via createResourceStudio on Cheqd testnet.

3. Issue Verifiable Credential
	•	Upon pinning, Studio issues a VC JWT.
	•	JWT and QR code appear for scanning with external wallet apps.

4. Verify Credential
	•	Click Verify VC.
	•	Studio’s /credential/verify returns validity & payload.

⸻

## API Endpoints

| Route                          | Method | Description                                   |
|--------------------------------|--------|-----------------------------------------------|
| `/api/agent`                   | POST   | Run AI agent → `{ text, model }`              |
| `/api/createDid`               | POST   | Create a Cheqd DID via Studio API             |
| `/api/pin`                     | POST   | Pin JSON as a DID-Linked Resource             |
| `/api/vc`                      | POST   | Issue a VC JWT + full JSON-LD credential      |
| `/api/credential/verify`       | POST   | Verify a JSON-LD VC via Studio API            |

⸻

## Library Overview

lib/cheqdStudio.ts

- **`lib/cheqdStudio.ts`**  
  - DID creation, resource anchoring, issue & verify credentials  
- **`lib/agent.ts`**  
  - OpenAI Chat wrapper (`runAgent`)  
- **`lib/vc.ts`**  
  - High-level VC issuance (`issueVc`)  
- **`lib/pin.ts`**  
  - SDK-based on-chain pinning (optional)

⸻

## Future Improvements
	•	On-chain explorer links:  Query Tx hash or resourceID on Cheqd Explorer.
	•	Holder DID support:  Integrate did:key creation for external holders.
	•	Trust Registry:  Build registry of approved AI agents & credential schemas.
	•	Authentication:  Allow users to import their own wallets via WalletConnect.

⸻
