"use client";
import React from 'react';
import { useState } from 'react';
import QRCode from 'react-qr-code';

const AGENT_API = '/api/agent';
const CREATE_API = '/api/createDid';
const PIN_API = '/api/pin';
const VC_API = '/api/vc';
const AGENT_DID = 'did:cheqd:testnet:EXAMPLE';

export default function Home() {
  const [did, setDid] = useState<string>("");
  const [keys, setKeys] = useState<string[]>([]);
  const [didTx, setDidTx] = useState<string>("");
  const [prompt, setPrompt] = useState('');
  const [vcJwt, setVcJwt] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [chatText, setChatText] = useState<string>('');

  const txExplorerLink = didTx

  // Step 1: Create a DID
  async function handleCreateDid() {
    setLoading(true);
    try {
      const res = await fetch(CREATE_API, { method: "POST" });
      if (!res.ok) throw await res.json();
      const { did: newDid, keys: newKeys, txHash: newTxHash } = await res.json();
      setDid(newDid);
      setKeys(newKeys.map((k: any) => k.kid));
      setDidTx(newTxHash);
    } catch (e: any) {
      console.error("Create DID error:", e.error || e);
      alert("Failed to create DID: " + (e.error || e));
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Run the agent with the prompt
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!did) { alert("Generate your DID first."); return; }
    setLoading(true);
    try {
      // Run LLM
      const agentRes = await fetch(AGENT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const { text, model } = await agentRes.json();
      setChatText(text);

      // Pin data
      const pinRes = await fetch(PIN_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentDid: did, data: { text, model } }),
      });
      const { resourceURI } = await pinRes.json();

      // Issue VC
      const vcRes = await fetch(VC_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentDid: did,
          subjectDid: did,
          claims: { text, model, resourceURI },
        }),
      });
      const { jwt } = await vcRes.json();
      setVcJwt(jwt);
    } catch (e: any) {
      console.error("Workflow error:", e);
      const msg = e?.error || e?.message || String(e);
      alert("Error during Run & Issue VC: " + msg);
    } finally {
      setLoading(false);
    }
  }

  // Step 3: Verify VC
  async function handleVerify() {
    setVerifyLoading(true);
    try {
      const res = await fetch('/api/credential/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwt: vcJwt }),
      });
      if (!res.ok) throw await res.json();
      const json = await res.json();
      setVerifyResult(json);
    } catch (e: any) {
      console.error('Verification error:', e.error || e);
      alert('Verification failed: ' + (e.error || e.message));
    } finally {
      setVerifyLoading(false);
    }
  }

  return (
    <main className="p-8 space-y-6">
      {/* 1. DID Creation */}
      <div className="flex space-x-4">
        <button
          onClick={handleCreateDid}
          disabled={loading || !!did}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {did ? "DID Created" : loading ? "Creating..." : "Create DID"}
        </button>
        {did && (
          <>
            <code className="break-all">{did}</code>
          </>
        )}
      </div>

      {/* 2. Run → Pin → VC Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading || !did}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Processing..." : "Run & Issue VC"}
        </button>
      </form>
      {/* 2. Chat Output */}
      {chatText && (
        <div className='mt-4'>
          <h2 className="font-bold"> AI Agent Response:</h2>
          <p className='p-2 border rounded bg-black text-white whitespace-pre-wrap'>{chatText}</p>
        </div>
      )}
      {/* 3. Show VC and QR */}
      {vcJwt && (
        <div className="mt-8 space-y-4">
          <h2 className="font-bold">Your VC (JWT):</h2>
          <textarea readOnly value={vcJwt} className="w-full p-2 border" rows={4} />
          <h2 className="font-bold">Scan or Click to Verify:</h2>
          <div className="flex items-center space-x-4">
            {/* QR code for mobile scan */}
            <QRCode value={vcJwt} />
            {/* Link for desktop verification */}
            <a
              href={`/api/credential/verify?jwt=${encodeURIComponent(vcJwt)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Verify VC (Link)
            </a>
          </div>

          <button
            onClick={handleVerify}
            disabled={verifyLoading}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded"
            >
              {verifyLoading ? "Verifying..." : "Verify VC"}
          </button>
          {verifyResult && (
            <div className='mt-4 p-2 border bg-gray-50'>
              <h3 className='font-semibold'>Verificaion Result:</h3>
              <pre className="whitespace-pre-wrap">{JSON.stringify(verifyResult, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </main>
  );
}