import { create } from "zustand";

const useStore = create((set) => ({
    curUser: null,
    isLoading: false,
    authChecked: false,  // flag to indicate if auth status has been checked

    setUser: (user) => set({ curUser: user }),
    setLoading: (loading) => set({ isLoading: loading }),
    setAuthChecked: (checked) => set({ authChecked: checked }),

    resetUser: () => set({ curUser: null })
}));

export default useStore;
