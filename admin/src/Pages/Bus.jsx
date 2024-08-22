import React, { useState } from 'react'
import Papa from "papaparse"
const Bus = () => {
  const [seat, setSeat] = useState("")
  
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
    payload.seat = seat
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    Papa.parse(file, {
      header: true,
      skipEmptyLines: false,
      complete: (results) => {
        setSeat(results.data)
      }
    })
  }

  return (
    <>
      <div>
        <h1>Bus Adding Form </h1>
        <form method={"post"}
          action={"/api/v1/bus/add"}
          className="contact"
          onSubmit={(e) => {
            e.preventDefault();
          }}>
          <frfs-text label="Enter Bus Name"
            name="busname"
            placeholder="Please Enter Bus  Name"
            required
            editable />
          <frfs-text label="Enter Bus Number"
            name="busno"
            placeholder="Please Enter Bus Number"
            required
            editable />
          <frfs-text label="Enter Bus Registration Number"
            name="registrationno"
            placeholder="Please Enter Bus Registration Number"
            required
            editable />
          <frfs-text label="Enter Bus Facilities"
            name="facilities"
            placeholder="Please Enter List of All the Facilities"
            required
            editable />
          <input type="file" name="seat" placeholder='Enter Bus Seat Details' onChange={handleFileUpload} required={true} />
          <button onClick={handleSubmit}>Submit Details</button>
        </form>
      </div>
    </>
  )
}

export default Bus