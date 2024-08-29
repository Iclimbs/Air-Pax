export default class message extends HTMLElement {
	shadow;
	attributes = {};
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "closed" });
	}
	render() {
		this.shadow.innerHTML = `
        <style>
        :host{
            position:fixed;
            top:0;
            left:0;
            right:0;
            bottom:0;
            display:flex;
            justify-content:center;
            background:rgba(0,0,0,0.5);
        }
        div{
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            padding:1rem;
        }
        .main{
            background:white;
            padding:1rem;
            border-radius:1rem;
            box-shadow:0 0 1rem rgba(0,0,0,0.5);
        }
        </style>
        <div>
            <div class=main>
            
            <h3>
                ${this.attributes["title"]}        
            </h3>
            <p>
                ${this.attributes["message"]}
            </p>
            </div>
        </div>
    `;
		let lifetime = this.attributes["lifetime"];
		if (!lifetime) {
			lifetime = 5000;
		}
        let redirect=this.attributes["redirect"];
        if(!redirect)redirect="/";
		setTimeout(() => {
            this.dispatchEvent(new CustomEvent("close", {timedout:true}))
			this.remove();
            location.href=redirect;
		}, lifetime);
	}
	connectedCallback() {
		this.render();
	}
	disconnectedCallback() {}
	static get observedAttributes() {
		return ["title", "message", "type", "lifetime","redirect"];
	}
	attributeChangedCallback(name, oldValue, newValue) {
		this.attributes[name] = newValue;
	}
}
