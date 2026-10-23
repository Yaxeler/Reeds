<script setup lang="ts">
	import wip from '@/common/images/wip.gif'
</script>

<template>
	<section class="wip">
		<h1 class="title">Reeds</h1>

		<p>
			Веб-приложение для адаптивного чтения: загружаете свой текст, а приложение
			приводит его к удобному для вас виду и при необходимости озвучивает.
		</p>

		<img
			class="image"
			:src="wip"
			alt="Сайт в разработке"
			width="450"
			height="450"
		/>
	</section>
</template>

<style scoped>
	.wip {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: center;
		max-width: 40rem;
		margin-inline: auto;
		padding: 3rem 1rem;
		text-align: center;
	}

	.title {
		font-size: 2.5rem;
		line-height: 1.2;
	}

	.image {
		width: min(100%, 18rem);
	}
</style>
