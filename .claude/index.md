# Infos to Speed Up Code Analysis

This little App is built with sveltekit and helps to search for the carbohydrate content of foods (e.g. Diabetics).

As a basis for its data it uses a csv dump of the german BLS Database.

It is built as a PWA, with offline capacity.

It is built with a privacy first approach (no tracking, no ads).

## Architecture: Feature-Based Modules (Planned)

We want to restructure from `utils/` to **feature-based modules** where each feature's components AND logic live together:

```
src/lib/
├── features/
│   ├── food/              # Food search, display, calculation
│   │   ├── *.svelte       # Components
│   │   ├── calculator.ts  # Nutrition logic
│   │   ├── search.ts      # Fuzzy search
│   │   └── ...
│   ├── custom-foods/      # Custom food management
│   ├── meal/              # Meal composition
│   ├── settings/          # App settings
│   ├── update/            # Update notification & SW
│   └── onboarding/        # Onboarding tour
│
├── shared/                # Cross-feature utilities
│   ├── *.svelte           # Shared components (Header, TabBar)
│   ├── formatting.ts
│   ├── storage.ts
│   └── debounce.ts
│
├── stores/                # Global reactive stores
└── types/
```

### Import Rules (not enforced via ESLint, but follow manually):
- **Features can import from**: `shared/`, `stores/`, `types/`
- **Features must NOT import from**: other features directly
- **Shared can import from**: only `shared/` itself
- If two features need the same thing → move it to `shared/`

## Important Directories and files

- /docs/*.md files for features and plans (maybe also *.puml)
- /scripts/*.ts scripts to convert the BLS data to json (and filter/improve)
- /scripts/bls-data/*.csv the CSV data to be imported
- /src/lib/components/*.svelte all svelte components (will move to features/)
- /src/lib/stores/*.ts all parts that store data in localStorage
- /src/lib/styles/*.css a hierarchical css structure that imports everything into app.css
- /src/lib/utils/*.ts helper functions (will move to features/ or shared/)
- /src/lib/routes/*.svelte the routing pages
- /static/lebensmittel-daten.json the converted BLS data to load in the app
- /static/fonts/* /static/icons/*.png the static assets
- /CHANGELOG.md the changelog that needs to be updated after a feature before the release
