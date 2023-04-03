const path = {
  home: '/',
  user: '/user',
  profile: '/user/profile',
  password: '/user/password',
  historyPurchase: '/user/purchase',
  login: 'login',
  register: '/register',
  cart: '/cart',
  logout: '/logout',
  productDetail: ':nameId'
} as const

export default path
