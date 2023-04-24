import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import InputNumber from 'src/components/InputNumber'
import ProductRating from 'src/components/ProductRating'
import QuantityController from 'src/components/QuantityController'
import { Product as ProductType, ProductListConfig } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle } from 'src/types/utils.types'
import { getIdFromNameId, rateSale } from 'src/utils/utils'
import Product from '../ProductList/Product'
import purchaseApi from 'src/apis/purchase.api'
import { purchaseStatus } from 'src/constant/purchase'
import { toast } from 'react-toastify'
import path from 'src/constant/path'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { convert } from 'html-to-text'

export default function ProductDetail() {
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  const { data: productDetail } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })
  const product = productDetail?.data.data
  const [indexImages, setIndexImages] = useState([0, 5])
  const [activeImg, setActiveImg] = useState('')
  const currentImages = useMemo(() => {
    return product ? product.images.slice(...indexImages) : [product]
  }, [product, indexImages])
  const imageRef = useRef<HTMLImageElement>(null)
  const [buyCount, setBuyCount] = useState(1)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation('product')
  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImg(product.images[0])
    }
  }, [product])

  const chooseActive = (img: string) => {
    setActiveImg(img)
  }

  const next = () => {
    if (indexImages[1] < (product as ProductType)?.images.length) {
      setIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const prev = () => {
    if (indexImages[0] > 0) {
      setIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const handleZoom = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect() // lấy ra chiều cao rộng của thẻ div chứa img
    const image = imageRef.current as HTMLImageElement // img cần zoom
    const { naturalHeight, naturalWidth } = image

    // cách 1  khi đã xử lý đc bubble event
    const { offsetY, offsetX } = e.nativeEvent

    // cách 2 lấy offsetX, offsetY khi ko xử lý đc bubble event
    // const offsetX = e.pageX - (rect.x + window.scrollX)
    // const offsetY = e.pageY - (rect.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const resetZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  // ============================= có thể bạn sẽ thích ===================
  const queryConfig: ProductListConfig = { limit: '10', page: '1', category: product?.category._id }
  const { data: productSuggestions } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig),
    enabled: Boolean(product), // chừng nào product có mới gọi api
    staleTime: 3 * 60 * 1000
  })

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const addToCartMutation = useMutation({
    mutationFn: (data: { buy_count: number; product_id: string }) => purchaseApi.addToCart(data)
  })

  const addToCart = () => {
    addToCartMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        onSuccess: (data) => {
          toast.success(data.data.message, { autoClose: 2000 })
          queryClient.invalidateQueries(['purchases', { status: purchaseStatus.inCart }])
        }
      }
    )
  }

  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string })
    const purchase = res.data.data
    navigate(path.cart, {
      state: {
        purchaseId: purchase._id
      }
    })
  }

  if (!product) return null
  return (
    <div className='bg-gray-200 py-6'>
      <Helmet>
        <title>{product.name} | Shopee Clone</title>
        <meta name='description' content={convert(product.description, { limits: { maxInputLength: 150 } })} />
      </Helmet>
      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              {/* để có tấm ảnh có chiều cao = vs chiều rộng khi thay đổi cỡ */}
              {/* thì cho relative và padding-top 100% */}
              <div
                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                onMouseMove={handleZoom}
                onMouseLeave={resetZoom}
              >
                <img
                  src={activeImg}
                  alt={product.name}
                  className='pointer-events-none absolute top-0 left-0 h-full w-full bg-white object-cover'
                  ref={imageRef}
                />
              </div>

              {/* slides */}
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='absolute left-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-2xl bg-black/20 text-white'
                  onClick={prev}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5 pl-2'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImages.length > 0 &&
                  currentImages.map((img, index) => {
                    const isActive = img === activeImg
                    return (
                      <div
                        className='relative w-full pt-[100%]'
                        key={index}
                        onMouseEnter={() => chooseActive(img as string)}
                      >
                        <img
                          src={img}
                          alt={product.name}
                          className='absolute top-0 left-0 h-full w-full bg-white object-cover'
                        />
                        {isActive && <div className='absolute inset-0 border-2 border-orange ' />}
                      </div>
                    )
                  })}
                <button
                  className='absolute right-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-2xl bg-black/20 text-white'
                  onClick={next}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5 pl-2'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
              {/* end slides */}
            </div>

            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-8 flex items-center'>
                <span className='cursor mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                <ProductRating
                  rating={product.rating}
                  activeClassName='fill-orange text-orange h-4 w-4'
                  noneActiveClassName='"fill-orange text-gray-300 h-4 w-4'
                />
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div className=' flex items-center'>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ml-4'>{t('product.sold')}</span>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>đ{formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange'>đ{formatCurrency(product.price)}</div>
                <div className='text-sx ml-4 rounded-sm bg-orange py-1 px-2 font-semibold uppercase text-white'>
                  {rateSale(product.price_before_discount, product.price)} {t('product.discount')}
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>{t('product.quantity')}</div>
                <QuantityController
                  max={product.quantity}
                  onDecrease={handleBuyCount}
                  onIncrease={handleBuyCount}
                  onType={handleBuyCount}
                  value={buyCount}
                />
                <div className='text-gray ml-6 text-sm text-gray-500'>
                  {product.quantity} {t('product.available')}
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <button
                  onClick={addToCart}
                  className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange hover:bg-orange/20'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='stroke-ỏ mr-3 h-5 w-5 fill-current'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                    />
                  </svg>
                  {t('cart.add_to_cart')}
                </button>
                <button
                  onClick={buyNow}
                  className='ml-4 flex h-12 cursor-pointer items-center justify-center rounded-sm bg-orange px-4 capitalize text-white hover:bg-orange/90'
                >
                  {t('cart.buy_now')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* description */}
      <div className='mt-8'>
        <div className='container'>
          <div className=' bg-white p-4 shadow'>
            <div className='rounded bg-gray-50 p-4 text-left text-lg capitalize text-slate-700'>
              {t('product.desc')}
            </div>
            <div className='mx-4 mt-12 mb-4 text-left text-sm leading-loose'>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.description)
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* products suggestion */}
      <div className='mt-8'>
        <div className='container'>
          <div className=' bg-white p-4 shadow'>
            <div className='rounded bg-gray-50 p-4 text-left text-lg uppercase text-slate-700'>
              {t('product.recommended_products')}
            </div>
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6'>
              {productSuggestions &&
                productSuggestions.data.data.products.map((product, index) => (
                  <div className='col-span-1' key={product._id + index}>
                    <Product product={product} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
