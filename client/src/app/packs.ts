export type Pack = {
  id: number
  title: string
  p1: string
  p2: string
  p3: string
  p0: string
}

export type PackKey = 'p1' | 'p2' | 'p3' | 'p0'

export const checkboxStylePacks: Pack[] = [
  {
    id: 1,
    title: 'first',
    p1: '#FF0060',
    p2: '#F6FA70',
    p3: '#0079FF',
    p0: '#fff',
  },
  {
    id: 2,
    title: 'second',
    p1: '#FF1E1E',
    p2: '#FFFF00',
    p3: '#00FFD1',
    p0: '#fff',
  },
  {
    id: 3,
    title: 'third',
    p1: '#FF4A4A',
    p2: '#FF9551',
    p3: '#6FEDD6',
    p0: '#fff',
  },
  {
    id: 4,
    title: 'fouth',
    p1: '#ff2626',
    p2: '#ffae00',
    p3: '#007fff',
    p0: '#fff',
  },
]
