import TasksPage from '@/components/pages/TasksPage'
import ArchivePage from '@/components/pages/ArchivePage'

export const routes = {
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: TasksPage
  },
  archive: {
    id: 'archive',
    label: 'Archive',
    path: '/archive',
    icon: 'Archive',
    component: ArchivePage
  }
}

export const routeArray = Object.values(routes)