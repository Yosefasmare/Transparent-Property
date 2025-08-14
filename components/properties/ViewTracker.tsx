'use client'

import { useEffect, useRef } from "react"
import { updatePropertyViews } from "@/lib/supabaseClient"

const ViewTracker = ({ propertyId }: { propertyId: string }) => {
  const hasUpdated = useRef(false)

  useEffect(() => {
    if (hasUpdated.current) return
    hasUpdated.current = true

    const viewed = JSON.parse(localStorage.getItem('viewedProperties') || '[]')

    if (!viewed.includes(propertyId)) {
      updatePropertyViews(propertyId).then(() => {
        localStorage.setItem('viewedProperties', JSON.stringify([...viewed, propertyId]))
      })
    }
  }, [propertyId])

  return null
}

export default ViewTracker
