'use client'
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa6'

const BackButton = () => {
  return (
        <button 
          onClick={() => window.history.back()}
          className="group flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-normal transition-colors duration-300 mx-auto"
        >
          <FaArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
          Go Back
        </button>
  )
}

export default BackButton