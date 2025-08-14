const InfoSection = () => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">Need Help?</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Contact your manager if you don&apos;t have credentials</li>
            <li>• Invite codes are case-sensitive and expire after 5 minutes</li>
            <li>• You&apos;ll be able to change your password after first login</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default InfoSection
