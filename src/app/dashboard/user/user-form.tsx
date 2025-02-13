'use client'
import { useForm, SubmitHandler } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"



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

export const UserForm = () => {

    const { mutate: updateUser, isPending } = useMutation({
        mutationFn: async (data: UserForm) => {
           const res = await client.users.updateUser.$post(data)
           console.log(res)
           return res.json()
        },
        onSuccess: (data) => {
            console.log(data)
        },
        onError: (error) => {
            console.log({error})
        }
    })
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<UserForm>({
        resolver: zodResolver(USER_VALIDATOR),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            city: "",
            country: "",
            postal_code: "ss",
            address: "",
        },
        mode: "onBlur"
    })
    const onSubmit: SubmitHandler<UserForm> = (data) => {
        console.log({data})
       updateUser(data)
    }

    return (
        <div className="mb-2">
            <div className="overflow-hidden">
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
    )
}   
