import { useCallback, useEffect, useMemo, useState } from 'react';
import { Contract } from 'ethers';
import { useAccount, usePublicClient, useReadContract } from 'wagmi';
import type { Address } from 'viem';

import { Header } from './Header';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';
import '../styles/CanvasApp.css';

type PlayerTuple = readonly [string, boolean, boolean, `0x${string}`];

type PlayerSummary = {
  address: Address;
  username: string;
  hasSelection: boolean;
};

type DecryptResultMap = Record<string, string>;

// const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

const TILES = [
  { id: 1, label: 'Sunburst', symbol: '☀️', accent: '#f97316' },
  { id: 2, label: 'Ocean Wave', symbol: '🌊', accent: '#2563eb' },
  { id: 3, label: 'Mountain', symbol: '⛰️', accent: '#4b5563' },
  { id: 4, label: 'Aurora', symbol: '🌌', accent: '#7c3aed' },
  { id: 5, label: 'Leaf', symbol: '🍃', accent: '#10b981' },
  { id: 6, label: 'Galaxy', symbol: '🪐', accent: '#f472b6' },
  { id: 7, label: 'Comet', symbol: '☄️', accent: '#fb7185' },
  { id: 8, label: 'Ripple', symbol: '💧', accent: '#38bdf8' },
  { id: 9, label: 'Spark', symbol: '⚡', accent: '#facc15' },
  { id: 10, label: 'Bloom', symbol: '🌸', accent: '#fda4af' },
  { id: 11, label: 'Crystal', symbol: '💎', accent: '#60a5fa' },
  { id: 12, label: 'Orbit', symbol: '🛰️', accent: '#94a3b8' },
  { id: 13, label: 'Firefly', symbol: '🪲', accent: '#a3e635' },
  { id: 14, label: 'Starlight', symbol: '⭐', accent: '#eab308' },
  { id: 15, label: 'Aurora Peak', symbol: '🏔️', accent: '#34d399' },
  { id: 16, label: 'Desert Moon', symbol: '🌙', accent: '#fde68a' },
] as const;

function encodeSelection(tiles: number[]): number {
  return tiles.reduce((mask, tile) => mask | (1 << (tile - 1)), 0);
}

function decodeSelection(mask: number): number[] {
  const tiles: number[] = [];
  for (let index = 0; index < TILES.length; index += 1) {
    if ((mask & (1 << index)) !== 0) {
      tiles.push(index + 1);
    }
  }
  return tiles;
}

