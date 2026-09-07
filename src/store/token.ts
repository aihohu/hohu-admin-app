import type {
  ILoginForm,
} from '@/api/login'
import type { IAuthLoginRes } from '@/api/types/login'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue' // 修复：导入 computed
import {
  login as _login,
  logout as _logout,
  refreshToken as _refreshToken,
  wxLogin as _wxLogin,
  getWxCode,
} from '@/api/login'
import { useUserStore } from './user'

const tokenInfoState: IAuthLoginRes = {
  token: '',
  refreshToken: '',
}

export const useTokenStore = defineStore(
  'token',
  () => {
    // 定义用户信息
    const tokenInfo = ref<IAuthLoginRes>({ ...tokenInfoState })

    // 设置用户信息
    const setTokenInfo = (val: IAuthLoginRes) => {
      tokenInfo.value = val
    }

    /**
     * 登录成功后处理逻辑
     * @param tokenInfo 登录返回的token信息
     */
    async function _postLogin(tokenInfo: IAuthLoginRes) {
      setTokenInfo(tokenInfo)
      const userStore = useUserStore()
      await userStore.fetchUserInfo()
    }

    /**
     * 用户登录
     * 有的时候后端会用一个接口返回token和用户信息，有的时候会分开2个接口，一个获取token，一个获取用户信息
     * （各有利弊，看业务场景和系统复杂度），这里使用2个接口返回的来模拟
     * @param loginForm 登录参数
     * @returns 登录结果
     */
    const login = async (loginForm: ILoginForm) => {
      try {
        const res = await _login(loginForm)
        await _postLogin(res)
        uni.showToast({
          title: '登录成功',
          icon: 'success',
        })
        return res
      }
      catch (error) {
        tokenInfo.value = { ...tokenInfoState }
        useUserStore().clearUserInfo()
        console.error('登录失败')
        uni.showToast({
          title: '登录失败，请重试',
          icon: 'error',
        })
        throw error
      }
    }

    /**
     * 微信登录
     * 有的时候后端会用一个接口返回token和用户信息，有的时候会分开2个接口，一个获取token，一个获取用户信息
     * （各有利弊，看业务场景和系统复杂度），这里使用2个接口返回的来模拟
     * @returns 登录结果
     */
    const wxLogin = async () => {
      try {
        // 获取微信小程序登录的code
        const code = await getWxCode()
        const res = await _wxLogin(code)
        await _postLogin(res)
        uni.showToast({
          title: '登录成功',
          icon: 'success',
        })
        return res
      }
      catch (error) {
        console.error('微信登录失败')
        uni.showToast({
          title: '微信登录失败，请重试',
          icon: 'error',
        })
        throw error
      }
    }

    /**
     * 退出登录 并 删除用户信息
     */
    const logout = async () => {
      try {
        await _logout(tokenInfo.value.refreshToken)
      }
      catch {
        console.error('退出登录失败')
      }
      finally {
        // 无论成功失败，都需要清除本地token信息
        tokenInfo.value = { ...tokenInfoState }
        uni.removeStorageSync('token')
        const userStore = useUserStore()
        userStore.clearUserInfo()
      }
    }

    /**
     * 刷新token
     * @returns 刷新结果
     */
    const refreshToken = async () => {
      try {
        if (!tokenInfo.value.refreshToken) {
          throw new Error('无效的refreshToken')
        }

        const refreshToken = tokenInfo.value.refreshToken
        const res = await _refreshToken(refreshToken)
        setTokenInfo(res)
        return res
      }
      catch (error) {
        console.error('刷新token失败')
        throw error
      }
    }

    /**
     * 获取有效的token
     * 注意：在computed中不直接调用异步函数，只做状态判断
     * 实际的刷新操作应由调用方处理
     * token 到期由服务端 401 驱动 refresh rotation，不信任客户端时钟。
     */
    const getValidToken = computed(() => {
      return tokenInfo.value.token
    })

    /**
     * 检查是否有登录信息（不考虑token是否过期）
     */
    const hasLoginInfo = computed(() => {
      return Boolean(tokenInfo.value.token)
    })

    /**
     * 检查是否持有登录 token；有效性由服务端判定。
     */
    const hasValidLogin = computed(() => {
      return hasLoginInfo.value
    })

    /**
     * 尝试获取有效的token，如果过期且可刷新，则刷新token
     * @returns 有效的token或空字符串
     */
    const tryGetValidToken = async (): Promise<string> => {
      return getValidToken.value
    }

    return {
      // 核心API方法
      login,
      wxLogin,
      logout,

      // 认证状态判断（最常用的）
      hasLogin: hasValidLogin,

      // 内部系统使用的方法
      refreshToken,
      tryGetValidToken,
      validToken: getValidToken,

      // 调试或特殊场景可能需要直接访问的信息
      tokenInfo,
      setTokenInfo,
    }
  },
  {
    // 添加持久化配置，确保刷新页面后token信息不丢失
    persist: true,
  },
)
