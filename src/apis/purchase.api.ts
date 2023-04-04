import { CartType, PurchaseListStatus, PurchaseType } from './../types/purchase.type'
import http from 'src/utils/http'
import { SuccessResponseApi } from 'src/types/utils.types'

const URL = 'purchases'

const purchaseApi = {
  addToCart(body: CartType) {
    return http.post<SuccessResponseApi<PurchaseType>>(`${URL}/add-to-cart`, body)
  },
  getPurchases(params: { status: PurchaseListStatus }) {
    return http.get<SuccessResponseApi<PurchaseType[]>>(`${URL}`, { params })
  },
  buyPurchase(body: CartType[]) {
    return http.post<SuccessResponseApi<PurchaseType[]>>(`${URL}/buy-products`, body)
  },
  updatePurchase(body: CartType) {
    return http.put<SuccessResponseApi<PurchaseType>>(`${URL}/update-purchase`, body)
  },
  deletePurchase(purchaseIds: string[]) {
    return http.delete<SuccessResponseApi<{ deleted_count: number }>>(`${URL}`, { data: purchaseIds })
  }
}

export default purchaseApi
