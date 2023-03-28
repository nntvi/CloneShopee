import React from 'react'
import Footer from 'src/components/Footer'
import RegisterHeader from 'src/components/RegisterHeader'

interface Props {
  children?: React.ReactNode
}
export default function RegisterLayout({ children }: Props) {
  // Layout Register có thể là đăng ký hoặc đăng nhập => nhập props children

  return (
    <div>
      <RegisterHeader />
      {children}
      <Footer />
    </div>
  )
}
