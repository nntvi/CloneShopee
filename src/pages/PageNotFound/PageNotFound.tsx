import React from 'react'
import { Link } from 'react-router-dom'
import path from 'src/constant/path'

export default function PageNotFound() {
  return (
    <main className='flex h-screen w-full flex-col items-center justify-center'>
      <h1 className='text-9xl font-extrabold tracking-widest text-orange'>404</h1>
      <div className='title-not-found absolute rotate-12 rounded bg-orange px-2 text-sm text-white'>Page Not Found</div>
      <Link to={path.home} className='mt-5'>
        <div className='active:text-orange-500 group relative inline-block text-sm font-medium text-white focus:outline-none focus:ring'>
          <span className='absolute inset-0 translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] transition-transform group-hover:translate-y-0 group-hover:translate-x-0' />
          <span className='relative block px-8 py-3'>Go Home</span>
        </div>
      </Link>
    </main>
  )
}
