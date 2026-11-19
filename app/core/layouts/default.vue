<script setup lang="ts">
	type Theme = 'dark' | 'light' | 'system'

	const storageKey = 'reeds-theme'
	const theme = ref<Theme>('system')

	function applyTheme(value: Theme) {
		theme.value = value
		document.documentElement.classList.toggle('light', value === 'light')
		document.documentElement.classList.toggle('dark', value === 'dark')
	}

	let savedTheme: null | string = null
	try {
		savedTheme = localStorage.getItem(storageKey)
	} catch {
		savedTheme = null
	}

	if (savedTheme === 'light' || savedTheme === 'dark') {
		applyTheme(savedTheme)
	}

	function changeTheme(event: Event) {
		const control = event.currentTarget
		if (!(control instanceof HTMLSelectElement)) return

		const value = control.value
		if (value !== 'light' && value !== 'dark' && value !== 'system') return

		const updateTheme = () => applyTheme(value)

		if (
			document.startViewTransition &&
			!matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			document.startViewTransition(updateTheme)
		} else {
			updateTheme()
		}

		try {
			localStorage.setItem(storageKey, value)
		} catch {
			return
		}
	}
</script>

<template>
	<header class="layout-header">
		<label class="layout-header__theme">
			Тема
			<select
				:value="theme"
				@change="changeTheme"
			>
				<option value="system">Как в системе</option>

				<option value="light">Светлая</option>

				<option value="dark">Тёмная</option>
			</select>
		</label>
	</header>

	<main>
		<slot></slot>
	</main>
</template>

<style scoped>
	.layout-header {
		display: flex;
		justify-content: flex-end;
		padding: var(--space-2) var(--space-4);
	}

	.layout-header__theme {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
	}
</style>
