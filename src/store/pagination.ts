import { create } from "zustand";

export const usePaginationStore = create<{
    page: number,
    itemsPerPage: number,
    setPage: (page: number) => void
    setItemsPerPage: (ammount: number) => void
}>((set) => ({
    page: 1,
    itemsPerPage: 20,
    setPage: (page) => set({page}),
    setItemsPerPage: (page) => set({page}),
}))
