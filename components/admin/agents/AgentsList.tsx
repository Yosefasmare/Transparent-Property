'use client'

import React, { useState } from 'react'
import { FiSearch, FiUser, FiPhone, FiTrash2, FiUsers } from 'react-icons/fi'
import Image from 'next/image'
import useStore from '@/lib/store'
import Link from 'next/link'
import { deactivateOrActivateAccount, updateManagerStatus } from '@/lib/supabaseClient'
import ConfirmationPopup from '../ConfirmationPopup'

const AgentsList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [showDeactivated, setShowDeactivated] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [agentToDelete, setAgentToDelete] = useState<{id: string, name: string, prevState: boolean, image_path: string} | null>(null)
  const [showManagerConfirm, setShowManagerConfirm] = useState(false)
  const [agentToManage, setAgentToManage] = useState<{id: string, name: string, isManager: boolean} | null>(null)
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null)

  const {agents,stateLoader,setAgents,agentData} = useStore()

  // Filter agents based on search term and filters
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.phone_no.toString().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === '' || 
      (roleFilter === 'manager' && agent.isManager) ||
      (roleFilter === 'agent' && !agent.isManager)
    
    const matchesStatus = showDeactivated || agent.is_active
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleDeleteClick = (id: string, name: string, prevState: boolean, image_path: string) => {
    // Find the agent to check if deletion is allowed
    const agent = agents.find(a => a.id === id)
    if (agent && !canDeleteAgent(agent)) {
      setMessage({
        text: agent.isManager && agentData?.isManager && agent.created_at && agentData?.created_at && new Date(agent.created_at) < new Date(agentData.created_at)
          ? 'Cannot deactivate a manager who was created before you'
          : 'Cannot modify this account',
        type: 'error'
      })
      setTimeout(() => setMessage(null), 5000)
      return
    }
    
    setAgentToDelete({ id, name, prevState, image_path })
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!agentToDelete || !agentData?.id) return
    
    try {
      const {message: responseMessage, type} = await deactivateOrActivateAccount(agentToDelete.id, agentToDelete.prevState, agentToDelete.image_path, agentData.id)
      
      // Set the message based on response type
      setMessage({
        text: responseMessage,
        type: type === 'success' ? 'success' : 'error'
      })

      // Update the local agents state by toggling is_active
      if (type === 'success') {
        setAgents(agents.map(agent => 
          agent.id === agentToDelete.id 
            ? { ...agent, is_active: !agentToDelete.prevState }
            : agent
        ))
      }
      
      // Auto-hide message after 5 seconds
      setTimeout(() => setMessage(null), 5000)
      
      setShowDeleteConfirm(false)
      setAgentToDelete(null)
    } catch (error) {
      console.error('Error deleting agent:', error)
      setMessage({
        text: 'An unexpected error occurred. Please try again.',
        type: 'error'
      })
      setTimeout(() => setMessage(null), 5000)
      setShowDeleteConfirm(false)
      setAgentToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
    setAgentToDelete(null)
  }

  const handleManagerToggle = (agentId: string, currentManagerStatus: boolean, agentName: string) => {
    setAgentToManage({ id: agentId, name: agentName, isManager: currentManagerStatus })
    setShowManagerConfirm(true)
  }

  const handleManagerConfirm = async () => {
    if (!agentToManage || !agentData?.id) {
      setMessage({
        text: 'User session not found. Please log in again.',
        type: 'error'
      })
      setTimeout(() => setMessage(null), 5000)
      return
    }

    try {
      const { message: responseMessage, type } = await updateManagerStatus(agentToManage.id, agentToManage.isManager, agentData.id)
      
      // Set the message based on response type
      setMessage({
        text: responseMessage,
        type: type === 'success' ? 'success' : 'error'
      })

      // Update the local agents state by toggling isManager
      if (type === 'success') {
        setAgents(agents.map(agent => 
          agent.id === agentToManage.id 
            ? { ...agent, isManager: !agentToManage.isManager }
            : agent
        ))
      }
      
      // Auto-hide message after 5 seconds
      setTimeout(() => setMessage(null), 5000)
      
      setShowManagerConfirm(false)
      setAgentToManage(null)
    } catch (error) {
      console.error('Error updating manager status:', error)
      setMessage({
        text: 'An unexpected error occurred. Please try again.',
        type: 'error'
      })
      setTimeout(() => setMessage(null), 5000)
      setShowManagerConfirm(false)
      setAgentToManage(null)
    }
  }

  const handleManagerCancel = () => {
    setShowManagerConfirm(false)
    setAgentToManage(null)
  }

  const dismissMessage = () => {
    setMessage(null)
  }

  // Helper function to check if a manager can be removed by current user
  const canRemoveManager = (agent: AgentData) => {
    if (!agent.isManager || !agentData?.created_at || !agent.created_at) return true
    return new Date(agent.created_at) >= new Date(agentData.created_at)
  }

  // Helper function to check if an agent can be deleted by current user
  const canDeleteAgent = (agent: AgentData) => {
    if (!agent.is_active || !agentData?.created_at || !agent.created_at) return true
    if (!agent.isManager || !agentData?.isManager) return true
    return new Date(agent.created_at) >= new Date(agentData.created_at)
  }


  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="flex space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <FiUsers className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Get started by adding your first real estate agent to the team. They&apos;ll be able to manage properties and handle inquiries.
      </p>
      <Link
     href={'/admin/agents/add-agents'}
      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
        <FiUser className="h-4 w-4" />
        Add Your First Agent
      </Link>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Agents</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your team of real estate agents</p>
          </div>
          <Link
          href={'/admin/agents/add-agents'}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            <FiUser className="h-4 w-4" />
            Add New Agent
          </Link>
        </div>
      </div>

      {/* Inline Message Display */}
      {message && (
        <div className={`px-6 py-3 border-l-4 ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-400' 
            : 'bg-red-50 border-red-400'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                message.type === 'success' 
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  message.type === 'success' 
                    ? 'bg-white' 
                    : 'bg-white'
                }`}></div>
              </div>
              <p className={`text-sm font-medium ${
                message.type === 'success' 
                  ? 'text-green-800' 
                  : 'text-red-800'
              }`}>
                {message.text}
              </p>
            </div>
            <button
              onClick={dismissMessage}
              className={`p-1 rounded-md hover:bg-opacity-20 ${
                message.type === 'success' 
                  ? 'hover:bg-green-500 text-green-600' 
                  : 'hover:bg-red-500 text-red-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search agents by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 sm:items-center">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="manager">Managers</option>
              <option value="agent">Agents</option>
            </select>
            <label className="w-full sm:w-auto flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={showDeactivated}
                onChange={(e) => setShowDeactivated(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Show Deactivated</span>
            </label>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {!stateLoader && agents.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
            <span>Total: <span className="font-medium text-gray-900">{agents.length}</span></span>
            <span>Active: <span className="font-medium text-green-600">{agents.filter(a => a.is_active).length}</span></span>
            <span>Deactivated: <span className="font-medium text-red-600">{agents.filter(a => !a.is_active).length}</span></span>
          </div>
        </div>
      )}
      {stateLoader ? (
        // Loading State
        <div className="p-6">
          <LoadingSkeleton />
        </div>
      ) : filteredAgents.length === 0 ? (
        // No Results State
        <div className="p-6">
          {agents.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <FiSearch className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                No agents match your current search criteria. Try adjusting your search terms or filters.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setRoleFilter('')
                  setShowDeactivated(true)
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        // Agents Table (desktop)
        <>
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Properties Sold
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className={`hover:bg-gray-50 ${!agent.is_active ? 'bg-gray-50 opacity-75' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
                          !agent.is_active ? 'bg-gray-200' : 'bg-indigo-100'
                        }`}>
                          {agent.profilePic_path ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_PIC_URL}/agent-avater/${agent?.profilePic_path}`}
                              alt={agent.name}
                              width={40}
                              height={40}
                              className={`w-full h-full object-cover ${!agent.is_active ? 'grayscale' : ''}`}
                            />
                          ) : (
                            <FiUser className={`h-5 w-5 ${!agent.is_active ? 'text-gray-500' : 'text-indigo-600'}`} />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm font-medium ${!agent.is_active ? 'text-gray-500' : 'text-gray-900'}`}>
                            {agent.name}
                            {!agent.is_active && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Deactivated
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">ID: {agent.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${!agent.is_active ? 'text-gray-500' : 'text-gray-900'}`}>{agent.email}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <FiPhone className="h-3 w-3" />
                        {agent.phone_no}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        agent.isManager 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {agent.isManager ? 'Manager' : 'Agent'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        agent.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {agent.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {agent.sold_properties} properties
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleManagerToggle(agent.id, agent.isManager, agent.name)}
                          disabled={!agent.is_active || !canRemoveManager(agent)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                            !agent.is_active || !canRemoveManager(agent)
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : agent.isManager
                                ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200'
                          }`}
                          title={
                            !agent.is_active 
                              ? 'Cannot modify deactivated account' 
                              : !canRemoveManager(agent)
                                ? 'Cannot remove manager who was created before you'
                                : agent.isManager 
                                  ? 'Remove manager role' 
                                  : 'Make manager'
                          }>
                          {agent.isManager ? 'Remove Manager' : 'Make Manager'}
                          {!canRemoveManager(agent) && agent.isManager && (
                            <span className="ml-1 text-xs text-gray-500">(Protected)</span>
                          )}
                        </button>
                                                <button
                          onClick={() => handleDeleteClick(agent.id, agent.name, agent.is_active,agent.profilePic_path)}
                          disabled={!canDeleteAgent(agent)}
                          className={`p-1 rounded transition-all duration-200 ${
                            !canDeleteAgent(agent)
                              ? 'text-gray-400 cursor-not-allowed'
                              : !agent.is_active 
                                ? 'text-green-600 hover:text-green-700' 
                                : 'text-red-600 hover:text-red-900'
                          }`}
                          title={
                            !canDeleteAgent(agent)
                              ? agent.isManager && agentData?.isManager && agent.created_at && agentData?.created_at && new Date(agent.created_at) < new Date(agentData.created_at)
                                ? 'Cannot deactivate manager who was created before you'
                                : 'Cannot modify this account'
                              : !agent.is_active 
                                ? 'Activate account' 
                                : 'Deactivate account'
                          }>
                          {!agent.is_active ? (
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          ) : (
                            <>
                              <FiTrash2 className="h-4 w-4" />
                              {!canDeleteAgent(agent) && agent.isManager && agentData?.isManager && agent.created_at && agentData?.created_at && new Date(agent.created_at) < new Date(agentData.created_at) && (
                                <span className="ml-1 text-xs text-gray-500">(Protected)</span>
                              )}
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Agents List (mobile) */}
          <div className="md:hidden">
            <div className="divide-y divide-gray-200">
              {filteredAgents.map((agent) => (
                <div key={agent.id} className={`p-4 ${!agent.is_active ? 'bg-gray-50 opacity-75' : 'bg-white'}`}>
                  <div className="flex items-center">
                    <div className={`${!agent.is_active ? 'bg-gray-200' : 'bg-indigo-100'} w-12 h-12 rounded-full flex items-center justify-center overflow-hidden`}>
                      {agent.profilePic_path ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_PIC_URL}/agent-avater/${agent?.profilePic_path}`}
                          alt={agent.name}
                          width={48}
                          height={48}
                          className={`w-full h-full object-cover ${!agent.is_active ? 'grayscale' : ''}`}
                        />
                      ) : (
                        <FiUser className={`h-6 w-6 ${!agent.is_active ? 'text-gray-500' : 'text-indigo-600'}`} />
                      )}
                    </div>
                    <div className="ml-4 min-w-0">
                      <div className={`text-sm font-medium truncate ${!agent.is_active ? 'text-gray-500' : 'text-gray-900'}`}>
                        {agent.name}
                        {!agent.is_active && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Deactivated</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate">ID: {agent.id}</div>
                    </div>
                  </div>

                  <div className="mt-3 text-sm">
                    <div className={`${!agent.is_active ? 'text-gray-500' : 'text-gray-900'} truncate`}>{agent.email}</div>
                    <div className="text-gray-500 flex items-center gap-1 mt-1">
                      <FiPhone className="h-3 w-3" />
                      {agent.phone_no}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={`${agent.isManager ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                      {agent.isManager ? 'Manager' : 'Agent'}
                    </span>
                    <span className={`${agent.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                      {agent.is_active ? 'Active' : 'Deactivated'}
                    </span>
                    <span className="text-xs text-gray-600">{agent.sold_properties} properties</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => handleManagerToggle(agent.id, agent.isManager, agent.name)}
                      disabled={!agent.is_active || !canRemoveManager(agent)}
                      className={`${!agent.is_active || !canRemoveManager(agent)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : agent.isManager
                          ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200'
                      } px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex-1`}
                      title={
                        !agent.is_active
                          ? 'Cannot modify deactivated account'
                          : !canRemoveManager(agent)
                            ? 'Cannot remove manager who was created before you'
                            : agent.isManager
                              ? 'Remove manager role'
                              : 'Make manager'
                      }
                    >
                      {agent.isManager ? 'Remove Manager' : 'Make Manager'}
                      {!canRemoveManager(agent) && agent.isManager && (
                        <span className="ml-1 text-xs text-gray-500">(Protected)</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteClick(agent.id, agent.name, agent.is_active, agent.profilePic_path)}
                      disabled={!canDeleteAgent(agent)}
                      className={`${!canDeleteAgent(agent)
                        ? 'text-gray-400 cursor-not-allowed'
                        : !agent.is_active
                          ? 'text-green-600 hover:text-green-700'
                          : 'text-red-600 hover:text-red-900'
                      } p-2 rounded transition-all duration-200`}
                      title={
                        !canDeleteAgent(agent)
                          ? agent.isManager && agentData?.isManager && agent.created_at && agentData?.created_at && new Date(agent.created_at) < new Date(agentData.created_at)
                            ? 'Cannot deactivate manager who was created before you'
                            : 'Cannot modify this account'
                          : !agent.is_active
                            ? 'Activate account'
                            : 'Deactivate account'
                      }
                    >
                      {!agent.is_active ? (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      ) : (
                        <>
                          <FiTrash2 className="h-5 w-5" />
                          {!canDeleteAgent(agent) && agent.isManager && agentData?.isManager && agent.created_at && agentData?.created_at && new Date(agent.created_at) < new Date(agentData.created_at) && (
                            <span className="ml-1 text-xs text-gray-500">(Protected)</span>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAgents.length}</span> of{' '}
                <span className="font-medium">{agents.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md">1</button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
             {showDeleteConfirm && agentToDelete && (
         <ConfirmationPopup
           isOpen={showDeleteConfirm}
           onClose={handleDeleteCancel}
           onConfirm={handleDeleteConfirm}
           title="Confirm Action"
           message={`Are you sure you want to ${agentToDelete.prevState ? 'deactivate' : 'activate'} ${agentToDelete.name}?`}
           confirmText={agentToDelete.prevState ? 'Deactivate' : 'Activate'}
           type="danger"
         />
       )}
       
       {showManagerConfirm && agentToManage && (
         <ConfirmationPopup
           isOpen={showManagerConfirm}
           onClose={handleManagerCancel}
           onConfirm={handleManagerConfirm}
           title="Confirm Manager Action"
           message={`Are you sure you want to ${agentToManage.isManager ? 'remove' : 'make'} ${agentToManage.name} a manager?`}
           confirmText={agentToManage.isManager ? 'Remove Manager' : 'Make Manager'}
           type={agentToManage.isManager ? 'danger' : 'warning'}
         />
       )}
    </div>
  )
}

export default AgentsList
