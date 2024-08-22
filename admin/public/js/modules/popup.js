export default class Popup {
    elms=[];
    constructor(){
        this.elms=document.querySelectorAll(".popup");
        this.setup();
    }
    setup(){
        for (let index = 0; index < this.elms.length; index++) {
            const elm = this.elms[index];
            let closeDOM=elm.querySelector(".close");
            if(!!closeDOM) closeDOM.addEventListener("click",e=>{
                elm.style.display="none";
            })            
        }
    }
}