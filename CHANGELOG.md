# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.1] - 2026-01-23

### Fixed
- double prefixing of food names is now solved


## [1.4.0] - 2026-01-23

### Added
- Energy/calorie display option (kcal or kJ) in settings
- Energy values shown in FoodCard, Calculator, and MealComposer
- Per-item and total energy calculation for meals

### Changed
- Carbohydrate values now displayed in green for better visibility
- Improved color scheme: green (KH), blue (BE), purple (KHE), amber (energy)

## [1.3.2] - 2026-01-23

### Fixed
- Accidentally added double "Brot" prefix

## [1.3.1] - 2026-01-22

### Fixed
- Long food names now wrap correctly (wrap-anywhere)
- Smaller font size for titles on mobile devices
- Long subtitles are automatically truncated to "verschiedene Varianten" (>40 characters)

## [1.3.0] - 2026-01-22

### Added
- JSON configuration file for prefixes and merge groups (`bls-config.json`)
- New prefix categories: Nudeln (pasta), Reis (rice), Zucker (sugar)
- Manual merge groups for better organization

### Changed
- Favorites now use `blsCode` instead of `name` for unique identification
- Service worker cache name now uses the version number

### Fixed
- Favorites page now displays cards vertically instead of side-by-side
- Fixed favorites reactivity with SvelteSet

## [1.2.0] - 2026-01-21

### Added
- BLS data as data source (German Federal Food Code)
- Automatic grouping of similar foods by BLS prefix
- Filtering by minimum carbohydrate content (4g/100g)

### Changed
- Food data is now converted from CSV

## [1.1.0] - 2026-01-20

### Added
- Print view for meals
- New favicon and title

### Changed
- Styling reorganization
- Improved margins

## [1.0.0] - 2026-01-19

### Added
- Initial release of carb-me app
- Food search with Fuse.js
- BE/KHE calculator (bread units / carb units)
- Favorites functionality
- Meal composition
- Dark mode
- PWA support (offline capable)
- Settings for preferred unit (BE/KHE)
