export type Timer = {
  id: number
  userId: number
  collectionId: number
  itemId: number
  startTime?: number | null
  trackedDuration: number
  isRunning?: boolean
}
