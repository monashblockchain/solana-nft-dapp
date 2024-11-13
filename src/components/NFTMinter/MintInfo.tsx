interface MintInfoProps {
  transactionLink: string | null; // Allow null for conditional rendering
  imageUrl: string | null; // Allow null for optional links
  metadataUri: string | null; // Allow null for optional links
}

export default function MintInfo({
  transactionLink,
  imageUrl,
  metadataUri,
}: MintInfoProps) {
  if (!transactionLink) return null; // Render nothing if transactionLink is null

  return (
    <div className="mt-4">
      <p>
        <strong>Transaction Link:</strong>{" "}
        <a href={transactionLink} target="_blank" rel="noopener noreferrer">
          View on Solana Explorer
        </a>
      </p>
      {imageUrl && (
        <p>
          <strong>Image URL:</strong>{" "}
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            View Image on IPFS
          </a>
        </p>
      )}
      {metadataUri && (
        <p>
          <strong>Metadata URL:</strong>{" "}
          <a href={metadataUri} target="_blank" rel="noopener noreferrer">
            View Metadata on IPFS
          </a>
        </p>
      )}
    </div>
  );
}
