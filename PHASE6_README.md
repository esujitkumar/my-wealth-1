# My Wealth PWA — Phase 6

## Real Market & Portfolio Intelligence

Added:
- Live stock LTP integration using the INDstocks quote API adapter.
- Mutual-fund latest NAV integration using AMFI NAV feed (daily, not real-time).
- 30-second REST refresh while Holdings is open.
- Optional WebSocket streaming through the existing server proxy.
- Live portfolio value and live P&L.
- Transaction-based XIRR using BUY/SIP/SELL/DIVIDEND/FEE cash flows plus current value.
- Market identifiers remain per holding: stock token such as `NSE:2885`; MF ISIN.

## Important
Configure the market provider under Settings. For WebSocket streaming, run the Node proxy and set its URL in the app. Do not publish access tokens in client code. Mutual-fund NAV is based on the latest published AMFI feed and is not tick-by-tick.
