import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}
interface State {
  hasError?: boolean
}
export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }
  public static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('Uncaught', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className='flex h-screen w-full flex-col items-center justify-center'>
          <h1 className='text-9xl font-extrabold tracking-widest text-orange'>500</h1>
          <div className='absolute rotate-12 rounded bg-orange px-2 text-sm text-white'>Something went wrong!</div>
          <a href='/' className='mt-5'>
            <div className='active:text-orange-500 group relative inline-block text-sm font-medium text-white focus:outline-none focus:ring'>
              <span className='absolute inset-0 translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] transition-transform group-hover:translate-y-0 group-hover:translate-x-0' />
              <span className='relative block px-8 py-3'>Go Home</span>
            </div>
          </a>
        </main>
      )
    }

    return this.props.children
  }
}
