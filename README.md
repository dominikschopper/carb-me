# carb-me 🍞🍎🧮

A free web app for calculating bread units (BE) and carbohydrate units (KHE) for people with diabetes.

**Live:** [carb-me.de](https://carb-me.de)

## Features

- Food database with BE/KHE values
- Fast search with fuzzy matching
- Compose meals and calculate total values
- Save favorites for frequently used foods
- Choice between BE (12g carbs) and KHE (10g carbs) as display unit
- Offline-capable as Progressive Web App (PWA)
- Printable food list
- No registration, no data transfer - everything stays local on your device

## Technology

- SvelteKit with Svelte 5
- Tailwind CSS 4
- TypeScript
- Static hosting on GitHub Pages

## Disclaimer

**This app is for informational purposes only and does not constitute medical advice, diagnosis, or treatment.**

The information provided about carbohydrates, bread units (BE), and carbohydrate units (KHE) does not replace professional advice from qualified medical personnel.

- Use of this app is at your own risk
- Despite careful research, nutritional values may contain errors
- Changes to diabetes therapy should only be made after consulting your physician
- In case of emergency: Call 112 (EU) or your local emergency number

## Privacy

This app was developed following the "Privacy by Design" principle:

- No data transfer to servers
- No cookies
- No tracking
- All data stays exclusively on your device (localStorage)

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Create production build
pnpm build
```

## License

MIT
