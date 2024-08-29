class Template {
    head(cols) {
        return `<thead>
        <tr>
            ${cols.map(c => `<th>${c}</th>`).join("")}
        </tr>
        </thead>
        `
    }
    body(rows) {
        return `<tbody>
        ${rows.map(row => {
            return `<tr class="${row[3] ?? ""}">
                ${row.map(col => `
                <td>${col}</td>
                `).join("")}
            </tr>`
        }).join("")}
        </tbody>`
    }
    paginate(page) {
        let html = "";
        for (let index = 1; index <= page.total; index++) {
            console.log(page.current==index)
            html += `
            <li class="page-item ${(index == page.current) ? "active" : ""}">
            <button class="pagebtn page-link ${(index == page.current) ? "open" : ""}" pno="1">
            ${index}
            </button>
            </li>
            `
        }
        return html;
    }
    filter(data) {
        return `<select name="status">
        <option value="">All</option>
        ${data.map(d => `
            <option value="${d}">${d}</option>
            `).join("")
            }</select>`
    }
}
export default class APILessTable extends HTMLDivElement {
    #table;
    template = new Template();
    #data = [];
    #headings = [];
    #page = {
        total: 1,
        current: 1
    }
    #pagination;
    #rows = [[]];
    #length = 3;
    #start = 0;
    constructor() {
        super();
    }
    static get observedAttributes() {
        return []
    }
    async connectedCallback() {
        let table = this.querySelector("table");
        this.#pagination = this.querySelector(".pagination");
        this.#table = table;
        let headings = [];
        Array.from(table.tHead.rows).forEach(row => {
            headings = Array.from(row.cells).map(c => c.innerText)
        });
        this.#headings = headings;
        // this.#data.push(headings);
        if (table.tBodies.length == 0)
            return;
        let data = Array.from(table.tBodies[0].rows).map(
            row => {
                return Array.from(row.cells).map(c => c.innerText)
            }
        )
        this.#data = data;
        await this.paginate()
        await this.render();
     }
    setup() {
        let downladBtn = this.querySelector(".download");
        if (!!downladBtn) {
            downladBtn.addEventListener("click", (event) => {
                let filename = event.target.getAttribute("filename");
                this.downloadCSV([this.#headings, ... this.#data], filename || "download.csv")
            })
        }
        let pageBtns = this.#pagination.querySelectorAll(".pagebtn");
        if (!!pageBtns) {
            pageBtns.forEach(btn => {
                btn.addEventListener("click", (event) => {
                    let targetBtn = event.target;
                    targetBtn.parentElement.querySelectorAll("button").forEach(b => b.classList.remove("open"));
                    targetBtn.classList.add("open")
                    this.#page.current = Number(targetBtn.innerText);
                    this.#rows = [];
                    this.paginate();
                    this.render();
                })
            })
        }
    }
    async paginate() {
        this.#page.total = Math.ceil((this.#data.length) / (this.#length));
        this.#start = (this.#page.current - 1) * this.#length;
        for (let index = this.#start; index < Math.min(this.#start + this.#length, this.#data.length); index++) {
            this.#rows.push(this.#data[index]);
        }
        console.log(this.#page)
    }
    async render() {
        this.#table.innerHTML = `
        ${this.template.head(this.#headings)}
        ${this.template.body(this.#rows)}
        `
        this.#pagination.innerHTML = this.template.paginate(this.#page);
        this.setup();
    }
    async downloadCSV(data, filename) {
        const csvContent = data.map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
    }
}