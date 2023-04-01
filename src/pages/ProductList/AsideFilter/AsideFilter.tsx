import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { omit } from 'lodash'
import { Controller, useForm } from 'react-hook-form'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import InputNumber from 'src/components/InputNumber'
import InputV2 from 'src/components/InputV2'
import RatingStar from 'src/components/RatingStart'
import path from 'src/constant/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { Category } from 'src/types/category.types'
import { ProductListConfig } from 'src/types/product.type'
import { schema } from 'src/utils/rules'

interface AsideProps {
  categories: Category[]
  queryConfig: QueryConfig
}
export type FormDataPrice = {
  price_min: string
  price_max: string
}

const priceSchema = schema.pick(['price_min', 'price_max'])

export default function AsideFilter(props: AsideProps) {
  const { categories, queryConfig } = props
  const { category } = queryConfig
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormDataPrice>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema)
  })

  const isActiveSort = (sortCategory: Exclude<ProductListConfig['category'], undefined>) => {
    return category === sortCategory
  }

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_min: data.price_min,
        price_max: data.price_max
      }).toString()
    })
  })

  const cancelFilter = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['rating_filter', 'price_max', 'price_min', 'category'])).toString()
    })
  }
  return (
    <div className='py-4'>
      {/* title category */}
      <Link to={path.home} className={classNames('flex items-center font-bold')}>
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      {/* end title category */}

      {/* category */}
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <ul className='text-left'>
        {categories.map((categoryItem, index) => (
          <li className='py-2 pl-2' key={categoryItem._id + index}>
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  category: categoryItem._id
                }).toString()
              }}
              className={classNames('font-semibold', {
                'relative mx-1  text-orange': isActiveSort(categoryItem._id)
              })}
            >
              {isActiveSort(categoryItem._id) && (
                <svg viewBox='0 0 4 7' className='absolute top-1 left-[-10px] h-3 w-3 fill-orange'>
                  <polygon points='4 3.5 0 0 0 7' />
                </svg>
              )}
              <span className='ml-3'>{categoryItem.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      {/* end category */}

      {/* filter */}
      <Link to={path.home} className='mt-4 flex items-center font-bold uppercase '>
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        bộ lọc tìm kiếm
      </Link>
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <div className='my-5'>
        <div className='flex-start flex text-sm text-gray-500'>Khoảng giá</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='TỪ'
                    classNameInput='p-1 text-sm w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      trigger('price_max')
                    }}
                  />
                )
              }}
            />
            {/* <InputV2
              control={control}
              name='price_min'
              type='text'
              className='grow'
              placeholder='TỪ'
              classNameInput='p-1 text-sm w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              onChange={() => {
                trigger('price_max')
              }}
              classNameError='mb-1 min-h-[1.25rem] text-sm text-red-600'
            /> */}
            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='ĐẾN'
                    classNameInput='p-1 text-sm w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      trigger('price_min')
                    }}
                  />
                )
              }}
            />
          </div>
          <div className='mb-1 min-h-[1.25rem] text-sm text-red-600'>{errors.price_min?.message}</div>
          <Button className='flex w-full items-center justify-center bg-orange p-2 text-sm text-white hover:bg-orange'>
            ÁP DỤNG
          </Button>
        </form>
      </div>

      {/* end filter */}

      {/* assess */}
      <div className='my-4 h-[1px] bg-gray-300 pt-[-5px]'></div>
      <div className='flex-start flex text-sm text-gray-500'>Đánh Giá</div>
      <div className='my-3'>
        <RatingStar queryConfig={queryConfig} />
      </div>
      {/* end assess */}

      <div className='my-4 h-[1px] bg-gray-300'></div>
      <Button
        onClick={cancelFilter}
        className='flex w-full items-center justify-center bg-orange p-2 text-sm text-white hover:bg-orange'
      >
        XOÁ TẤT CẢ
      </Button>
    </div>
  )
}
