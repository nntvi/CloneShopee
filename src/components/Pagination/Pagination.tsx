import classNames from 'classnames'
import { createSearchParams, Link } from 'react-router-dom'
import path from 'src/constant/path'
import { QueryConfig } from 'src/hooks/useQueryConfig'

interface PaginationProps {
  pageSize: number
  queryConfig: QueryConfig
}
const RANGE = 2
function Pagination(props: PaginationProps) {
  const { queryConfig, pageSize } = props
  const page = Number(queryConfig.page)
  let dotLast = false
  let dotFirst = false

  const renderDotLast = (index: number) => {
    if (!dotLast) {
      dotLast = true
      return (
        <span key={index} className='p-2'>
          ...
        </span>
      )
    }
    return null
  }
  const renderDotFirst = (index: number) => {
    if (!dotFirst) {
      dotFirst = true
      return (
        <span key={index} className='p-2'>
          ...
        </span>
      )
    }
    return null
  }
  const render = () => {
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotLast(index)
        }
        if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotFirst(index)
          } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotLast(index)
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDotFirst(index)
        }
        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            key={index}
            className={classNames('mx-2 cursor-pointer rounded px-3 py-2 shadow-sm', {
              'bg-orange text-white': page === pageNumber,
              'bg-white': page !== pageNumber
            })}
          >
            {pageNumber}
          </Link>
        )
      })
  }
  return (
    <div className='mt-6 flex flex-wrap justify-center'>
      {page === 1 ? (
        <span
          className={classNames('mx-2  rounded bg-white px-3 py-2 shadow-sm', {
            'cursor-pointer': page !== 1,
            'disabled cursor-not-allowed': page === 1
          })}
        >
          Previous
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
          className={classNames('mx-2  rounded bg-white px-3 py-2 shadow-sm', {
            'cursor-pointer': page !== 1,
            'disabled cursor-not-allowed': page === 1
          })}
        >
          Previous
        </Link>
      )}

      {render()}

      {page === pageSize ? (
        <span
          className={classNames('mx-2  rounded bg-white px-3 py-2 shadow-sm', {
            'cursor-pointer': page !== pageSize,
            'disabled cursor-not-allowed': page === pageSize
          })}
        >
          Next
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
          className={classNames('mx-2  rounded bg-white px-3 py-2 shadow-sm', {
            'cursor-pointer': page !== pageSize,
            'disabled cursor-not-allowed': page === pageSize
          })}
        >
          Next
        </Link>
      )}
    </div>
  )
}

export default Pagination

// TH 1: có 1 dấu 3 chấm ở cuối
/* [1] 2 3 ... 19 20
 * 1 [2] 3 ... 19 20
 * 1 2 [3] 4 5 ... 19 20
 */

// TH 2: có 2 dấu 3 chấm
/* 1 2  ... 4 5 [6] 7 8 ... 19 20
 *
 */

// TH 1: có 1 dấu 3 chấm ở đầu
/* 1 2 3 ... 14 15 [16] 17 18 19 20
 *
 */
