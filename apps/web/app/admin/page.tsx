import { redirect } from 'next/navigation'

const getAdminUrl = () => {
  return (
    process.env.NEXT_PUBLIC_LEADCMS_ADMIN_URL ||
    process.env.LEADCMS_URL ||
    'http://localhost:8080'
  )
}

export default function AdminPage() {
  const adminUrl = getAdminUrl()

  redirect(adminUrl)
}

