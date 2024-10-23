import React from "react";
import {
    Button,
    Dialog,
    IconButton,
    Typography,
    DialogBody,
    DialogHeader,
    DialogFooter,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
 
// Define Zod schema for form validation
const schema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    price: z.string().refine((value) => !isNaN(Number(value)), {
        message: "Price must be a positive number",
      }),
    available: z.boolean({ message: "Availability must be a boolean" })
});
 
export function OutletModal(props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });
 
    const onSubmit = (data) => {
        // Convert string inputs to the expected types before validation
        const formData = {
            ...data,
            price: parseFloat(data.price), // Convert price to number
            available: data.available === "true" || data.available === true // Convert available to boolean
        };
  
        // Your API call logic here
        fetch(`http://localhost:4500${action}`, {
            method: method,
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status==="success") {
                    props.handleModal()
                    toast.success(data.message)
                } else {
                    props.handleModal()
                    toast.success(data.message)
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
 
    return (
        <Dialog size="sm" open={props.showmodal} handler={props.handleModal} className="p-4">
            <form className="flex flex-col mt-4" onSubmit={handleSubmit(onSubmit)}>
                <DialogHeader className="relative m-0 block">
                    <Typography variant="h4" color="blue-gray">
                        Manage Food
                    </Typography>
                    <IconButton
                        size="sm"
                        variant="text"
                        className="!absolute right-3.5 top-3.5"
                        onClick={props.handleModal}
                    >
                        <XMarkIcon className="h-4 w-4 stroke-2" />
                    </IconButton>
                </DialogHeader>
                <DialogBody className="space-y-4 pb-6">
                    <div className="mb-6">
                        <label className="block text-black font-semibold mb-2" htmlFor="name">
                            Food Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("name")}
                            type="text"
                            id="name"
                            className="text-black w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter food name"
                        />
                        {errors.name && (
                            <p className="text-red-500">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-black font-semibold" htmlFor="price">
                            Price <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("price")}
                            type="number" // Keep it as text, we'll convert to number in onSubmit
                            id="price"
                            className="text-black w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter food price"
                        />
                        {errors.price && (
                            <p className="text-red-500">{errors.price.message}</p>
                        )}
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-black font-semibold" htmlFor="available">
                            Available <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register("available")}
                            id="available"
                            className="text-black w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                        {errors.available && (
                            <p className="text-red-500">{errors.available.message}</p>
                        )}
                    </div>
                    <button
                        className="text-white p-3 bg-gray-900 rounded-lg shadow-lg hover:bg-primary-dark transition"
                        type="submit"
                    >
                        Add Food
                    </button>
                </DialogBody>
            </form>
        </Dialog>
    );
}