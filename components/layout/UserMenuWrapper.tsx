'use client'

import { SessionProvider } from 'next-auth/react'
import UserMenu from './UserMenu'

export default function UserMenuWrapper() {
  return (
    <SessionProvider>
      <UserMenu />
    </SessionProvider>
  )
}
