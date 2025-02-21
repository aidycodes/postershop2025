import UserSidebar from "./user-sidebar";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Poster Hub - Dashboard",
  description: "Poster Hub is a platform for buying posters",
  icons: [{ rel: "icon", url: "/favicon.webp" }],
}
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

  

  return (
    <div className="flex h-min-screen bg-gray-100 overflow-hidden relative">
      <UserSidebar />
      <div className=" md:w-[0%] lg:w-[8%] bg-black bg-black hidden md:block top-0 right-0 h-full bg-transparent"/>
      {/* Main Content */}
      {/*no mouse on the overflow*/}
      <div className="flex-1  relative min-w-0">
        <main className="md:p-6 mx-auto ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;