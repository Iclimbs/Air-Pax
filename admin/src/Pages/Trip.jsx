import React,{useState} from 'react'

const Trip = () => {
    const [buslist,setBuslist] = useState([])
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

        console.log(payload);

        // fetch(`http://localhost:4500${action}`, {
        //     method: "POST",
        //     body: JSON.stringify(payload),
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        // })
        //     .then((res) => res.json())
        //     .then((data) => {
        //         console.log(data)
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
    }

    return (
        <> <h1>Creating Trip For Users :- </h1>
            <form method={"post"}
                action={"/api/v1/bus/add"}
                className="contact"
                onSubmit={(e) => {
                    e.preventDefault();
                }}>
                <input type="text" name="from" placeholder='Please Enter Start Location of Bus' required />
                <input type="text" name="to" placeholder='Please Enter End Location of Bus' required />
                <input type="date" name="journeydate" placeholder="Please Enter Journey Date" min={new Date().toISOString().split('T')[0]} required />
                <input type="time" name="starttime" placeholder="Please Enter Journey Start Time" required />
                <input type="time" name="endtime" placeholder="Please Enter Journey End Time" required />
                <input type="text" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" placeholder='Please Enter Total Journey Time in Format 05:05' name="journeytotaltime" required />
                <input type="number" name="price" placeholder='Please Enter Ticket Price' required />
                <select name="" id="">
                    <option value=""></option>
                    <option value=""></option>
                    <option value=""></option>
                    <option value=""></option>
                    <option value=""></option>
                </select>
                <button onClick={handleSubmit}>Submit Details</button>
            </form></>
    )
}

export default Trip