# Phase 3 — Live investment data

## What changed
- Investment holdings now support live-price fields.
- Stock holdings can store an INDstocks market token such as `NSE:2885`.
- Mutual-fund holdings can store an AMFI ISIN.
- Holdings page has a market refresh flow.
- A small Node/Express server proxy is included so a production deployment can keep the INDstocks token server-side.

## Data-source decision
- **Stocks:** INDstocks is the first adapter. Its documentation says API access is free, offers real-time market data, and provides WebSocket streaming. The browser app currently uses the safer REST refresh path; the included production proxy now supports WebSocket price streaming.
- **Mutual funds:** AMFI is the source of the latest published NAV. Mutual-fund NAV is daily, not tick-by-tick, so the UI explicitly displays the NAV date rather than pretending it is real-time.
- **Gold:** kept behind an adapter boundary for the next data-provider integration.

## Recommended setup
1. Create an INDstocks account and complete the required onboarding.
2. Generate an access token. Tokens are documented as expiring after 24 hours.
3. For the personal prototype, you can put the token into Settings → Market data. Do not publish that token with the app.
4. For a public/hosted deployment, set `INDSTOCKS_TOKEN` in the server environment and set the app's Market proxy URL to that server. The proxy now covers both stock quotes and AMFI NAV download.
5. Add market tokens to stock assets and ISINs to mutual-fund assets.

## Important
No real market value is fabricated. If a provider is not configured or cannot be reached, the app keeps the last stored value and reports the connection status.

## What is genuinely real-time?
Stock LTP can be streamed in real time during market hours. Mutual-fund NAV cannot: AMFI states NAV is declared at the end of each trading day. The app labels the NAV date so it never presents stale daily NAV as tick data.
