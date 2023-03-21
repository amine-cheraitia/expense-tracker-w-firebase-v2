import axios from "axios";

export default {
	namespaced: true,
	state() {
		return {
			solde: null,
			ressources: [
				{
					id: 5,
				},
			],
			type_ressources: [],
		};
	},
	mutations: {
		setRessources(state, payload) {
			/* state.ressources.push(...payload); version qui nest ok 100*/
			state.ressources = [...payload];
		},
		setSolde(state, payload) {
			state.solde = payload;
		},
		setRessourcesType(state, payload) {
			state.type_ressources = [...payload];
		},
	},
	actions: {
		async loadRessources(context) {
			let ressources;
			const userId = context.rootGetters["auth/userId"];
			let erreur = null;
			const config = {
				headers: {
					Authorization: `Bearer ${context.rootGetters["auth/getToken"]}`,
				},
			};
			await axios
				.get("http://127.0.0.1:8000/api/ressource/user/" + userId, config)
				.then((result) => {
					ressources = result.data;
					let soldeGlobale = 0;
					for (const key in ressources) {
						soldeGlobale += Number(ressources[key].solde);
					}

					context.commit("setSolde", soldeGlobale.toFixed(2));
				})
				.catch((err) => {
					erreur = err.response.status;
					const error = err.response.status;
					throw error;
				});

			if (!erreur) {
				context.commit("setRessources", ressources);
			}
		},
		async loadRessourcesType(context) {
			const config = {
				headers: {
					Authorization: `Bearer ${context.rootGetters["auth/getToken"]}`,
				},
			};
			await axios
				.get("http://127.0.0.1:8000/api/typeressource", config)
				.then((result) => {
					context.commit("setRessourcesType", result.data);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		async deleteRessource(context, payload) {
			const config = {
				headers: {
					Authorization: `Bearer ${context.rootGetters["auth/getToken"]}`,
				},
			};
			await axios
				.delete("http://127.0.0.1:8000/api/ressource/" + payload, config)
				.then((res) => {
					console.log(res);
					context.dispatch("loadRessources");
				})
				.catch((err) => {
					console.log(err.message);
					throw err.message;
				});
		},
	},
	getters: {
		solde(state) {
			return state.solde;
		},
		ressources(state) {
			return state.ressources;
		},
		typeressources(state) {
			return state.type_ressources;
		},
	},
};
