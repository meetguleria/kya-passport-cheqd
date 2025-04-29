"use client";
import { useState } from 'react';
import { runAgent } from '@/lib/agent';
import { pinDlr } from '@/lib/pin';
import { issueVc } from '@/lib/vc';
import QRCode from 'react-qr-code';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [vcJwt, setVcJwt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Step 1: Run the agent with the prompt
    const { text, model } = await runAgent(prompt);

    // Step 2: Pin the DLR
    const { uri } = await pinDlr("", { text, model });

    // Step 3: Issue the VC
    const { jwt } = await issueVc("did:cheqd:testnet:EXAMPLE", model, uri);
    setVcJwt(jwt);
    setLoading(false);
  }

  return (
    <main className="p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          className="w-full p-2 border rounded"
        />
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white">
          {loading ? "Processing..." : "Run & Issue VC"}
        </button>
      </form>
      {vcJwt && (
        <div className="mt-8">
          <h2 className="font-bold">Your VC (JWT):</h2>
          <textarea readOnly value={vcJwt} className="w-full p-2 border" rows={4} />
          <h2 className="font-bold mt-4">Scane to Verify:</h2>
          <QRCode value={vcJwt} />
        </div>
      )}
    </main>
  );
}