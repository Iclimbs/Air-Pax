import api from "./api.js";

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
class SurveyTiming {
    #start;
    #end;
    #diff = {
        h: 0,
        i: 0,
        s: 0
    }
    constructor(start, end) {
        this.#start = new Date(start)
        this.#end = new Date(end)
        let temp = this.#end - this.#start;
        this.#diff = {
            h: Math.floor(temp / 3600000),
            i: Math.floor(temp / 60000) % 60,
            s: Math.floor(temp / 1000) % 60
        }
    }
    get diff() {
        return this.formatTime(this.#diff);
    }
    get start() {
        return this.formatTime({ h: this.#start.getHours(), i: this.#start.getMinutes() })
    }
    formatTime(time) {
        let out = `${(time.h < 10) ? `0${time.h}` : time.h}:${(time.i < 10) ? `0${time.i}` : time.i}`;
        if (!!time.s)
            out += `:${(time.s < 10) ? `0${time.s}` : time.s}`
        return out;
    }
}
export default class Table extends HTMLDivElement {
    API = new api();
    template = new Template();
    #data = [];
    #headings = [
        "Sl. No.",
        "Survey ID",
        "Survey Title",
        "Status",
        "Rewards"
    ];
    #rows = [[]];
    #page = {
        total: 1,
        current: 1
    }
    #length = 10;
    #start = 0;
    #table;
    #pagination;
    endpoint = "";
    constructor() {
        super();
    }
    static get observedAttributes() {
        return [
            "api"
        ]
    }
    async connectedCallback() {
        this.endpoint = this.getAttribute("api");
        if (!this.endpoint || this.endpoint == "") { return; }
        let data = await this.API.get(this.endpoint)
        this.#data = data.surveys.filter(s=>!!s.survey).map((attempt, index) => {
            if (attempt.survey == null) return ;
            return [
                (index + 1),
                attempt.survey.surveyID ?? "",
                attempt.survey.name,
                attempt.status,
                attempt.rewards + " Points",
            ]
        });
        this.#table = this.querySelector("table");
        this.#pagination = this.querySelector(".pagination");
        this.paginate();
        this.filter();
        this.dateRange();
        await this.render();
    }

    async render() {
        this.#table.innerHTML = `
        ${this.template.head(this.#headings)}
        ${this.template.body(this.#rows)}
        `
        this.#pagination.innerHTML = this.template.paginate(this.#page);
        this.setup();
    }
    async paginate() {
        this.#page.total = Math.ceil((this.#data.length) / (this.#length));
        this.#start = (this.#page.current - 1) * this.#length;
        for (let index = this.#start; index < Math.min(this.#start + this.#length, this.#data.length); index++) {
            this.#rows.push(this.#data[index]);
        }

    }
    async setup() {
        let pageBtns = this.#pagination.querySelectorAll(".pagebtns");
        pageBtns.forEach(btn => {
            btn.addEventListener("click", (event) => {
                let targetBtn = event.target;
                targetBtn.parentElement.querySelectorAll("button").forEach(b => b.classList.remove("open"));
                targetBtn.classList.add("open")
                this.#page.current = Number(targetBtn.innerText);
                this.#rows = [];
                this.paginate();
                this.#table.innerHTML = `
                    ${this.template.head(this.#headings)}
                    ${this.template.body(this.#rows)}
                `;
            })
        })
        let downladBtn = this.querySelector(".download");
        downladBtn.addEventListener("click", (event) => {
            let filename = event.target.getAttribute("filename");
            this.downloadCSV([this.#headings, ...this.#data], filename || "download.csv")
        })
        let filter = this.querySelector("[name=status]");
        if (!!filter) {
            filter.addEventListener("change", (e) => {
                let table = this.querySelector("table");
                table.setAttribute("class", e.target.value);
            })
        }
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
    filter() {
        let filterDOM = this.querySelector(".filter");
        filterDOM.innerHTML = this.template.filter(["disqualified", "pending", "completed"])
    }
    dateRange() {
        let element = this.querySelector('[daterange]');
        new easepick.create({
            element: "[daterange]",
            css: [
                "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css"
            ],
            zIndex: 10,
            grid: 2,
            calendars: 2,
            plugins: [
                "AmpPlugin",
                "RangePlugin"
            ]
        })
     
        element.addEventListener("change", (e) => {
            console.log(e);
        })

    }
}