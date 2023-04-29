import React, { Suspense, lazy, useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import path from 'src/constant/path'
import { AppContext } from 'src/contexts/app.context'
import CartLayout from 'src/layouts/CartLayout'
import MainLayout from 'src/layouts/MainLayout'
import RegisterLayout from 'src/layouts/RegisterLayout'
// import Cart from 'src/pages/Cart'
// import Login from 'src/pages/Login'
// import PageNotFound from 'src/pages/PageNotFound'
// import ProductDetail from 'src/pages/ProductDetail'
// import ProductList from 'src/pages/ProductList'
// import Register from 'src/pages/Register'
import UserLayout from 'src/pages/User/layouts/UserLayout'
// import ChangePassword from 'src/pages/User/pages/ChangePassword'
// import History from 'src/pages/User/pages/HistoryPurchase/History'
// import Profile from 'src/pages/User/pages/Profile'

const Login = lazy(() => import('src/pages/Login'))
const ProductList = lazy(() => import('src/pages/ProductList'))
const Profile = lazy(() => import('src/pages/User/pages/Profile'))
const Register = lazy(() => import('src/pages/Register'))
const ProductDetail = lazy(() => import('src/pages/ProductDetail'))
const Cart = lazy(() => import('src/pages/Cart'))
const ChangePassword = lazy(() => import('src/pages/User/pages/ChangePassword'))
const History = lazy(() => import('src/pages/User/pages/HistoryPurchase/History'))
const PageNotFound = lazy(() => import('src/pages/PageNotFound'))

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  // login roi di vao Outlet
  // Outlet gom [profile, producList]
  // neu khong thi tra ve login
  return isAuthenticated ? <Outlet /> : <Navigate to={'login'} />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  // chua login vao Outlet
  // Outlet gom [login, register]
  // con khong se tra ve page product
  return !isAuthenticated ? <Outlet /> : <Navigate to={'/'} />
}
export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: (
        // <RegisterLayout>
        <RejectedRoute />
        // </RegisterLayout>
      ),
      children: [
        {
          path: '',
          element: <RegisterLayout />,
          children: [
            {
              path: path.login,
              element: (
                <Suspense>
                  <Login />
                </Suspense>
              )
            },
            {
              path: path.register,
              element: (
                <Suspense>
                  <Register />
                </Suspense>
              )
            }
          ]
        }
        // {
        //   path: path.login,
        //   element: (
        //     <Suspense>
        //       <Login />
        //     </Suspense>
        //   )
        // },
        // {
        //   path: path.register,
        //   element: (
        //     <Suspense>
        //       <Register />
        //     </Suspense>
        //   )
        // }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      // login roi => vao duoc profile
      children: [
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: (
                <Suspense>
                  <Profile />
                </Suspense>
              )
            },
            {
              path: path.password,
              element: (
                <Suspense>
                  <ChangePassword />
                </Suspense>
              )
            },
            {
              path: path.historyPurchase,
              element: (
                <Suspense>
                  <History />
                </Suspense>
              )
            }
          ]
        },
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </CartLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: '',
          index: true, // tránh trường hợp khi dời vị trí của path này ở đâu cũng ko bị trắng page
          element: (
            <Suspense>
              <ProductList />
            </Suspense>
          )
        },
        {
          path: path.productDetail,
          element: (
            <Suspense>
              <ProductDetail />
            </Suspense>
          )
        },
        {
          path: '*',
          element: (
            <Suspense>
              <PageNotFound />
            </Suspense>
          )
        }
      ]
    }
    // {
    //   path: '',
    //   index: true, // tránh trường hợp khi dời vị trí của path này ở đâu cũng ko bị trắng page
    //   element: (
    //     <MainLayout>
    //       <Suspense>
    //         <ProductList />
    //       </Suspense>
    //     </MainLayout>
    //   )
    // },
    // {
    //   path: path.productDetail,
    //   element: (
    //     <MainLayout>
    //       <Suspense>
    //         <ProductDetail />
    //       </Suspense>
    //     </MainLayout>
    //   )
    // },
    // {
    //   path: '*',
    //   element: (
    //     <MainLayout>
    //       <Suspense>
    //         <PageNotFound />
    //       </Suspense>
    //     </MainLayout>
    //   )
    // }
  ])
  return routeElements
}
