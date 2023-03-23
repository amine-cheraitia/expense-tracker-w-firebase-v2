<template>
	<div class="home wrapper">
		<!-- 		<img alt="Vue logo" src="../assets/logo.png" />
		<HelloWorld msg="Welcome to Your Vue.js App" /> -->
		<h2>Expense Tracker</h2>
		<div class="number-section">
			<div class="number-box">
				<span class="mark"><i class="fa-solid fa-sack-dollar"></i></span>
				<div class="titre">Le solde total</div>
				<Loader class="loading" v-if="loading"></Loader>
				<span class="money solde" v-else>+{{ displaySolde }}</span>
				<hr class="dark-horizontal" />
				<div class="link-to">
					<router-link to="/ressources" class="link-to"
						>Voir plus <i class="fa-solid fa-arrow-right"></i
					></router-link>
				</div>
			</div>
			<div class="number-box">
				<span class="mark"><i class="fa-solid fa-arrow-trend-down"></i></span>
				<div class="titre">Montant des sortie</div>
				<Loader class="loading" v-if="loading"></Loader>
				<span class="money minus" v-else>-{{ depenses }}</span>
				<hr class="dark-horizontal" />
				<div class="link-to">
					<router-link to="/ressources" class="link-to"
						>Voir plus <i class="fa-solid fa-arrow-right"></i
					></router-link>
				</div>
			</div>
			<div class="number-box">
				<span class="mark"><i class="fa-solid fa-arrow-trend-up"></i></span>
				<div class="titre">Montant des entrés</div>
				<Loader class="loading" v-if="loading"></Loader>
				<span class="money plus" v-else>{{ ressources }}</span>
				<hr class="dark-horizontal" />
				<div class="link-to">
					<router-link to="/ressources" class="link-to"
						>Voir plus <i class="fa-solid fa-arrow-right"></i
					></router-link>
				</div>
			</div>
		</div>
		<div class="chart-section">
			<!-- <div class="row"> -->
			<div class="chart-box">
				<div class="chart-wrapper">
					<div class="chart-container">
						<canvas id="recetteChart"></canvas>
					</div>
					<div class="sub-title">
						Evolution mensuelle des dépenses et des recettes
					</div>
				</div>
			</div>
			<!-- 				<div class="chart-box">
					<div class="chart-wrapper">
						<canvas id="depenseChart"></canvas>
					</div>
				</div>
			</div> -->
			<div class="chart-box">
				<div class="chart-wrapper">
					<div class="chart-container">
						<canvas id="annuelChart"></canvas>
					</div>
					<div class="sub-title">
						Evolution annuel des dépenses et des recettes
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
/* import HelloWorld from "@/components/HelloWorld.vue"; */
/* import { BarChart } from "@/components/Charts/BarChart.vue"; */
import Chart from "chart.js/auto";
import Loader from "@/components/ui/Loader.vue";
/* import Spinner from "../components/ui/Spinner.vue"; */
export default {
	data() {
		return {
			loading: true,
			montant: [150, 0, 2000, 300, 40040, 0, 0, 0, 50, 10000, 10, 100],
			montant2: [
				30000, 500, 250, 0, 13000, 0, 50500, 0, 0, 45000, 45000, 22000,
			],
		};
	},
	name: "HomeView",
	components: {
		Loader,
	},
	methods: {
		async loadMouvement() {
			try {
				await this.$store.dispatch("mouvements/loadMouvement");
				await this.$store.dispatch("ressources/loadRessources");
				await this.$store.dispatch("ressources/loadRessources");
				await this.$store.dispatch("mouvements/loadEntréSortie");
				/* await this.$store.dispatch("mouvements/loadKpi"); */
			} catch (error) {
				error;
				/* 	this.error = true;
				this.errorText = `Une Erreur s'est produise , code de l'erreur: ${error.response.status}`; */
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
		},
		async loadSolde() {
			const solde = await this.$store.getters["ressources/solde"];

			this.displaySolde2 =
				new Intl.NumberFormat("fr-FR").format(Number(solde)) + ".00 DA";
		},
		async loadKpi() {
			await this.$store.dispatch("mouvements/loadKpi");
		},
	},
	computed: {
		loadEntré() {
			return false;
		},

		displaySolde() {
			const solde = this.$store.getters["ressources/solde"];

			let soldeGlobal =
				new Intl.NumberFormat("fr-FR").format(Number(solde)) + ".00 DA";

			return soldeGlobal;
		},
		ressources() {
			const entré = this.$store.getters["mouvements/totalEntré"];
			return new Intl.NumberFormat("fr-FR").format(Number(entré)) + ".00 DA";
		},
		depenses() {
			const sortie = this.$store.getters["mouvements/totalSortie"];
			return new Intl.NumberFormat("fr-FR").format(Number(sortie)) + ".00 DA";
		},
		kpiMonthlyDepense() {
			return this.$store.getters["mouvements/monthly_kpi_depense"];
		},
		kpiMonthlyRecette() {
			return this.$store.getters["mouvements/monthly_kpi_recette"];
		},
		kpiYearlyRecette() {
			return this.$store.getters["mouvements/yearly_kpi_recette"];
		},
		kpiYearlyDepense() {
			return this.$store.getters["mouvements/yearly_kpi_depense"];
		},
		years_kpi() {
			return this.$store.getters["mouvements/years_kpi"];
		},
	},
	beforeMount() {
		console.log("beforemount");
	},
	async mounted() {
		await this.loadKpi();
		const labels = [
			"Jan.",
			"Fev.",
			"Mars",
			"Avr.",
			"Mai.",
			"Juin",
			"Juil",
			"Août",
			"Sep.",
			"Oct.",
			"Nov.",
			"Déc.",
		];
		console.log("ici");
		console.log(this.years_kpi);
		const labels2 = this.years_kpi;

		const data = {
			labels: labels2,
			datasets: [
				{
					label: "Recette",
					backgroundColor: "#fff",
					borderColor: "#fff",
					data: this.kpiYearlyRecette,
					borderWidth: 3,
					hoverBackgroundColor: "#f7f7f7",
					hoverBorderColor: "#2ecc71",
					scaleStepWidth: 4,
				},
				{
					label: "Dépenses",
					backgroundColor: "#514785" /* #c0392b*/,
					borderColor: "#514785",
					data: this.kpiYearlyDepense,
					borderWidth: 3,
					hoverBackgroundColor: "#6d5eb4",
					hoverBorderColor: "#c0392b",
					scaleStepWidth: 4,
				},
			],
		};

		const config1 = {
			type: "bar",
			responsive: true,
			scaleFontColor: "#FFFFFF",
			legend: {
				display: false,
			},
			data: data,
			stacked: true,
			options: {
				responsive: true,
				scales: {
					x: {
						grid: {
							display: false,
							borderColor: "#514785",
						},

						ticks: {
							font: { weight: 500 },
							maxTicksLimit: 12,
							color: "#fff",
							padding: 8,
						},
						min: 0,
					},

					y: {
						ticks: {
							font: { weight: 550 },
							color: "#fff",
							min: 0,
							padding: 8,
							max: 1000000,
							maxTicksLimit: 7,
							callback: function (value) {
								return value + " DA";
							},
						},
						grid: {
							color: "#fff",
							borderDash: [5],
							drawBorder: false,
							tickLength: 3,
						},
					},
				},
			},
			/* 			color: "red",
			backgroundColor: "red", */
			color: "red",
			backgroundColor: "red",
			plugins: [
				{
					beforeDraw: (chart) => {
						const { ctx } = chart;
						ctx.save();
						ctx.globalCompositeOperation = "destination-over";
						ctx.fillStyle = "#9c88ff";
						ctx.fillRect(0, 0, chart.width, chart.height);
						ctx.restore();
					},
				},
			],
		};

		const data2 = {
			labels: labels,
			datasets: [
				{
					label: "Dépense",
					backgroundColor: "#fff",
					borderColor: "#fff",
					/* 					borderColor: "rgb(255, 99, 132)", */

					data: this.kpiMonthlyDepense,
					borderWidth: 5,
					hoverBackgroundColor: "#514785 ",
					hoverBorderColor: "yellow",
					scaleStepWidth: 4,
				},

				{
					label: "Recette",
					backgroundColor: "#514785" /* #c0392b*/,
					borderColor: "#514785",
					data: this.kpiMonthlyRecette,
					borderWidth: 5,
					hoverBackgroundColor: "#514785",
					hoverBorderColor: "#514785",
					scaleStepWidth: 4,
				},
			],
		};
		const config2 = {
			type: "line",
			responsive: true,
			scaleFontColor: "#FFFFFF",
			legend: {
				display: false,
			},
			data: data2,
			options: {
				responsive: true,
				scales: {
					x: {
						grid: {
							display: false,
							borderColor: "#514785",
						},

						ticks: {
							font: { weight: 550 },
							maxTicksLimit: 12,
							color: "#fff",
							padding: 8,
						},
						min: 0,
					},

					y: {
						ticks: {
							font: { weight: 550 },
							color: "#fff",
							min: 0,
							padding: 8,
							max: 1000000,
							maxTicksLimit: 7,
							callback: function (value) {
								return value + " DA";
							},
						},
						grid: {
							color: "#fff",
							borderDash: [5],
							drawBorder: false,
							tickLength: 3,
						},
					},
				},
			},
			color: "red",
			backgroundColor: "red",
			plugins: [
				{
					beforeDraw: (chart) => {
						const { ctx } = chart;
						ctx.save();
						ctx.globalCompositeOperation = "destination-over";
						ctx.fillStyle = "#9c88ff";
						ctx.fillRect(0, 0, chart.width, chart.height);
						ctx.restore();
					},
				},
			],
		};

		const data3 = {
			labels: labels,
			datasets: [
				{
					label: "Recette",
					backgroundColor: "#fff" /* */,
					borderColor: "#fff",
					/* 					borderColor: "rgb(255, 99, 132)", */
					data: this.montant,
					borderWidth: 5,
					hoverBackgroundColor: "#514785 ",
					hoverBorderColor: "yellow",
					scaleStepWidth: 4,
				},
			],
		};
		data3;
		/* 		const config3 = {
			type: "line",
			responsive: true,
			scaleFontColor: "#FFFFFF",
			legend: {
				display: false,
			},
			data: data3,
			options: {
				responsive: true,
				scales: {
					x: {
						grid: {
							display: false,
						},

						ticks: {
							font: { weight: 550 },
							maxTicksLimit: 12,
							color: "#fff",
							padding: 8,
						},
						min: 0,
					},

					y: {
						ticks: {
							font: { weight: 550 },
							color: "#fff",
							min: 0,
							padding: 8,
							max: 1000000,
							maxTicksLimit: 7,
							callback: function (value) {
								return value + " DA";
							},
						},
						grid: {
							color: "#fff",
							borderDash: [5],
							drawBorder: false,
							tickLength: 3,
						},
					},
				},
			},
			color: "red",
			backgroundColor: "red",
			plugins: [
				{
					beforeDraw: (chart) => {
						const { ctx } = chart;
						ctx.save();
						ctx.globalCompositeOperation = "destination-over";
						ctx.fillStyle = "#9c88ff";
						ctx.fillRect(0, 0, chart.width, chart.height);
						ctx.restore();
					},
				},
			],
		}; */
		const myChart = new Chart(document.getElementById("recetteChart"), config2);
		myChart;
		/* 		const myChart2 = new Chart(
			document.getElementById("depenseChart"),
			config2
		);
		myChart2; */
		/* config3; */
		const myChart3 = new Chart(document.getElementById("annuelChart"), config1);
		myChart3;
	},
	created() {
		this.loadMouvement();
		/* this.loadKpi(); */
	},
};
</script>
<style scoped>
.chart-wrapper {
	position: relative;
	width: 520px;
	height: 350px;
}
.chart-box {
	margin: 40px;
	box-shadow: 2px 2px 5px #9c88ff;
	border: #9c88ff 0.5px solid;
	outline: none;
	border-radius: 18px;
	background: #fff;
	height: 320px;
	position: relative;
}
.chart-container {
	position: relative;
	border: #9c88ff 0.5px solid;

	width: 100%;
}
.sub-title {
	position: absolute;
	bottom: 40px;
	left: 25px;
}
#recetteChart,
#depenseChart,
#annuelChart {
	border-radius: 15px;
	position: absolute;
	top: -15px;
	width: 100%;
	height: 260px;
	border-top: #9c88ff 0.5px solid;
}

