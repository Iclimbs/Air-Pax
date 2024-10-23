import React from "react";
import {
    Button,
    Dialog,
    IconButton,
    Typography,
    DialogHeader,
    DialogFooter,
    DialogBody
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";



const FoodModal = (props) => {
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
            method:method,
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
                    toast.success(data.message)
                }
            })
            .catch((err) => {
                toast.error(err.message)
            })
    }
    return (
        <>

            <Dialog size="sm" open={props.showmodal} handler={props.handleModal} className="p-4">
                <form method={props?.data.length !== 0 ? "PATCH" : "post"}
                    action={props?.data.length !== 0 ? `/api/v1/food/edit/${props.data._id}` : "/api/v1/food/add"}
                    className="food"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}>
                    <DialogHeader className="relative m-0 block">
                        {props.data._id ?
                            <Typography variant="h4" color="blue-gray">
                                Manage Food Item
                            </Typography>

                            : <Typography variant="h4" color="blue-gray">
                                Add Food Item
                            </Typography>
                        }

                        <Typography className="mt-1 font-normal text-gray-600">
                            Keep your Food Detail's Upto Date.
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
                            <frfs-text label="Price"
                                name="price"
                                required
                                editable
                                value={props?.data.price}
                            />
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button className="ml-auto" onClick={handleSubmit}>
                            {props?.data.name ? "Edit Food Item" :"Add Food Item"}
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </>
    )
}

export default FoodModal
