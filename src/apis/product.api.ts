import { Product, ProductList, ProductListConfig } from 'src/types/product.type'
import { SuccessResponseApi } from 'src/types/utils.types'
import http from 'src/utils/http'

const url = 'products'
const productApi = {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponseApi<ProductList>>(url, { params })
  },
  getProductDetail(id: string) {
    return http.get<SuccessResponseApi<Product>>(`${url}/${id}`)
  }
}

export default productApi
