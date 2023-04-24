import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import ProductRating from 'src/components/ProductRating'
import path from 'src/constant/path'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle } from 'src/types/utils.types'
import { generateNameId } from 'src/utils/utils'

interface ProductProps {
  product: ProductType
}
export default function Product(props: ProductProps) {
  const { product } = props
  const { t } = useTranslation('product')
  return (
    <Link
      to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}
      className='overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.0625rem] hover:shadow-md'
    >
      <div className='relative w-full pt-[100%]'>
        <img
          src={product.image}
          className='absolute top-0 left-0 h-full w-full bg-white object-cover'
          alt={product.name}
        />
      </div>
      <div className='p2 '>
        <div className='min-h-[2rem] text-xs line-clamp-2'>{product.name}</div>
        <div className='mt-3 flex items-center'>
          <div className='max-w-[50%] truncate text-gray-500 line-through'>
            đ{formatCurrency(product.price_before_discount)}
          </div>
          <div className='ml-1 truncate text-orange'>
            <span className='tex-xs'>đ</span>
            <span>{formatCurrency(product.price)}</span>
          </div>
        </div>

        {/* start */}
        <div className='mt-3 flex items-center justify-end'>
          <ProductRating rating={product.rating} />
          <div className='ml-2 text-sm'>
            <span>{formatNumberToSocialStyle(product.sold)}</span>
            <span className='ml-1'>{t('product.sold')}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
