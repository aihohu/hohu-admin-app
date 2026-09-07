<script lang="ts" setup>
import { useTokenStore } from '@/store/token'
import { shouldShowTenantCodeInput } from '@/utils/tenant-auth'

definePage({
  style: {
    navigationBarTitleText: '登录',
  },
})

const tokenStore = useTokenStore()
const userName = ref('')
const password = ref('')
const tenantCode = ref('')
const submitting = ref(false)
const showTenantCode = shouldShowTenantCodeInput(
  import.meta.env.VITE_TENANT_MODE,
  import.meta.env.VITE_TENANT_LOCATOR,
)

async function doLogin() {
  if (tokenStore.hasLogin) {
    uni.navigateBack()
    return
  }

  if (!userName.value.trim() || !password.value || (showTenantCode && !tenantCode.value.trim())) {
    uni.showToast({
      title: '请填写完整登录信息',
      icon: 'none',
    })
    return
  }

  submitting.value = true
  try {
    await tokenStore.login({
      userName: userName.value,
      password: password.value,
      ...(showTenantCode ? { tenantCode: tenantCode.value } : {}),
    })
    uni.navigateBack()
  }
  catch {
    // Store 统一展示不包含后端细节的失败提示。
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <view class="login-page">
    <view class="login-card">
      <view class="login-title">
        登录
      </view>
      <view class="login-description">
        使用你的工作账号继续
      </view>
      <view v-if="showTenantCode" class="form-item">
        <view class="form-label">
          租户代码
        </view>
        <input
          v-model="tenantCode"
          class="form-input"
          :disabled="submitting"
          placeholder="请输入租户代码"
          type="text"
        >
      </view>
      <view class="form-item">
        <view class="form-label">
          账号
        </view>
        <input
          v-model="userName"
          class="form-input"
          :disabled="submitting"
          placeholder="请输入账号"
          type="text"
        >
      </view>
      <view class="form-item">
        <view class="form-label">
          密码
        </view>
        <input
          v-model="password"
          class="form-input"
          :disabled="submitting"
          placeholder="请输入密码"
          password
        >
      </view>
      <button class="login-button" :disabled="submitting" @click="doLogin">
        {{ submitting ? '登录中…' : '登录' }}
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 96rpx 40rpx 40rpx;
  background: #f5f7fa;
}

.login-card {
  padding: 48rpx 40rpx;
  border-radius: 24rpx;
  background: #fff;
  box-shadow: 0 16rpx 48rpx rgb(15 23 42 / 8%);
}

.login-title {
  color: #172033;
  font-size: 48rpx;
  font-weight: 600;
}

.login-description {
  margin: 12rpx 0 44rpx;
  color: #7b8495;
  font-size: 28rpx;
}

.form-item {
  margin-bottom: 32rpx;
}

.form-label {
  margin-bottom: 14rpx;
  color: #303846;
  font-size: 28rpx;
}

.form-input {
  height: 88rpx;
  box-sizing: border-box;
  padding: 0 28rpx;
  border: 2rpx solid #dce1e8;
  border-radius: 14rpx;
  background: #fff;
  color: #172033;
  font-size: 30rpx;
}

.login-button {
  margin-top: 12rpx;
  border-radius: 14rpx;
  background: #246bfd;
  color: #fff;
  font-size: 30rpx;
}
</style>
