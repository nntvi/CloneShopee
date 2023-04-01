import { CartType, PurchaseListStatus, PurchaseType } from './../types/purchase.type'
import http from 'src/utils/http'
import { SuccessResponseApi } from 'src/types/utils.types'

const url = 'purchases'

const purchaseApi = {
  addToCart(body: CartType) {
    return http.post<SuccessResponseApi<PurchaseType>>(`${url}/add-to-cart`, body)
  },
  getPurchases(params: { status: PurchaseListStatus }) {
    return http.get<SuccessResponseApi<PurchaseType[]>>(`${url}`, { params })
  },
  buyPurchase(body: CartType[]) {
    return http.post<SuccessResponseApi<PurchaseType[]>>(`${url}/buy-products`, body)
  },
  updatePurchase(body: CartType) {
    return http.put<SuccessResponseApi<PurchaseType>>(`${url}/update-purchase`, body)
  },
  deletePurchase(purchaseIds: string[]) {
    return http.delete<SuccessResponseApi<{ deleted_count: number }>>(`${url}`, { data: purchaseIds })
  }
}

export default purchaseApi
