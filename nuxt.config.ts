export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',

	// Только клиентский рендеринг, деплой статикой (nuxt generate)
	ssr: false,

	css: ['@/core/assets/styles/main.css'],

	devtools: { enabled: true },

	dir: {
		assets: '~~/app/core/assets',
		layouts: '~~/app/core/layouts',
	},

	imports: {
		dirs: [],
		scan: false,
	},

	modules: ['@nuxt/eslint', '@pinia/nuxt'],
})
