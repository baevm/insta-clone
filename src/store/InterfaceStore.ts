import create from 'zustand'

const useInterfaceStore = create((set) => ({
  toast: { open: false, message: '' },

  openToast: ({ message }: { message: string }) => set((state: any) => ({ toast: { open: true, message } })),
  closeToast: () => set((state: any) => ({ toast: { open: false, message: '' } })),
}))

export default useInterfaceStore
