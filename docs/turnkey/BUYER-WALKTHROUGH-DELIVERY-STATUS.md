# Buyer Walkthrough Delivery Status

**Capture date:** 19 August 2026  
**Delivered file:** `/home/ubuntu/caffio-turnkey-bundle/walkthrough/output/CAFFIO-BUYER-WALKTHROUGH-90S-WITH-MUSIC.mp4`

| Property | Verified value |
|---|---|
| Runtime | 90.000 seconds |
| Frame | 1280×720, horizontal 16:9 |
| Frame rate | 25 fps |
| Video codec | H.264 / AVC |
| Content | Actual browser recording of the listed public buyer-facing routes and interactions |
| Voiceover | None |
| Music | **Serene View — Arulo**, Mixkit item 443; instrumental bed mixed at 12% gain with a 2-second fade-in and a 3-second fade-out |
| Audio codec | AAC-LC, stereo, 44.1 kHz, 192 kb/s |
| Measured audio level | −35.2 dB mean; −20.5 dB maximum |
| SHA-256 | `44adbbf31d3859576afd2fe795dff756102b7178f4a82368fc202c1a27f9138c` |

The video is a direct screen recording from the running build. It demonstrates discovery, product record, search, comparison, field notes, FAQ/conversion boundary, favorites, local cart, Society, tracking, profile, and payment-activity empty state. It does not create a payment, shipment, account, verified review, or live provider record.

## Licensed music record

The selected track was downloaded through Mixkit’s official in-page control on 19 August 2026 after the user delegated candidate selection. The official source presents it under Mixkit’s Stock Music Free License. The original file is retained at `/home/ubuntu/caffio-turnkey-bundle/walkthrough/audio/Serene-View-Arulo-Mixkit-443.mp3`, with SHA-256 `556ae7a19c783bd666593e60fbba776bac7f9ff6c2173bebded0bc200cc82ec3`, duration 113.972245 seconds, MP3 stereo 44.1 kHz / 256 kb/s. Its public source and decision record are kept in `docs/turnkey/MUSIC-CANDIDATE-RESEARCH.md`.

> This record documents the source and the observed licence label at download time; it does **not** transfer music rights to a buyer. Any downstream use remains subject to the provider’s then-current licence terms.

## Release verification

The dedicated high-definition Playwright recording completed successfully. The source release had passed 37 Vitest checks, TypeScript validation, production build, 82 browser checks with two intentional environment-dependent skips, `git diff --check`, and a production dependency audit reporting zero known vulnerabilities across all severities at the time of the prior run. The music re-export additionally passed runtime, resolution, codec, and audio-level verification; the complete project quality gate is rerun before this release is checkpointed.
