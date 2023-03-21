import { createStore } from "vuex";
import mouvements from "./modules/mouvements/mouvements";
import ressources from "./modules/ressources/ressources";
import auth from "./modules/Auth/auth";

export default createStore({
	state() {
		return {
			collapsed: true,
			SIDEBAR_WITH: 180,
			SIDEBAR_WITH_COLLAPSED: 38,
		};
	},
	getters: {
		collapsed(state) {
			return state.collapsed;
		},
		Sidebarwiths(stat) {
			if (stat.collapsed == false) {
				return `${stat.SIDEBAR_WITH}px`;
			} else {
				return `${stat.SIDEBAR_WITH_COLLAPSED}px`;
			}
		},
		SIDEBAR_WITH(stat) {
			return stat.SIDEBAR_WITH;
		},
		SIDEBAR_WITH_COLLAPSED(stat) {
			return stat.SIDEBAR_WITH_COLLAPSED;
		},
	},
	mutations: {
		setClose(state) {
			state.collapsed = true;
		},
		toggleSidebar(state) {
			state.collapsed = !state.collapsed;
		},
		setSIDEBAR_WITH_COLLAPSED(state, payload) {
			state.SIDEBAR_WITH_COLLAPSED = payload;
			if (payload === 0) {
				state.SIDEBAR_WITH = 180;
			} else {
				state.SIDEBAR_WITH = 180;
			}
		},
	},
	actions: {
		toggleSidebar(context) {
			context.commit("toggleSidebar");
		},
	},
	modules: {
		mouvements: mouvements,
		ressources: ressources,
		auth: auth,
	},
});
