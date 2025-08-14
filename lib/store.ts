import { create } from 'zustand'
import { logoutUser } from './supabaseClient'



type Store = {
  loading: boolean
  setLoading: (loading: boolean) => void
  stateLoader : boolean;
  setStateLoader: (stateLoader:boolean) => void
  isAuthenticated: boolean
  setIsAuthenticated : (isAuthenticated : boolean) => void
  agentData: AgentData | null
  setAgentData: (agentData: AgentData|null) => void
  agent_properties: AgentProperties[] | []
  setAgent_properties: (agent_properties: AgentProperties[] | []) => void
  agent_inquiries: Inquiries[] | []
  setAgent_inquiries : (agent_inquiries: Inquiries[] | []) => void
  agents: AgentData[] | []
  setAgents: (agents: AgentData[] | [] ) => void
  logout: () => void
}


const useStore = create<Store>()((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({isAuthenticated}), 
  agentData: null,
  setAgentData: (agentData) => set({agentData}),
  agent_properties:[],
  setAgent_properties: (agent_properties) => set({agent_properties}),
  agent_inquiries:[],
  setAgent_inquiries: (agent_inquiries) => set({agent_inquiries}),
  stateLoader:false,
  setStateLoader: (stateLoader) => set({stateLoader}),
  agents: [],
  setAgents: (agents) => set({agents}),
  logout: async () => {
    const result = await logoutUser()
    if (result.success) {
      set({
        isAuthenticated: false,
        agentData: null,
        agent_properties: [],
        agent_inquiries: [],
        agents: []
      })
    }
    return result
  }
}))

export default useStore