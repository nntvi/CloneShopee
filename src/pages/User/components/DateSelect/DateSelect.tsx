import range from 'lodash/range'
import React, { useState } from 'react'

interface DateProps {
  onChange: (value: Date) => void
  value?: Date
  errorMessage?: string
}
export default function DateSelect(props: DateProps) {
  const { errorMessage, value, onChange } = props

  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFromSelect, name } = event.target
    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: valueFromSelect
    }
    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }

  return (
    <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
      <div className='truncate pt-3 text-right sm:w-[20%]'>Ngày sinh</div>
      <div className='sm:w-[80%] sm:pl-5'>
        <div className='flex justify-between pl-5'>
          <select
            onChange={handleChange}
            name='date'
            value={value?.getDate() || date.date}
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
          >
            <option disabled>Ngày</option>
            {range(1, 32).map((dateItem) => (
              <option value={dateItem} key={`date${dateItem}`}>
                {dateItem}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name='month'
            value={value?.getMonth() || date.month}
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
          >
            <option disabled>Tháng</option>
            {range(0, 12).map((month) => (
              <option value={month} key={`date${month}`}>
                {month + 1}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name='year'
            value={value?.getFullYear() || date.year}
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3  hover:border-orange'
          >
            <option disabled>Năm</option>
            {range(1990, 2024).map((year) => (
              <option value={year} key={`date${year}`}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
      </div>
    </div>
  )
}
