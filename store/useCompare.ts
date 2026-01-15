import { create } from 'zustand'
import { Vehicle } from '@/lib/types'

interface CompareState {
    comparisonList: Vehicle[]
    addToCompare: (vehicle: Vehicle) => void
    removeFromCompare: (vehicleId: string) => void
    isInCompare: (vehicleId: string) => boolean
    clearCompare: () => void
    toggleCompare: (vehicle: Vehicle) => void
}

export const useCompare = create<CompareState>((set, get) => ({
    comparisonList: [],
    addToCompare: (vehicle) => {
        const { comparisonList } = get()
        // Max 3 vehicles for comparison
        if (comparisonList.length < 3 && !comparisonList.some((v) => v.id === vehicle.id)) {
            set({ comparisonList: [...comparisonList, vehicle] })
        }
    },
    removeFromCompare: (vehicleId) => {
        set({ comparisonList: get().comparisonList.filter((v) => v.id !== vehicleId) })
    },
    isInCompare: (vehicleId) => {
        return get().comparisonList.some((v) => v.id === vehicleId)
    },
    clearCompare: () => set({ comparisonList: [] }),
    toggleCompare: (vehicle) => {
        const { isInCompare, addToCompare, removeFromCompare, comparisonList } = get()

        if (isInCompare(vehicle.id)) {
            removeFromCompare(vehicle.id)
        } else {
            // Logic for adding: if full, replace the oldest? Or just don't add?
            // For now, if < 3, add. If full, user must remove one first.
            if (comparisonList.length < 3) {
                addToCompare(vehicle)
            } else {
                // Optional: Trigger a notification "Max 3 items"
                // For simplicity in this phase, we won't throw error but just not add
                console.warn("Comparison list is full (max 3)")
            }
        }
    },
}))
