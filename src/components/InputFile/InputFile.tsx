import React, { useRef } from 'react'
import { toast } from 'react-toastify'
import config from 'src/constant/config'

interface InputFileProps {
  onChange?: (file?: File) => void
}
export default function InputFile(props: InputFileProps) {
  const { onChange } = props
  const imageRef = useRef<HTMLInputElement>(null)
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = e.target.files?.[0]
    if (fileFromLocal && (fileFromLocal.size >= config.sizeUpload || !fileFromLocal.type.includes('image'))) {
      toast.error('File ảnh không đúng định dạng', {
        position: 'top-center'
      })
    } else {
      onChange && onChange(fileFromLocal)
    }
  }

  const handleUpload = () => {
    imageRef.current?.click()
  }
  return (
    <>
      <input
        className='hidden'
        type='file'
        accept='.jpg, .jpeg, .png'
        ref={imageRef}
        onChange={onFileChange}
        onClick={(e: any) => {
          e.target.value = null
        }}
      />
      <button
        type='button'
        onClick={handleUpload}
        className='flex h-10 items-center justify-end border bg-white px-6 text-sm text-gray-600 shadow-sm'
      >
        Chọn ảnh
      </button>
    </>
  )
}
