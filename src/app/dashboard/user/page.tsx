import { UserForm } from "./user-form"

const UserPage = () => {
    return (
        <div className="h-full w-full  mx-auto md:px-4 pl-[64px] md:pl-0 md:max-w-[70%] lg:max-w-[50%] lg:ml-[402px] md:ml-[256px] md:mr-[256px]">
          <div className="flex flex-col">
            {/* Main Content Area */} 
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">User Details</h2>
                <div className="space-y-4 w-full mx-auto ">
                  <UserForm />
                </div>
            
            </div>
          </div>
        </div>
    )
}   

export default UserPage;
