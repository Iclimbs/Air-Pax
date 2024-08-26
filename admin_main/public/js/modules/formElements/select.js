import api from "../common/api.js";
export default class select extends HTMLElement {
	currencies = {
		af: "؋",
		ax: "€",
		al: "Lek",
		dz: "دج",
		as: "$",
		ad: "€",
		ao: "Kz",
		ai: "$",
		aq: "$",
		ag: "$",
		ar: "$",
		am: "֏",
		aw: "ƒ",
		au: "$",
		at: "€",
		az: "m",
		bh: ".د.ب",
		bd: "৳",
		bb: "Bds$",
		by: "Br",
		be: "€",
		bz: "$",
		bj: "CFA",
		bm: "$",
		bt: "Nu.",
		bo: "Bs.",
		bq: "$",
		ba: "KM",
		bw: "P",
		bv: "kr",
		br: "R$",
		io: "$",
		bn: "B$",
		bg: "Лв.",
		bf: "CFA",
		bi: "FBu",
		kh: "KHR",
		cm: "FCFA",
		ca: "$",
		cv: "$",
		ky: "$",
		cf: "FCFA",
		td: "FCFA",
		cl: "$",
		cn: "¥",
		cx: "$",
		cc: "$",
		co: "$",
		km: "CF",
		cg: "FC",
		ck: "$",
		cr: "₡",
		ci: "CFA",
		hr: "kn",
		cu: "$",
		cw: "ƒ",
		cy: "€",
		cz: "Kč",
		cd: "FC",
		dk: "Kr.",
		dj: "Fdj",
		dm: "$",
		do: "$",
		tl: "$",
		ec: "$",
		eg: "ج.م",
		sv: "$",
		gq: "FCFA",
		er: "Nfk",
		ee: "€",
		et: "Nkf",
		fk: "£",
		fo: "Kr.",
		fj: "FJ$",
		fi: "€",
		fr: "€",
		gf: "€",
		pf: "₣",
		tf: "€",
		ga: "FCFA",
		gm: "D",
		ge: "ლ",
		de: "€",
		gh: "GH₵",
		gi: "£",
		gr: "€",
		gl: "Kr.",
		gd: "$",
		gp: "€",
		gu: "$",
		gt: "Q",
		gg: "£",
		gn: "FG",
		gw: "CFA",
		gy: "$",
		ht: "G",
		hm: "$",
		hn: "L",
		hk: "$",
		hu: "Ft",
		is: "kr",
		in: "₹",
		id: "Rp",
		ir: "﷼",
		iq: "د.ع",
		ie: "€",
		il: "₪",
		it: "€",
		jm: "J$",
		jp: "¥",
		je: "£",
		jo: "ا.د",
		kz: "лв",
		ke: "KSh",
		ki: "$",
		xk: "€",
		kw: "ك.د",
		kg: "лв",
		la: "₭",
		lv: "€",
		lb: "£",
		ls: "L",
		lr: "$",
		ly: "د.ل",
		li: "CHf",
		lt: "€",
		lu: "€",
		mo: "$",
		mk: "ден",
		mg: "Ar",
		mw: "MK",
		my: "RM",
		mv: "Rf",
		ml: "CFA",
		mt: "€",
		im: "£",
		mh: "$",
		mq: "€",
		mr: "MRU",
		mu: "₨",
		yt: "€",
		mx: "$",
		fm: "$",
		md: "L",
		mc: "€",
		mn: "₮",
		me: "€",
		ms: "$",
		ma: "DH",
		mz: "MT",
		mm: "K",
		na: "$",
		nr: "$",
		np: "₨",
		nl: "€",
		nc: "₣",
		nz: "$",
		ni: "C$",
		ne: "CFA",
		ng: "₦",
		nu: "$",
		nf: "$",
		kp: "₩",
		mp: "$",
		no: "kr",
		om: ".ع.ر",
		pk: "₨",
		pw: "$",
		ps: "₪",
		pa: "B/.",
		pg: "K",
		py: "₲",
		pe: "S/.",
		ph: "₱",
		pn: "$",
		pl: "zł",
		pt: "€",
		pr: "$",
		qa: "ق.ر",
		re: "€",
		ro: "lei",
		ru: "₽",
		rw: "FRw",
		sh: "£",
		kn: "$",
		lc: "$",
		pm: "€",
		vc: "$",
		bl: "€",
		mf: "€",
		ws: "SAT",
		sm: "€",
		st: "Db",
		sa: "﷼",
		sn: "CFA",
		rs: "din",
		sc: "SRe",
		sl: "Le",
		sg: "$",
		sx: "ƒ",
		sk: "€",
		si: "€",
		sb: "Si$",
		so: "Sh.so.",
		za: "R",
		gs: "£",
		kr: "₩",
		ss: "£",
		es: "€",
		lk: "Rs",
		sd: ".س.ج",
		sr: "$",
		sj: "kr",
		sz: "E",
		se: "kr",
		ch: "CHf",
		sy: "LS",
		tw: "$",
		tj: "SM",
		tz: "TSh",
		th: "฿",
		bs: "B$",
		tg: "CFA",
		tk: "$",
		to: "$",
		tt: "$",
		tn: "ت.د",
		tr: "₺",
		tm: "T",
		tc: "$",
		tv: "$",
		ug: "USh",
		ua: "₴",
		ae: "إ.د",
		gb: "£",
		us: "$",
		um: "$",
		uy: "$",
		uz: "лв",
		vu: "VT",
		va: "€",
		ve: "Bs",
		vn: "₫",
		vg: "$",
		vi: "$",
		wf: "₣",
		eh: "MAD",
		ye: "﷼",
		zm: "ZK",
		zw: "$",
	};
	api = new api();
	#attributes = {};
	#shadow;
	#domElements;
	#searchParameter = "";
	#optionList = [];
	#multiple = false;
	#value = [];
	#validity = {};
	#validationMessage = "";
	static formAssociated = true;

