import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

export function AppDevtools() {
  if (!import.meta.env.DEV) {
    return null
  }

  return (
    <TanStackDevtools
      config={{
        position: 'bottom-right',
      }}
      plugins={[
        {
          name: 'TanStack Router',
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />
  )
}
