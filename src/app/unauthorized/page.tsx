import React from 'react'

function unauthorized() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative'>
        <h1 className='text-3xl font-bold text-red-600'>Acess Denied 🚫</h1>
        <p className='mt-2 text-gray-700'>You do not have permission to access this page.</p>
    </div>
  )
}

export default unauthorized