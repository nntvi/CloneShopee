import React from 'react'
import CartHeader from 'src/components/CartHeader'
import Footer from 'src/components/Footer'

interface CartLayoutProps {
  children: React.ReactNode
}
export default function CartLayout(props: CartLayoutProps) {
  const { children } = props
  return (
    <div>
      <CartHeader />
      {children}
      <Footer />
    </div>
  )
}
