'use client'

import useStore from "@/lib/store";

type summeryType = {
    title:string;
    value:number;
    icon:any
}

const SummeryCards = ({title,value,icon}:summeryType) => {
  
  const {stateLoader} = useStore()

  return (
     <div className="bg-white flex-1 rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
       <div className="flex flex-col lg:flex-row items-center justify-between">
         <div className='flex flex-col justify-between items-center text-center'>
           <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
           {stateLoader ? (
             <div className="flex items-center gap-2">
               <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
               <span className="text-sm text-gray-500">Loading...</span>
             </div>
           ) : (
             <p className="text-3xl font-bold text-gray-900">{value || 0}</p>
           )}
         </div>
         <div className="p-3 bg-blue-100 rounded-xl">
           {icon}
         </div>
       </div>
     </div>
  )
}

export default SummeryCards