import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, createSearchParams } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import path from 'src/constant/path'
import { purchaseStatus } from 'src/constant/purchase'
import { AppContext } from 'src/contexts/app.context'
import useQueryParams from 'src/hooks/useQueryParams'
import { PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurrency } from 'src/types/utils.types'
import { generateNameId } from 'src/utils/utils'

const purchaseTabs = [
  { status: purchaseStatus.all, name: 'Tất cả' },
  { status: purchaseStatus.waitingForConfirmation, name: 'Chờ xác nhận' },
  { status: purchaseStatus.waitingForGetting, name: 'Chờ lấy hàng' },
  { status: purchaseStatus.inProgress, name: 'Đang giao' },
  { status: purchaseStatus.delivered, name: 'Đã giao' },
  { status: purchaseStatus.canceled, name: 'Đã huỷ' }
]
export default function History() {
  const queryParam: { status?: string } = useQueryParams()
  const status = Number(queryParam.status) || purchaseStatus.all
  const { isAuthenticated } = useContext(AppContext)

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: status }],
    queryFn: () => purchaseApi.getPurchases({ status: status as PurchaseListStatus }),
    enabled: isAuthenticated
  })
  const historyData = purchasesInCartData?.data.data
  return (
    <div>
      <Helmet>
        <title>Lịch sử đơn hàng | Shopee Clone</title>
        <meta name='description' content='Lịch sử đơn hàng cho dự án shopee clone by Tuong Vi' />
      </Helmet>
      <div className='overflow-hidden'>
        <div className='min-w-[700px]'>
          <div className='sticky top-0 flex rounded-t-sm shadow-sm'>
            {purchaseTabs.map((item) => (
              <Link
                key={item.status}
                to={{
                  pathname: path.historyPurchase,
                  search: createSearchParams({
                    status: String(item.status)
                  }).toString()
                }}
                className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
                  'border-b-orange text-orange': status === item.status,
                  'border-b-black/10 text-gray-900': status !== item.status
                })}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div>
            {historyData?.map((purchase) => (
              <div key={purchase._id} className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'>
                <Link
                  className='flex'
                  to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                >
                  <div className='flex-shrink-0'>
                    <img src={purchase.product.image} alt={purchase.product.name} className='h-20 w-20 object-cover' />
                  </div>
                  <div className='ml-3 flex-grow overflow-hidden'>
                    <div className='truncate'>{purchase.product.name}</div>
                    <div className='mt-3'>x{purchase.buy_count}</div>
                  </div>
                  <div className='ml-3 flex-shrink-0'>
                    <span className='truncate text-gray-500 line-through'>
                      đ{formatCurrency(purchase.product.price_before_discount)}
                    </span>
                    <div className='ml-2 truncate text-orange'>
                      <span>đ{formatCurrency(purchase.product.price)}</span>
                    </div>
                  </div>
                </Link>
                <div className='flex items-center justify-end'>
                  <span>Tổng giá tiền: </span>
                  <span>
                    <div className='ml-4 text-xl text-orange'>
                      đ{formatCurrency(purchase.product.price * purchase.buy_count)}
                    </div>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
