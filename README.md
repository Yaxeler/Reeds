# Reeds

**Reeds** — веб-приложение для адаптивного чтения. Пользователь загружает свой текст, а приложение приводит его к удобному лично для него виду: шрифт, интервалы, цвета, режимы фокуса, озвучивание. Проект рассчитан на людей с особенностями восприятия текста: дислексией, слабым зрением, СДВГ, РАС, нарушениями цветовосприятия.

Вся обработка идёт в браузере, документ не покидает устройство.

Сайт: <https://yaxeler.github.io/Reeds/>

---

## Стек

| Инструмент                                   | Назначение                                |
| -------------------------------------------- | ----------------------------------------- |
| [Nuxt 4](https://nuxt.com)                   | Каркас, маршрутизация, сборка (без SSR)   |
| [Vue 3](https://vuejs.org)                   | UI-фреймворк, Composition API             |
| [TypeScript](https://www.typescriptlang.org) | Типизация                                 |
| [Pinia](https://pinia.vuejs.org)             | Управление состоянием                     |
| [Vitest](https://vitest.dev)                 | Юнит-тесты чистых функций                 |
| [pnpm](https://pnpm.io)                      | Пакетный менеджер                         |
| [GitHub Pages](https://pages.github.com)     | Хостинг статики, деплой из GitHub Actions |

---

## Архитектура

Проект следует методологии **[FEOD](https://feod.dev/)** (Feature-Entities-Objects-Declarations) — альтернативе FSD для организации фронтенд-кода. Подробнее: [статья на Habr](https://habr.com/ru/companies/sportmaster_lab/articles/972410/) (первоисточник) · [feod.dev](https://feod.dev/).

```
app/
  app.vue        корень приложения
  core/          глобальная инфраструктура: стили, layouts, конфиг
  pages/         страницы, имя файла повторяет URL (index.vue — это /)
  modules/       бизнес-модули, наружу только через index.ts (public API)
  common/        переиспользуемый код без бизнес-логики: ui, composables, utils и т.д.
  global/        то, что доступно без импорта: глобальные типы, шимы
```

Слой App в FEOD здесь называется `core`: в Nuxt 4 имя `app/` занято корнем исходников.

Правила импортов между слоями:

| Слой      | Может импортировать                  |
| --------- | ------------------------------------ |
| `core`    | `core`, `pages`, `modules`, `common` |
| `pages`   | `modules`, `common`                  |
| `modules` | `modules`, `common`                  |
| `common`  | `common`                             |
| `global`  | никто не импортирует                 |

Из модуля можно импортировать только то, что экспортирует его `index.ts`; внутри своего модуля — любые файлы.

Правила проверяет [`@o-feod/oxlint-structure-plugin`](https://feod.dev/tools/oxlint-plugin.html) в составе oxlint.

Импорты всегда абсолютные через алиас `@/` (`@/modules/reader`, `@/common/utils/contrast`), в том числе внутри одного модуля и в CSS `@import`. Относительные пути запрещены линтером.

---

## Стили

Глобальные стили лежат в `app/core/assets/styles`, точка входа — `main.css`:

- `foundation/` — фундамент, от которого зависят остальные стили: токены (`variables.css`), сброс браузерных стилей (`reset.css`), базовые стили элементов (`base.css`);
- `utilities/` — утилитарные классы;
- `portals/` — стили компонентов, которые рендерятся в портал вне дерева приложения.

Компоненты стилизуются через `<style scoped>`, классы именуются по **[БЭМ](https://ru.bem.info/methodology/naming-convention/)**: `block`, `block__element`, `block--modifier`. Поддерживаются светлая, тёмная и системная темы: цвета заданы через `light-dark()`, тема переключается классом `html.light` или `html.dark`. Порядок CSS-свойств проверяет stylelint (`stylelint-config-property-sort-order-smacss`).

---

## Начало работы

### Требования

- [Node.js](https://nodejs.org) 24.20.0 — версия зафиксирована в `.nvmrc`, ставится через [nvm](https://github.com/nvm-sh/nvm)
- [pnpm](https://pnpm.io) 12 — версия зафиксирована в `packageManager` в `package.json`, ставится через [corepack](https://github.com/nodejs/corepack)

### Установка Node.js

Если nvm ещё не установлен — поставить по [инструкции](https://github.com/nvm-sh/nvm#installing-and-updating) и перезапустить терминал. Затем в корне проекта:

```bash
nvm install    # установит версию из .nvmrc, если её ещё нет
nvm use        # переключит текущий терминал на эту версию
node -v        # v24.20.0
```

### Установка pnpm

```bash
npm install -g corepack@latest   # встроенный в Node.js corepack слишком старый для pnpm 12
corepack enable
pnpm -v                          # 12.x — corepack сам скачает версию из packageManager
```

### Первый запуск

```bash
pnpm install
pnpm dev
```

Откроется на <http://localhost:3000>. Git-хуки ставятся автоматически при `pnpm install`.

---

## Команды

```bash
pnpm dev               # Запуск dev-сервера
pnpm build             # Production-сборка
pnpm generate          # Сборка статики в .output/public
pnpm preview           # Превью production-сборки

pnpm check:all         # Запуск всех проверок
pnpm check:formatting  # Prettier
pnpm check:styles      # Stylelint
pnpm check:oxlint      # Oxlint (включая правила FEOD)
pnpm check:eslint      # ESLint
pnpm check:types       # TypeScript
pnpm test              # Unit-тесты (Vitest)
```

Тесты лежат рядом с проверяемым файлом (`contrast.ts` → `contrast.test.ts`) и пишутся только для чистых функций, без Nuxt-окружения и DOM.

---

## Ветки и деплой

- `main` — единственная постоянная ветка, она же продакшен.
- Работа ведётся в ветках `<type>/<короткое-имя>` (`feat/pdf-import`, `fix/voice-error`) и вливается в `main` через пулл-реквест.
- CI (GitHub Actions) на каждый пуш проверяет коммиты, форматирование, линтеры, типы и тесты. Слить пулл-реквест можно только после успешных проверок.
- После успешных проверок на `main` CI собирает статику и публикует её на GitHub Pages: <https://yaxeler.github.io/Reeds/>. Сайт открывается из подпапки `/Reeds/`, поэтому при сборке задаётся `NUXT_APP_BASE_URL=/Reeds/`.

---

## Коммиты

Проект использует **[Conventional Commits](https://www.conventionalcommits.org/)**.

```
<type>: <description>

feat: add pdf import
fix: fix voice selection on safari
```

Типы: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`.

Хуки **lefthook**:

- `commit-msg` — сообщение проверяет **commitlint**;
- `pre-commit` — по изменённым файлам по очереди `prettier --write`, `stylelint --fix`, `oxlint --fix` + `eslint --fix`; исправления добавляются в коммит.
