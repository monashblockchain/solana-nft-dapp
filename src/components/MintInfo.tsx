export default function MintInfo({ transactionLink, imageUrl, metadataUri }) {
  if (!transactionLink) return null;

  return (
    <div className="mt-4">
      <p>
        <strong>Transaction Link:</strong>{" "}
        <a href={transactionLink} target="_blank" rel="noopener noreferrer">
          View on Solana Explorer
        </a>
      </p>
      <p>
        <strong>Image URL:</strong>{" "}
        <a href={imageUrl} target="_blank" rel="noopener noreferrer">
          View Image on IPFS
        </a>
      </p>
      <p>
        <strong>Metadata URL:</strong>{" "}
        <a href={metadataUri} target="_blank" rel="noopener noreferrer">
          View Metadata on IPFS
        </a>
      </p>
    </div>
  );
}
