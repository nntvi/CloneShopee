import React, { forwardRef, InputHTMLAttributes, useState } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}
const InputNumber = forwardRef<HTMLInputElement, InputProps>(function InputInner(
  {
    errorMessage,
    className,
    classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-400 focus:shadow-sm',
    classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
    onChange,
    value = '',
    ...rest
  },
  ref
) {
  const [localValue, setLocalValue] = useState<string>(value as string)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (/^\d+$/.test(value) || value === '') {
      // thực thi onChange callback từ bên ngoài truyeen vào props
      onChange && onChange(e)
      // cập nhật local value state
      setLocalValue(value)
    }
  }
  return (
    <div className={className}>
      <input
        className={classNameInput}
        {...rest}
        onChange={handleChange}
        value={value === undefined ? localValue : value}
        ref={ref}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber
