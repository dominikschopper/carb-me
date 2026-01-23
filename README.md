# carb-me 🍞🍎🧮

A free web app for calculating bread units (BE) and carbohydrate units (KHE) for people with diabetes.

**Live:** [carb-me.de](https://carb-me.de)

## Features

- Food database with BE/KHE values and kcal/kjoule display
- Choice between BE (12g carbs) and KHE (10g carbs) as display unit
- Fast search with fuzzy matching
- Compose meals and calculate total values
- Save favorites for frequently used foods
- Offline-capable as Progressive Web App (PWA)
- Printable food list
- No registration, no data transfer - everything stays local on your device

## Technology

- SvelteKit with Svelte 5
- Tailwind CSS 4
- TypeScript
- Static hosting on GitHub Pages

## Disclaimer

**This app is for informational purposes only and does not give any kind of medical advice, diagnosis, or treatment.**

The information provided about carbohydrates, bread units (BE), and carbohydrate units (KHE) does not replace professional advice from qualified medical personnel.

- Use of this app is at your own risk!
- Despite careful research, nutritional values may contain errors!
- Changes to diabetes therapy should only be made after consulting your physician!
- In case of emergency call your local emergency number

## Privacy

This app was developed following the "Privacy by Design" principle:

- No data transfer to servers
- No cookies
- No tracking
- All data stays exclusively on your device (localStorage)

## Data Source

The food database is based on the **Bundeslebensmittelschlüssel (BLS) 3.02** - the German Federal Food Key, a standardized food composition database.

### Data Processing

The original BLS CSV data is processed with the following transformations:

1. **Filtering**: Only foods with ≥4g carbohydrates per 100g are included
2. **Exclusions**: Spirits (BLS codes P6xx, P7xx) are excluded
3. **Grouping**: Similar foods with the same BLS prefix (first 4 characters) and ≤15g KH difference are merged into single entries with subtitles showing variants
4. **Values**: Grouped entries use median values for KH, kcal, and kJ

To regenerate the food database from updated BLS data:

```bash
# Place BLS CSV in scripts/bls-data/
pnpm convert-bls
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# check typescript
pnpm check

# Create production build
pnpm build

# Convert BLS data into JSON for this app
pnpm convert-bls
```

## License

MIT
