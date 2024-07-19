const { API } = require("./constants");

module.exports = class Request {


    constructor(session) {
        this.session = session;
        this.ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36";
        this.requestOptions = {
            login_headers: {
                "Accept": "*/*",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            normal_headers: {
                "Accept": "application/vnd.api+json",
                "Accept-Language": this.session.default_language
            }
        };
    }

    async get(url) {
        if(this.session.isLoggedIn) this.requestOptions.normal_headers["Authorization"] = "Bearer " + this.session._auth?.access_token;
        const finalUrl = API + url;
        return await fetch(finalUrl, {
            method: "GET",
            headers: this.requestOptions.normal_headers
        })
            .then(res => {
                if(res.status === 401) throw new Error("INVALID_TOKEN");
                return res.json();
            })
            .then(response => {
                return response;
            });
    }
    

    async post(url, body, login = false) {
        if(this.session.isLoggedIn) this.requestOptions.normal_headers["Authorization"] = "Bearer " + this.session._auth?.access_token;
        const finalUrl = API + url;
        return await fetch(finalUrl, {
            method: "POST",
            headers: login ? this.requestOptions.login_headers : this.requestOptions.normal_headers,
            body: body
        })
            .then(res => {
                if(res.status === 204) return true;
                if(res.status === 401) throw new Error("INVALID_CRENDENTIALS");
                return res.json();
            })
            .then(response => {
                return response;
            });
    }
}
