<template>
	<div class="wrapper">
		<Breadcrumb pageName="Liste des ressources" />
		<h2 class="titlePage">Liste des mouvements</h2>
		<!-- <h2>Expense Tracker</h2> -->

		<div class="container">
			<h4>Votre Solde</h4>
			<Spinner class="loading" v-if="loadingSold"></Spinner>
			<h1 v-else id="balance">
				{{ displaySolde }}
			</h1>

			<div class="inc-exp-container">
				<div>
					<h4>Ressources</h4>
					<p id="money-plus" class="money plus">+{{ ressources }}</p>
				</div>
				<div>
					<h4>Dépenses</h4>
					<p id="money-minus" class="money minus">-{{ depenses }}</p>
				</div>
			</div>

			<h3>Historique</h3>

			<div class="inner-container">
				<Spinner class="loading" v-if="loading"></Spinner>
				<span v-else-if="!loading && error">{{ errorText }}</span>
				<ul v-else id="list" class="list">
					<!-- <li class="minus">
				Cash <span>-$400</span><button class="delete-btn">x</button
				><button class="edit-btn">-</button>
			</li>
			<li class="plus">
				Achat fourniture <span>+$30.000,00</span
				><button class="delete-btn">x</button
				><button class="edit-btn">-</button>
			</li> -->
					<li
						v-for="(mouvement, index) in mouvements"
						:key="index"
						:class="mvmType(mouvement.type_mouvement_id)"
					>
						<div class="description">
							<span>{{ description(mouvement.description) }}</span>
							<span class="date">{{
								formatDate(mouvement.date_mouvement)
							}}</span>
						</div>
						<div class="montant">
							{{ mouvement.type_mouvement_id == 1 ? "+" : "-" }}
							{{ mouvement.montant }} DA
							<button
								class="delete-btn-inside"
								@click="deleteMouvement(mouvement.id)"
							>
								<i class="fa-solid fa-x x"></i></button
							><button
								class="edit-btn-inside"
								@click="editMouvement(mouvement.id)"
							>
								<i class="fa-solid fa-minus minus"></i>
							</button>
						</div>
						<button class="delete-btn" @click="deleteMouvement(mouvement.id)">
							<i class="fa-solid fa-x"></i></button
						><button class="edit-btn" @click="editMouvement(mouvement.id)">
							<i class="fa-solid fa-minus"></i>
						</button>
					</li>
				</ul>
			</div>
			<button class="btn" @click="hidden = open = true">
				Ajouter transaction
			</button>
			<Modal v-on:toggleModal="toggleHiden" :open="open" />
			<ModalEdit
				v-on:toggleModal="toggleHiden"
				:openEdit="openEdit"
				:editId="editId"
			/>
		</div>
	</div>
</template>

<script>
/* todo
	--update from ressource a chaque add ou edit
	--login
	--sanctum coté laravel
	--token management vuex
	--route beforeEach...etc
	--déploiement
*/
/* import { mapState, mapGetters } from "vuex"; */
import Breadcrumb from "@/components/ui/Breadcrumb";
import Spinner from "../components/ui/Spinner.vue";
import Modal from "../components/ui/Modal.vue";

