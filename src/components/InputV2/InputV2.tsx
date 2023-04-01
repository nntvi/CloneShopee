import React, { forwardRef, InputHTMLAttributes, useState } from 'react'
import { FieldPath, FieldValue, FieldValues, useController, UseControllerProps } from 'react-hook-form'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}
function InputV2<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: UseControllerProps<TFieldValues, TName> & InputProps) {
  const { type, onChange, classNameInput, className, classNameError, value = '', ...rest } = props
  const { field, fieldState } = useController(props)
  const [localValue, setLocalValue] = useState<string>(field.value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueFromInput = e.target.value
    const numberCondition = type === 'number' && (/^\d+$/.test(valueFromInput) || valueFromInput === '')
    if (numberCondition || type !== 'number') {
      setLocalValue(valueFromInput) // phòng khi người dùng ko truyền vào cái gì thì input ko bị undefined

      // gọi field.onChange để cập nhật vào react hook form
      field.onChange(e)

      // thực thi onChange truyền bên ngoài vào (nếu có)
      onChange && onChange(e)
    }
  }
  return (
    <div className={className}>
      <input
        className={classNameInput}
        {...rest}
        {...field}
        onChange={handleChange}
        value={field.value || localValue}
      />
      <div className={classNameError}>{fieldState.error?.message}</div>
    </div>
  )
}

export default InputV2
