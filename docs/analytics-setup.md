# YardCalc analytics setup

YardCalc's production build is configured with GA4 Measurement ID `G-7H9N1VFV2E` in `sites/yardcalc/.env.production`. The ID is public and is not a password.

1. The Google Analytics Web data stream for YardCalc provides Measurement ID `G-7H9N1VFV2E`.
2. Production builds read `NEXT_PUBLIC_GA_ID` from `sites/yardcalc/.env.production`.
3. Rebuild and deploy YardCalc. The privacy page will then describe the analytics that are enabled.

Tracked events:

- `page_view`: route path and page title; query strings are excluded.
- `calculator_start`: the calculator slug, once on first input per page visit.
- `calculator_result`: the calculator slug, once after a valid result first appears.
- `affiliate_click`: reserved for future affiliate links; provide only calculator slug, partner key, and placement key.

The event interface deliberately excludes entered measurements, prices, result values, and destination URLs. Ad clicks and impressions should be read from the ad platform's reports after ads are installed.
