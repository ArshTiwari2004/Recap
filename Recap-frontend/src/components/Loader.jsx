import React from 'react'

export const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-gray-500"></div>
    </div>
  )
}
