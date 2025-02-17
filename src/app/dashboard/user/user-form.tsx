'use client'
import { useForm, SubmitHandler } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const USER_VALIDATOR = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string(),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    postal_code: z.string().min(1, "Postal code is required"),
    address: z.string().min(1, "Address is required"),
})

type UserForm = z.infer<typeof USER_VALIDATOR>

export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    phone: string | null;
    city: string | null;
    country: string | null;
    postal_code: string | null;
    address: string | null;
    createdAt: string;
    updatedAt: string
}
export const UserForm = () => {
    const [showToast, setShowToast] = useState(false)
    const queryClient = useQueryClient()
    const { data, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const res = await client.users.me.$get()
            return res.json()
        },
        
    })

    const { mutate: updateUser, isPending } = useMutation({
        mutationFn: async (data: UserForm) => {
           const res = await client.users.updateUser.$post(data)  
           return res.json()
        },
        onSuccess: async(data) => {
            await queryClient.invalidateQueries({ queryKey: ['user'] })
            setShowToast(true)
        },
        onError: (error) => {
            console.log({error})
        }
    })
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<UserForm>({
        resolver: zodResolver(USER_VALIDATOR),
        defaultValues: {
            name: data?.name ?? "",
            email: data?.email ?? "",
            phone: data?.phone ?? "",
            city: data?.city ?? "",
            country: data?.country ?? "",
            postal_code: data?.postal_code ?? "",
            address: data?.address ?? "",
        },
        mode: "onBlur"
    })
    const onSubmit: SubmitHandler<UserForm> = (data) => {
       updateUser(data)
    }

    useEffect(() => {
        if (showToast) {
            setTimeout(() => {
                setShowToast(false)
            }, 3000)
        }
    }, [showToast])
    return (
        <>
            <Toast message="User updated successfully" show={showToast} onClose={() => {}} classNames="bg-green-600/80 shadow-xl border border-green-400 " position="p-6 top-0 right-0 z-50" />
        <div className="mb-2 relative">
            <div className="overflow-hidden relative">
            <form className="flex flex-col  gap-1 " onSubmit={handleSubmit(onSubmit)}>
                <div className="p-2">
                    <div className="flex flex-col gap-2 ">
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <input className=" border  border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        {...register("name")}
                        />
                    <div className="h-1 -mt-3">
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                </div>
                </div>
                <div className="p-2">
                    <div className="flex flex-col gap-2 ">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <input className=" border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        {...register("email")}
                        />
                    <div className="h-1 -mt-3">
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                </div>
                </div>
                <div className="p-2">
                    <div className="flex flex-col gap-2 ">
                        <label htmlFor="address" className="text-sm font-medium">Address</label>
                        <input className=" border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        {...register("address")}
                        />
                    <div className="h-1 -mt-3">
                        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                    </div>
                </div>
                </div>
                <div className="p-2">
                    <div className="flex flex-col gap-2 ">
                        <label htmlFor="city" className="text-sm font-medium">City</label>
                        <input className=" border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        {...register("city")}
                        />
                    <div className="h-1 -mt-3">
                        {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                    </div>
                </div>
                </div>
                <div className="p-2">
                    <div className="flex flex-col gap-2 ">
                        <label htmlFor="country" className="text-sm font-medium">Country</label>
                        <input className=" border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        {...register("country")}
                        />
                    <div className="h-1 -mt-3">
                        {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
                    </div>
                </div>
                </div>
                <div className="p-2">
                    <div className="flex flex-col gap-2 ">
                        <label htmlFor="postal_code" className="text-sm font-medium">Postal Code</label>
                        <input className=" border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        {...register("postal_code")}
                        />
                    <div className="h-1 -mt-3">
                        {errors.postal_code && <p className="text-red-500 text-sm">{errors.postal_code.message}</p>}
                    </div>
                </div>
                </div>
                <div className="p-2 mb-6">
                    <div className="flex flex-col gap-2 ">
                        <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                        <input className=" border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        {...register("phone")}
                        />
                    <div className="h-1 -mt-3">
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>
                </div>
                </div>
             
                <button disabled={isPending} type="submit" className={`bg-blue-500 text-white rounded-md cursor-pointer p-2 flex-1 w-full ${isPending ? "opacity-50 cursor-default" : ""}`}>
                    {isPending ? "Updating..." : "Update"}
                </button>
            </form>
            </div>
        </div>
        </>
    )
}

interface ToastProps {
    message: string
    show: boolean
    onClose: () => void
    classNames?: string
    position?: string
}

const Toast = ({ message, show, onClose, position, classNames }: ToastProps) => {
    return (
      <div className={cn(`absolute bottom-4 right-4 transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} pointer-events-none`, position)}>
        <div className={cn(`bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-4 pointer-events-auto`, classNames)}>
          <span>{message}</span>
          <button 
            onClick={onClose}
            className="hover:bg-gray-700 rounded-full p-1"
          >
        
          </button>
        </div>
      </div>
    );
  };
