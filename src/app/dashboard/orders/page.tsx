import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import OrdersTable from "./ordersTable"

const Orders = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) {
      redirect('/sign-in')
        
    }
    return (
        <div className="min-h-screen w-full  mx-auto md:px-4 pl-[64px] md:pl-0 md:max-w-[70%] lg:max-w-[50%] lg:ml-[402px] md:ml-[256px] md:mr-[256px]">
        <div className="flex flex-col">
          {/* Main Content Area */} 
            <div className="bg-white rounded-lg shadow-md mb-2 md:p-6">
              <h2 className="text-2xl font-bold p-2 md:p-0 md:mb-4">Orders</h2>
              <div className="space-y-4 w-full mx-auto ">
                <OrdersTable />
              </div>
          
          </div>
        </div>
      </div>
    )
}   

export default Orders
