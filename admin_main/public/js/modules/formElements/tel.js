import api from "../common/api.js";
import formElements from "./formElements.js";

export default class tel extends formElements {
	customError = "";
	api = new api();
	iti;
	cn = "us";
	static get observedAttributes() {
		return [
			"label",
			"value",
			"name",
			"placeholder",
			"required",
			"editable",
			"cn",
			"unique",
		];
	}
	stylesheet() {
		let temp = super.stylesheet();
		return (
			temp + `<link rel="stylesheet" href="/css/intlTelInput.css" as="style" >`
		);
	}
	async render() {
		if (!this.attribute("cn")) {
			let resp = await this.api.get("/api/v1/options/country/my");
			if (resp.status == "success") {
				this.cn = resp.data[0].code;
			}
		} else {
			this.cn = this.attribute("cn");
		}
		let label = this.attribute("label");
		let value = this.attribute("value");
		if (typeof value == "object") {
			value = value.value;
		}
		this.classList.add("loading");
		this.shadow.innerHTML = `
        ${this.stylesheet()}       
        <div class="form-group">
        <label 
            for="${this.attribute("name")}"
            >${label}</label>
        	<input type="tel" 
				name="${this.attribute("name")}" 
				value="${value}"
				class="form-control"
				placeholder="${this.attribute("placeholder")}"
				${this.attribute("required") ? "required" : ""}
				${this.attribute("editable") ? "" : "disabled"}
            >
		</div>	
        `;
		let input = this.shadow.querySelector("input");
		let cn = this.attribute("cn");
		let iti = window.intlTelInput(input, {
			initialCountry: this.cn,
			utilsScript: "/js/utils.js",
			onlyCountries: [this.cn],
		});
		this.iti = iti;
		["change", "keyup", "blur"].forEach((event) => {
			input.addEventListener(event, () => {
				let number = iti.getNumber();
				let valid = iti.isValidNumber();
				this.classList.remove("error");
				if (!valid) {
					this.classList.add("error");
				}
			});
		});
		this.setup();
	}
	setup() {
		super.setup();
		if (this.attribute("required")) {
			this.internals.setValidity(
				{
					valueMissing: true,
				},
				this.attribute("label") + " is required",
			);
		}
		let value = this.attribute("value");
		if (value != "") this.internals.setValidity({});
		if (!this.attribute("editable")) this.internals.setValidity({});
		let input = this.shadow.querySelector("input");
		input.addEventListener("change", async () => {
			let number = this.iti.getNumber();
			if (!number)
				return this.attribute("required")? this.internals.setValidity(
					{
						valueMissing: true,
					},
					this.attribute("label") + " is required",
				) : this.internals.setValidity({});
			let valid = this.iti.isValidNumber();
			if (!valid) {
				this.internals.setValidity(
					{
						typeMismatch: true,
					},
					this.attribute("label") + " is invalid",
				);
				return;
			}
			this.internals.setValidity(
				{
					customError: true
				},
				" ",
			);
			let resp = await this.api.post("https://iclimbs.in/api/v1/validate/tel", { number });
			switch (resp.status) {
				case "error":
					if (this.attribute("unique")) {
						this.customError = resp.message;
						this.internals.setValidity(
							{
								customError: true,
							},
							resp.message,
						);
					} else {
						this.internals.setValidity({});
					}
					break;
				case "success":
					this.customError = "";
					this.internals.setValidity({});
					this.classList.remove("error");
					break;
			}
		});
	}
	get value() {
		if (!this.iti) return "";
		if (!this.iti.isValidNumber()) return "";
		let value = this.iti.getNumber();
		return value;
	}
	set value(value) {
		if (!this.iti) return console.log("no iti");
		this.iti.setNumber(value);
		this.internals.setValidity({});
	}
	get validity() {
		let value = this.attribute("value");
		if (value != "") {
			this.internals.setValidity({});
			return super.validity;
		}
		if (!this.attribute("editable")) {
			this.internals.setValidity({});
			return super.validity;
		}
		if (!this.iti) {
			this.internals.setValidity(
				{
					valueMissing: true,
				},
				this.attribute("label") + " is required",
			);
			return super.validity;
		}
		if (this.customError != "") {
			this.internals.setValidity(
				{
					customError: true,
				},
				this.customError,
			);
			return super.validity;
		}
		let number = this.iti.getNumber();
		if (!number) {
			this.internals.setValidity(
				{
					valueMissing: true,
				},
				this.attribute("label") + " is required",
			);
			return super.validity;
		}
		if (!this.iti.isValidNumber()) {
			this.internals.setValidity(
				{
					typeMismatch: true,
				},
				this.attribute("label") + " is invalid",
			);
			return super.validity;
		}
		this.internals.setValidity({});
		return super.validity;
	}
	get label() {
		return this.attribute("label");
	}
	get name() {
		return this.attribute("name");
	}
}
