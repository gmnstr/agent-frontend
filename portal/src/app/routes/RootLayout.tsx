import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { AppShell } from '../../components/layout/AppShell'

export type RootOutletContext = {
  setToolbar: (content: ReactNode) => void
}

export const RootLayout = () => {
  const [toolbar, setToolbar] = useState<ReactNode>(null)

  const handleSetToolbar = useCallback((content: ReactNode) => {
    setToolbar(content)
  }, [])

  return (
    <AppShell toolbarContent={toolbar}>
      <Outlet context={{ setToolbar: handleSetToolbar }} />
    </AppShell>
  )
}
