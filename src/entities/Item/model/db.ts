import type { Item } from '../types/item'

export const db: Item[] = [
  {
    id: Date.now(),
    title: 'First todo to do :)',
    type: 'todo',
    isDone: false,
  },
  {
    id: Date.now() + 1,
    title: 'Second todo to do ;D',
    type: 'todo',
    isDone: false,
  },
  {
    id: Date.now() + 2,
    title: 'Third todo already done :3',
    type: 'todo',
    isDone: true,
  },
  {
    id: Date.now() + 3,
    title: 'Some cool project',
    type: 'project',
    isDone: false,
    subtodos: [
      {
        id: Date.now() + 4,
        title: 'first subtodo',
        type: 'todo',
        isDone: false,
      },
      {
        id: Date.now() + 5,
        title: 'second subtodo',
        isDone: true,
        type: 'todo',
      },
      {
        id: Date.now() + 6,
        title: 'third subtodo',
        isDone: false,
        type: 'todo',
      },
    ],
  },
]
