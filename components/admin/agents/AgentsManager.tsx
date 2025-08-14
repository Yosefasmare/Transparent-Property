import React from 'react'
import AgentsStats from './AgentsStats'
import AgentsList from './AgentsList'

const AgentsManager = () => {
  return (
    <div className="space-y-6">
      <AgentsStats />
      <AgentsList />
    </div>
  )
}

export default AgentsManager