export function CanvasApp() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const signerPromise = useEthersSigner();
  const { instance, isLoading: zamaLoading, error: zamaError } = useZamaInstance();

  const [usernameInput, setUsernameInput] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationNotice, setRegistrationNotice] = useState<string | null>(null);

  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [isSubmittingSelection, setIsSubmittingSelection] = useState(false);
  const [selectionNotice, setSelectionNotice] = useState<string | null>(null);

  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedTiles, setDecryptedTiles] = useState<number[] | null>(null);
  const [decryptNotice, setDecryptNotice] = useState<string | null>(null);

  const [playerDirectory, setPlayerDirectory] = useState<PlayerSummary[]>([]);
  const [isDirectoryLoading, setIsDirectoryLoading] = useState(false);

  const isContractConfigured = true;

  const playerQuery = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getPlayer',
    args: address && isContractConfigured ? [address] : undefined,
    query: {
      enabled: Boolean(address) && isContractConfigured,
    },
  });
  const playerData = playerQuery.data as PlayerTuple | undefined;

  const playerListQuery = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getRegisteredPlayers',
    query: {
      enabled: isContractConfigured,
    },
  });
  const registeredAddresses = playerListQuery.data as readonly Address[] | undefined;

  const isRegistered = Boolean(playerData?.[1]);
  const hasSelection = Boolean(playerData?.[2]);
  const encryptedSelection = playerData?.[3];

  const refreshPlayerData = useCallback(async () => {
    if (!isContractConfigured) {
      return;
    }

    await playerQuery.refetch();
    await playerListQuery.refetch();
  }, [playerQuery, playerListQuery, isContractConfigured]);

  useEffect(() => {
    let cancelled = false;

    const loadDirectory = async () => {
      if (!isContractConfigured) {
        setPlayerDirectory([]);
        setIsDirectoryLoading(false);
        return;
      }

      if (!registeredAddresses || !publicClient) {
        setPlayerDirectory([]);
        return;
      }

      setIsDirectoryLoading(true);

      try {
        const entries = await Promise.all(
          registeredAddresses.map(async (playerAddress) => {
            const result = (await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: CONTRACT_ABI,
              functionName: 'getPlayer',
              args: [playerAddress],
            })) as PlayerTuple;

            return {
              address: playerAddress,
              username: result[0],
              hasSelection: result[2],
            };
          }),
        );
        if (!cancelled) {
          setPlayerDirectory(entries);
        }
      } catch (error) {
        console.error('Failed to load player directory', error);
        if (!cancelled) {
          setPlayerDirectory([]);
        }
      } finally {
        if (!cancelled) {
          setIsDirectoryLoading(false);
        }
      }
    };

    loadDirectory();

    return () => {
      cancelled = true;
    };
  }, [registeredAddresses, publicClient, isContractConfigured]);

  const toggleTile = (tileId: number) => {
    setSelectedTiles((previous) =>
      previous.includes(tileId) ? previous.filter((id) => id !== tileId) : [...previous, tileId],
    );
    setSelectionNotice(null);
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!address) {
      setRegistrationNotice('Connect your wallet to register.');
      return;
    }

    if (!usernameInput.trim()) {
      setRegistrationNotice('Username cannot be empty.');
      return;
    }

    if (!isContractConfigured) {
      setRegistrationNotice('Contract address is not configured yet.');
      return;
    }

    try {
      setIsRegistering(true);
      setRegistrationNotice(null);

      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Wallet signer not available.');
      }

      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.registerPlayer(usernameInput.trim());
      await tx.wait();

      setUsernameInput('');
      setRegistrationNotice('Registration completed successfully.');
      await refreshPlayerData();
    } catch (error) {
      console.error('Failed to register player', error);
      setRegistrationNotice(
        error instanceof Error ? error.message : 'Unable to register. Please try again.',
      );
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSelectionSubmit = async () => {
    if (!address) {
      setSelectionNotice('Connect your wallet to submit a drawing.');
      return;
    }

    if (!instance) {
      setSelectionNotice('Encryption service is not ready yet.');
      return;
    }

    if (!isContractConfigured) {
      setSelectionNotice('Contract address is not configured yet.');
      return;
    }

    if (!isRegistered) {
      setSelectionNotice('Register before submitting a drawing.');
      return;
    }

    try {
      setIsSubmittingSelection(true);
      setSelectionNotice(null);

      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Wallet signer not available.');
      }

      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const mask = encodeSelection(selectedTiles);
      const buffer = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      buffer.add32(mask);
      const encryptedInput = await buffer.encrypt();

      const tx = await contract.updateSelection(encryptedInput.handles[0], encryptedInput.inputProof);
      await tx.wait();

      setSelectionNotice(mask === 0 ? 'Cleared drawing successfully.' : 'Drawing saved securely.');
      setDecryptedTiles(null);
      await refreshPlayerData();
    } catch (error) {
      console.error('Failed to submit drawing', error);
      setSelectionNotice(
        error instanceof Error ? error.message : 'Unable to submit drawing. Please try again.',
      );
    } finally {
      setIsSubmittingSelection(false);
    }
  };

  const handleDecryptSelection = async () => {
    if (!address || !encryptedSelection) {
      setDecryptNotice('No encrypted drawing found for this wallet.');
      return;
    }

    if (!instance) {
      setDecryptNotice('Encryption service is not ready yet.');
      return;
    }

    if (!isContractConfigured) {
      setDecryptNotice('Contract address is not configured yet.');
      return;
    }

    try {
      setIsDecrypting(true);
      setDecryptNotice(null);

      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Wallet signer not available.');
      }

      const keypair = instance.generateKeypair();
      const handlePairs = [{ handle: encryptedSelection, contractAddress: CONTRACT_ADDRESS }];
      const startTimestamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = '7';
      const contractAddresses = [CONTRACT_ADDRESS];

      const eip712 = instance.createEIP712(
        keypair.publicKey,
        contractAddresses,
        startTimestamp,
        durationDays,
      );

      const signature = await (await signer).signTypedData(
        eip712.domain,
        { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
        eip712.message,
      );

      const decrypted = (await instance.userDecrypt(
        handlePairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        contractAddresses,
        address,
        startTimestamp,
        durationDays,
      )) as DecryptResultMap;

      const rawValue = decrypted[encryptedSelection];
      if (!rawValue) {
        throw new Error('Decryption did not return a value.');
      }

      const maskValue = Number(BigInt(rawValue));
      setDecryptedTiles(decodeSelection(maskValue));
      setDecryptNotice('Drawing decrypted locally.');
    } catch (error) {
      console.error('Failed to decrypt drawing', error);
      setDecryptNotice(
        error instanceof Error ? error.message : 'Unable to decrypt drawing. Please try again.',
      );
    } finally {
      setIsDecrypting(false);
    }
  };

  const selectionPreview = useMemo(() => {
    if (decryptedTiles && decryptedTiles.length > 0) {
      return decryptedTiles;
    }
    if (selectedTiles.length > 0) {
      return selectedTiles;
    }
    return [];
  }, [decryptedTiles, selectedTiles]);

  return (
    <div className="canvas-app">
      <Header />
      <main className="canvas-main">
        <section className="intro-panel">
          <div>
            <h2 className="intro-title">Encrypted Canvas</h2>
            <p className="intro-subtitle">
              Create a drawing on a 4x4 canvas, encrypt it with Zama FHE, and store it securely on-chain.
            </p>
            <div className="status-line">
              <span>
                {address
                  ? `Connected wallet: ${address.slice(0, 6)}...${address.slice(-4)}`
                  : 'Connect your wallet to get started.'}
              </span>
              {zamaLoading && <span className="status-badge">Initializing encryption</span>}
              {zamaError && <span className="status-error">Encryption error: {zamaError}</span>}
              {!isContractConfigured && (
                <span className="status-error">
                  Update CONTRACT_ADDRESS with your deployed EncryptedCanvas address.
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="panel-grid">
          <div className="panel">
            <h3 className="panel-title">1. Register Username</h3>
            <p className="panel-description">
              Register once to start saving encrypted drawings. Usernames help friends find your canvas.
            </p>
            <form className="form" onSubmit={handleRegister}>
              <label className="form-label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={usernameInput}
                onChange={(event) => setUsernameInput(event.target.value)}
                placeholder="Enter a memorable name"
                className="text-input"
                disabled={isRegistering || isRegistered}
              />
              <button
                type="submit"
                className="primary-button"
                disabled={isRegistering || isRegistered}
              >
                {isRegistering ? 'Registering...' : isRegistered ? 'Registered' : 'Register'}
              </button>
            </form>
            {registrationNotice && <p className="notice">{registrationNotice}</p>}
            {isRegistered && playerData && (
              <div className="summary-card">
                <p className="summary-label">Username</p>
                <p className="summary-value">{playerData[0]}</p>
              </div>
            )}
          </div>

          <div className="panel">
            <h3 className="panel-title">2. Design Your Drawing</h3>
            <p className="panel-description">
              Tap tiles to craft your encrypted artwork. Once saved, only you can decrypt it locally.
            </p>

            <div className="tile-grid">
              {TILES.map((tile) => {
                const isActive = selectedTiles.includes(tile.id);
                return (
                  <button
                    key={tile.id}
                    type="button"
                    className={`tile ${isActive ? 'tile-active' : ''}`}
                    style={{ borderColor: isActive ? tile.accent : 'transparent' }}
                    onClick={() => toggleTile(tile.id)}
                    disabled={!isRegistered || isSubmittingSelection}
                  >
                    <span className="tile-symbol" style={{ color: tile.accent }}>
                      {tile.symbol}
                    </span>
                    <span className="tile-label">{tile.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="actions-row">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setSelectedTiles([])}
                disabled={selectedTiles.length === 0 || isSubmittingSelection}
              >
                Clear Selection
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={handleSelectionSubmit}
                disabled={isSubmittingSelection || !isRegistered}
              >
                {isSubmittingSelection ? 'Encrypting...' : 'Save Drawing'}
              </button>
            </div>
            {selectionNotice && <p className="notice">{selectionNotice}</p>}
          </div>

          <div className="panel">
            <h3 className="panel-title">3. My Encrypted Drawing</h3>
            <p className="panel-description">
              Decrypt your stored drawing through the relayer. The decrypted artwork never leaves your browser.
            </p>

            <div className="preview-grid">
              {TILES.map((tile) => {
                const isActive = selectionPreview.includes(tile.id);
                return (
                  <div
                    key={tile.id}
                    className={`preview-tile ${isActive ? 'preview-active' : ''}`}
                    style={{ backgroundColor: isActive ? `${tile.accent}15` : undefined }}
                  >
                    <span className="tile-symbol" style={{ color: tile.accent }}>
                      {tile.symbol}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="actions-row">
              <button
                type="button"
                className="primary-button"
                onClick={handleDecryptSelection}
                disabled={!hasSelection || isDecrypting}
              >
                {isDecrypting ? 'Decrypting...' : 'Decrypt Drawing'}
              </button>
            </div>
            {decryptNotice && <p className="notice">{decryptNotice}</p>}
            {hasSelection && !decryptedTiles && (
              <p className="muted-text">Encrypted selection stored on-chain. Decrypt to reveal it locally.</p>
            )}
          </div>
        </section>

        <section className="panel community-panel">
          <h3 className="panel-title">Community Gallery</h3>
          <p className="panel-description">
            Discover who else is building encrypted art. Drawings remain secure until owners decrypt them.
          </p>
          {isDirectoryLoading && <p className="muted-text">Loading registered players…</p>}
          {!isDirectoryLoading && playerDirectory.length === 0 && (
            <p className="muted-text">No players have registered yet. Be the first to mint an encrypted drawing!</p>
          )}
          <div className="directory-list">
            {playerDirectory.map((entry) => (
              <div key={entry.address} className="directory-card">
                <div>
                  <p className="summary-label">Username</p>
                  <p className="summary-value">{entry.username || 'Unnamed artist'}</p>
                </div>
                <div>
                  <p className="summary-label">Wallet</p>
                  <p className="summary-value">
                    {entry.address.slice(0, 6)}…{entry.address.slice(-4)}
                  </p>
                </div>
                <div>
                  <p className="summary-label">Drawing</p>
                  <p className={`summary-value ${entry.hasSelection ? 'status-success' : 'status-muted'}`}>
                    {entry.hasSelection ? 'Encrypted' : 'Not submitted'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
