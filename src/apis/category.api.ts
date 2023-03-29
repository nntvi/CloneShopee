import { Category } from './../types/category.types'
import { SuccessResponseApi } from 'src/types/utils.types'
import http from 'src/utils/http'

export const getCategory = () => http.get<SuccessResponseApi<Category[]>>('categories')
