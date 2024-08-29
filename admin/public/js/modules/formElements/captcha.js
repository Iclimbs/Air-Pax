import formElements from "./formElements.js";
export default class captcha extends formElements {
    images=[
        "Car",
        "Fireworks",
        "Flowers",
        "Hills",
        "Night Sky",
        "Sunset"
    ]
    attributes={};
    static get observedAttributes() {
        return ["path"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.attributes[name]=newValue;
    }
    randomize(){
        let img=[...this.images];
        let final=[];
        while(img.length){
            final.push(img.splice(Math.floor(Math.random()*img.length),1)[0]);
        }
        return final;
    }
    connectedCallback() {
        this.render();
    }
    stylesheet(){
        let temp=super.stylesheet();
        temp+=`<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossorigin="anonymous" referrerpolicy="no-referrer" as="style" onload="this.onload=null;this.rel='stylesheet'" />`
        return temp;
    }
    render() {
        let que=this.images[Math.floor(Math.random()*this.images.length)];
        let imglist=this.randomize();
        let path=this.attributes['path']||"/captcha/";
        this.shadowRoot.innerHTML = `
        
        ${this.stylesheet()}
        <div class=captcha>
        <div><i class="fa-regular fa-circle"></i> I am not a robot</div>
        </div>
        <div class=popup>
        <span>Which of the following is a picture of a ${que}?</span>
        <div class='images'>${
            imglist.map((img,i)=>`
                <label>
                    <input type="radio" name="captcha" value="${img==que}">
                    <img src="${path}${img.toLowerCase().replace(" ","")}.png" alt="${img}">
                </label>`).join("")
        }
        </div>
        <div class=error></div>
        </div>
        `;
        this.setupEvents();
        // this.shadowRoot.querySelectorAll("label").forEach(label=>{
        //     label.addEventListener("click",e=>{
        //     if(e.target.tagName=="IMG")return;
        //     this.setAttribute("value",e.target.value);
        //     this.dispatchEvent(new CustomEvent("change",{
        //         detail:{
        //             value: e.target.value
        //         }
        //     }))
        // })
    // })
    }
    style(){
        return `
        span{
            font-size: 15px;
        }
        div.images{
            display:grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap:15px;
            font-size:14px;
        }
        img{
            width:100%;
            border:2px solid transparent;
        }
        label input{
            display:none;
        }
        label input:checked+img{
            border: 2px solid #ccc;
            filter: brightness(0.8);
        }
        .popup{
            display:none;
            border: 2px inset;
            padding: 10px;
            border-radius: 10px;
            margin: 10px 0;
            background: #ccc;
            color: #000;
        }
        .error{
            color:red;
            font-size: 12px;
        }
        .captcha{
            background: #fff;
            color: #000;
            display: flex;
            justify-content: center;
            padding: 10px;
            border-radius: 10px;
            margin: 10px 0;
            cursor:pointer;
        }`
    }
    setupEvents(){
        this.internals.setValidity({
            valueMissing:true
        }," ")
        let DOMElements={
            captchaBox:this.shadowRoot.querySelector(".captcha"),
            popup:this.shadowRoot.querySelector(".popup"),
            images:this.shadowRoot.querySelectorAll("label"),
            checkbox:this.shadowRoot.querySelector(".fa-circle"),
            error:this.shadowRoot.querySelector(".error")
        }

        DOMElements.captchaBox.addEventListener("click",e=>{
            DOMElements.popup.style.display="block";
            DOMElements.captchaBox.style.display="none";
        },{
            once:true
        });
        DOMElements.images.forEach(label=>{
            label.addEventListener("click",e=>{
                if(e.target.tagName=="IMG")return;
                this.setAttribute("value",e.target.value);
                this.dispatchEvent(new CustomEvent("change",{
                    detail:{
                        value: e.target.value
                    }
                }))
            })
        });
        this.addEventListener("change",e=>{
            if(e.detail.value=="true"){
                DOMElements.checkbox.classList.remove("fa-circle");
                DOMElements.checkbox.classList.add("fa-check-circle");
                DOMElements.error.innerHTML="";
                this.classList.remove("error");
                DOMElements.popup.style.display="none";
                DOMElements.captchaBox.style.display="";
                this.internals.setValidity({});
            }else{
                DOMElements.checkbox.checked=false;
                DOMElements.error.innerHTML="Please select correct picture to proceed";
            }
        })
    }
    get value(){
        return "";
    }
    set value(value){
        // if(!this.iti)return;
        // this.iti.setNumber(value);
    }
    get label(){
        return this.attribute("label");
    }
    get name(){
        return this.attribute("name");
    }
}
