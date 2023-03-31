import { PurchaseListStatus, PurchaseType } from './../types/purchase.type'
import http from 'src/utils/http'
import { SuccessResponseApi } from 'src/types/utils.types'

const url = 'purchases'

const purchaseApi = {
  addToCart(body: { product_id: string; buy_count: number }) {
    return http.post<SuccessResponseApi<PurchaseType>>(`${url}/add-to-cart`, body)
  },
  getPurchases(params: { status: PurchaseListStatus }) {
    return http.get<SuccessResponseApi<PurchaseType[]>>(`${url}`, { params })
  }
}

export default purchaseApi
