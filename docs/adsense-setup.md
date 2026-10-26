# YardCalc AdSense setup

YardCalc has a conditional AdSense loader and one responsive manual slot after each calculator article. The build also generates a root ads.txt entry from a valid publisher ID. No ad code or seller entry is emitted without a valid ID.

## Account setup

1. Sign in to Google AdSense with the account owner's Google account. Use the real payment address country; Google does not allow changing it later.
2. Add yardcalc.xyz, connect the site using the publisher meta tag or AdSense code, and request review. Ads cannot serve until the site has passed review and shows Ready.
3. Copy the publisher ID (ca-pub- followed by 16 digits). The site build uses it for the verification meta tag, AdSense loader, and root ads.txt.
4. After approval, create a responsive Display ad unit and copy its numeric slot ID.
5. Build and deploy with NEXT_PUBLIC_ADSENSE_CLIENT_ID and NEXT_PUBLIC_ADSENSE_TOOL_SLOT set in the process environment.

For GitHub Pages, set SOE_DOMAIN=yardcalc.xyz as well, then run .bin/node.exe scripts/build-pages.mjs and .bin/node.exe scripts/deploy-gh-pages.mjs. Do not commit an .env file containing account settings.

The ad is placed after the full calculator article, away from the measurement controls. Keep the ad label and separation intact; do not encourage clicks or position the ad so it can be mistaken for a calculator control.

## China payment options

Google currently supports AdSense publishers in mainland China. The listed payment options include wire transfer and PayPal Hyperwallet. Hyperwallet may offer PayPal, cash collection, or other local transfer options; check the choices and fees in the account. Alipay and WeChat are not direct AdSense payment methods. A wire transfer requires a bank account that can receive international transfers.

## Current state

No publisher ID or ad slot ID is configured in the build environment yet. The site has not been submitted for AdSense review, and no ads are being served.
