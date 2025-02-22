'use client'
import { useState } from "react"
import { UserSession } from "@/app/layout"
import { authClient } from "@/lib/auth-client"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
const DeleteComponent = ({session}: {session: UserSession}) => {

    const [deleteCheck, setDeleteCheck] = useState('')
    const [error, setError] = useState('')
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient()
    const router = useRouter()

    const handleDelete = async() => {
          if (deleteCheck === session.email) {    // Perform delete operation
            try{ 
                setIsLoading(true);
                const response = await authClient.deleteUser()
                    setIsOpen(false);
                    queryClient.invalidateQueries({ queryKey: ['cart'] })
                    queryClient.invalidateQueries({ queryKey: ['orders'] })
                    queryClient.setQueryData(['user'] , null)
                    router.push('/')
            } catch (error) {
                setError('Failed to delete account');
                setIsLoading(false);
            }
            } else {
                setError('Please enter your email to confirm deletion');
                setIsLoading(false);
            }
        
      };
    
      return (  <div className="w-full">
        {/* Main Delete Button and Warning */}
        <div className="space-y-4 w-full mx-auto">
          <span className="text-red-500 block">
            Warning: This action is irreversible and will delete your account and all associated data.
          </span>
          <button 
            disabled={isLoading}
            onClick={() => setIsOpen(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-md w-full cursor-pointer hover:bg-red-600"
          >
           {isLoading ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
  
        {/* Confirmation UI - Modal on desktop, inline on mobile */}
        {isOpen && (
          <>
            {/* Desktop Modal - hidden on mobile (below sm breakpoint) */}
            <div className="hidden sm:flex fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Confirm Account Deletion</h3>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                
                <p className="text-gray-600">
                  Please type your email <span className="font-medium">{session.email}</span> to confirm deletion.
                </p>
                
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
                
                <input
                  type="text"
                  value={deleteCheck}
                  onChange={(e) => setDeleteCheck(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setError('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isLoading}
                    onClick={() => {
                      handleDelete()
                        .then((message) => {
                          console.log(message);
                        })
                        .catch((errorMessage) => {
                          setError(errorMessage);
                        });
                    }}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
                  >
                    {isLoading ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </div>
            </div>
  
            {/* Mobile Inline Version - shown only on mobile (below sm breakpoint) */}
            <div className="sm:hidden mt-4 border-t border-gray-200 pt-4 space-y-4">
              <h3 className="text-lg font-semibold">Confirm Account Deletion</h3>
              
              <p className="text-gray-600">
                Please type your email <span className="font-medium">{session.email}</span> to confirm deletion.
              </p>
              
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              
              <input
                type="text"
                value={deleteCheck}
                onChange={(e) => setDeleteCheck(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 "
              />
              
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    handleDelete()
                      .then((message) => {
                        console.log(message);
                      })
                      .catch((errorMessage) => {
                        setError(errorMessage);
                      });
                  }}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
                >
                  Confirm Deletion
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setError('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

export default DeleteComponent;
