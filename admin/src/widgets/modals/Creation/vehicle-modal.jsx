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



export function VehicleModal(props) {
    const handleSubmit = (e) => {
        let frm = e.target.form;
        if (!frm) return console.log("misconfigured");
        const action = frm.getAttribute("action");
        const method = frm.getAttribute("method") || "post";
        let payload = {};
        let errors = [];
        frm.querySelectorAll("[name]").forEach((fld) => {
            if (!fld.validity.valid) errors.push(fld);
            if (["checkbox", "radio"].indexOf(fld.type) === -1) {
                payload[fld.name] = fld.value;
                return;
            }
            if (fld.checked) payload[fld.name] = fld.value;
        });
        if (errors.length) {
            errors[0].focus();
            return false;
        }
        payload.name = payload.name + payload.registrationno

        fetch(`http://localhost:4500${action}`, {
            method: method,
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "success") {
                    props.handleModal()
                    toast.success(data.message)
                } else {
                    props.handleModal()
                    toast.error(data.message)
                }
            })
            .catch((err) => {
                toast.error(err.message)
            });
    }
    return (
        <>
            <Dialog size="sm" open={props.showmodal} handler={props.handleModal} className="p-4">
                <form method={props?.data.length !== 0 ? "PATCH" : "post"}
                    action={props?.data.length !== 0 ? `/api/v1/vehicle/edit/${props.data._id}` : "/api/v1/vehicle/add"}
                    className="contact"
                    autoComplete="off"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}>
                    <DialogHeader className="relative m-0 block">
                        <Typography variant="h4" color="blue-gray">
                           {props?.data.name? "Manage Vehicle" : "Add Vehicle" } 
                        </Typography>
                        <Typography className="mt-1 font-normal text-gray-600">
                            Keep your Vehicle records up-to-date and organized.
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
                        <div>
                            <frfs-text label="Name"
                                name="name"
                                required
                                editable
                                value={props?.data.name}
                            />
                        </div>
                        <div>
                            <frfs-text label="Bus Number"
                                name="busno"
                                required
                                editable
                                value={props?.data.busno}
                            />
                        </div>
                        <div>
                            <frfs-text label="Bus Registration Number"
                                name="registrationno"
                                required
                                editable
                                value={props?.data.registrationno}
                            />
                        </div>
                        <div>
                            <frfs-text label="Bus Facilities"
                                name="facilities"
                                required
                                editable
                                value={props?.data.facilities}
                            />
                        </div>
                        <div className="flex gap-4">
                            {/* Dynamic Seat Pricing OPtions */}
                            {/* <div className="w-full">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="mb-2 text-left font-medium"
                                >
                                    Upload Seat Details
                                </Typography>
                                <input type="file" name="seat" onChange={handleFileUpload} required={true} />
                            </div> */}
                            <div className="w-full">
                                <frfs-text label="Seats"
                                    name="seats"
                                    required
                                    editable
                                    value={props?.data.seats}
                                />
                            </div>
                            <div className="w-full">
                                <frfs-text label="Price"
                                    name="price"
                                    required
                                    editable
                                    value={props?.data.price}
                                />
                            </div>

                        </div>

                    </DialogBody>
                    <DialogFooter>
                        <Button className="ml-auto" onClick={handleSubmit}>
                            {props?.data.name ? "Edit Vehicle" : "Add Vehicle"}
                        </Button>
                    </DialogFooter>
                </form>

            </Dialog>
        </>
    );
}
