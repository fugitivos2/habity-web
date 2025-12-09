'use client'

import dynamic from 'next/dynamic'

// Importar UserMenu con SSR deshabilitado para asegurar client-side rendering
const UserMenu = dynamic(() => import('./UserMenu'), {
  ssr: false,
  loading: () => (
    <div className="h-10 w-10 rounded-full bg-gray-300 animate-pulse"></div>
  ),
})

export default function ClientUserMenu() {
  return <UserMenu />
}