import ModalEdit from "../components/ui/ModalEdit.vue";
export default {
	components: { Modal, Spinner, ModalEdit, Breadcrumb },
	data() {
		return {
			hidden: false,
			mouvementsData: null,
			loading: true,
			loadingSold: true,
			error: false,
			errorText: "",
			displaySolde2: null,
			open: false,
			editId: null,
			openEdit: false,
		};
	},
	methods: {
		formatDate(data) {
			const date = new Date(data);
			const month = date.getMonth() + 1;
			return [
				date.getDate().toString().padStart(2, "0"),
				month.toString().padStart(2, "0"),
				date.getFullYear().toString().padStart(2, "0"),
			].join("/");
		},
		toggleHiden() {
			this.editId = null;
			this.openEdit = false;
			this.open = false;
		},
		mvmType(mvm) {
			if (mvm === 1) {
				return "plus";
			} else {
				return "minus";
			}
		},
		async deleteMouvement(id) {
			try {
				await this.$swal({
					title: "Confirmation",
					text: "Est-vous sûr de bien vouloir supprimer ce mouvement ?",
					type: "warning",
					showCancelButton: true,
					showCloseButton: true,
					confirmButtonText: "Oui",
					cancelButtonText: "Non",
					showLoaderOnConfirm: true,
				}).then((res) => {
					if (res.value) {
						this.$store.dispatch("mouvements/deleteMouvement", id);
						this.$swal.fire({
							target: "#custom-target",
							customClass: {
								container: "position-absolute",
							},
							toast: true,
							position: "top-end",
							showConfirmButton: false,
							timer: 3000,
							timerProgressBar: true,
							didOpen: (toast) => {
								toast.addEventListener("mouseenter", this.$swal.stopTimer);
								toast.addEventListener("mouseleave", this.$swal.resumeTimer);
							},
							icon: "success",
							title: "Suppression réussite",
						});
					} else {
						this.$swal("", "Suppression annuler", "info");
					}
				});

				console.log("ok");
			} catch (error) {
				const err =
					error.message.charAt(1).toUpperCase() + error.message.slice(2);
				/* 				this.$swal({
					title: "Are you sure?",
					text: "You can't revert your action",
					type: "warning",
					showCancelButton: true,
					confirmButtonText: "Yes Delete it!",
					cancelButtonText: "No, Keep it!",
					showCloseButton: true,
					showLoaderOnConfirm: true,
				}).then((result) => {
					if (result.value) {
						this.$swal(
							"Deleted",
							"You successfully deleted this file",
							"success"
						);
					} else {
						this.$swal("Cancelled", "Your file is still intact", "info");
					}
				}); */

				this.$swal.fire({
					text: `${err}`,
					target: "#custom-target",
					customClass: {
						container: "position-absolute",
					},
					toast: true,
					position: "top-end",
					showConfirmButton: false,
					timer: 3000,
					timerProgressBar: true,
					didOpen: (toast) => {
						toast.addEventListener("mouseenter", this.$swal.stopTimer);
						toast.addEventListener("mouseleave", this.$swal.resumeTimer);
					},
					icon: "error",
					title: "Suppression impossible",
				});
			}
		},
		editMouvement(id) {
			this.editId = id;
			this.openEdit = true;
		},

		async loadMouvement() {
			try {
				await this.$store.dispatch("mouvements/loadMouvement");
				await this.$store.dispatch("ressources/loadRessources");
			} catch (error) {
				this.error = true;
				this.errorText = `Une Erreur s'est produise , code de l'erreur: ${error.response.status}`;
			}
			/* this.counterFNC(); */

			await this.loadSolde();

			/* 			const solde = await this.$store.getters["ressources/solde"];  option a exploré pour le compteur du solde
			const t = this;
			t;
			this.interval = setInterval(() => {
				if (t.counter < solde) {
					console.log("tes");
					t.counter+=100;
				} else {
					console.log("no");
					clearInterval(t.interval);
				}
			}, 1);
			 */
			this.loading = false;
			this.loadingSold = false;
			/* 			/* .get("http://127.0.0.1:8000/api/ressource")
			await axios
				.get("http://127.0.0.1:8000/api/mouvement")
				.then((res) => {
					this.loading = false;
					this.mouvementsData = res.data.data;
					console.log(res);
				})
				.catch((err) => {
					this.loading = false;
					this.error = true;
					this.errorText = `Une Erreur s'est produise , code de l'erreur: ${err.response.status}`;

					console.log(this.error);
				}); */
		},

		description(dsc) {
			return dsc.length > 25 ? dsc.slice(0, 22) + "..." : dsc;
		},
		async loadSolde() {
			const solde = await this.$store.getters["ressources/solde"];

			this.displaySolde2 =
				new Intl.NumberFormat("fr-FR").format(Number(solde)) + ".00 DA";
		},
	},

	created() {
		this.$store.dispatch("ressources/loadRessources");
		this.$store.dispatch("mouvements/loadEntréSortie");
		this.loadMouvement();

		//setinterval for solde
		//https://www.youtube.com/watch?v=kOcFZV3c75I
	},
	beforeMount() {
		console.log("before mount");
		this.$store.dispatch("auth/checkToken");
	},
	beforeCreate() {
		console.log("before create");
		this.$store.dispatch("auth/checkToken");
	},
	beforeUpdate() {
		this.$store.dispatch("mouvements/loadKpi");
	},
	/* 	watch: {
		soldeGet(newValue, oldValue) {
			console.log(newValue + " " + oldValue);
		},
		solde(newValue, oldValue) {
			console.log(newValue + " " + oldValue);
		},
	}, */
	computed: {
		/* ...mapGetters({
			soldeGet: "ressources/solde", // moduleName/getterName
		}),
		...mapState("ressources", ["solde"]),*/
		mouvements() {
			return this.$store.getters["mouvements/mouvements"];
		},
		ressources() {
			const entré = this.$store.getters["mouvements/totalEntré"];
			return new Intl.NumberFormat("fr-FR").format(Number(entré)) + ".00 DA";
		},
		depenses() {
			const sortie = this.$store.getters["mouvements/totalSortie"];
			return new Intl.NumberFormat("fr-FR").format(Number(sortie)) + ".00 DA";
		},

		displaySolde() {
			const solde = this.$store.getters["ressources/solde"];

			let soldeGlobal =
				new Intl.NumberFormat("fr-FR").format(Number(solde)) + ".00 DA";

			return soldeGlobal;
		},
	},
};
</script>
<style>
:root {
	--box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}
</style>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Lato&display=swap");

:root {
	--box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

* {
	box-sizing: border-box;
}
.description {
	display: flex;
	flex-direction: column;
	text-align: left;
	flex-shrink: 3;
}
/* .info {
	display: flex;
}

.somme {
	flex-shrink: 0;
} */
.montant {
	flex-shrink: 0;
}
body {
	background-color: #f7f7f7;
	/* display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center; */
	min-height: 100vh;
	margin: 0;
	font-family: "Lato", sans-serif;
}

.container {
	margin: 30px auto;
	width: 450px;
}
.date {
	color: #333;
	font-size: 13px;
	font-style: italic;
}

h1 {
	letter-spacing: 1px;
	margin: 0;
}

h3 {
	border-bottom: 1px solid #bbb;
	padding-bottom: 10px;
	margin: 40px 0 10px;
}

h4 {
	margin: 0;
	text-transform: uppercase;
}

.inc-exp-container {
	background-color: #fff;
	box-shadow: var(--box-shadow);
	padding: 20px;
	display: flex;
	justify-content: space-between;
	margin: 20px 0;
}

.inc-exp-container > div {
	flex: 1;
	text-align: center;
}

.inc-exp-container > div:first-of-type {
	border-right: 1px solid #dedede;
}

.money {
	font-size: 20px;
	letter-spacing: 1px;
	margin: 5px 0;
}

.money.plus {
	color: #2ecc71;
}

.money.minus {
	color: #c0392b;
}

label {
	display: inline-block;
	margin: 10px 0;
}

input[type="text"],
input[type="number"] {
	border: 1px solid #dedede;
	border-radius: 2px;
	display: block;
	font-size: 16px;
	padding: 10px;
	width: 100%;
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
	width: 100%;
	border-radius: 30px;
}

.btn:focus,
.delete-btn:focus,
.edit-btn:focus {
	outline: 0;
}

.list {
	list-style-type: none;
	padding: 0;
	margin-bottom: 40px;
}

.list li {
	background-color: #fff;
	box-shadow: var(--box-shadow);
	color: #333;
	display: flex;
	justify-content: space-between;
	position: relative;
	padding: 10px;
	margin: 10px 0;
}

.list li.plus {
	border-right: 5px solid #2ecc71;
}

.list li.minus {
	border-right: 5px solid #c0392b;
}

.delete-btn {
	cursor: pointer;
	background-color: #e74c3c;
	border: 0;
	color: #fff;
	width: 25px;
	height: 25px;
	font-size: 12px;
	line-height: 50%;
	/* padding: 0px 5px 2px 5px; */
	position: absolute;
	top: 50%;
	left: 0;
	transform: translate(-100%, -50%);
	opacity: 0;
	transition: opacity 0.3s ease;
	border-radius: 30px;
}
.edit-btn {
	cursor: pointer;
	background-color: #9c88ff;
	border: 0;
	color: #fff;
	width: 25px;
	height: 25px;
	font-size: 12px;
	line-height: 50%;
	/* padding: 0px 5px 2px 5px; */
	position: absolute;
	top: 50%;
	left: -25px;
	transform: translate(-100%, -50%);
	opacity: 0;
	transition: opacity 0.3s ease;
	border-radius: 30px;
}
.edit-btn-inside,
.delete-btn-inside {
	display: none;
}
.edit-btn-inside {
	cursor: pointer;
	background-color: #fff;
	border: 0;
	color: #fff;
	width: 20px;
	height: 20px;
	font-size: 12px;
	line-height: 50%;
	border-radius: 10px;
	transition: all 0.3s ease;
}
.x {
	color: #e74c3c;
	transition: all 0.4s ease;
}
.minus {
	color: #9c88ff;
	transition: all 0.4s ease;
}
.delete-btn-inside {
	cursor: pointer;
	background-color: #fff;
	border: 0;
	color: #fff;
	width: 20px;
	height: 20px;
	font-size: 12px;
	line-height: 50%;
	border-radius: 10px;
	transition: all 0.3s ease;
}
.delete-btn-inside:hover {
	background: #e74c3c;
}
.delete-btn-inside:hover .x {
	color: #fff;
}
.edit-btn-inside:hover {
	background: #9c88ff;
}
.edit-btn-inside:hover .minus {
	color: #fff;
}
i {
	font-size: 10px;
}

.list li:hover .delete-btn,
.list li:hover .edit-btn {
	opacity: 1;
}
h2.titlePage {
	text-align: left;
	margin-left: 65px;
	color: #2c3e50;

	font-weight: 600;
}
@media (max-width: 600px) {
	.sidebar {
		display: none;
	}
	.container {
		margin: 0 auto;
		width: 90%;
		display: flex;
		justify-content: center;
		align-items: stretch;
		flex-direction: column;
	}
	.inner-container {
		width: 95%;
		display: inline-block;
		align-self: flex-end;
	}
	.list li {
		padding: 10px 2px 10px 10px;
	}
	.edit-btn {
		display: none;
	}
	.delete-btn {
		display: none;
	}

	.edit-btn-inside,
	.delete-btn-inside {
		display: inline-block;
	}
	.inc-exp-container > div {
		display: flex;
		flex-direction: column;
		justify-content: stretch;
		align-items: stretch;
	}

	.money.minus,
	.money.plus {
		flex-shrink: 1;
		transition: all 0.3s ease;
	}
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
@media (max-width: 500px) {
	#balance {
		font-size: 28px;
	}
	.inc-exp-container h4 {
		font-size: 14px;
	}
	.inc-exp-container {
		flex-direction: column;
	}
	.inc-exp-container p {
		text-align: center;
	}
	.money.plus,
	.money.minus {
		font-size: 16px;
		/* display: flex; */
		font-weight: bold;
	}
	.inc-exp-container > div:first-of-type {
		border-right: 0px;
	}
	/* todo Add media query to IPAD */
}
</style>
