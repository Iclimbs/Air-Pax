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


export function OutletModal(props) {
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
    }
    return (
        <>
            <Dialog size="sm" open={props.showmodal} handler={props.handleModal} className="p-4">
                <form method={props?.data.length!==0 ? "PATCH" : "post"}
                    action={props?.data.length!==0 ? `/api/v1/counter/edit/${props.data._id}` : "/api/v1/counter/add"}
                    className="contact"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}>
                    <DialogHeader className="relative m-0 block">
                        <Typography variant="h4" color="blue-gray">
                            Manage Counter
                        </Typography>
                        <Typography className="mt-1 font-normal text-gray-600">
                            Keep your Counter records up-to-date and organized.
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
                            <frfs-text label="City"
                                name="city"
                                required
                                editable
                                value={props?.data.city}
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="w-full">
                                <frfs-text label="Location"
                                    name="location"
                                    required
                                    editable
                                    value={props?.data.location}
                                />

                            </div>
                            <div className="w-full">

                                <frfs-tel label="Mobile"
                                    name="phoneno"
                                    cn='in'
                                    required
                                    editable
                                    value={props?.data.phoneno}
                                />
                            </div>
                        </div>

                    </DialogBody>
                    <DialogFooter>
                        <Button className="ml-auto" onClick={handleSubmit}>
                            {props?.data ? "Add Counter" : "Edit Counter"}
                        </Button>
                    </DialogFooter>
                </form>

            </Dialog>
        </>
    );
}
