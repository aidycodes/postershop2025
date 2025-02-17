import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import DeleteComponent from "./delete-component"
import { UserSession } from "@/app/layout"
const SettingsPage = async () => {

    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) {
      redirect('/sign-in')
        
    }

    return (
        <div className="h-full w-full h-screen mx-auto md:px-4 pl-[64px] md:pl-0 md:max-w-[70%] lg:max-w-[50%] lg:ml-[402px] md:ml-[256px] md:mr-[256px] flex items-center justify-center">
        <div className="flex flex-col h-full md:h-auto justify-center items-center  flex-1 w-full -mt-20 md:-mt-90">
          {/* Main Content Area */} 
            <div className="bg-white  rounded-lg shadow-md p-6 flex-1 w-full my-10">
              <h2 className="text-2xl font-bold  mb-4">Settings</h2>
                <DeleteComponent session={session.user as UserSession} />
          
          </div>
        </div>
      </div>
    )
}   

export default SettingsPage;
