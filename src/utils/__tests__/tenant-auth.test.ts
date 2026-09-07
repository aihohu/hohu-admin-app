import { describe, expect, it } from 'vitest'
import { buildLoginPayload, shouldShowTenantCodeInput } from '../tenant-auth'

describe('tenant login capability', () => {
  it('keeps single mode free of tenant fields', () => {
    expect(shouldShowTenantCodeInput(undefined, undefined)).toBe(false)
    expect(shouldShowTenantCodeInput('single', 'code')).toBe(false)
    expect(buildLoginPayload('alice', 'secret')).toEqual({
      userName: 'alice',
      password: 'secret',
    })
  })

  it('normalizes and submits a tenant code only for hosted code locator', () => {
    expect(shouldShowTenantCodeInput('hosted', 'code')).toBe(true)
    expect(shouldShowTenantCodeInput('hosted', 'host')).toBe(false)
    expect(buildLoginPayload('alice', 'secret', ' Tenant-B ')).toEqual({
      userName: 'alice',
      password: 'secret',
      tenantCode: 'tenant-b',
    })
  })
})
