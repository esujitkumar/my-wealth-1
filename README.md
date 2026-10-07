# My Wealth — Personal Finance PWA

This is the first functional foundation of the personal wealth app.

## Included now
- Mobile-first responsive dashboard inspired by the supplied reference
- Dashboard, Holdings, Assets, Credit Cards, Debts/Loans, Expenses, Insurance, Goals, Insights, Reminders, Settings
- Light/dark mode
- Local-first data storage using browser localStorage
- Offline-capable PWA shell/service worker
- Add/delete assets
- Add/delete expenses
- Basic portfolio calculations
- JSON backup/export
- Responsive navigation suitable for Android

## Run locally
1. Install Node.js LTS.
2. Open a terminal in this folder.
3. Run:
   npm install
   npm run dev
4. Open the local address shown by Vite.

## Install on Android
Once the app is hosted over HTTPS:
- Open it in Chrome on the phone.
- Choose "Add to Home screen" / "Install app".

## Next build phase
The data model is intentionally prepared for:
- automatic stock prices
- automatic mutual-fund NAV updates
- gold pricing
- recurring transactions
- credit-card details
- loan amortization
- insurance policies
- goal projections
- reports/export
- reminders
- encrypted cloud backup
- eventual Android APK packaging with Capacitor

Live market-data APIs are NOT hard-coded yet; the provider should be selected before connecting real prices.
