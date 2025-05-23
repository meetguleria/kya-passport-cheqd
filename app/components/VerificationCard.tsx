import React, { useState } from 'react';

export interface VerificationResult {
  verified: boolean;
  issuer: string;
  signer?: {
    id: string;
    type: string;
    controller: string;
    publicKeyBase58?: string;
  };
  policies?: {
    credentialStatus: boolean;
  };
}

export interface CredentialSubject {
  id: string;
  text: string;
  model: string;
  resourceURI?: string;
}

interface VerificationCardProps {
  verifyResult: VerificationResult;
  subject: CredentialSubject;
}

/**
 * VerificationCard
 * Displays the result of a VC verification along with agent details.
 */
export default function VerificationCard({
  verifyResult,
  subject
}: VerificationCardProps) {
  const [expanded, setExpanded] = useState(false);

  const snippet = subject.text.length > 100
    ? subject.text.slice(0, 100) + '…'
    : subject.text;

  return (
    <div
      className={`mt-4 p-4 rounded bg-transparent border ${
        verifyResult.verified ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
      }`}
    >
      <h3 className="text-lg font-semibold mb-2">
        {verifyResult.verified ? '✅ Credential Verified' : '❌ Verification Failed'}
      </h3>

      <p className="mb-2">
        <strong>Issuer:</strong>{' '}
        <code className="break-all">{verifyResult.issuer}</code>
      </p>

      {verifyResult.signer && (
        <div className="mb-2">
          <h4 className="font-medium">Signer Details</h4>
          <ul className="list-disc list-inside text-sm">
            <li><strong>ID:</strong> <code>{verifyResult.signer.id}</code></li>
            <li><strong>Type:</strong> {verifyResult.signer.type}</li>
            <li><strong>Controller:</strong> {verifyResult.signer.controller}</li>
          </ul>
        </div>
      )}

      {verifyResult.policies && (
        <div className="mb-2">
          <h4 className="font-medium">Policies</h4>
          <ul className="list-disc list-inside text-sm">
            <li>
              <strong>Credential Status:</strong>{' '}
              {verifyResult.policies.credentialStatus ? 'Revoked' : 'Active'}
            </li>
          </ul>
        </div>
      )}

      <div className="mt-4">
        <h4 className="font-medium mb-1">Agent Details</h4>
        <p><strong>Model:</strong> {subject.model}</p>
        <p>
          <strong>Response:</strong>{' '}
          {expanded ? subject.text : snippet}{' '}
          {subject.text.length > 100 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 underline text-sm ml-1"
            >
              {expanded ? 'Show Less' : 'Show More'}
            </button>
          )}
        </p>
        {subject.resourceURI && (
          <p className="mt-1">
            <a
              href={subject.resourceURI}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              View on-chain resource
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
