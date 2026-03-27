'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, CheckCircle2, AlertCircle, Loader2, Copy, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on: (event: string, handler: (...args: unknown[]) => void) => void
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void
      isMetaMask?: boolean
    }
  }
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export default function ConnectWallet() {
  const [address, setAddress] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [chainId, setChainId] = useState<string | null>(null)

  // Auto-reconnect if previously connected
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return
    window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
      const list = accounts as string[]
      if (list.length > 0) setAddress(list[0])
    })

    const handleAccountsChanged = (accounts: unknown) => {
      const list = accounts as string[]
      setAddress(list.length > 0 ? list[0] : null)
    }

    const handleChainChanged = (id: unknown) => {
      setChainId(id as string)
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum!.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum!.removeListener('chainChanged', handleChainChanged)
    }
  }, [])

  const connect = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not found. Please install it from metamask.io', { duration: 5000 })
      window.open('https://metamask.io/download/', '_blank')
      return
    }
    setLoading(true)
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
      if (accounts.length > 0) {
        setAddress(accounts[0])
        const id = await window.ethereum.request({ method: 'eth_chainId' }) as string
        setChainId(id)
        toast.success('🦊 Wallet connected!')
      }
    } catch {
      toast.error('Wallet connection cancelled')
    }
    setLoading(false)
  }

  const disconnect = () => {
    setAddress(null)
    setChainId(null)
    setOpen(false)
    toast('Wallet disconnected')
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success('Address copied!')
    }
  }

  const getNetworkName = (id: string | null) => {
    const networks: Record<string, string> = {
      '0x1': 'Ethereum',
      '0x89': 'Polygon',
      '0x38': 'BNB Chain',
      '0xa': 'Optimism',
      '0xa4b1': 'Arbitrum',
      '0x2105': 'Base',
    }
    return id ? (networks[id] ?? `Chain ${parseInt(id, 16)}`) : null
  }

  const networkName = getNetworkName(chainId)

  return (
    <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
      {address ? (
        /* Connected state */
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.6rem 0.85rem', borderRadius: '0.75rem',
            background: 'rgba(6,214,160,0.08)', border: '1px solid rgba(6,214,160,0.2)',
            cursor: 'pointer',
          }}
        >
          <CheckCircle2 size={15} color="#06d6a0" />
          <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
            <p style={{ fontSize: '0.72rem', color: '#06d6a0', fontWeight: 600, lineHeight: 1.2 }}>Connected</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(232,232,240,0.5)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {truncateAddress(address)}
            </p>
          </div>
        </button>
      ) : (
        /* Disconnected state */
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={connect}
          disabled={loading}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.6rem 0.85rem', borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, rgba(124,106,255,0.15), rgba(6,214,160,0.08))',
            border: '1px solid rgba(124,106,255,0.25)',
            color: '#a897ff', cursor: loading ? 'wait' : 'pointer',
            fontSize: '0.82rem', fontWeight: 600,
          }}
        >
          {loading
            ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
            : <Wallet size={15} />
          }
          {loading ? 'Connecting…' : 'Connect Wallet'}
          <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
        </motion.button>
      )}

      {/* Wallet popup */}
      <AnimatePresence>
        {open && address && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            style={{
              position: 'absolute', bottom: '110%', left: 0, right: 0, zIndex: 300,
              background: 'rgba(13,13,31,0.98)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.85rem', padding: '1rem', minWidth: 200,
            }}
          >
            <p style={{ fontSize: '0.7rem', color: 'rgba(232,232,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Connected Wallet</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', padding: '0.5rem 0.6rem' }}>
              <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#e8e8f0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {address}
              </span>
              <button onClick={copyAddress} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(232,232,240,0.4)', padding: 2 }}>
                <Copy size={13} />
              </button>
              <a href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(232,232,240,0.4)', display: 'flex' }}>
                <ExternalLink size={13} />
              </a>
            </div>

            {networkName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#06d6a0', boxShadow: '0 0 6px #06d6a0' }} />
                <span style={{ fontSize: '0.75rem', color: 'rgba(232,232,240,0.5)' }}>{networkName}</span>
              </div>
            )}

            <button
              onClick={disconnect}
              style={{
                width: '100%', padding: '0.45rem', borderRadius: '0.5rem',
                background: 'rgba(255,107,151,0.08)', border: '1px solid rgba(255,107,151,0.15)',
                color: '#ff6b97', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              Disconnect
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
