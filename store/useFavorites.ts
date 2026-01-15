import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Vehicle } from '@/lib/types'

interface FavoritesState {
    favorites: Vehicle[]
    addFavorite: (vehicle: Vehicle) => void
    removeFavorite: (vehicleId: string) => void
    isFavorite: (vehicleId: string) => boolean
    toggleFavorite: (vehicle: Vehicle) => void
}

export const useFavorites = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],
            addFavorite: (vehicle) => {
                const { favorites } = get()
                if (!favorites.some((v) => v.id === vehicle.id)) {
                    set({ favorites: [...favorites, vehicle] })
                }
            },
            removeFavorite: (vehicleId) => {
                set({ favorites: get().favorites.filter((v) => v.id !== vehicleId) })
            },
            isFavorite: (vehicleId) => {
                return get().favorites.some((v) => v.id === vehicleId)
            },
            toggleFavorite: (vehicle) => {
                const { isFavorite, addFavorite, removeFavorite } = get()
                if (isFavorite(vehicle.id)) {
                    removeFavorite(vehicle.id)
                } else {
                    addFavorite(vehicle)
                }
            },
        }),
        {
            name: 'queirolo-favorites', // name of the item in the storage (must be unique)
        }
    )
)
