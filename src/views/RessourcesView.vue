<template>
	<div class="wrapper">
		<!-- 		<div class="breadcrumb">
			<router-link to="/" style="text-align: left">Tableau de bord</router-link>
			/ Liste des ressources
		</div> -->
		<Breadcrumb pageName="Liste des ressources" />
		<h2 class="titlePage">Liste des ressources</h2>
		<div class="main">
			<table class="table">
				<thead>
					<tr>
						<th>Ressource</th>
						<th>N° de compte</th>

						<th>Solde</th>
						<th>actions</th>
					</tr>
				</thead>
				<tr v-if="loading">
					<td colspan="4">
						<Spinner class="loading"></Spinner>
					</td>
				</tr>
				<tr v-else-if="!loading && error">
					<td colspan="4">
						<span>{{ errorText }} </span>
					</td>
				</tr>
				<tr v-else-if="ressources.length === 0">
					<td colspan="4">
						<span>Il y'a pas de ressource enregistrer pour l'instant</span>
					</td>
				</tr>

				<transition-group name="list" tag="tbody" v-else>
					<tr v-for="(ressource, index) in ressources" :key="index">
						<td>{{ ressource.nom_ressource }}</td>
						<td>
							{{ ressource.num_compte == "" ? "-" : ressource.num_compte }}
						</td>

						<td>{{ soldeFormat(ressource.solde) }}</td>
						<td class="action">
							<button class="x" @click="deleteRessource(ressource.id)">
								<i class="fa-solid fa-x"></i>
							</button>
							&nbsp;
							<button class="minus" @click="editRessource(ressource.id)">
								<i class="fa-solid fa-minus"></i>
							</button>
						</td>
					</tr>
				</transition-group>
			</table>
			<button class="btn" @click="open = !open">Ajouter Ressource</button>

			<ModalRessource
				v-on:toggleModal="toggleHiden"
				:open="open"
			></ModalRessource>
			<ModalRessourceEdit
				v-on:toggleModal="toggleHiden"
				:openEdit="openEdit"
				:editId="editId"
			>
			</ModalRessourceEdit>
			<ModalConfirmation
				v-on:toggleModal="toggleModalConfirmation"
				:openConfirmation="openConfirmation"
				:idDelete="idDelete"
			></ModalConfirmation>
		</div>
	</div>
</template>

<script>
import ModalConfirmation from "../components/ui/ModalConfirmation.vue";
import Spinner from "../components/ui/Spinner.vue";
import ModalRessource from "../components/ressource/ModalRessource.vue";
import ModalRessourceEdit from "../components/ressource/ModalRessourceEdit.vue";
import Breadcrumb from "@/components/ui/Breadcrumb";
/* import BaseModal from "../components/ui/BaseModal.vue"; */
export default {
	components: {
		ModalRessource,
		ModalRessourceEdit,
		Spinner,
		ModalConfirmation,
		Breadcrumb,
	},
	data() {
		return {
			hidden: false,
			open: false,
			openEdit: false,
			editId: null,
			loading: true,
			errorText: "",
			error: false,
			openConfirmation: false,
			idDelete: null,
		};
	},
	/* 	provide() {
		return {
			open: this.open,
		};
	}, */
	methods: {
		async loadRessources() {
			try {
				await this.$store.dispatch("ressources/loadRessources");
			} catch (error) {
				this.error = true;
				this.loading = false;
				this.errorText =
					`Une Erreur s'est produise , code de l'erreur: ` + error;
			}

			this.loading = false;
		},
		soldeFormat(solde) {
			return new Intl.NumberFormat("fr-FR").format(Number(solde)) + ".00 DA";
		},
		toggleHiden() {
			this.hidden = false;
			this.open = false;
			/*  */
			this.editId = null;
			this.openEdit = false;
		},
		toggleModalConfirmation() {
			this.idDelete = null;
			this.openConfirmation = false;
		},
		deleteRessource(id) {
			this.idDelete = id;
			this.openConfirmation = true;
		},
		editRessource(id) {
			this.editId = id;
			this.openEdit = true;
		},
	},
	computed: {
		ressources() {
			return this.$store.getters["ressources/ressources"];
		},
	},
	created() {
		this.loadRessources();
	},
	beforeMount() {
		console.log("before mount");
		this.$store.dispatch("auth/checkToken");
	},
	beforeCreate() {
		console.log("before create");
		this.$store.dispatch("auth/checkToken");
	},
};
</script>

