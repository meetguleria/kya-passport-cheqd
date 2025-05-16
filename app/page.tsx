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
  const [prompt, setPrompt] = useState('');
  const [vcJwt, setVcJwt] = useState('');
  const [loading, setLoading] = useState(false);

  // Extract the method-specific ID (UUID) from the DID
  const methodId = did.split(':').pop();
  const explorerLink = methodId
    ? `https://testnet-explorer.cheqd.io/search?query=${encodeURIComponent(methodId)}`
    : '';

  // Step 1: Create a DID
  async function handleCreateDid() {
    setLoading(true);
    try {
      const res = await fetch(CREATE_API, { method: "POST" });
      if (!res.ok) throw await res.json();
      const { did: newDid, keys: newKeys } = await res.json();
      setDid(newDid);
      setKeys(newKeys.map((k: any) => k.kid));
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
          <a
            href={explorerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600 break-all"
          >
            <code>{did}</code>
          </a>
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

      {/* 3. Show VC and QR */}
      {vcJwt && (
        <div className="mt-8 space-y-4">
          <h2 className="font-bold">Your VC (JWT):</h2>
          <textarea readOnly value={vcJwt} className="w-full p-2 border" rows={4} />
          <h2 className="font-bold">Scan to Verify:</h2>
          <QRCode value={vcJwt} />
        </div>
      )}
    </main>
  );
}