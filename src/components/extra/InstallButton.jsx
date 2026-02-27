let deferredPrompt = null

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
  console.log('Install available')
})

export const installApp = async () => {
  if (!deferredPrompt) return

  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice

  console.log('User response:', outcome)

  deferredPrompt = null
}
