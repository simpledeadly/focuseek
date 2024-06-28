<script setup lang="ts">
import { Navbar } from '@/widgets/navbar'
</script>

<template>
	<div class="container">
		<div class="centered">
			<!-- <img
				src="../assets/images/focuseek_logo.png"
				alt="Focuseek"
				class="logo"
			/> -->
			<h1 class="logo">Focuseek</h1>
		</div>
		<Navbar class="centered" />
		<transition name="fade">
			<router-view />
		</transition>
	</div>
</template>

<style lang="scss">
* {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	box-sizing: border-box;
	margin: 0;
	padding: 0;
	font-size: 18px;
	outline: none;
	color: #3f3f3f;
}

body {
	background: #f5f7f8;
}

.container {
	width: 1024px;
	margin: 0 auto;
	// height: 90vh;
}

.centered {
	width: 100%;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 auto;
}

.logo {
	// for img
	margin-top: 1.5rem;
	margin-bottom: 0.5rem; // 6px
	width: auto;
	// height: 36px;

	// not img
	font-family: 'Lilly Script One', cursive;
	font-size: 25px;
	color: #f5f7f8;
	text-shadow: 1px 1px 0 #2f2f2f, -1px -1px 0 #2f2f2f, 1px -1px 0 #2f2f2f,
		-1px 1px 0 #2f2f2f;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.fade-appear,
.fade-enter {
	opacity: 0;
}

.fade-appear-active,
.fade-enter-active {
	transition: opacity 0.5s;
	opacity: 1;
}
</style>
