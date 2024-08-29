import React from "react";
import {
    Button,
    Dialog,
    IconButton,
    Typography,
    DialogHeader,
    DialogFooter,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";



const ConfirmModal = (props) => {
    const handleSubmit = () => {
        fetch(`http://localhost:4500${props.endpoint}${props.data._id}`, {
            method: "PATCH",
            body: JSON.stringify(props.data),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status==="success") {
                    props.toggleConfirmModal()
                    toast.success(data.message)
                } else {
                    props.toggleConfirmModal()
                    toast.success(data.message)
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    return (
        <>

            <Dialog size="sm" open={props.showmodal} handler={props.toggleConfirmModal} className="p-4">
                <DialogHeader className="relative m-0 block">
                    <Typography variant="h4" color="blue-gray">
                        Confirmation Alert!
                    </Typography>
                    <Typography className="mt-1 font-normal text-gray-600">
                        Are you sure to disable this counter?
                    </Typography>
                    <IconButton
                        size="sm"
                        variant="text"
                        className="!absolute right-3.5 top-3.5"
                        onClick={props.toggleConfirmModal}
                    >
                        <XMarkIcon className="h-4 w-4 stroke-2" />
                    </IconButton>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex gap-4">
                        <Button className="ml-auto" onClick={() => { props.toggleConfirmModal }}>
                            No
                        </Button>
                        <Button className="ml-auto" onClick={handleSubmit}>
                            Yes
                        </Button>
                    </div>

                </DialogFooter>
            </Dialog>
        </>
    )
}

export default ConfirmModal
