import api from "../common/api.js";
export default class formElements extends HTMLElement {
	#shadow;
	#attributes = {};
	api = new api();
	static formAssociated = true;
	prepare() {}
	constructor() {
		super();
		if (!this.getAttribute("no-shadow")) {
			this.internals = this.attachInternals();
			this.#shadow = this.attachShadow({ mode: "open" });
		}
		this.api.header = {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: "Bearer " + localStorage.getItem("auth"),
		};
	}
	stylesheet() {
		return `<link rel="stylesheet" href="/css/${this.type}.css">`;
	}
	async connectedCallback() {
		await this.render();
		this.setup();
		return;
	}
	setup() {
		try {
			this.input = this.shadowRoot.querySelector("input");
			if (!!this.input) {
				this.input.addEventListener("change", (e) => {
					this.value = e.target.value;
					const clone = new e.constructor(e.type, e);
					this.dispatchEvent(clone);					
				});
			}
			if (!!this.#attributes["value"]) {
				this.value = this.#attributes["value"];
			}
			if (!this.hasAttribute("tabindex")) {
				this.setAttribute("tabindex", "0");
			}
			this.addEventListener("focus", () => {
				setTimeout(() => {
					this.classList.remove("error");
					let error = this.shadow.querySelector(".error");
					if (!!error) error.innerHTML = "";
				}, 1000);
				let input=this.shadowRoot.querySelector("input");
				if(!!input)input.focus();
			});
			this.addEventListener("blur", () => {
				console.log(this.validity);
			});
		} catch (error) {
			console.log(error);
		}
	}
	attributeChangedCallback(attr, old, current) {
		this.#attributes[attr] = this.json(current);
	}
	json(input) {
		try {
			return JSON.parse(input);
		} catch (error) {
			return input;
		}
	}
	get shadow() {
		return this.#shadow;
	}
	attribute(name, value = null) {
		if ([null, undefined, ""].indexOf(value) == -1)
			this.#attributes[name] = value;
		return this.#attributes[name] || "";
	}
	get value() {
		let input=this.shadowRoot.querySelector("input");
		if(!!input){
			this._value=input.value;
		}
		return this._value;
	}
	set value(value) {
		this._value = value;
		this.internals.setFormValue(value);
	}
	get validity() {
		let error = this.shadow.querySelector(".error");
		if (!error) {
			error = document.createElement("span");
			error.classList.add("error");
			this.shadow.appendChild(error);
		}
		error.innerHTML="";
		this.classList.remove("error");
		if(!!this.internals.validity.valid)return this.internals.validity;
			this.classList.add("error");
			error.innerHTML = this.internals.validationMessage;
		
		if (this.internals.validity.valueMissing) {
			let error = this.shadow.querySelector(".error");
			error.innerHTML = "";
		}
		return this.internals.validity;
	}
	get form() {
		return this.internals.form;
	}

	get name() {
		return this.getAttribute("name");
	}

	get type() {
		return this.localName;
	}
	get label() {
		return this.attribute("label");
		// let temp =
		// let label;
		// return temp[0];
		// if (temp instanceof Array) {
		// 	label = temp.find((l) => l.lang == "en");
		// }
		// if (!label) label = temp[0] || temp;
		// return label;
	}
	get validationMessage() {
		return this.internals.validationMessage;
	}
	translate(target, object) {
		let keys = Object.keys(object);
		for (let index = 0; index < keys.length; index++) {
			const key = keys[index];
			let regex = new RegExp(`{{${key}}}`, "g");
			if (object[key] instanceof Array) {
				target = target.replace(regex, object[key].join(", "));
				continue;
			}
			if (typeof object[key] == "object") {
				target = target.replace(regex, JSON.stringify(object[key]));
				continue;
			}
			target = target.replace(regex, object[key]);
		}
		return target;
	}
}
