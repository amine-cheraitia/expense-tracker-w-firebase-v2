import axios from "axios";
import router from "@/router";

export default {
	namespaced: true,
	state() {
		return {
			userId: null,
			user: null,
			token: null,
		};
	},
	mutations: {
		resetUser(state) {
			state.userId = null;
			state.user = null;
			state.token = null;
		},
		setUser(state, payload) {
			state.userId = payload.userId;
			state.user = payload.user;
			state.token = payload.token;
		},
	},
	actions: {
		async logout({ commit, state }) {
			const data = { ...state.user };
			localStorage.removeItem("userId");
			localStorage.removeItem("user");
			localStorage.removeItem("token");
			await commit("resetUser");
			await axios
				.post("/api/logout", data)
				.then((r) => console.log(r.data))
				.catch((r) => console.log(r));
		},
		async login(context, payload) {
			await axios
				.post("/api/login", payload)
				.then((res) => {
					const data = {
						userId: res.data.user.id,
						user: res.data.user,
						token: res.data.token,
					};
					localStorage.setItem("userId", res.data.user.id);
					localStorage.setItem("user", JSON.stringify(res.data.user));
					localStorage.setItem("token", res.data.token);
					context.commit("setUser", data);
					console.log(res);
				})
				.catch((err) => {
					throw err.response.data.message;
				});
		},
		async signUp(context, payload) {
			await axios
				.post("/api/signup", payload)
				.then((res) => {
					const data = {
						userId: res.data.user.id,
						user: res.data.user,
						token: res.data.token,
					};
					localStorage.setItem("userId", res.data.user.id);
					localStorage.setItem("user", JSON.stringify(res.data.user));
					localStorage.setItem("token", res.data.token);
					context.commit("setUser", data);
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		async tryLogin({ commit }) {
			const userId = localStorage.getItem("userId");
			const user = JSON.parse(localStorage.getItem("user"));
			const token = localStorage.getItem("token");
			if (user && token) {
				commit("setUser", { userId: userId, user: user, token: token });
				/* router.push("/"); */
			}
			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};
			await axios
				.post("/api/checktoken", user, config)
				.then((res) => {
					console.log(res);

					commit("setUser", { userId: userId, user: user, token: token });
					/* router.push("/"); */
				})
				.catch((err) => {
					console.log(err);
					commit("resetUser");
					router.push("/login");
				});
		},
		async checkToken({ state, commit }) {
			const config = {
				headers: {
					Authorization: `Bearer ${state.token}`,
				},
			};

			await axios
				.post("/api/checktoken", state.user, config)
				.then((res) => {
					console.log(res);
					/* 					if (user && token) {
						commit("setUser", { userId: userId, user: user, token: token });
						router.push("/");
					} */
				})
				.catch((err) => {
					console.log(err);

					commit("resetUser");

					router.push("/login");
				});
		},
	},
	getters: {
		userId(state) {
			return state.userId;
		},
		getToken(state) {
			return state.token;
		},
	},
};
