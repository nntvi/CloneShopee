export const sortBy = {
  createAt: 'createAt',
  view: 'view',
  sold: 'sold',
  price: 'price'
} as const // thêm as const vào để đọc được thôi, có sửa value của object đc

export const orderBy = { asc: 'asc', desc: 'desc' } as const
