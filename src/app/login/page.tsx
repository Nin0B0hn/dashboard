// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { LoginForm } from "@/components/login-form"
import { AppSidebar } from "@/components/app-sidebar_OLD"


export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
      <AppSidebar />
    </div>
  )
}
