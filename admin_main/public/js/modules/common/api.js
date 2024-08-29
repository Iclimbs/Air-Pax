
export default class api {
	headers = {
		"Content-Type": "application/json",
		
	};
	endpoint = "";
	constructor() {}
	async execute(url, method = "GET", data = null) {
		let options = {
			method: method,
			headers: this.headers,
		};
		if (data) options.body = JSON.stringify(data);
		const response = await fetch(url, options);
		return response.json();
	}
	async get(url) {
		let temp=localStorage.getItem(url);
		if(!!temp){
			try {
				return {
					status:"success",
					data:JSON.parse(temp)
				}
				
			} catch (error) {
				console.log(error);
				localStorage.removeItem(url);
			}
		}
		return this.execute(url);
	}
	async post(url, data) {
		return this.execute(url, "POST", data);
	}
	async put(url, data) {
		return this.execute(url, "PUT", data);
	}
	async patch(url, data) {
		return this.execute(url, "PATCH", data);
	}
	async delete(url, data) {
		return this.execute(url, "DELETE", data);
	}
	async copy(url, data) {
		return this.execute(url, "COPY", data);
	}
	async getHTML(url) {
		let response = await fetch(url);
		return response.text();
	}
	get headers() {
		return this.headers;
	}
	set headers(headers) {
		this.headers = headers;
	}
	get endpoint() {
		return this.endpoint;
	}
	set endpoint(endpoint) {
		this.endpoint = endpoint;
	}
	set header(object) {
		Object.assign(this.headers, object);
	}
}
