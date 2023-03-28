import { useState } from 'react'
// eslint-disable-next-line import/no-unresolved
import './App.css'
import useRouteElements from './hooks/useRouteElement'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [count, setCount] = useState(0)
  const routeElements = useRouteElements()
  return (
    <div>
      <ToastContainer />
      {routeElements}
    </div>
  )
}

export default App
