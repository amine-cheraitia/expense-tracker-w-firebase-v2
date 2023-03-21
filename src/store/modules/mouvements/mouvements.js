import axios from "axios";

export default {
	namespaced: true,
	state() {
		return {
			mouvements: [
				/* 				{
					id: 1,
					description: "Cash ",
					montant: 500,
					date_mouvement: "2022-03-02",
					type_mouvement_id: 1,
					user_id: 1,
					ressource_id: 1,
				},
				{
					id: 2,
					description: "Achat fourniture",
					montant: 30000,
					date_mouvement: "2022-03-02",
					type_mouvement_id: 2,
					user_id: 1,
					ressource_id: 3,
				}, */
			],
			totalEntré: 0,
			totalSortie: 0,
			monthly_kpi_recette: null,
			monthly_kpi_depense: null,
			yearly_kpi_recette: null,
			yearly_kpi_depense: null,
			years_kpi: null,
		};
	},
	mutations: {
		setMouvement(state, payload) {
			state.mouvements = [...payload];
		},
		setEntréSortie(state, payload) {
			state.totalEntré = payload.entré;
			state.totalSortie = payload.sortie;
		},
		set_monthly_kpi(state, payload) {
			state.monthly_kpi_recette = [...payload.recette];
			state.monthly_kpi_depense = [...payload.depense];
		},
		set_yearly_kpi(state, payload) {
			state.yearly_kpi_recette = [...payload.yearlyRecette];
			state.yearly_kpi_depense = [...payload.yearlyDepense];
			state.years_kpi = [...payload.years];
		},
	},
	actions: {
		async loadKpi(context) {
			const userid = context.rootGetters["auth/userId"];
			const config = {
				headers: {
					Authorization: `Bearer ${context.rootGetters["auth/getToken"]}`,
				},
			};
			/* Todo call api and retrive data for monthly and yearly kpi */
			const depense = [];
			const recette = [];
			const yearlyDepense = [];
			const yearlyRecette = [];
			const years = [];

			const thisYear = new Date().getFullYear();

			for (let index = 0; index < 12; index++) {
				depense.push(0);
				recette.push(0);
			}

			for (let index = thisYear - 4; index <= thisYear; index++) {
				years.push(index);
				yearlyDepense.push(0);
				yearlyRecette.push(0);
			}

			await axios(`http://127.0.0.1:8000/api/mouvement/kpi/${userid}`, config)
				.then((res) => {
					const mouvement = res.data[0];

					for (let key in mouvement) {
						depense[mouvement[key].m - 1] = parseInt(mouvement[key].depense);
						recette[mouvement[key].m - 1] = parseInt(mouvement[key].recette);
					}

					const mouvementAnnuel = res.data[1];

					for (let key in mouvementAnnuel) {
						let index = years.findIndex(
							(index) => index === mouvementAnnuel[key].y
						);
						yearlyDepense[index] = parseInt(mouvementAnnuel[key].depense);
						yearlyRecette[index] = parseInt(mouvementAnnuel[key].recette);
					}

					context.commit("set_monthly_kpi", {
						depense: depense,
						recette: recette,
					});
					const yearsStr = years.map((val) => String(val));

					context.commit("set_yearly_kpi", {
						yearlyDepense: yearlyDepense,
						yearlyRecette: yearlyRecette,
						years: yearsStr,
					});
				})
				.catch((err) => err);
		},
		async loadEntréSortie(context) {
			const userId = context.rootGetters["auth/userId"];
			const config = {
				headers: {
					Authorization: `Bearer ${context.rootGetters["auth/getToken"]}`,
				},
			};
			await axios
				.get("http://127.0.0.1:8000/api/ressourcetotal/user/" + userId, config)
				.then((res) => {
					let payloadEntréSortie = {
						entré: res.data.entré,
						sortie: res.data.sortie,
					};
					context.commit("setEntréSortie", payloadEntréSortie);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		async loadMouvement(context) {
			const config = {
				headers: {
					Authorization: `Bearer ${context.rootGetters["auth/getToken"]}`,
				},
			};
			const userId = context.rootGetters["auth/userId"];
			await axios
				.get("http://127.0.0.1:8000/api/mouvement/user/" + userId, config)
				.then((res) => {
					console.log(userId);
					console.log(res);
					context.commit("setMouvement", res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		async deleteMouvement(context, payload) {
			const config = {
				headers: {
					Authorization: `Bearer ${context.rootGetters["auth/getToken"]}`,
				},
			};
			await axios
				.delete("http://127.0.0.1:8000/api/mouvement/" + payload, config)
				.then((res) => {
					console.log(res);
					context.dispatch("loadMouvement");
					context.dispatch("loadEntréSortie");
				})
				.catch((err) => {
					throw new Error(
						" une erreur s'est produite lors de la suppression, status : " +
							err.response.status
					);
				});
		},
	},
	getters: {
		totalEntré(state) {
			return state.totalEntré;
		},
		totalSortie(state) {
			return state.totalSortie;
		},
		mouvements(state) {
			return state.mouvements;
		},
		monthly_kpi_recette(state) {
			return state.monthly_kpi_recette;
		},
		monthly_kpi_depense(state) {
			return state.monthly_kpi_depense;
		},
		yearly_kpi_depense(state) {
			return state.yearly_kpi_depense;
		},
		yearly_kpi_recette(state) {
			return state.yearly_kpi_recette;
		},
		years_kpi(state) {
			return state.years_kpi;
		},
	},
};
