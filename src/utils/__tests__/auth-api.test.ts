import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getUserInfo, login, logout, refreshToken } from '@/api/login'

const httpMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}))

vi.mock('@/http/http', () => ({
  http: httpMocks,
}))

describe('backend auth API contract', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uses the hosted login payload and current auth routes', () => {
    login({ userName: ' Alice ', password: 'secret', tenantCode: ' Tenant-A ' })
    getUserInfo()
    logout('refresh-token')
    refreshToken('refresh-token')

    expect(httpMocks.post).toHaveBeenNthCalledWith(1, '/auth/login', {
      userName: 'Alice',
      password: 'secret',
      tenantCode: 'tenant-a',
    })
    expect(httpMocks.get).toHaveBeenCalledWith('/auth/getUserInfo')
    expect(httpMocks.post).toHaveBeenNthCalledWith(2, '/auth/logout', {
      refreshToken: 'refresh-token',
    })
    expect(httpMocks.post).toHaveBeenNthCalledWith(3, '/auth/refreshToken', {
      refreshToken: 'refresh-token',
    })
  })
})
