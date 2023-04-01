import { useMutation, useQuery } from '@tanstack/react-query'
import produce from 'immer'
import { keyBy } from 'lodash'
import { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import { purchaseStatus } from 'src/constant/purchase'
import { AppContext } from 'src/contexts/app.context'
import { CartType, ExtendedPurchase, PurchaseType } from 'src/types/purchase.type'
import { formatCurrency } from 'src/types/utils.types'
import { generateNameId } from 'src/utils/utils'
import noImage from 'src/assets/images/no-product.png'
import path from 'src/constant/path'

export default function Cart() {
  const { data, refetch } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.inCart })
  })
  const purchaseData = data?.data.data
  const location = useLocation()
  const chosenPurchaseIdFromLocation = (location.state as { purchaseId: string | null })?.purchaseId
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)

  // ------------------------  calculate -------------------------------
  const isAllChecked = useMemo(
    () => extendedPurchases.every((purchase) => purchase.checked), // every: nếu trong đám có 1 đứa false, thì hàm dừng lại return về false
    [extendedPurchases]
  )

  const checkedPurchase = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])

  const checkedPurchaseCount = checkedPurchase.length
  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchase.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [checkedPurchase]
  )

  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchase.reduce((result, current) => {
        return result + (current.product.price_before_discount - current.product.price) * current.buy_count
      }, 0),
    [checkedPurchase]
  )

  // ----------------------- HANDLE CHECKED --------------------------
  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchaseObj = keyBy(prev, '_id')
      return (
        purchaseData?.map((purchase) => {
          const isChosenPurchaseFromLocation = chosenPurchaseIdFromLocation === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isChosenPurchaseFromLocation || Boolean(extendedPurchaseObj[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchaseData, chosenPurchaseIdFromLocation])

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])
  const handleCheck = (purchaseIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = e.target.checked
      })
    )
  }

  const handleCheckedAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }
  // ----------------------- UPDATE PURCHASE --------------------------
  const updatePurchaseMutation = useMutation({
    mutationFn: (params: CartType) => purchaseApi.updatePurchase(params),
    onSuccess: () => {
      refetch()
    }
  })

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  // ----------------------- DELETE PURCHASE --------------------------

  const deletePurchaseMutation = useMutation({
    mutationFn: (id: string[]) => purchaseApi.deletePurchase(id),
    onSuccess: (data) => {
      refetch()
      toast(data.data.message)
    }
  })

  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchaseMutation.mutate([purchaseId])
  }

  const handleDeleteManyPurchase = () => {
    const purchaseIds = checkedPurchase.map((purchase) => purchase._id)
    deletePurchaseMutation.mutate(purchaseIds)
  }

  // ----------------------- BUY PURCHASE --------------------------

  const buyPurchaseMutation = useMutation({
    mutationFn: (body: CartType[]) => purchaseApi.buyPurchase(body),
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message)
    }
  })

  const handleBuyPurchase = () => {
    if (checkedPurchaseCount > 0) {
      const params = checkedPurchase.map((purchsase) => {
        return {
          product_id: purchsase.product._id,
          buy_count: purchsase.buy_count
        }
      })
      buyPurchaseMutation.mutate(params)
    }
  }
  return (
    <div className='bt-neutral-100 py-16'>
      <div className='container'>
        {purchaseData && purchaseData?.length > 0 ? (
          <Fragment>
            <div className='over-flow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-orange'
                          onChange={handleCheckedAll}
                          checked={isAllChecked}
                        />
                      </div>
                      <div className='flex-grow text-black'>Sản phẩm</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>Đơn giá</div>
                      <div className='col-span-1'>Số lượng</div>
                      <div className='col-span-1'>Số tiền</div>
                      <div className='col-span-1'>Thao tác</div>
                    </div>
                  </div>
                </div>
                <div className='my-3 rounded-sm bg-white p-5 shadow'>
                  {extendedPurchases.length > 0 &&
                    extendedPurchases.map((purchase, index) => (
                      <div
                        key={purchase._id + index}
                        className='mb-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white py-5 px-4  text-center text-sm text-gray-500'
                      >
                        <div className='col-span-6'>
                          <div className='flex'>
                            <div className='justify-content flex flex-shrink-0 items-center pr-3'>
                              <input
                                type='checkbox'
                                checked={purchase.checked}
                                className='h-5 w-5 accent-orange'
                                onChange={handleCheck(index)}
                              />
                            </div>
                            <div className='flex-grow'>
                              <div className='flex items-center'>
                                <Link
                                  to={`${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                                  className='h-20 w-20 flex-shrink-0'
                                >
                                  <img src={purchase.product.image} alt={purchase.product.name} />
                                </Link>
                                <div className='flex-grow px-2 pt-1 pb-2'>
                                  <Link
                                    className='text-left line-clamp-2'
                                    to={`${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                                  >
                                    {purchase.product.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className='col-span-6'>
                          <div className='grid grid-cols-5 items-center'>
                            <div className='col-span-2'>
                              <div className='flex items-center justify-center'>
                                <span className='text-gray-300 line-through'>
                                  đ{formatCurrency(purchase.product.price_before_discount)}
                                </span>
                                <span className='ml-3'>đ{formatCurrency(purchase.product.price)}</span>
                              </div>
                            </div>

                            <div className='col-span-1'>
                              <QuantityController
                                max={purchase.product.quantity}
                                onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                                onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                                onType={handleTypeQuantity(index)}
                                onFocusOut={(value) =>
                                  handleQuantity(
                                    index,
                                    value,
                                    value >= 1 &&
                                      value <= purchase.product.quantity &&
                                      value !== (purchaseData as PurchaseType[])[index].buy_count
                                  )
                                }
                                value={purchase.buy_count}
                                classNameWrapper='flex items-center'
                                disabled={purchase.disabled}
                              />
                            </div>

                            <div className='col-span-1'>
                              <span className='text-orange'>
                                {formatCurrency(purchase.product.price * purchase.buy_count)}
                              </span>
                            </div>

                            <div className='col-span-1'>
                              <button
                                onClick={handleDelete(index)}
                                className='transition-color bg-none text-black hover:text-orange'
                              >
                                Xoá
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            {/* sticky total */}
            <div className='sticky bottom-0 z-10 mt-10 flex flex-col rounded-sm border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
              <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                <input
                  type='checkbox'
                  className='h-5 w-5 accent-orange'
                  onChange={handleCheckedAll}
                  checked={isAllChecked}
                />
              </div>
              <button className='bb-none mx-3 border-none' onClick={handleCheckedAll}>
                Chọn tất cả {`(${extendedPurchases.length})`}
              </button>
              <button className='bb-none mx-3 border-none' onClick={handleDeleteManyPurchase}>
                Xoá
              </button>
              <div className='mt-5 flex flex-col items-center sm:ml-auto sm:mt-0 sm:flex-row'>
                <div className='flex items-center'>
                  <div className='flex items-center sm:justify-end'>
                    <div>Tổng thanh toán ({checkedPurchaseCount} sản phẩm)</div>
                    <div className='ml-2 text-2xl text-orange'>₫ {formatCurrency(totalCheckedPurchasePrice)}</div>
                  </div>
                  <div className='ml-1 flex items-center sm:justify-end'>
                    <div className='text-gray-500'>Tiết kiệm</div>
                    <div className='ml-6 text-orange'>₫ {formatCurrency(totalCheckedPurchaseSavingPrice)}</div>
                  </div>
                </div>
                <Button
                  onClick={handleBuyPurchase}
                  className='mt-5 h-10 w-52 bg-red-500 text-center text-sm uppercase text-white hover:bg-red-600 sm:ml-5 sm:mt-0'
                  disabled={buyPurchaseMutation.isLoading}
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </Fragment>
        ) : (
          <div className='flex flex-col items-center justify-center py-10'>
            <img src={noImage} alt='noImage' className='h-24 w-24' />
            <div className='mt-3 font-bold'>Giỏ hàng của bạn còn trống</div>
            <Link
              to={path.home}
              className='mt-5 flex h-12 cursor-pointer items-center justify-center rounded-sm bg-orange px-5 uppercase text-white hover:bg-orange/90'
            >
              mua ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