.home {
	/* border: 1px solid red; */
	display: flex;
	/* justify-content: space-evenly; */
	align-items: center;
	/* min-height: 90vh; */
	flex-direction: column;
	justify-content: center;
}
.number-section,
.chart-section {
	/* border-radius: 18px; */
	padding: 15px;
	/* 	border: #9c88ff 0.5px solid;
	box-shadow: 2px 2px 5px #9c88ff;
	background: #fff; */
}

.number-section {
	width: 90%;
	justify-content: center;
	margin-bottom: 20px;
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}
.chart-section {
	width: 90%;
	/* height: 500px; */
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}
.number-box {
	padding: 15px;
	border: #9c88ff 0.5px solid;
	/* width: 280px; */
	height: 100px;
	flex: 0 0 25%;
	display: flex;
	flex-direction: column;
	/* justify-content: center; */
	align-items: center;
	border: #9c88ff 0.5px solid;
	box-shadow: 2px 2px 5px #9c88ff;
	background: #fff;
	border-radius: 18px;
	margin: 15px;
}

.number-box .titre,
.number-box .money {
	text-align: right;
	width: 100%;
}
.dark-horizontal {
	background-image: linear-gradient(
		90deg,
		transparent,
		rgba(0, 0, 0, 0.4),
		transparent
	);
	border-top: none;
	margin-right: 0;
	margin-left: 0;
	margin-top: 20px;
	width: 80%;
	height: 1px;
	background-color: transparent;
	opacity: 0.25;
}
.titre {
	font-weight: 300;
	color: #9c88ff;
	text-transform: capitalize;
	padding: 3px;
}
.link-to {
	color: #9c88ff;
	font-weight: 300;
	text-align: left;
	width: 100%;
	text-decoration: none;
	margin-left: 10px;
	transition: 0.5 ease;
}
.link-to:hover {
	text-decoration: underline;
	font-weight: 500;
}
.fa-arrow-right {
	float: right;
	margin-right: 10px;
}
.mark {
	/* width: 100%; */
	position: relative;
}
.mark .fa-arrow-trend-up {
	border: 0.5px solid;
	background: #2ecc71; /* 9c88ff */
	color: #fff;
	font-size: 24px;
	padding: 20px;
	position: absolute;
	top: -35px;
	left: -155px;
	border-radius: 18px;
}
.mark .fa-arrow-trend-down {
	border: #c0392b 0.5px solid;
	background: #fff;
	color: #c0392b;
	font-size: 24px;
	padding: 20px;
	position: absolute;
	top: -35px;
	left: -155px;
	border-radius: 18px;
}
.mark .fa-sack-dollar {
	border: 0.5px solid;
	background: #9c88ff;
	color: #fff;
	font-size: 24px;
	padding: 20px;
	position: absolute;
	top: -35px;
	left: -155px;
	border-radius: 18px;
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
.money.solde {
	font-weight: 700;
}

@media (min-width: 1550px) {
	.mark .fa-arrow-trend-up {
		left: -170px;
	}
	.mark .fa-arrow-trend-down {
		left: -170px;
	}
	.mark .fa-sack-dollar {
		left: -170px;
	}
}
@media (min-width: 1750px) {
	.mark .fa-arrow-trend-up {
		left: -200px;
	}
	.mark .fa-arrow-trend-down {
		left: -200px;
	}
	.mark .fa-sack-dollar {
		left: -200px;
	}
}
@media (max-width: 1370px) {
	.chart-section {
		width: 100%;
	}
}
@media (max-width: 1300px) {
	.mark .fa-arrow-trend-up {
		left: -130px;
	}
	.mark .fa-arrow-trend-down {
		left: -130px;
	}
	.mark .fa-sack-dollar {
		left: -130px;
	}
}
@media (max-width: 1180px) {
	.number-section {
		justify-content: baseline;
	}
	.number-box {
		flex: 0 2 43%;
	}
	.mark .fa-arrow-trend-up {
		left: -190px;
	}
	.mark .fa-arrow-trend-down {
		left: -190px;
	}
	.mark .fa-sack-dollar {
		left: -190px;
	}
}

@media (max-width: 1016px) {
	.number-section {
		justify-content: center;
	}
	.number-box {
		flex: 0 1 70%;
	}
	.mark .fa-arrow-trend-up {
		left: -270px;
	}
	.mark .fa-arrow-trend-down {
		left: -270px;
	}
	.mark .fa-sack-dollar {
		left: -270px;
	}
}
@media (max-width: 850px) {
	.number-section,
	.chart-section {
		justify-content: center;
	}
	.number-box {
		flex: 0 1 70%;
	}
	.mark .fa-arrow-trend-up {
		left: -230px;
	}
	.mark .fa-arrow-trend-down {
		left: -230px;
	}
	.mark .fa-sack-dollar {
		left: -230px;
	}
}

@media (max-width: 740px) {
	.number-section,
	.chart-section {
		justify-content: center;
	}
	.number-box {
		flex: 0 1 70%;
	}
	.mark .fa-arrow-trend-up {
		left: -200px;
	}
	.mark .fa-arrow-trend-down {
		left: -200px;
	}
	.mark .fa-sack-dollar {
		left: -200px;
	}
}
@media (max-width: 600px) {
	.mark .fa-arrow-trend-up {
		left: -170px;
	}
	.mark .fa-arrow-trend-down {
		left: -170px;
	}
	.mark .fa-sack-dollar {
		left: -170px;
	}
}
@media (max-width: 580px) {
	.chart-box {
		width: 95%;
	}
	.chart-box {
		margin: 40px 15px;
	}
	.chart-wrapper {
		width: 100%;
	}
}
@media (max-width: 580px) {
	.chart-box {
		width: 95%;
	}
	.chart-box {
		margin: 40px 15px;
	}
	.chart-wrapper {
		width: 100%;
	}
	.number-box {
		flex: 0 1 90%;
	}
}

@media (max-width: 579px) {
	.chart-box {
		width: 100%;
	}
	.chart-box {
		margin: 25px 10px;
	}
	.chart-wrapper {
		width: 100%;
	}
	.number-box {
		flex: 0 1 95%;
		margin-left: 0;
		margin-right: 0;
	}
}
@media (max-width: 520px) {
	.mark .fa-arrow-trend-up {
		left: -150px;
	}
	.mark .fa-arrow-trend-down {
		left: -150px;
	}
	.mark .fa-sack-dollar {
		left: -150px;
	}
	.chart-box {
		height: 290px;
	}
	.sub-title {
		bottom: 70px;
	}
}
@media (max-width: 460px) {
	.chart-box {
		height: 260px;
	}
	.sub-title {
		bottom: 100px;
	}
}
@media (max-width: 450px) {
	.chart-box {
		height: 240px;
	}
	.sub-title {
		bottom: 120px;
	}
}
@media (max-width: 350px) {
	.chart-box {
		width: 100%;
	}
	.chart-box {
		margin: 25px 10px;
	}
	.chart-wrapper {
		width: 100%;
	}
	.chart-box {
		height: 200px;
	}
	.sub-title {
		bottom: 150px;
		left: 5px;
	}
}
</style>

<!--to do dashboard modal size media query -->
