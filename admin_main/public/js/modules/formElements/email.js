import api from "../common/api.js";
import formElements from "./formElements.js";
export default class email extends formElements {
	static get observedAttributes() {
		return [
			"value",
			"label",
			"name",
			"editable",
			"required",
			"placeholder",
			"exist",
		];
	}
	constructor() {
		super();
	}
	async render() {
		let label = this.attribute("label");
		let value = this.attribute("value");
		this.shadow.innerHTML = `
        ${this.stylesheet()}
        <div class="form-group">
        <label 
            for="${this.attribute("name")}"
            >${label}</label>
        <input type="email" 
            name="${this.attribute("name")}" 
            value="${value}"
            class="form-control"
            placeholder="${this.attribute("placeholder")}"
            ${this.attribute("required") ? "required" : ""}
            ${this.attribute("editable") ? "" : "disabled"}
            >
        </div>
    `;
		this.internals.setValidity(
			{
				valueMissing: true,
			},
			"Email is required",
		);
	}

	setup() {
		super.setup();
		let input = this.shadow.querySelector("input");
		input.addEventListener("focus", () => {
			let errorDOM = this.shadow.querySelector(".error");
			if (errorDOM) errorDOM.innerText = "";
			this.classList.remove("error");
		});
		input.addEventListener("change", async (event) => {
			this.internals.setValidity(
				{
					customError: true,
				},
				" ",
			);
			let input = event.target;
			if (input.validity.valid) {
				let email = input.value;
				if (this.attribute("exist")) {
					this.internals.setValidity({});
					return;
				}
				try {
					let resp = await this.api.post("https://iclimbs.in/api/v1/validate/email", { email });
					switch (resp.status) {
						case "error":
							let errorDOM = this.shadow.querySelector(".error");
							if (!errorDOM) {
								errorDOM = document.createElement("span");
								errorDOM.classList.add("error");
								input.parentNode.appendChild(errorDOM);
							}
							this.internals.setValidity({ customError: true }, resp.message);
							errorDOM.innerText = resp.message;
							this.classList.add("error");
							break;
						case "success":
							this.internals.setValidity({});
							this.classList.remove("error");
							break;
						default:
							this.internals.setValidity({});
							break;
					}					
				} catch (error) {
					console.log(error);
				}
			} else {
				this.internals.setValidity({ typeMismatch: true }, "Invalid email");
			}
		});
	}
	setValue(value) {
		this.internals.setFormValue(value);
		let input=this.shadow.querySelector("input");
		if(!!input)input.value = value;
		this.setAttribute("value", value);
		this.internals.setValidity({})
		this.dispatchEvent(new Event("change"));
	}

	get value() {
		return this.shadow.querySelector("input").value;
	}
	set value(value) {
		this.setValue(value);
	}
	get label() {
		return this.attribute("label");
	}
	get name() {
		return this.attribute("name");
	}
}
