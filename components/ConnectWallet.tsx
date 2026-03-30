'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, CheckCircle2, Loader2, Copy, ExternalLink, X } from 'lucide-react'
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
      setAddress((accounts as string[]).length > 0 ? (accounts as string[])[0] : null)
    }
    const handleChainChanged = (id: unknown) => setChainId(id as string)
    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)
    return () => {
      window.ethereum!.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum!.removeListener('chainChanged', handleChainChanged)
    }
  }, [])

  const connect = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not found'); window.open('https://metamask.io/download/', '_blank'); return
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
    } catch { toast.error('Connection cancelled') }
    setLoading(false)
  }

  const disconnect = () => { setAddress(null); setChainId(null); setOpen(false); toast('Disconnected') }
  const copyAddress = () => { if (address) { navigator.clipboard.writeText(address); toast.success('Copied!') } }
  const getNetworkName = (id: string | null) => {
    const m: Record<string, string> = { '0x1': 'Ethereum', '0x89': 'Polygon', '0x38': 'BNB', '0xa': 'Optimism', '0xa4b1': 'Arbitrum', '0x2105': 'Base' }
    return id ? (m[id] ?? `Chain ${parseInt(id, 16)}`) : null
  }

  return (
    <div style={{ position: 'relative', marginBottom: '0.25rem' }}>
      {address ? (
        <button
          onClick={() => setOpen(v => !v)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.6rem 0.85rem', borderRadius: '12px',
            background: 'rgba(74,222,128,0.1)',
            border: '1px solid rgba(74,222,128,0.25)',
            backdropFilter: 'blur(8px)',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(74,222,128,0.18)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(74,222,128,0.1)'}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 8px #4ADE80', flexShrink: 0 }} />
          <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
            <p style={{ fontSize: '0.72rem', color: '#4ADE80', fontWeight: 500 }}>Connected</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {truncateAddress(address)}
            </p>
          </div>
        </button>
      ) : (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={connect}
          disabled={loading}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.6rem 0.85rem', borderRadius: '12px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,0.65)', cursor: loading ? 'wait' : 'pointer',
            fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.13)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Wallet size={16} />}
          {loading ? 'Connecting…' : 'Connect Wallet'}
          <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
        </motion.button>
      )}

      <AnimatePresence>
        {open && address && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            style={{
              position: 'absolute', bottom: '110%', left: 0, right: 0, zIndex: 300,
              background: 'rgba(10,8,25,0.82)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '16px', padding: '1rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>Connected Wallet</p>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}><X size={14} /></button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0.6rem' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.75)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{address}</span>
              <button onClick={copyAddress} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}><Copy size={13} /></button>
              <a href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', display: 'flex' }}><ExternalLink size={13} /></a>
            </div>
            {getNetworkName(chainId) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 6px #4ADE80' }} />
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>{getNetworkName(chainId)}</span>
              </div>
            )}
            <button
              onClick={disconnect}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '10px', background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.2)', color: '#FB7185', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, fontFamily: 'Inter, sans-serif', transition: 'all 0.15s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(251,113,133,0.18)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(251,113,133,0.1)'}
            >
              Disconnect
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
