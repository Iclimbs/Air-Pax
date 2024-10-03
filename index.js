// let pddata = ''
// let ccavResponse = 'order_id=123654789&tracking_id=313012099229&bank_ref_no=null&order_status=Failure&failure_message=&payment_mode=Wallet&card_name=Avenues Test for New TC&status_code=null&status_message=&currency=INR&amount=6140.89&billing_name=Charli&billing_address=Room no 1101, near Railway station Ambad&billing_city=Indore&billing_state=MH&billing_zip=425001&billing_country=India&billing_tel=9896226054&billing_email=test@gmail.com&delivery_name=Chaplin&delivery_address=room no.701 near bus stand&delivery_city=Hyderabad&delivery_state=Andhra&delivery_zip=425001&delivery_country=India&delivery_tel=9896226054&merchant_param1=additional Info&merchant_param2=additional Info&merchant_param3=additional Info&merchant_param4=additional Info&merchant_param5=additional Info&vault=N&offer_type=null&offer_code=null&discount_value=0.0&mer_amount=6000.00&eci_value=null&retry=N&response_code=&billing_notes=&trans_date=03/10/2024 18:00:19&bin_country=&auth_ref_num=&trans_fee=119.4&service_tax=21.49';
// pData = '<table border=1 cellspacing=2 cellpadding=2><tr><td>'
// // console.log("pddata 1",pData);
// pData = pData + ccavResponse.replace(/=/gi, '</td><td>')
// console.log("pddata 2",pData);

// pData = pData.replace(/&/gi, '</td></tr><tr><td>')

// // console.log("pddata 3",pData);

// pData = pData + '</td></tr></table>'

// // console.log("pddata 4",pData);


// let pddata = '';
// let ccavResponse = 'order_id=123654789&tracking_id=313012099229&bank_ref_no=null&order_status=Failure&failure_message=&payment_mode=Wallet&card_name=Avenues Test for New TC&status_code=null&status_message=&currency=INR&amount=6140.89&billing_name=Charli&billing_address=Room no 1101, near Railway station Ambad&billing_city=Indore&billing_state=MH&billing_zip=425001&billing_country=India&billing_tel=9896226054&billing_email=test@gmail.com&delivery_name=Chaplin&delivery_address=room no.701 near bus stand&delivery_city=Hyderabad&delivery_state=Andhra&delivery_zip=425001&delivery_country=India&delivery_tel=9896226054&merchant_param1=additional Info&merchant_param2=additional Info&merchant_param3=additional Info&merchant_param4=additional Info&merchant_param5=additional Info&vault=N&offer_type=null&offer_code=null&discount_value=0.0&mer_amount=6000.00&eci_value=null&retry=N&response_code=&billing_notes=&trans_date=03/10/2024 18:00:19&bin_country=&auth_ref_num=&trans_fee=119.4&service_tax=21.49';
// let pData = '<table border=1 cellspacing=2 cellpadding=2><tr><td>';
// let idCounter = 1;  // Initialize an id counter

// pData = pData + ccavResponse.replace(/=/gi, `</td><td id="cell-${++idCounter}">`);
// pData = pData.replace(/&/gi, `</td></tr><tr><td id="cell-${++idCounter}">`);

// pData = pData + '</td></tr></table>';

// console.log("pddata 4",pData);




let pddata = '';
let ccavResponse = 'order_id=123654789&tracking_id=313012099229&bank_ref_no=null&order_status=Failure&failure_message=&payment_mode=Wallet&card_name=Avenues Test for New TC&status_code=null&status_message=&currency=INR&amount=6140.89&billing_name=Charli&billing_address=Room no 1101, near Railway station Ambad&billing_city=Indore&billing_state=MH&billing_zip=425001&billing_country=India&billing_tel=9896226054&billing_email=test@gmail.com&delivery_name=Chaplin&delivery_address=room no.701 near bus stand&delivery_city=Hyderabad&delivery_state=Andhra&delivery_zip=425001&delivery_country=India&delivery_tel=9896226054&merchant_param1=additional Info&merchant_param2=additional Info&merchant_param3=additional Info&merchant_param4=additional Info&merchant_param5=additional Info&vault=N&offer_type=null&offer_code=null&discount_value=0.0&mer_amount=6000.00&eci_value=null&retry=N&response_code=&billing_notes=&trans_date=03/10/2024 18:00:19&bin_country=&auth_ref_num=&trans_fee=119.4&service_tax=21.49';

let pData = '<table border=1 cellspacing=2 cellpadding=2><tr><td>';
let idCounter = 1;  // Initialize an id counter

pData = pData + ccavResponse.replace(/=/gi, function() {
    return `</td><td id="cell-${idCounter}" data-unique-code="CODE-${idCounter++}">`;
});

pData = pData.replace(/&/gi, function() {
    return `</td></tr><tr><td id="cell-${idCounter}" data-unique-code="CODE-${idCounter++}">`;
});

pData = pData + '</td></tr></table>';

let pnr = document.getElementById("cell-1")

console.log(pnr.innerText);
