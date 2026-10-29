import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    // Fetch a route's chunk and loader on hover/focus so the click renders immediately
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    // Every navigation runs inside document.startViewTransition: the page cross-fades and
    // elements sharing a view-transition-name (project thumbnails) morph between pages
    defaultViewTransition: true,
  })

  return router
}
