'use client'

import useStore from '@/lib/store'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const ManageAgent = ({children}:{children:React.ReactNode}) => {

    const {agentData} = useStore()
    const router = useRouter()
    const [isManager,setIsManager] = useState(false)

    useEffect(()=>{
        if(!agentData?.isManager){
           router.push('/admin')
           return
        } else{
            setIsManager(true)
        }
    },[router, agentData?.isManager])

    if(isManager) return <>{children}</>
}

export default ManageAgent