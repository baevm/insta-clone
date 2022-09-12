import create from 'zustand'

const useInterfaceStore = create((set) => ({
  toast: { open: false, message: '' },

  openToast: ({ message }: { message: string }) => set(() => ({ toast: { open: true, message } })),
  closeToast: () => set(() => ({ toast: { open: false, message: '' } })),
}))

export default useInterfaceStore
