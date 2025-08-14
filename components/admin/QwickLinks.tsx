import Link from 'next/link'
import React from 'react'

type props = {
    name: string
    link: string
    p:string
    icon:any
}

const QwickLinks = ({name,link,p, icon}:props) => {
  return (
     <Link
     href={`/admin/${link}`}
      className="flex items-center space-x-3 p-4 text-left rounded-xl hover:bg-green-50 transition-all duration-200 border border-gray-200 hover:border-green-200">
       <div className="p-3 bg-green-100 rounded-xl">
         {icon}
       </div>
       <div>
         <span className="text-sm font-medium text-gray-900">{name}</span>
         <p className="text-xs text-gray-500">{p}</p>
       </div>
     </Link>
  )
}

export default QwickLinks