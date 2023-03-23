<template>
	<div class="wrapper">analytics</div>
</template>

<script>
export default {
	name: "name",
	props: {},
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

<style scoped></style>
