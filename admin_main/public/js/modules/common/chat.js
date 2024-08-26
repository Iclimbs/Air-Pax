export default class chat extends HTMLDivElement {
    DOM;
    connectedCallback(){
        this.DOM={
            openbtn:this.querySelector("[btn=openbtn]"),
            closebtn:this.querySelector("[btn=closebtn]"),
            sendbtn:this.querySelector("[btn=sendbtn]"),
            messageArea:this.querySelector("[chats]"),
            message:this.querySelector("[name=message]")
        }
        this.setupActions();
    }
    setupActions(){
        if(!!this.DOM.openbtn)
        this.DOM.openbtn.addEventListener("click",()=>{
            console.log("OPening please wait")
            this.open();
        })
        if(!!this.DOM.closebtn)
        this.DOM.closebtn.addEventListener("click",()=>{
            this.close();
        })
        if(!!this.DOM.sendbtn)
        this.DOM.sendbtn.addEventListener("click",()=>{
            this.send();
        })

        document.addEventListener("new-message",(event)=>{
            const {msg,user}=event.detail;
            console.log(user);
            const {message,sender}=msg;
            this.DOM.messageArea.innerHTML+=`
            <li class="${(user)?"":"right"}">${message}</li>
            `                            
        })
    }
    send(){
        let message=this.DOM.message.value;
        this.DOM.message.value="";
        document.dispatchEvent(new CustomEvent("send-message",{
            detail:{message}
        }))
    }
    open(){
        this.classList.add("open");
    }
    close(){
        this.classList.remove("open");
    }    
}