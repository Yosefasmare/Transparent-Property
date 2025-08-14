import { FaEye } from 'react-icons/fa6'

type Props = {
  views: number
}

const ViewCounter = ({ views }: Props) => {
  const formatViews = (viewCount: number) => {
    if (viewCount >= 1000000) {
      return `${(viewCount / 1000000).toFixed(1)}M`
    } else if (viewCount >= 1000) {
      return `${(viewCount / 1000).toFixed(1)}K`
    }
    return viewCount.toString()
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200">
      <div className="relative">
        <FaEye className="text-indigo-500 text-sm" />
        <div className="absolute -inset-1 bg-indigo-400 rounded-full blur opacity-20"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-800">{formatViews(views)}</span>
        <span className="text-xs text-gray-600">views</span>
      </div>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
    </div>
  )
}

export default ViewCounter 