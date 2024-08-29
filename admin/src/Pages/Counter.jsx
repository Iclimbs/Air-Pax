import React from 'react'

const Counter = () => {
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
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            <div>
                <h1>Counter Adding Form </h1>
                <form method={"post"}
                    action={"/api/v1/counter/add"}
                    className="contact"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}>
                    <frfs-text label="Name"
                        name="name"
                        required
                        editable />
                    <frfs-text label="City"
                        name="city"
                        required
                        editable />
                    <frfs-text label="Location"
                        name="location"
                        required
                        editable />
                    <frfs-tel label="Mobile"
                        name="phoneno"
                        cn='in'
                        required
                        editable />
                    <button onClick={handleSubmit}>Submit Details</button>
                </form>
            </div>
        </>
    )
}

export default Counter