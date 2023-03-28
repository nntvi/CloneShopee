import React from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface InputProps {
  type: React.HTMLInputTypeAttribute
  errorMessage?: string
  placeholder: string
  name: string
  className?: string
  register: UseFormRegister<any>
  rules?: RegisterOptions
}
export default function Input({ type, errorMessage, placeholder, name, className, register, rules }: InputProps) {
  return (
    <div className={className}>
      <input
        type={type}
        className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-400 focus:shadow-sm'
        placeholder={placeholder}
        {...register(name, rules)}
        autoComplete='on'
      />
      <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
    </div>
  )
}
