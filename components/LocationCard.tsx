import Image from "next/image"
import Link from "next/link";
import { HiOutlineArrowRight, HiOutlineHome, HiOutlineMap } from "react-icons/hi"

type locationType = {
    loc: {
        loc_name:string;
        loc_pic:string;
        num_property:number;
        loc_city: string;
        loc_subcity:string
    }
}


const LocationCard = ({loc}:locationType) => {


  return (
    <Link
    href={`/properties?area=${loc.loc_name}&state=${loc.loc_city}&subcity=${loc.loc_subcity}`}
      key={loc.loc_name}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={loc.loc_pic}
          alt={loc.loc_name}
          width={400}
          height={300}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Property count badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
          <div className="flex items-center gap-2">
            <HiOutlineHome className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-800">
              {loc.num_property}
            </span>
          </div>
        </div>
         {/* Location icon */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
          <HiOutlineMap className="w-5 h-5 text-blue-600" />
        </div>
      </div>
       {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
          {loc.loc_name}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-sm font-medium">
              {loc.num_property} Properties
            </span>
          </div>
          
          {/* Arrow indicator */}
          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
            <HiOutlineArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
       {/* Hover effect border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300 pointer-events-none" />
    </Link>
  )
}

export default LocationCard