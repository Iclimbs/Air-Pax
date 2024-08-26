import FormElements from "./formElements.js";

export default class editors extends FormElements {
	#value = "";
	static get observedAttributes() {
		return ["label", "name", "minlength", "value"];
	}
	async render() {
		let label = this.attribute("label");
		this.shadow.innerHTML = `
        ${this.stylesheet()}
        <div class="form-group">
        <label>${this.attribute("label")}</label>
        <textarea class="editor form-control" name="${this.attribute(
					"name",
				)}" id="${this.attribute("name")}" required></textarea>
        </div>
        `;
	}
	setup() {
		if(!window.jQuery){
			let temp = document.createElement("script");
			temp.src = "/js/jquery.min.js";
			temp.addEventListener("load", () => {
				this.setup();
			});
			document.body.appendChild(temp);
			return false;
		}
		if (!window.tinymce) {
			let temp = document.createElement("script");
			temp.src = "/vendor/tinymce/tinymce.min.js";
			temp.addEventListener("load", () => {
				this.setup();
			});
			document.body.appendChild(temp);
			return false;
		}
		this.internals.setValidity(
			{
				valueMissing: true,
			},
			"Required",
		);

		tinymce.init({
			target: this.shadow.querySelector("textarea"),
			menubar: false,
			toolbar: false,
			statusbar: false,
			height: "100",
			init_instance_callback: (editor) => {
				editor.on("keyup", (e) => {
					let minlength = this.attribute("minlength");
					let val = e.target.innerText;
					this._value = e.target.innerHTML;
					if (val.length > minlength) {
						this.internals.setValidity({});
						this.classList.remove("error");
					} else {
						this.internals.setValidity(
							{
								tooShort: true,
							},
							`Please describe your ${this.attribute("label")}`,
						);
					}
				});
			},
		});
	}
}
