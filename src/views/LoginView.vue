<template>
	<div class="container">
		<form action="" method="post" @submit.prevent="sendCridential">
			<div class="card">
				<div class="title">
					<i class="fa-solid fa-chart-column"></i> Expense Tracker
				</div>
				<div class="form-container" :class="{ invalid: Errors.email }">
					<label for="email"><i class="fa-solid fa-envelope"></i> Email</label>
					<input type="email" id="email" v-model="form.email" @change="reset" />
				</div>
				<div class="form-container" :class="{ invalid: Errors.password }">
					<label for=""><i class="fa-solid fa-lock"></i> Password</label>
					<input type="password" v-model="form.password" @change="reset" />
				</div>
				<div
					class="form-control invalidTxt"
					style="margin-top: 10px"
					v-if="Errors.email || Errors.password"
				>
					<span>{{ messageError }}</span>
				</div>
				<button class="btn">Se Connecter</button>

				<button class="btn" @click="$router.push('/signup')">S'inscrire</button>
			</div>
		</form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			form: {
				email: null,
				password: null,
			},
			Errors: {
				email: false,
				password: false,
			},
			messageError: "Veuillez saisir correctement vos identifiants",
		};
	},
	methods: {
		async sendCridential() {
			/* axios part */
			const data = { ...this.form };
			this.messageError = "Veuillez saisir correctement vos identifiants";
			if (data.email === "" || data.email === null) {
				console.log("email erreur");
				this.Errors.email = true;
			}
			if (data.password === "" || data.password === null) {
				console.log("password erreur");
				this.Errors.password = true;
			}
			if (this.Errors.email === false && this.Errors.password === false) {
				try {
					await this.$store.dispatch("auth/login", data);
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
						title: "Authentification réussite",
					});
					this.$router.push("/");
				} catch (error) {
					console.log(error);
					this.Errors.email = true;
					this.Errors.password = true;
					this.messageError = error;
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
						icon: "error",
						title: "Authentification impossible",
					});
				}
			}
			console.log(data.password);
		},
		reset() {
			this.Errors.email = false;
			this.Errors.password = false;
		},
	},
	props: {},
};
</script>

<style scoped>
.container {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
}

.title {
	margin-bottom: 30px;
	font-size: 28px;
	color: #9c88ff;
	font-weight: 900;
}

#main {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}
.card {
	width: 350px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	padding: 15px;
	border-radius: 20px;
	border: #9c88ff 1px solid;
	box-shadow: 10px 5px 25px #9c88ff;
}

.form-container label {
	color: #9c88ff;
	font-weight: 700;
}

input[type="email"],
input[type="password"] {
	border: 1px solid #dedede;
	border-radius: 2px;
	display: block;
	font-size: 16px;
	padding: 10px;
	width: 100%;
	outline-color: #9c88ff;
	margin-top: 10px;
	border-radius: 15px;
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
	border-radius: 5px;
	transition: 0.4s ease-in;
}
.btn:hover {
	background-color: #6d5eb4;
}

.form-container {
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	width: 80%;

	margin-bottom: 20px;
}

.form-container.invalid input {
	border-color: red;
}
.form-container.invalid label {
	color: red;
}
.invalidTxt {
	color: red;
}
</style>
