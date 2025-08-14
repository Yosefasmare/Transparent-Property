'use client'

import useStore from "@/lib/store"
import { fetchAgents, fetchInquriesby_agent, fetchPropertiesby_agent } from "@/lib/supabaseClient"
import { useEffect } from "react"


const StateSetting = () => {
    const {
      agentData,
      setAgent_inquiries,
      setAgent_properties,
      setAgents,
      isAuthenticated,
      setStateLoader
    } = useStore()
    const agent_id = agentData?.id

    
    useEffect(()=>{
        const handleFetching = async () => {
          setStateLoader(true)
            try {
                  if(!isAuthenticated || !agent_id) return
                const Aproperties = await fetchPropertiesby_agent(agent_id!)
                const Ainquries = await fetchInquriesby_agent(agent_id!)

                 // setting globall state
                 setAgent_properties(Aproperties)
                 setAgent_inquiries(Ainquries)

                 if(agentData?.isManager){
                  const data = await fetchAgents(agent_id)
                  if(data){
                    setAgents(data)
                  }
                 }

              } catch (error) {
                 console.error(error)
              }  
              setStateLoader(false)
            }
     handleFetching()

    },[isAuthenticated,agentData?.isManager,agent_id])


  return null
}

export default StateSetting