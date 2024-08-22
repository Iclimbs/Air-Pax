import api from "../common/api.js"
import FormElements from "./formElements.js";

export default class text extends  FormElements {
    api=new api();
    static get observedAttributes() {
        return [
            "label",
            "value",
            "name",
            "placeholder",
            "required",
            "editable",
            "api",
            "method",
            "parent",
            "pattern",
            "showerror"
        ];
    }
    render() {
        let label=this.attribute("label");
        let value=this.attribute("value");
        if((typeof value == "string") && !!value.match(/nan/gi)){
            value="";
        }
        if(typeof value=="object"){
            value=value.value;
        }
        this.shadow.innerHTML = `
        ${this.stylesheet()}
        <div class="form-group">
        <label 
            for="${this.attribute("name")}"
            >${label}</label>
        <input type="text" 
            name="${this.attribute("name")}" 
            value="${value}"
            class="form-control"
            placeholder="${this.attribute("placeholder")}"
            ${this.attribute("required")? "required":""}
            ${this.attribute("editable")? "":"disabled"}
            ${this.attribute("pattern")? `pattern="${this.attribute("pattern")}"`:""}
            >
         </div>   
        `;
    }    
    setup(){
        super.setup();
        let pattern=this.attribute("pattern");
        let required=this.attribute("required");
        let val=this.attribute("value");
        if(required){
            this.internals.setValidity({
                valueMissing: true,
            },this.attribute("label") + " is required");
        }
        if(val!=""){
            this.internals.setValidity({});
        }
        if(!!pattern){
            let input=this.shadow.querySelector("input");
            if(!input)return;
            input.addEventListener("change",()=>{
                let value=input.value;
                if(value==""){
                    this.internals.setValidity({
                        valueMissing: true
                    },
                    this.attribute("label") + " is required"
                    );
                }
                else if(!value.match(pattern)){
                    this.internals.setValidity({
                        patternMismatch: true,
                    },  this.attribute("label") + " is not valid");
                }else{
                    this.internals.setValidity({});
                }
            });
        }
        let api=this.attribute("api");
        let method=this.attribute("method");
        let parent=this.attribute("parent");
        if(!api || !method || !parent){
            return;
        }
        let p=document.querySelectorAll("[name="+parent+"]")[0];
        if(!p){
            return;
        }
        ["change","changed"].forEach(ev=>{
            p.addEventListener(ev,async ()=>{
                if([null,undefined,""].indexOf(p.value)>-1)return ;
                let data={
                    [parent]:p.value
                };
                let info;
                switch (method.toLowerCase()) {
                    case "get":                        
                        break;
                    case "post":
                         info=await this.api.post(api,data);
                        break;
                    default:
                        break;
                }
                if(info.status=="success"){
                    this.shadow.querySelector("input").value=info.data;                    
                }else if(info.status="validate"){
                    this.setAttribute("pattern",`^${info.data.zip}$`)
                }
                
            });

        })
    }
    get validity(){
        let value=this.value;
        let pattern=this.attribute("pattern");
        let required=this.attribute("required");
        this.classList.remove("error")
        if(required && value==""){
            this.internals.setValidity({
                valueMissing: true,
            },`${this.attribute("lable")} is required`);
            return super.validity;
        }
        if(!!pattern && !value.match(pattern)){
            this.internals.setValidity({
                patternMismatch: true,
            },  this.attribute("label") + " is not valid");
        }else{
            this.internals.setValidity({});
        }
        return super.validity;
    }
}
//*/