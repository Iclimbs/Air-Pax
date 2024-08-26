import React, { useState } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

import { useRef } from 'react'

const center = { lat: 48.8584, lng: 2.2945 }

const Trip = () => {

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyAdlbp-63zIbSeMqFSRFmA3Fe_LsjAbEyE"
      })

    const [map, setMap] = useState(null)
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')

    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef()
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destiantionRef = useRef()

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

    async function calculateRoute() {
        if (originRef.current.value === '' || destiantionRef.current.value === '') {
            return
        }
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService()
        const results = await directionsService.route({
            origin: originRef.current.value,
            destination: destiantionRef.current.value,
            // eslint-disable-next-line no-undef
            travelMode: google.maps.TravelMode.DRIVING,
        })
        setDirectionsResponse(results)
        setDistance(results.routes[0].legs[0].distance.text)
        setDuration(results.routes[0].legs[0].duration.text)
    }

    function clearRoute() {
        setDirectionsResponse(null)
        setDistance('')
        setDuration('')
        originRef.current.value = ''
        destiantionRef.current.value = ''
    }

    return (
        <> <h1>Creating Trip For Users :- </h1>
            <div className='flex'>
                <form method={"post"}
                    action={"/api/v1/trip/add"}
                    className="contact"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}>
                    <frfs-text label='Name' name='name' required editable />
                    <frfs-select label="Start From"
                        name="from"
                        api='http://localhost:4500/api/v1/counter/listall'
                        required
                        editable />
                    <frfs-select label="End To"
                        name="to"
                        api='http://localhost:4500/api/v1/counter/listall'
                        required
                        editable />
                    <frfs-select label="Vehicle Name"
                        name="busid"
                        api='http://localhost:4500/api/v1/vehicle/listall'
                        required
                        editable />
                    <div className='flex flex-col'>
                        <label htmlFor="">Journey Start Date</label>
                        <input type="date" name="journeystartdate" min={new Date().toISOString().split('T')[0]} required />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="">Journey End Date</label>
                        <input type="date" name="journeyenddate" min={new Date().toISOString().split('T')[0]} required />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="">Journey Start Time</label>
                        <input type="time" name="starttime" required />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="">Journey End Time</label>
                        <input type="time" name="endtime" required />

                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="">Total Journey Time Format : 05:05 </label>
                        <input type="text" pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" name="journeytotaltime" required />
                    </div>

                    <div className='flex flex-col'>
                        <input type="number" name="price" placeholder='Please Enter Ticket Price' required />

                    </div>


                    <button onClick={handleSubmit}>Submit Details</button>
                </form>
            </div>
            <div>
                <GoogleMap
                    center={center}
                    zoom={15}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    options={{
                        zoomControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                    // onLoad={map => setMap(map)}
                >
                    {/* <Marker position={center} />
                    {directionsResponse && (
                        <DirectionsRenderer directions={directionsResponse} />
                    )} */}
                </GoogleMap>
            </div>
        </>
    )
}

export default Trip