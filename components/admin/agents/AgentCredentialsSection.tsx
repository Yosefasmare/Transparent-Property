'use client'

import { useState, useEffect } from 'react'
import { FiCopy, FiCheck, FiMail, FiLock, FiLink, FiHash } from 'react-icons/fi'

const AgentCredentialsSection = () => {
  const [agentCredentials, setAgentCredentials] = useState<{
    email: string
    tempPassword: string
    inviteCode: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  // Listen for agent creation from the form
  useEffect(() => {
    const handleAgentCreated = (event: CustomEvent) => {
      setAgentCredentials({
        email: event.detail.email,
        tempPassword: event.detail.tempPassword,
        inviteCode: event.detail.inviteCode
      })
    }

    window.addEventListener('agentCreated' as any, handleAgentCreated)
    return () => window.removeEventListener('agentCreated' as any, handleAgentCreated)
  }, [])

  const copyAllCredentials = async () => {
    if (!agentCredentials) return

    const credentialsText = `Agent Credentials

Email: ${agentCredentials.email}
Temporary Password: ${agentCredentials.tempPassword}
Signup URL: ${window.location.origin}/signup@new-agents
Invite Code: ${agentCredentials.inviteCode}

Please use these credentials to complete your agent registration.`

    try {
      await navigator.clipboard.writeText(credentialsText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy credentials:', error)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  // Don't render anything if no credentials
  if (!agentCredentials) {
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
            <FiMail className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Agent Credentials</h2>
        </div>
        <p className="text-gray-600">
          Share these credentials with the new agent. They can use this information to complete their registration.
        </p>
      </div>

      {/* Copy All Button */}
      <div className="mb-6">
        <button
          onClick={copyAllCredentials}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          {copied ? (
            <>
              <FiCheck className="h-5 w-5" />
              Copied All!
            </>
          ) : (
            <>
              <FiCopy className="h-5 w-5" />
              Copy All Credentials
            </>
          )}
        </button>
      </div>

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiMail className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Email Address</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200 flex-1">
              {agentCredentials.email}
            </span>
            <button
              onClick={() => copyToClipboard(agentCredentials.email)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
              title="Copy email"
            >
              <FiCopy className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Temporary Password */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FiLock className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Temporary Password</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200 flex-1">
              {agentCredentials.tempPassword}
            </span>
            <button
              onClick={() => copyToClipboard(agentCredentials.tempPassword)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
              title="Copy password"
            >
              <FiCopy className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Signup URL */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiLink className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Signup URL</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200 flex-1 break-all">
              {`${window.location.origin}/signup@new-agents`}
            </span>
            <button
              onClick={() => copyToClipboard(`${window.location.origin}/signup@new-agents`)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors flex-shrink-0"
              title="Copy URL"
            >
              <FiCopy className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Invite Code */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiHash className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Invite Code</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-200 flex-1 text-center">
              {agentCredentials.inviteCode}
            </span>
            <button
              onClick={() => copyToClipboard(agentCredentials.inviteCode)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
              title="Copy code"
            >
              <FiCopy className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-2">How to Use These Credentials</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Share the email and temporary password with the new agent</li>
              <li>Provide them with the signup URL: <code className="bg-blue-100 px-1 rounded">/signup@new-agents</code></li>
              <li>They will need to enter the invite code during registration</li>
              <li>The agent can change their password after first login</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentCredentialsSection
