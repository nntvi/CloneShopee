import { describe, expect, it } from 'vitest'
import {
  saveAccessTokenToLocalStorage,
  saveRefreshTokenToLocalStorage,
  clearLocalStorage,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage
} from '../auth'

const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MjAwM2FmNmQ3YzYyMDM0MDg1NmFhZCIsImVtYWlsIjoiZ2ltaS52aWFpYmlAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0wNC0wNFQxNzoxNzo0OS43MjdaIiwiaWF0IjoxNjgwNjI4NjY5LCJleHAiOjE2ODA2Mjg2Nzl9.i26_bxTlk7YSGYqLvB4ja80uAZJGlDWdw3faNaowQ58'
const refresh_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MjAwM2FmNmQ3YzYyMDM0MDg1NmFhZCIsImVtYWlsIjoiZ2ltaS52aWFpYmlAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0wNC0wNFQxNzoxNzo0OS43MjdaIiwiaWF0IjoxNjgwNjI4NjY5LCJleHAiOjE2ODA2MzIyNjl9.kvR2NUmDwRoPZEe1t5DveOckM_k-ubOi7MnRIyvPx7c'
const profile = `{
  "_id": "642003af6d7c620340856aad",
  "roles": [
    "User"
  ],
  "email": "gimi.viaibi@gmail.com",
  "createdAt": "2023-03-26T08:34:55.867Z",
  "updatedAt": "2023-04-04T02:59:15.303Z",
  "__v": 0,
  "address": "Thủ Đức",
  "date_of_birth": "1998-09-25T17:00:00.000Z",
  "name": "Tường Viiiiiii",
  "phone": "09090909090",
  "avatar": "03d9a646-6fec-4473-8d1d-6f1c3a02ee6e.jpeg"
}`

describe('saveAccessTokenToLocalStorage', () => {
  it('access_token được set vào local storage', () => {
    saveAccessTokenToLocalStorage(access_token)
    expect(getAccessTokenFromLocalStorage()).toBe(access_token)
  })
})

describe('saveRefreshTokenToLocalStorage', () => {
  it('access_token được set vào local storage', () => {
    saveRefreshTokenToLocalStorage(refresh_token)
    expect(getRefreshTokenFromLocalStorage()).toBe(refresh_token)
  })
})

describe('clearLocalStorage', () => {
  it('xoá data trong LS', () => {
    saveAccessTokenToLocalStorage(access_token)
    saveRefreshTokenToLocalStorage(refresh_token)
    clearLocalStorage()
    expect(getAccessTokenFromLocalStorage()).toEqual('')
    expect(getRefreshTokenFromLocalStorage()).toEqual('')
  })
})

// describe('saveProfileToLocalStorage', () => {
//   it('profile được set vào local storage', () => {
//     saveProfileToLocalStorage(profile)
//     expect(localStorage.getItem('profile')).toEqual(profile)
//   })
// })
