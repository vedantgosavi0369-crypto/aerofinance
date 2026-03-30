'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, CheckCircle2, Loader2, Copy, ExternalLink } from 'lucide-react'
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
        toast.success('Wallet connected!')
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
    <div style={{ position: 'relative', marginBottom: '0.25rem' }}>
      {address ? (
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.65rem 0.85rem', borderRadius: '6px',
            background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            cursor: 'pointer', transition: 'border-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = '#D4D4D8'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          <CheckCircle2 size={16} color="var(--text-primary)" />
          <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.2 }}>Connected</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {truncateAddress(address)}
            </p>
          </div>
        </button>
      ) : (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={connect}
          disabled={loading}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.65rem 0.85rem', borderRadius: '6px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)', cursor: loading ? 'wait' : 'pointer',
            fontSize: '0.85rem', fontWeight: 500, transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
        >
          {loading
            ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            : <Wallet size={16} color="var(--text-secondary)" />
          }
          {loading ? 'Connecting…' : 'Connect Wallet'}
          <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
        </motion.button>
      )}

      <AnimatePresence>
        {open && address && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            style={{
              position: 'absolute', bottom: '110%', left: 0, right: 0, zIndex: 300,
              background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
              borderRadius: '8px', padding: '1rem', minWidth: 200,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.5rem' }}>Connected Wallet</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '4px', padding: '0.5rem 0.6rem', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {address}
              </span>
              <button onClick={copyAddress} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 2 }}>
                <Copy size={14} />
              </button>
              <a href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', display: 'flex' }}>
                <ExternalLink size={14} />
              </a>
            </div>

            {networkName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-primary)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{networkName}</span>
              </div>
            )}

            <button
              onClick={disconnect}
              style={{
                width: '100%', padding: '0.55rem', borderRadius: '4px',
                background: 'transparent', border: '1px solid var(--border-color)',
                color: '#EF4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
                fontFamily: 'Inter, sans-serif', transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.borderColor = '#FCA5A5'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            >
              Disconnect
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
