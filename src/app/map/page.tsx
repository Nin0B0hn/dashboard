// eslint-disable-next-line @typescript-eslint/no-unused-vars

"use client"

// import { LoginForm } from "@/components/login-form"
// import { AppSidebar } from "@/components/app-sidebar"
// import FloatingActionBar from "@/components/menus/floating-actionbar"
import Map from '@/components/map/map';
import GeorefCommentPicker from '@/components/georef-comment-picker';





export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      {/* <LoginForm /> */}
      <GeorefCommentPicker />
      {/* <MapMenu /> */}
      <Map />
      {/* <AppSidebar />  */}
      {/* <FloatingActionBar
        onRun={() => console.log("Run clicked")}
        onLaugh={() => console.log("Laugh clicked")}
        onMute={() => console.log("Mute clicked")}
        onSound={() => console.log("Sound clicked")}
        onStar={() => console.log("Star clicked")}
      /> */}
    </div>
  )
}
