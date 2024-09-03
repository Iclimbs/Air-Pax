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



export function TripModal(props) {
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
                if (data.status === "success") {
                    props.handleModal()
                    toast.success(data.message)
                } else {
                    props.handleModal()
                    toast.success(data.message)
                }
            })
            .catch((err) => {
                toast.success(data.message)
            });
    }
    return (
        <>
            <Dialog size="sm" open={props.showmodal} handler={props.handleModal} className="p-4">
                <form method={props?.data.length !== 0 ? "PATCH" : "post"}
                    action={props?.data.length !== 0 ? `/api/v1/trip/edit/${props.data._id}` : "/api/v1/trip/add"}
                    className="contact"
                    autoComplete="off"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}>
                    <DialogHeader className="relative m-0 block">
                        <Typography variant="h4" color="blue-gray">
                            Manage Trips
                        </Typography>
                        <Typography className="mt-1 font-normal text-gray-600">
                            Keep your Trip records up-to-date and organized.
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
                        <div className="flex gap-4">
                            <div className="w-full">
                                <frfs-select label="From"
                                    api={props?.data.from ? `http://localhost:4500/api/v1/counter/search/${props?.data.from}` : `http://localhost:4500/api/v1/counter/listall`}
                                    name="from"
                                    required
                                    editable
                                    value={props?.data.from}
                                />
                            </div>
                            <div className="w-full">
                                <frfs-select label="To"
                                    api={props?.data.to ? `http://localhost:4500/api/v1/counter/search/${props?.data.to}` : `http://localhost:4500/api/v1/counter/listall`}
                                    name="to"
                                    required
                                    editable
                                    value={props?.data.to}
                                />
                            </div>
                        </div>
                        <div>
                            <frfs-select label="Vehicle Name"
                                name="busid"
                                api={props?.data.busid ? `http://localhost:4500/api/v1/vehicle/search/${props?.data.busid}` : `http://localhost:4500/api/v1/vehicle/listall`}
                                required
                                editable
                                value={props?.data.busid}
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="w-full">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="mb-2 text-left font-medium"
                                >
                                    Journey Start Date
                                </Typography>
                                <input type="date" name="journeystartdate" min={new Date().toISOString().split('T')[0]} value={props?.data.journeystartdate} required />
                            </div>
                            <div className="w-full">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="mb-2 text-left font-medium"
                                >
                                    Journey End Date
                                </Typography>
                                <input type="date" name="journeyenddate" min={new Date().toISOString().split('T')[0]} value={props?.data.journeyenddate} required />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-full">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="mb-2 text-left font-medium"
                                >
                                    Journey Start Time
                                </Typography>
                                <input type="time" name="starttime" value={props?.data.starttime} required />
                            </div>
                            <div className="w-full">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="mb-2 text-left font-medium"
                                >
                                    Journey End Time
                                </Typography>
                                <input type="time" name="endtime" value={props?.data.endtime} required />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-full">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="mb-2 text-left font-medium"
                                >
                                    Journey Total Time
                                </Typography>
                                <input type="text" pattern="[0-9][0-9]:[0-5][0-9]" name="totaltime" value={props?.data.totaltime} required />
                            </div>

                            <div className="w-full">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="mb-2 text-left font-medium"
                                >
                                    Ticket Prices Per Seat
                                </Typography>
                                <input type="number" name="price" value={props?.data.price} required />
                            </div>

                        </div>
                        <div className="flex gap-4">

                            <div className="w-full">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="mb-2 text-left font-medium"
                                >
                                    Total Distance
                                </Typography>
                                <input type="number" name="distance" value={props?.data.distance} required />
                            </div>
                            <div className="w-full">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="mb-2 text-left font-medium"
                                >
                                    Total Seats
                                </Typography>
                                <input type="number" name="totalseats" value={props?.data.totalseats} required />
                            </div>
                        </div>

                    </DialogBody>
                    <DialogFooter>
                        <Button className="ml-auto" onClick={handleSubmit}>
                            {props?.data ? "Add Trip" : "Edit Trip"}
                        </Button>
                    </DialogFooter>
                </form>

            </Dialog>
        </>
    );
}