<style scoped>
/* CSS Snippet For Responsive Table - Stylized */

/* Basic */

* {
	box-sizing: border-box;
}

.btn {
	cursor: pointer;
	background-color: #9c88ff;
	box-shadow: var(--box-shadow);
	color: #fff;
	border: 0;
	display: block;
	font-size: 16px;
	margin: 10px 0 30px;
	padding: 10px;
	width: 180px;
}

.btn:focus,
.delete-btn:focus,
.edit-btn:focus {
	outline: 0;
}

.main {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	margin-top: 40px;
}

table {
	border-spacing: 0px;
	border-collapse: collapse;
	width: 100%;
	max-width: 85%;
	margin-bottom: 15px;
	background-color: transparent; /* Change the background-color of table here */
	text-align: left; /* Change the text-alignment of table here */
}

th {
	font-weight: bold;
	border: 1px solid #cccccc; /* Change the border-color of heading here */
	padding: 8px;
	width: 25%;
}

td {
	border: 1px solid #cccccc; /* Change the border-color of cells here */
	padding: 8px;
}

/* Stylized */
.action {
	display: flex;
	justify-content: center;
	align-items: center;
}
/* Adding Striped Effect for odd rows */

tr {
	background-color: transparent; /* Change the default background-color of rows here */
}

tr:nth-of-type(2n + 1) {
	background-color: #eeeeee; /* Change the background-color of odd rows here */
}

tr th {
	background-color: #6d5eb4; /* Change the background-color of heading here */
}
button {
	color: #6d5eb4;
	border: 0px;
	border-radius: 5px;
	padding: 3px 5px;
	border-radius: 30px;
}

h2.titlePage {
	text-align: left;
	margin-left: 65px;
	color: #2c3e50;

	font-weight: 600;
}
@media (max-width: 550px) {
	/* 	.breadcrumb {
		margin-left: 35px;
	} */
	h2.titlePage {
		margin-left: 35px;
		font-size: 1em;
	}
}

a {
	text-decoration: none;
	color: #6d5eb4;
}

.x:hover {
	color: #ccc;
	background: #e74c3c;
}

.minus:hover {
	color: #ccc;
	background: #6d5eb4;
}

/* Adding Hover Effect for rows */

tr {
	-moz-transition: background-color 300ms ease-in-out 0s;
	-ms-transition: background-color 300ms ease-in-out 0s;
	-o-transition: background-color 300ms ease-in-out 0s;
	-webkit-transition: background-color 300ms ease-in-out 0s;
	transition: background-color 300ms ease-in-out 0s;
}

tr:hover {
	background-color: #9c88ff; /* Change the hover background-color of rows here */
}

/* Removing left and right border of rows for modern UIs */

tr {
	border-top: 1px solid #cccccc;
	border-bottom: 1px solid #cccccc;
}

th,
td {
	border: none;
	text-align: center;
}

/* animation groupe */

.list-enter-active,
.list-leave-active {
	transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}
.list-move {
	transition: transform 1s;
	position: absolute;
}
/* .list-leave-active {
	position: absolute; 
} */
@media (max-width: 602px) {
	.table {
		font-size: 14px;
		overflow: auto;
	}
	.table td {
		font-size: 13px;
	}
	.x,
	.minus {
		font-size: 12px;
	}
}
</style>
