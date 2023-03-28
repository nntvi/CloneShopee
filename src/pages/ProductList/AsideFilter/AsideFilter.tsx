import React from 'react'
import { Link } from 'react-router-dom'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import path from 'src/constant/path'

export default function AsideFilter() {
  return (
    <div className='py-4'>
      {/* title category */}
      <Link to={path.home} className='flex items-center font-bold'>
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
      <ul>
        <li className='py-2 pl-2'>
          <Link to={path.home} className='relative font-semibold text-orange'>
            <svg viewBox='0 0 4 7' className='absolute top-1 left-[-10px] h-2 w-2 fill-orange'>
              <polygon points='4 3.5 0 0 0 7' />
            </svg>
            Thời trang nam
          </Link>
        </li>
        <li className='py-2 pl-2'>
          <Link to={path.home}>Áo khoác</Link>
        </li>
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
        <form action='' className='mt-2'>
          <div className='flex items-start'>
            <Input
              type='text'
              className='grow'
              placeholder='TỪ'
              classNameInput='p-1 text-sm w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
            />
            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Input
              type='text'
              className='grow'
              placeholder='ĐẾN'
              classNameInput='p-1 text-sm w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
            />
          </div>
          <Button className='flex w-full items-center justify-center bg-orange p-2 text-sm text-white hover:bg-orange'>
            ÁP DỤNG
          </Button>
        </form>
      </div>

      {/* end filter */}

      {/* assess */}
      <div className='my-4 h-[1px] bg-gray-300'></div>
      <div className='flex-start flex text-sm text-gray-500'>Đánh Giá</div>
      <div className='my-3'>
        <ul>
          <li className='py-1 pl-2'>
            <Link to={'/home'} className='flex items-center text-sm'>
              {Array(5)
                .fill(1)
                .map((_, index) => (
                  <svg key={index} viewBox='0 0 9.5 8' className='mr-1 h-4 w-4'>
                    <defs>
                      <linearGradient id='ratingStarGradient' x1='50%' x2='50%' y1='0%' y2='100%'>
                        <stop offset={0} stopColor='#ffca11' />
                        <stop offset={1} stopColor='#ffad27' />
                      </linearGradient>
                      <polygon
                        id='ratingStar'
                        points='14.910357 6.35294118 12.4209136 7.66171903 12.896355 4.88968305 10.8823529 2.92651626 13.6656353 2.52208166 14.910357 0 16.1550787 2.52208166 18.9383611 2.92651626 16.924359 4.88968305 17.3998004 7.66171903'
                      />
                    </defs>
                    <g fill='url(#ratingStarGradient)' fillRule='evenodd' stroke='none' strokeWidth={1}>
                      <g transform='translate(-876 -1270)'>
                        <g transform='translate(155 992)'>
                          <g transform='translate(600 29)'>
                            <g transform='translate(10 239)'>
                              <g transform='translate(101 10)'>
                                <use stroke='#ffa727' strokeWidth='.5' xlinkHref='#ratingStar' />
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                ))}
              <span>Trở lên</span>
            </Link>
          </li>
        </ul>
      </div>
      {/* end assess */}

      <div className='my-4 h-[1px] bg-gray-300'></div>
      <Button className='flex w-full items-center justify-center bg-orange p-2 text-sm text-white hover:bg-orange'>
        XOÁ TẤT CẢ
      </Button>
    </div>
  )
}
