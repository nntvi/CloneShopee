import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HOME_EN from 'src/locales/en/home.json'
import PRODUCT_EN from 'src/locales/en/product.json'
import PROFILE_EN from 'src/locales/en/profile.json'

import HOME_VI from 'src/locales/vi/home.json'
import PRODUCT_VI from 'src/locales/vi/product.json'
import PROFILE_VI from 'src/locales/vi/profile.json'

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
} as const

export const resources = {
  en: {
    home: HOME_EN,
    product: PRODUCT_EN,
    profile: PROFILE_EN
  },
  vi: {
    home: HOME_VI,
    product: PRODUCT_VI,
    profile: PROFILE_VI
  }
} as const

export const defaultNS = 'home'

i18n.use(initReactI18next).init({
  resources,
  lng: 'vi',
  ns: ['home', 'product', 'profile'],
  fallbackLng: 'vi',
  defaultNS: defaultNS,
  interpolation: {
    escapeValue: false // react already safes from xss
  }
})
export default i18n
