<script setup lang="ts"></script>

<template>
	<nav>
		<router-link to="/">Home</router-link> |
		<router-link to="/help">Help</router-link>
	</nav>
	<router-view />
</template>

<style lang="scss">
* {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}
</style>
