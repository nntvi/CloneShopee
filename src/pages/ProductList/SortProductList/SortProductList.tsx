import classNames from 'classnames'
import { omit } from 'lodash'
import React from 'react'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import path from 'src/constant/path'
import { orderBy, sortBy } from 'src/constant/product'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { ProductListConfig } from 'src/types/product.type'

interface SortProps {
  pageSize: number
  queryConfig: QueryConfig
}
export default function SortProductList(props: SortProps) {
  const { queryConfig, pageSize } = props
  const { sort_by = sortBy.view, order } = queryConfig
  const navigate = useNavigate()
  const page = Number(queryConfig.page)
  const isActiveSort = (valueSortBy: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === valueSortBy
  }

  const handleFilter = (valueSortBy: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: valueSortBy
          },
          ['order']
        )
      ).toString()
    })
  }

  const handlePriceOrder = (valueOrder: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: valueOrder
      }).toString()
    })
  }
  return (
    <div className='bg-gray-300/40 py-4 px-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center'>
          <div>Sắp xếp theo</div>
          <button
            onClick={() => handleFilter(sortBy.view)}
            className={classNames('ml-2 h-8  px-4 text-center text-sm capitalize ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSort(sortBy.view),
              'bg-white text-black hover:bg-slate-100': !isActiveSort(sortBy.view)
            })}
          >
            Phổ biến
          </button>
          <button
            onClick={() => handleFilter(sortBy.createAt)}
            className={classNames('ml-2 h-8  px-4 text-center text-sm capitalize ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSort(sortBy.createAt),
              'bg-white text-black hover:bg-slate-100': !isActiveSort(sortBy.createAt)
            })}
          >
            Mới nhất
          </button>
          <button
            onClick={() => handleFilter(sortBy.sold)}
            className={classNames('ml-2 h-8  px-4 text-center text-sm capitalize ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSort(sortBy.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveSort(sortBy.sold)
            })}
          >
            Bán chạy
          </button>
          <select
            className={classNames('ml-2 h-8 px-4 text-left text-sm capitalize', {
              'bg-orange text-white hover:bg-orange/80': isActiveSort(sortBy.price),
              'bg-white text-black hover:bg-slate-100': !isActiveSort(sortBy.price)
            })}
            value={order || ''}
            onChange={(e) => handlePriceOrder(e.target.value as Exclude<ProductListConfig['order'], undefined>)}
          >
            <option value='' disabled>
              Giá
            </option>
            <option className='bg-white text-black' value={orderBy.desc}>
              Giá cao đến thấp
            </option>
            <option className='bg-white text-black' value={orderBy.asc}>
              Giá thấp đến cao
            </option>
          </select>
        </div>

        <div className='flex items-center'>
          <div>
            <span className='text-orange'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='ml-2 flex'>
            {page === 1 ? (
              <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-tl-sm rounded-bl-sm shadow-sm'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className={classNames(
                  'flex h-8 w-9  items-center justify-center rounded-tl-sm rounded-bl-sm shadow-sm ',
                  {
                    'cursor-not-allowed bg-white/60': page === 1,
                    'bg-white/60 hover:bg-slate-100': page !== 1
                  }
                )}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}

            {page === pageSize ? (
              <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-tl-sm rounded-bl-sm  shadow-sm'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className={classNames(
                  'flex h-8 w-9  items-center justify-center rounded-tl-sm rounded-bl-sm shadow-sm ',
                  {
                    'cursor-not-allowed ': page === pageSize,
                    'bg-white/60 hover:bg-slate-100': page !== pageSize
                  }
                )}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
