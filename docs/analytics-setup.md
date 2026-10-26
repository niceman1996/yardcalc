# YardCalc analytics setup

YardCalc's GA4 integration is disabled until a valid web Measurement ID is supplied at build time. The ID looks like `G-XXXXXXXXXX` and is not a password.

1. In Google Analytics, create or select a property for YardCalc.
2. Add a Web data stream for `https://yardcalc.xyz`.
3. Copy the stream's Measurement ID and set it as `NEXT_PUBLIC_GA_ID` before building the static site.
4. Rebuild and deploy YardCalc. The privacy page will then describe the analytics that are enabled.

Tracked events:

- `page_view`: route path and page title; query strings are excluded.
- `calculator_start`: the calculator slug, once on first input per page visit.
- `calculator_result`: the calculator slug, once after a valid result first appears.
- `affiliate_click`: reserved for future affiliate links; provide only calculator slug, partner key, and placement key.

The event interface deliberately excludes entered measurements, prices, result values, and destination URLs. Ad clicks and impressions should be read from the ad platform's reports after ads are installed.
