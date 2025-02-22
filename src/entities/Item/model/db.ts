import type { Item } from '../types/item'

export const db: Item[] = [
  {
    id: Date.now(),
    title: 'Добавить настройки',
    type: 'todo',
    isDone: false,
  },
  {
    id: Date.now() + 1,
    title: 'Валидировать ошибки по приложению',
    type: 'todo',
    isDone: false,
  },
  {
    id: Date.now() + 2,
    title: 'Добавить хоткеи',
    type: 'todo',
    isDone: false,
  },
  {
    id: Date.now() + 3,
    title: 'Очень крутой проект',
    type: 'project',
    isDone: false,
    subtodos: [
      {
        id: Date.now() + 4,
        title: 'first subitem, this is todo',
        isDone: false,
        type: 'todo',
      },
      {
        id: Date.now() + 5,
        title: 'second subitem, todo too',
        isDone: true,
        type: 'todo',
      },
      {
        id: Date.now() + 6,
        title: 'third subitem but this is note',
        type: 'note',
      },
    ],
  },
  {
    id: Date.now() + 7,
    title: 'Затемнить цвет чекбоксов',
    type: 'note',
  },
  {
    id: Date.now() + 8,
    title: 'Подобрать цвета для типов, сделать рамку',
    type: 'note',
  },
  {
    id: Date.now() + 9,
    title: 'Сделать карандаш видимым',
    type: 'note',
  },
]
