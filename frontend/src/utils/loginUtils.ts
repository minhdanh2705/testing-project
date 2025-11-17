export function consumeRegisterSuccess(): string | null {
  try {
    const succ = localStorage.getItem('registerSuccess')
    if (succ === 'true') {
      localStorage.removeItem('registerSuccess')
      return 'Đăng kí thành công. Vui lòng đăng nhập.'
    }
    return null
  } catch (e) {
    return null
  }
}

export function parseLoginError(err: any): string {
  if (!err) return 'Không kết nối được tới server'
  if (typeof err === 'string') return err
  if (err.message === 'Unauthorized') return 'Sai email hoặc mật khẩu'
  return err.message || 'Không kết nối được tới server'
}
