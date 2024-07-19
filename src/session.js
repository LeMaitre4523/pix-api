const Request = require("./request");
const convertKeys = require("./utils/convertKeys");

module.exports = class Session {
    constructor() {
        this._auth = undefined;
        this.isLoggedIn = false;
        this.users = undefined;
        this.request = new Request(this);
        this.areas = new Map();
        this.scorecards = new Map();
        this.default_language = "fr-fr";
    }

    async loginWithCredentials(username, password) {
        const body = `grant_type=password&username=${username}&password=${password}&scope=mon-pix`;
        return await this.request.post("/token", body, true).then(async (response) => {
            this.isLoggedIn = true;
            this._auth = response;
            return await this.fetchUser();
        });
    }

    async loginWithTokens(user_id, access_token, refresh_token) {
        this.isLoggedIn = true;
        this._auth = {
            token_type: "bearer",
            access_token: access_token,
            user_id: user_id,
            refresh_token: refresh_token,
            expires_in: 14400
        };
        return await this.fetchUser();
    }

    async revokeTokens(options = {}) {
        let stats = { access_token: false, refresh_token: false }
        if(options.access_token || this?._auth?.access_token) {
            const body = `token_type_hint=access_token&token=${options.access_token ? options.access_token : this._auth.access_token}`;
            stats.access_token = await this.request.post("/revoke", body, true)
        }
        if(options.refresh_token || this?._auth?.refresh_token) {
            const body = `token_type_hint=refresh_token&token=${options.refresh_token ? options.refresh_token : this._auth.refresh_token}`;
            stats.refresh_token_token = await this.request.post("/revoke", body, true)
        }
        return stats;
    }

    async fetchUser() {
        if(!this.isLoggedIn) throw new Error("YOU MUST LOGIN FIRST")
        return await this.request.get("/users/me").then((response) => {
            this.users = {
                id: response.data.id,
                ...convertKeys(response.data.attributes),
            };
            return this.users;
        });
    }

    async getUser() {
        return this.users;
    }

    async getCertifications() {
        if(!this.isLoggedIn) throw new Error("YOU MUST LOGIN FIRST")
        return await this.request.get(`/certifications`).then((response) => {
            let list = [];
            response.data.forEach(certif => {
                list.push({ 
                    id: certif.id,
                    ...convertKeys(certif.attributes),
                })
            })
            return list;
        });
    }

    async getCompetences() {
        if(!this.isLoggedIn) throw new Error("YOU MUST LOGIN FIRST")
        return await this.request.get(`/users/${this.users.id}/profile`).then((response) => {
            response.included.forEach((element) => {
                if("code" in element.attributes) {
                    const areas = element.attributes;
                    this.areas.set(element.id, { id: element.id, title: areas.title, code: areas.code, color: areas.color });
                } else if("competence-id" in element.attributes) {
                    this.scorecards.set(element.id, element);
                }
            });
            const areasList = Object.fromEntries(this.areas.entries());
            this.scorecards.forEach((competence) => {
                let area = areasList[competence.relationships.area.data.id]
                if(!area.scorecards) area.scorecards = [];
                 area.scorecards.push(competence);
            });
            return {
                global: convertKeys(response.data.attributes),
                competences: Object.keys(areasList).map((key) => areasList[key])
            };
        });
    }
}