	static get observedAttributes() {
		return [
			"all",
			"options",
			"label",
			"value",
			"maxlength",
			"multiple",
			"method",
			"api",
			"parent",
			"pvalue",
			"when",
			"class",
			"value",
			"required",
			"hidden",
			"child",
			"children",
			"currency",
			"default",
			"summerize",
			"preferred",
			"disabled",
			"noption",
			"country",
			"editable",
			"other",
		];
	}

	constructor() {
		super();
		let attributes = this.getAttributeNames();
		attributes.forEach((attr) => {
			Object.assign(this.#attributes, {
				[attr]: this.getAttribute(attr),
			});
		});
		this.#multiple = this.getAttribute("multiple") || false;
		let internals = this.attachInternals;
		if (!this.attachInternals) {
			this.internals = {
				setFormValue: (v) => {
					this.value = v;
				},
				setValidity: (validity, message = "") => {
					this.#validity = validity;
					this.#validationMessage = message;
					if (message != "") Object.assign(this.#validity, { valid: false });
					else Object.assign(this.#validity, { valid: true });
				},
			};
		} else {
			this.internals = this.attachInternals({ mode: "open" });
		}
		this.#shadow = this.attachShadow({ mode: "open" });
	}
	async reload() {
		if ("multiselect" in this.#attributes) {
			this.selectNone();
		}
		this.#searchParameter = "";
		this.#value = [];
		this.value = "";
		await this.options();
		this.loadOptions();

		this.setupDOMElements();
		if (
			!!this.#domElements.selected &&
			"innerText" in this.#domElements.selected
		)
			this.#domElements.selected.innerText =
				this.getAttribute("placeholder") || "--Please Select--";
		if (!!this.#domElements.value && "value" in this.#domElements.value)
			this.#domElements.value.value = "";
		this.updateChild();
	}
	isJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}
	load() {
		// Seeting up initial conditions;
		this.#domElements;
		this.#searchParameter = "";
		this.#value = [];
		this.value = "";
		if (
			"selected" in this.#attributes &&
			this.isJsonString(this.#attributes["selected"])
		) {
			let selected =
				"multiple" in this.#attributes
					? JSON.parse(this.#attributes["selected"])
					: JSON.parse(this.#attributes["selected"]) || [
							this.#attributes["selected"],
					  ];
			this.#value = selected;
			this.setValue();
		}
		this.render();
		this.input = this.shadowRoot.querySelector("input");
		this.input.addEventListener("change", (e) => {
			const clone = new e.constructor(e.type, e);
			this.dispatchEvent(clone);
			this.value = this.input.value;
		});
		this.addEventListener("focus", () => {
			this.classList.remove("error");
			this.input.focus();
		});
		if (!this.hasAttribute("tabindex")) {
			this.setAttribute("tabindex", "0");
		}
		this.setupActions();
		if ("child" in this.#attributes || "children" in this.#attributes) {
			this.updateChild();
		}
	}
	connectedCallback() {
		this.load();
	}
	clearList() {
		// this.hide();
		if (!!this.#domElements.list) {
			this.#domElements.list.innerHTML = "";
		}
	}
	updateChild() {
		let children =
			"children" in this.#attributes
				? JSON.parse(this.#attributes["children"])
				: [];
		"child" in this.#attributes ? children.push(this.#attributes["child"]) : "";
		if (children.length == 0) return;
		children.forEach((child) => {
			let elm = document.querySelector(`[name=${child}]`);
			if (!elm) return console.log("child element missing");
			if ("clearList" in elm) elm.clearList();
			if (!this.hidden) elm.setAttribute("pvalue", this._value);
			else {
				elm.setAttribute("pvalue", "");
			}
			if ("reload" in elm) elm.reload();
		});
	}
	changedEvent(detail) {
		if (this._value != "") {
			this.internals.setValidity({});
		}
		let event = new CustomEvent("changed", {
			detail: detail,
		});
		if ("child" in this.#attributes || "children" in this.#attributes) {
			this.updateChild();
		}
		this.dispatchEvent(event);
		this.updateChild();
	}
	attributeChangedCallback(attr, old, current) {
		this.#attributes[attr] = current;
		switch (attr) {
			case "currency":
				let find = new RegExp("$", "gi");
				// this.#shadow.innerHTML = this.#shadow.innerHTML.replace(find, current);
				break;
			case "country":
				let cn = current.toLowerCase();
				if (cn in this.currencies) {
					let currency = this.currencies[cn];
					this.setAttribute("currency", currency);
				}
				break;
			case "required":
				if (!this.#attributes["required"]) break;
				if (!!this.#attributes["value"]) break;
				if (!current) {
					this.internals.setValidity({});
				} else {
					this.internals.setValidity(
						{
							valueMissing: true,
						},
						`${
							!!this.#attributes["label"]
								? this.#attributes["label"]
								: "This field "
						} is required`,
					);
				}
				let label = this.#shadow.querySelector("label");
				if (!label) break;
				label.innerHTML =
					label.innerHTML +
					` ${this.#attributes["required"] == true ? "<span>*</span>" : ""}`;
				break;
			case "hidden":
				break;
			case "value":
				if (this._value == current) break;
				this.#attributes["value"] = current;
				this.#value = current;
				this._value = current;
				this.internals.setFormValue(current);
				this.setValue();
				this.internals.setValidity({});
				break;
			case "multiple":
				this.#multiple = current;
				!current
					? this.#shadow.querySelector("div")?.removeAttribute("multiple")
					: this.#shadow.querySelector("div")?.addAttribute("multiple");
				break;
			case "pvalue":
				this.#attributes["pvalue"] = current;
				break;
			case "parent":
				this.parentSetup(current);
				if (current != "") this.hide();
				break;
			case "class":
				let elm = this.#shadow.querySelector("div");
				if (!!elm) elm.classList = current;
				break;
			case "child":
				this.#attributes[attr] = current;
				this.updateChild();
				break;
			case "options":
				this.render();
				this.setupActions();
				break;
			case "default":
				this.#attributes[attr] = current;
				if ("default" in this.#attributes) {
					try {
						if ("multiple" in this.#attributes) {
							let def = JSON.parse(this.#attributes["default"]);
							this.#value = def;
							this.setValue();
						} else {
							this.setAttribute("value", this.#attributes["default"]);
						}
					} catch (error) {}
				}
				break;
			case "preferred":
				this.#attributes[attr] = current;
				break;
			case "disabled":
				this.#attributes[attr] = current;
				break;
			default:
				this.#attributes[attr] = current;
				break;
		}
	}
	parentSetup(current) {
		if (current == "") return;
		const form=this.form || this.closest("form");
		if(!form){
			setTimeout(()=>{
				this.parentSetup(current);
			},1000);
			return;
		}
		let parent = form.querySelector(`[name=${current}]`);
		if (!parent) return;
		let children = parent.getAttribute("children");
		if (!children) children = [];
		else children = JSON.parse(children);
		if (!children.includes(this.getAttribute("name")))
			children.push(this.getAttribute("name"));
		parent.setAttribute("children", JSON.stringify(children));
	}
	render() {
		let attr = this.#attributes;
		let pclass = this.getAttribute("class") || "";
		let options = this.options();
		let placeholder = this.getAttribute("placeholder") || "--Please Select--";
		this.#shadow.innerHTML = `
		${this.stylesheet()}
                <div ${pclass != "" ? `class="${pclass}"` : ""}  
				${ ("multiple" in this.#attributes) ? "multiple" : ""}
					style="position:relative;">
                    ${this.buttons()}
                    ${this.label()}
                    <input type="hidden" name="selectInputName">
                    	<div class="selected form-control">${placeholder}</div>
							<div class='summary'></div>
                    		<div class="wrapper" style='display:none'>
							<input  type="hidden" name="search" placeholder="Search here...">
						<ul  style="--max-options:${attr.maxlength || 10}">
						</ul>
                    </div>
                </div>
                `;
		this.loadOptions();
		this.setupDOMElements();
		// todo: Added for testing phase
		// this.open();
	}
	style() {
		if (this.tagName.startsWith("FRFS"))
			return ` <link rel="stylesheet" href="/css/select.css">`;
		else
			return `<link rel="stylesheet" href="/dist/eForm/select/scss/comp.css">`;
	}
	loadOptions() {
		let event = new CustomEvent("refreshed");
		this.dispatchEvent(event);
		this.renderOptionList(this.#optionList).then((list) => {
			this.#domElements.list.innerHTML = list;
			this.setupDOMElements();
			this.enableListItemClick();
			this.internals.setValidity(
				{
					valueMissing: true,
				},
				`${
					!!this.#attributes["label"]
						? this.#attributes["label"]
						: "This field "
				} is required`,
			);
			if (!!this.#value) {
				let selectedelms = Array.from(this.#domElements.listItems).filter(
					(e) => {
						return this.#value.includes(e.getAttribute("data-value"));
					},
				);
				selectedelms.forEach((e) => {
					this.select(e);
				});
			}
			this.setValue();
		});
	}
	async options() {
		if ("options" in this.#attributes) return await this.optionAttribute();
		if ("api" in this.#attributes) return await this.optionAPI();
		return await this.optionHTML();
	}
	optionHTML() {
		let temp = Array.from(this.querySelectorAll("option"));
		if (!temp || temp.length == 0) return ``;
		let optionList = temp.reduce((acc, opt) => {
			if (opt.hasAttribute("value"))
				acc[opt.getAttribute("value")] = opt.innerHTML;
			else acc[opt.innerText.trim] = opt.innerHTML;
			opt.hasAttribute("selected")
				? this.#value.push(
						opt.hasAttribute("value")
							? opt.getAttribute("value")
							: opt.innerText.trim(),
				  )
				: "";
			return acc;
		}, {});
		this.#optionList = optionList;
		return this.renderOptionList(optionList);
	}
	optionAPI() {
		let url = this.getAttribute("api");
		if (!url) return;
		let method = this.getAttribute("method") || "get";
		this.internals.setValidity({});
		this.#optionList = [];
		if (this.#optionList.length != 0) return;
		switch (method.toLowerCase()) {
			case "get":
				fetch(url)
					.then((e) => e.json())
					.then((r) => {
						let temp = Array.from(r.data || r);
						let optionList = {};

						temp.forEach((e) => {
							optionList[e._id || e.id || e.code || e.name] = e.label || e.name;
						});
						this.#optionList = optionList;
						if (Object.keys(optionList).length == 0) {
							this.hide();
							this.internals.setValidity({});
						} else {
							this.unhide();
						}
						this.loadOptions();
					});
				break;
			case "post":
				if (!this.#attributes["pvalue"]) return;
				if (this.#attributes["pvalue"] == "") return;
				let info = {
					[this.getAttribute("parent")]: this.getAttribute("pvalue"),
				};
				let parent = [];
				let p = this.parent;
				while (p.parent) {
					parent.push(p.parent);
					p = p.parent;
				}
				for (let index = 0; index < parent.length; index++) {
					const pElm = parent[index];
					Object.assign(info, {
						[pElm.getAttribute("name")]: pElm.value,
					});
				}
				if (!(Object.keys(info).indexOf(this.#attributes["parent"]) > -1))
					return;

				this.api.post(url, info).then((r) => {
					if (!!r.hide) this.hide();
					let optionList = {};
					let temp = r.data || r;
					if (!("forEach" in temp)) return;
					temp.forEach((e) => {
						optionList[e._id || e.id || e.code || e.name] = e.label || e.name;
					});
					this.#optionList = optionList;
					this.unhide();
					if (Object.keys(optionList).length == 0) {
						this.hide();
					} else {
						let inp = this.#shadow.querySelector("[name=selectInputName]");
						this.hide();
						this.#shadow.querySelector("ul").style = "";
						this.#shadow.querySelector("[name=search]").style = "";
						this.#shadow.querySelector(".selected").style = "";
						this.internals.setValidity(
							{ valueMissing: true },
							`${this.#attributes["label"] || "This field "} is required`,
						);
						this.unhide();
					}
					this.loadOptions();
					if (this._value != "") {
						this.internals.setValidity(
							{ valueMissing: true },
							`${this.#attributes["label"] || "This"} is required`,
						);
					}
				});
				return;
				break;

			default:
				break;
		}
		return [""];
	}
	optionAttribute() {
		if (!this.#attributes.options) return;
		let optionList = JSON.parse(this.#attributes.options);
		if (optionList instanceof Array) {
			let temp = {};
			optionList.forEach((e) => {
				Object.assign(temp, { [`${e}`]: `${e}` });
			});
			optionList = temp;
		}
		this.#optionList = optionList;
		return this.renderOptionList(optionList);
	}
	buttons() {
		if (!this.#multiple) return "";
		return `<div class="selectAll" style="display:none">
              <input type=checkbox id="cb"> <label for="cb">${
								"all" in this.#attributes
									? this.#attributes["all"]
									: "Select All"
							}</label>
          </div>`;
	}
	async renderOptionList(optionList) {
		if (
			"selected" in this.#attributes &&
			this.isJsonString(this.#attributes["selected"])
		) {
			let selected =
				"multiple" in this.#attributes
					? JSON.parse(this.#attributes["selected"])
					: JSON.parse(this.#attributes["selected"]) ||
					  `[
							this.#attributes["selected"],
					  ]`;
			this.#value = selected;
			this.setValue();
		}
		let keys = Object.keys(optionList);
		keys = keys.sort((a, b) =>
			this.#attributes["sort"] == -1 ? b - a : a - b,
		);
		let curr = "$";
		if (!!this.#attributes["country"])
			curr = this.currencies[this.#attributes["country"].toLowerCase()];
		this.unhide();
		if (keys.length == 0) {
			this.hide();
			return "";
		}
		if (!!this.#attributes["other"]) {
			optionList["other"] = "Other (please specify)";
			keys.push("other");
		}
		return keys
			.map((option) => {
				let text = `${optionList[option]}`;
				text = text.replace(/\$/g, curr);
				let value = option;
				return `<li  data-value='${value}'>${text}</li>`;
			})
			.join("\n");
	}
	label() {
		if ("label" in this.#attributes)
			return `<label>${this.#attributes.label || ""} <span>*</span></label>`;
		return ``;
	}
	hide() {
		this.setAttribute("hidden", "true");
		this.setAttribute("style", "display:none");
		this._value = "";
		this.setAttribute("value", "");
		this.internals.setValidity({});
	}
	unhide() {
		if (this.parent.hidden)
			return console.log({
				[this.name]: "hidden due to parent value",
			});
		this.removeAttribute("hidden");
		this.removeAttribute("style");
	}
	toggleOpen() {
		this.#domElements.contentWrapper.classList.contains("open")
			? this.close()
			: this.open();
	}
	open() {
		if (this.#attributes["disabled"] == true) return;
		if (
			Object.keys(this.#attributes).indexOf("editable") > -1 &&
			[false, "false"].indexOf(this.#attributes["editable"]) > -1
		) {
			return console.log("Not editable");
		}
		this.classList.remove("invalid");
		let selectAll = this.#shadow.querySelector(".selectAll");
		!!selectAll ? (selectAll.style = "") : "";
		Object.keys(this.#optionList).length <= (this.#attributes["maxlength"] || 5)
			? this.#domElements.search.setAttribute("type", "hidden")
			: this.#domElements.search.setAttribute("type", "search");
		this.#domElements.list.classList.add("open");
		this.#domElements.search.classList.add("open");
		this.#domElements.buttons?.classList.add("open");
	}
	close() {
		let selectAll = this.#shadow.querySelector(".selectAll");
		!!selectAll ? (selectAll.style = "display:none") : "";
		this.#domElements.list.classList.remove("open");
		this.#domElements.search.classList.remove("open");
		this.#domElements.buttons?.classList.remove("open");
	}
	search() {
		let list = this.#domElements.list;
		let filteredOptions = Object.keys(this.#optionList).filter((e) => {
			let key = e.toString().toLowerCase();
			let value = this.#optionList[e].toString().toLowerCase();
			if (key == this.#searchParameter.toLowerCase()) {
				if (!this.#multiple) {
					this.select(
						this.#domElements.list.querySelector(`[data-value="${e}"]`),
					);
					this.open();
				}
			}

			return (
				key == this.#searchParameter.toLowerCase() ||
				value.match(new RegExp(`${this.#searchParameter}`, "gi"))
			);
		});
		list.querySelectorAll("[data-value]").forEach((elm) => {
			filteredOptions.includes(elm.getAttribute("data-value"))
				? elm.removeAttribute("hidden")
				: elm.setAttribute("hidden", true);
		});
		this.#domElements.listItems = Array.from(this.#domElements.listItems).sort(
			(a, b) => (a.hasAttribute("selected") ? 1 : -1),
		);
	}
	selectNext(i = null) {
		if (!!this.#multiple) return false;
		if (i + 1 == this.#domElements.listItems.length) return;
		let index = this.selected();
		if (!!i) index = i;
		index++;
		if (index >= this.#domElements.listItems.length) index--;
		this.#domElements.listItems[index].hasAttribute("hidden")
			? this.selectNext(index)
			: this.select(this.#domElements.listItems[index]);
	}
	selectPrevious(i = null) {
		if (!!this.#multiple) return false;
		if (i == 0) return false;
		let index = i || this.selected();
		if (index > 0) index--;
		this.#domElements.listItems[index].hasAttribute("hidden")
			? this.selectPrevious(index)
			: this.select(this.#domElements.listItems[index]);
	}
	selected() {
		let listItems = Array.from(this.#domElements.listItems);
		return listItems.indexOf(listItems.find((e) => e.hasAttribute("selected")));
	}
	otherOption = {
		add(e) {
			let name = e.getAttribute("name");
			if (name != "gender") return;
			let parent = e.parentElement;
			let newElement = document.createElement("frfs-text");
			newElement.setAttribute("name", `${name}_others`);
			newElement.setAttribute("editable", true);
			newElement.setAttribute("label", "Please specify");
			newElement.setAttribute("class", "col-sm-12");
			parent.insertBefore(newElement, e.nextSibling);
		},
		remove(e) {
			
			let name = e.getAttribute("name");
			let parent = e.parentElement;
			if (!parent) return;
			let newElement = parent.querySelector(`[name="${name}_others"`);
			if (!newElement) return;
			newElement.remove();
		},
	};
	select(e) {
		let id = e.getAttribute("data-value");
		let name = e.innerText;
		let event = new CustomEvent(
			e.hasAttribute("selected") ? "deleted" : "added",
			{
				detail: {
					id,
					name,
				},
			},
		);
		if (id == "other") {
			e.hasAttribute("selected")
				? this.otherOption.remove(this)
				: this.otherOption.add(this);
			this.#domElements.listItems.forEach((b) => {
				b.removeAttribute("selected");
			});
			e.setAttribute("selected", true);
			this.#domElements.selected.innerHTML = e.innerHTML;
			this.#domElements.value.value = e.getAttribute("data-value");
			this.setAttribute("value", this.#domElements.value.value);
			this.value = e.getAttribute("data-value");
			this.changedEvent({
				name: this.#attributes["name"],
				value: this.value,
			});
			this.close();
			return;
		}

		this.dispatchEvent(event);

		if (!this.#multiple || this.#value.indexOf("other") > -1) {
			this.otherOption.remove(this);
			this.#domElements.listItems.forEach((b) => {
				b.removeAttribute("selected");
			});
			e.setAttribute("selected", true);
			this.#domElements.selected.innerHTML = e.innerHTML;
			this.#domElements.value.value = e.getAttribute("data-value");
			this.setAttribute("value", this.#domElements.value.value);
			this.value = e.getAttribute("data-value");
			this.changedEvent({
				name: this.#attributes["name"],
				value: this.value,
			});
			this.close();
			return;
		}

		e.hasAttribute("selected")
			? e.removeAttribute("selected")
			: e.setAttribute("selected", true);
		this.updateValue();
	}
	setupDOMElements() {
		let DOMElements = {
			label: this.#shadow.querySelector("label"),
			value: this.#shadow.querySelector("input[type=hidden]"),
			selected:
				this.#shadow.querySelector(".selected") ||
				this.#shadow.querySelector("span"),
			list: this.#shadow.querySelector("ul"),
			listItems: this.#shadow.querySelectorAll("li"),
			search: this.#shadow.querySelector("[name=search]"),
			buttons: this.#shadow.querySelector(".buttons"),
			contentWrapper: this.#shadow.querySelector(".wrapper"),
		};
		this.#domElements = DOMElements;
		if ("preferred" in this.#attributes) {
			if (this.#attributes["preferred"] == 1) {
				let keys = Object.keys(this.#optionList);
				this.#value = keys[0];
				this.setValue();
			}
			if (this.#attributes["preferred"] == -1) {
				let keys = Object.keys(this.#optionList);
				this.#value = keys[keys.length - 1];
				this.setValue();
			}
		}
		if ("default" in this.#attributes) {
			try {
				if ("multiple" in this.#attributes) {
					let def = JSON.parse(this.#attributes["default"]);
					this.#value = def;
					this.setValue();
				} else {
					this.setAttribute("value", this.#attributes["default"]);
				}
			} catch (error) {}
		}
	}
	setupActions() {
		this.setupDOMElements();
		let itm = this.#shadow.querySelector(".wrapper");
		if (!!itm) itm.style = "";
		let DOMElements = this.#domElements;
		if ("when" in this.#attributes) this.setupWhenEvent();
		DOMElements.listItems.forEach((btn) => {
			btn.addEventListener("click", (e) => {
				this.select(e.target);
				this.close();
			});
		});
		let summaryDOM = this.#shadow.querySelector(".summary");
		if (!!summaryDOM) {
			summaryDOM.addEventListener("click", (e) => {
				this.toggleOpen();
			});
		}
		DOMElements.selected.addEventListener("click", () => {
			this.toggleOpen();
			// !this.#multiple ? this.toggleOpen() : this.toggleOpen();
		});
		this.#shadow
			.querySelector("[name=search]")
			.addEventListener("search", (e) => {
				this.#searchParameter = this.#domElements.search.value;
				this.search();
			});
		this.addEventListener("focus", (e) => {});
		this.addEventListener("blur", (e) => {
			this.close();
		});

		this.addEventListener("keyup", (e) => {
			switch (e.key) {
				case "Enter":
				case " ":
					if (!this.#domElements.list.classList.contains("open")) this.open();
					break;
				case "ArrowUp":
					this.selectPrevious();
					break;
				case "ArrowDown":
					this.selectNext();
					break;
				case "Escape":
					this.close();
					break;
				case "?":
					break;
				default:
					this.#searchParameter = this.#domElements.search.value;
					this.search();
					break;
			}
		});
	}
	updateValue() {
		if (!this.#domElements.list) return;
		let temp = Array.from(
			this.#domElements.list.querySelectorAll("[selected]"),
		).reduce((a, c) => {
			a.push(c.getAttribute("data-value"));
			return a;
		}, []);
		if (JSON.stringify(temp) != JSON.stringify(this.#value)) {
			this.setAttribute("value", JSON.stringify(temp));
		}
		if (temp.length == 0) {
			Array.from(this.#domElements.listItems).filter((li) => {
				if (!this.#value) return;
				if (this.#value.indexOf(li.getAttribute("data-value")) > -1)
					li.setAttribute("selected", true);
			});
			this.#domElements.selected.innerHTML =
				this.#attributes["placeholder"] || "--Please Select--";
		} else {
			this.#domElements.selected.innerHTML =
				"countonly" in this.#attributes
					? `${
							this.#domElements.list.querySelectorAll("[selected]").length
					  } selected`
					: Array.from(
							this.#domElements.list.querySelectorAll("[selected]"),
					  ).reduce((a, c) => {
							a += `<span value='${c.getAttribute("data-value")}'>${
								c.innerText
							} <i class='fa fa-times close'>x</i></span>`;
							return a;
					  }, []);
		}
		this.setupDeselect();
		let deselect = this.#shadow.querySelector("[deselect]");
		let select = this.#shadow.querySelector("[select]");
		if (
			this.#attributes["summerize"] &&
			temp.length > this.#attributes["summerize"]
		) {
			this.#shadow.querySelector(".summary").innerHTML =
				this.#shadow.querySelectorAll("li").length !== temp.length
					? `${temp.length} selected`
					: "all" in this.#attributes
					? this.#attributes["all"]
					: `All Selected`;
			this.#shadow.querySelector("div").setAttribute("summerize", true);
		} else {
			this.#shadow.querySelector(".summary").innerHTML = "";
			this.#shadow.querySelector("div").setAttribute("summerize", false);
		}
		if (!!select && select.hasAttribute("hidden"))
			select.removeAttribute("hidden");
		if (!!deselect && deselect.hasAttribute("hidden"))
			deselect.removeAttribute("hidden");
		if (!!deselect && temp.length == 0) deselect.setAttribute("hidden", true);
		if (temp.length == this.#domElements.listItems.length)
			if (!!select && !select.hasAttribute("hidden"))
				select.setAttribute("hidden", true);
		this.changedEvent({
			name: this.#attributes["name"],
			value: this.value,
		});
	}
	setupDeselect() {
		this.#domElements.selected.querySelectorAll(".close").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				let itm = e.target.parentElement;
				let val = itm.getAttribute("value");
				this.#domElements.listItems.forEach((li) => {
					if (li.getAttribute("data-value") == val)
						li.removeAttribute("selected");
				});

				itm.remove();
				let event = new CustomEvent("deleted", {
					detail: {
						id: val,
						name: itm.innerText,
					},
				});
				this.dispatchEvent(event);
				this.updateValue();
			});
		});
	}
	enableListItemClick() {
		let DOMElements = this.#domElements;
		DOMElements.listItems.forEach((btn) => {
			btn.addEventListener("click", (e) => {
				this.select(e.target);
				!this.#multiple ? this.close() : "";
			});
		});
		if (!!this.#multiple) {
			let selectAllCB = this.#shadow.querySelector("[type=checkbox]");
			if (!!selectAllCB) {
				selectAllCB.addEventListener("change", (e) => {
					selectAllCB.checked ? this.selectAll() : this.selectNone();
				});
				this.addEventListener("deleted", (e) => {
					selectAllCB.checked = false;
				});
			}
			if (!!this.#domElements.buttons) {
				let selectBtn = this.#domElements.buttons.querySelector("[select]");
				if (!!selectBtn) {
					selectBtn.addEventListener("click", (event) => {
						this.selectAll();
					});
				}
				let deselectBtn = this.#domElements.buttons.querySelector("[deselect]");
				if (!!deselectBtn) {
					deselectBtn.addEventListener("click", (event) => {
						this.selectNone();
					});
				}
				let okBtn = this.#domElements.buttons.querySelector("[ok]");
				if (!!okBtn) {
					okBtn.addEventListener("click", (event) => {
						this.close();
					});
				}
			}
		}
		if (DOMElements.listItems.length == 1) {
			this.select(DOMElements.listItems[0]);
		}
	}

	selectAll() {
		this.#domElements.list.querySelectorAll("li").forEach((e) => {
			if (!e.hasAttribute("selected")) this.select(e);
			// e.setAttribute("selected", true);
		});
		this.updateValue();
	}
	selectNone() {
		this.#domElements.list.querySelectorAll("li").forEach((e) => {
			if (e.hasAttribute("selected")) this.select(e);
		});
		this.updateValue();
	}
	setupWhenEvent() {
		
	}
	processWhen() {
		let pvalue = this.#attributes["pvalue"];
		let when = this.#attributes["when"];
		console.log({
			pvalue,
			when,
		});
	}
	reset() {
		this.#domElements.value.value = "";
		this.#domElements.selected.innerText = "--Please Select--";
		this.#domElements.listItems.forEach((li) => {
			if (li.hasAttribute("selected")) li.removeAttribute("selected");
		});
		this.value = "";
	}
	get hidden() {
		return this.getAttribute("hidden") ?? false;
	}
	get value() {
		return this._value;
	}
	set value(value) {
		if (this._value == value) return;
		this._value = value;
		this.internals.setFormValue(value);
		this.setValue();
	}
	setValue() {
		if (!this.#value) return;
		if (!this.#domElements || !this.#domElements.listItems) return;
		if (!!this.#attributes["multiple"]) return this.updateValue();
		if (this.#domElements.listItems.length == 0) return;
		let elm = Array.from(this.#domElements.listItems).find(
			(v) => v.getAttribute("data-value")?.toLowerCase() == this._value,
		);
		if (!elm) return;
		// this.select(elm);
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
	get parent() {
		if (!("parent" in this.#attributes)) return false;
		if (
			this.#attributes["parent"] == "" ||
			this.#attributes["parent"] == "null"
		)
			return false;
		return (
			document.querySelector(`[name=${this.#attributes["parent"]}]`) || false
		);
	}
	get validity() {
		if (this.getAttribute("style") == "display:none") {
			if (this.internals.validity.valid) this.classList.remove("error");
			this.internals.setValidity({});
			return this.internals.validity;
		}
		if (this.hidden) {
			if (this.internals.validity.valid) this.classList.remove("error");
			this.internals.setValidity({});
			return this.internals.validity;
		}
		if (!this.#attributes["required"]) this.internals.setValidity({});
		if (this.internals.validity.valid) this.classList.remove("error");
		else this.classList.add("error");
		return this.internals.validity || this.#validity;
	}
	get validationMessage() {
		return this.internals.validationMessage || this.#validationMessage;
	}
	get willValidate() {
		return this.internals.willValidate;
	}
	checkValidity() {
		return this.internals.checkValidity();
	}
	reportValidity() {
		return this.internals.reportValidity();
	}
	setCustomValidity(v) {}
	loaded() {
		return !(
			!this.#domElements.listItems || this.#domElements.listItems.length == 0
		);
	}
	pushToSelectedList(value) {
		try {
			if (
				!this.#domElements.listItems ||
				this.#domElements.listItems.length == 0
			)
				return false;
			let elm = Array.from(this.#domElements.listItems).find((e) => {
				return e.getAttribute("data-value") == value;
			});
			if (!elm.getAttribute("selected")) elm.click();
		} catch (error) {
			this.#value = `["${value}"]`;
		}
	}
	stylesheet() {
		return `<link rel="stylesheet" href="/css/${this.type}.css">`;
	}
	getOptionText(value) {
		return this.#optionList[value];
	}
}

// customElements.define("frfs-select", EFormSelect);
