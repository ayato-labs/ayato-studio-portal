## [1.3.1](https://github.com/ayato-labs/ayato-studio-portal/compare/v1.3.0...v1.3.1) (2026-05-14)


### Bug Fixes

* **redesign:** fix TypeScript error by importing correct Report type in Home page ([d153020](https://github.com/ayato-labs/ayato-studio-portal/commit/d153020e1b2c84309334e98a4a172a1a2b5f4020))

# [1.3.0](https://github.com/ayato-labs/ayato-studio-portal/compare/v1.2.0...v1.3.0) (2026-05-14)


### Features

* merge minimalist redesign to main ([af1502d](https://github.com/ayato-labs/ayato-studio-portal/commit/af1502d4f832198e13f796fee873b87abe405c55))

# [1.2.0](https://github.com/ayato-labs/ayato-studio-portal/compare/v1.1.0...v1.2.0) (2026-05-13)


### Bug Fixes

* add NaN guards to numeric inputs ([fb28798](https://github.com/ayato-labs/ayato-studio-portal/commit/fb2879832812df5d24ef4cb536499d4c33feb4b7))


### Features

* implement portfolio app features including content management, UI components, and linting workflows ([101c272](https://github.com/ayato-labs/ayato-studio-portal/commit/101c2728551bdfdcb0a97b362cb05fbe45abecec))
* implement portfolio strategist app with real-time allocation analysis and rebalancing logic ([d76a5c4](https://github.com/ayato-labs/ayato-studio-portal/commit/d76a5c4fece08c791a63577a181b78e3cac085da))
* implement Supabase API client, local content processing, and Ruff linting configuration ([e844fa5](https://github.com/ayato-labs/ayato-studio-portal/commit/e844fa5c330e39aed0db94fab46ca7bc12b1f8b8))

# [1.1.0](https://github.com/ayato-labs/ayato-studio-portal/compare/v1.0.2...v1.1.0) (2026-05-09)


### Features

* add ripen service documentation and thumbnail asset ([b8c221e](https://github.com/ayato-labs/ayato-studio-portal/commit/b8c221e06633f09a9b2d554a4213593d1e021435))

## [1.0.2](https://github.com/ayato-labs/ayato-studio-portal/compare/v1.0.1...v1.0.2) (2026-05-09)


### Bug Fixes

* move blog image to public and fix paths ([aa153ca](https://github.com/ayato-labs/ayato-studio-portal/commit/aa153ca6ded05e38f2de1624b5e198c65df82b10))

## [1.0.1](https://github.com/ayato-labs/ayato-studio-portal/compare/v1.0.0...v1.0.1) (2026-05-09)


### Bug Fixes

* resolve Stripe type error in client.ts ([2c01915](https://github.com/ayato-labs/ayato-studio-portal/commit/2c019150da9c2d9e5d8c890a19a7df1f39cb4ded))

# 1.0.0 (2026-05-09)


### Bug Fixes

* Add firebase.json and enable static export for Firebase Hosting ([d08bad4](https://github.com/ayato-labs/ayato-studio-portal/commit/d08bad48603f5ab8b54cfee28b8da2bbf54cab01))
* **auth:** fix implicit any type error in callback page ([849c0c1](https://github.com/ayato-labs/ayato-studio-portal/commit/849c0c1a95464a6f5b705f8d62a29aa4ca1279c4))
* **automation:** Add repository_dispatch trigger to workflow ([8b38c6c](https://github.com/ayato-labs/ayato-studio-portal/commit/8b38c6cee0d1661ee4778e0cf3dc8ac52061ce3c))
* comprehensive cleanup of Supabase relationship errors for stable production build ([4dcc515](https://github.com/ayato-labs/ayato-studio-portal/commit/4dcc515d1c9e47f2d04d8f0254b0c339ebd2b89d))
* Correct React attribute casing for AdSense script ([8d2d869](https://github.com/ayato-labs/ayato-studio-portal/commit/8d2d8695244cb5555f17e03cd3bc14c94eb6a4b5))
* **deploy:** update project name and add secret debug step for Cloudflare migration ([ca0bbd0](https://github.com/ayato-labs/ayato-studio-portal/commit/ca0bbd00e6c78ae1576e1c5d7d9ebe2c84f536df))
* disable home page cache (revalidate=0) to ensure real-time intelligence stream ([2faa320](https://github.com/ayato-labs/ayato-studio-portal/commit/2faa3201d5ce9778d694c7810d07e333980672c1))
* enforce Asia/Tokyo timezone for all report and blog timestamps ([5bf12ce](https://github.com/ayato-labs/ayato-studio-portal/commit/5bf12ce92b51755f2ffe1f8975e27edbfa414c2d))
* explicit cache-dependency-path for python setup ([6c5b06f](https://github.com/ayato-labs/ayato-studio-portal/commit/6c5b06f070aebb87a68cf98bcdb3e9e95fbd259c))
* explicit directory targeting for next lint in CI ([9d2025f](https://github.com/ayato-labs/ayato-studio-portal/commit/9d2025fdffc28db27902c7d2680cc5bc8e41d803))
* fallback to primary supabase client for reports if news-specific client is missing ([74280f9](https://github.com/ayato-labs/ayato-studio-portal/commit/74280f9b2a43df2f7d06ccaa3bef992697afae45))
* Final attempt at force-static build fix ([c5a2320](https://github.com/ayato-labs/ayato-studio-portal/commit/c5a23209f0a3acd51f7e235f8fb99f3fb76fb16b))
* ignore E501 for long security keys in tools/ ([aa290e8](https://github.com/ayato-labs/ayato-studio-portal/commit/aa290e8da97f228a5e72419c18a21fd54be8c938))
* implement generateStaticParams for reports detail page to support static export ([b3c9e5c](https://github.com/ayato-labs/ayato-studio-portal/commit/b3c9e5cb1bac46264c66e150aac6543a8a438e33))
* Pass tracking secrets to build and fix React attribute casing ([64c1be4](https://github.com/ayato-labs/ayato-studio-portal/commit/64c1be454e9308d2b685bd81b924195a4f9fc84e))
* remove dot from next lint in CI to avoid misinterpretation ([dc63aff](https://github.com/ayato-labs/ayato-studio-portal/commit/dc63affdf53eabfee57d5e15ecdf544e585dc897))
* Replace server-side auth callback with client-side page for static export ([89d3f2d](https://github.com/ayato-labs/ayato-studio-portal/commit/89d3f2d246604f89ed218b97015b0983db7e614b))
* resolve build error by aligning with static export and refactoring Supabase query ([d6fb3b9](https://github.com/ayato-labs/ayato-studio-portal/commit/d6fb3b9fba279b3a9bd779c4b2ebffb86b1e7a95))
* resolve build failure by refactoring fs logic and centralizing types ([4e68828](https://github.com/ayato-labs/ayato-studio-portal/commit/4e6882814c740f389dcf66ea15d6b7df2be4760a))
* resolve build issues (static export vs dynamic routes and sitemap fetch error) ([686aba8](https://github.com/ayato-labs/ayato-studio-portal/commit/686aba88b72610762943c0f476d554e3b60a68ca))
* resolve import and lint errors in reports detail page ([fcb4a06](https://github.com/ayato-labs/ayato-studio-portal/commit/fcb4a064d296daec92c6fa07abf6a94f013af692))
* resolve incorrect paths in release.yml workflow ([40c0926](https://github.com/ayato-labs/ayato-studio-portal/commit/40c0926980dc30ebc698a8438569ec89f3d949e7))
* resolve missing generateStaticParams error for build stability ([255f323](https://github.com/ayato-labs/ayato-studio-portal/commit/255f32308742cca0b6f006028f75312017262ff9))
* resolve TypeScript error in note.ts by handling optional fields ([844f46c](https://github.com/ayato-labs/ayato-studio-portal/commit/844f46ca062e136010c209998f4dc4bdb9093fdc))
* restore raw_items join for category and market metadata ([7e893aa](https://github.com/ayato-labs/ayato-studio-portal/commit/7e893aad23a44a2f15ceae2c38b51b0da2fca286))
* restore raw_items join with left-join fallback to fix Silent Engine ([4074829](https://github.com/ayato-labs/ayato-studio-portal/commit/4074829440e80452cf58a14aed3dd2e309703037))
* revert revalidate=0 as it may have caused deployment/routing issues ([d428c93](https://github.com/ayato-labs/ayato-studio-portal/commit/d428c9368c7de7465373491de55a0f2ee48017eb))
* sync package-lock.json for supabase integration ([a4b63a0](https://github.com/ayato-labs/ayato-studio-portal/commit/a4b63a09b00dbab799a8466b71db01343640dbea))
* synchronize package-lock.json with package.json ([29acb63](https://github.com/ayato-labs/ayato-studio-portal/commit/29acb63e0b8388f1546c4615659dccb1c2fc395f))
* **ui:** force dark mode and refine ReportCard contrast to resolve white-on-white text bug ([757a694](https://github.com/ayato-labs/ayato-studio-portal/commit/757a69461fb6f7b453baf674b319669e382a40e1))
* update MetadataRoute import type in sitemap.ts ([64e8ab9](https://github.com/ayato-labs/ayato-studio-portal/commit/64e8ab931e6ecd68f2d292e7881b5d5c54abd2ad))
* use a stable compatibility date instead of a future one ([62138ff](https://github.com/ayato-labs/ayato-studio-portal/commit/62138ff58be308926fa2d4c6baa6318480eb938a))
* use absolute import alias for api helper in reports detail page ([fd8698e](https://github.com/ayato-labs/ayato-studio-portal/commit/fd8698ebcc4964f9dae8bdc18afcbffa2104b291))


### Features

* Add API unit tests ([c620ac9](https://github.com/ayato-labs/ayato-studio-portal/commit/c620ac95384bd75261fb0f993b466c3fba3c72b9))
* add blog post about MCP CVE issues ([ef2e863](https://github.com/ayato-labs/ayato-studio-portal/commit/ef2e863e7bc4836051ddd9de33460732afc89195))
* add customizable CTA section component and update Next.js type references ([d541eb3](https://github.com/ayato-labs/ayato-studio-portal/commit/d541eb341b1ccf92bb34ea7a2c34d09ca893c416))
* add documentation for MCP tool description fixes ([9cf58fa](https://github.com/ayato-labs/ayato-studio-portal/commit/9cf58fab643ded1a4c91e1b6ff4f723df133db49))
* Add E2E tests for homepage visibility ([f217025](https://github.com/ayato-labs/ayato-studio-portal/commit/f2170252e81a5a0212b51c38bcbb67506571a90c))
* Add global test setup with environment stubs ([29021d1](https://github.com/ayato-labs/ayato-studio-portal/commit/29021d185d386b5388245ecf926f7e998d2327c7))
* add Gmail Protector product page with documentation, privacy policy, and terms of service routes ([fbc8f5a](https://github.com/ayato-labs/ayato-studio-portal/commit/fbc8f5ae309b7a29d1100ab97aeda16d2aaca75f))
* Add Google AdSense script support ([f4848a8](https://github.com/ayato-labs/ayato-studio-portal/commit/f4848a8ef1ca89719bbd626c53be146228b7d6fc))
* Add Google Search Console, Ads, and SEO infrastructure ([d6a07f0](https://github.com/ayato-labs/ayato-studio-portal/commit/d6a07f00c05de78f8628465e6f86c31c0bcd49e5))
* add JSON-LD structured data for SEO (Article, Course, NewsArticle) ([4f3e639](https://github.com/ayato-labs/ayato-studio-portal/commit/4f3e639e580dbb6e66cccb624e5c1ed0f1e9bdd6))
* add Lead Gen CTA section to article detail pages ([7de2468](https://github.com/ayato-labs/ayato-studio-portal/commit/7de2468cf2aef65645a3e09ee23102da8c7cdd7d))
* add Markdown rendering, source URL, remove Score display, install typography plugin ([31becc3](https://github.com/ayato-labs/ayato-studio-portal/commit/31becc3b77f6b8230e01b737a633e5c5a7a4c034))
* add new blog post about AI Skills vs Prompts ([42081cc](https://github.com/ayato-labs/ayato-studio-portal/commit/42081cc9e1739b06d970850e2663921e356f7e1d))
* add new blog posts, service documentation, and academy educational content ([8fd8aa0](https://github.com/ayato-labs/ayato-studio-portal/commit/8fd8aa02bd8b2d3029c66a6ab36bc8dfce0645dc))
* add note.com RSS fetching utility with rss-parser ([7e8cff3](https://github.com/ayato-labs/ayato-studio-portal/commit/7e8cff36ec29f797395def23c8ecf79d5015bfba))
* add NoteCTA to blog and academy detail pages for premium conversion ([5462480](https://github.com/ayato-labs/ayato-studio-portal/commit/5462480dbd2aa1ba89dd079e96116907d606bca6))
* Add Playwright configuration ([de40314](https://github.com/ayato-labs/ayato-studio-portal/commit/de4031434bd2f46c97c2e9a1c0d93aa6503c33e0))
* add premium UI components for note.com feed ([604383f](https://github.com/ayato-labs/ayato-studio-portal/commit/604383f66a78266e341b4e2a3b37f492aa43687f))
* add privacy and terms of service pages for Gmail Protector app ([f782f10](https://github.com/ayato-labs/ayato-studio-portal/commit/f782f109f33e59f383c451e6bbbe22383ab6deab))
* add privacy policy page for Site Downloader extension ([27e9d06](https://github.com/ayato-labs/ayato-studio-portal/commit/27e9d0670e641a6c2f434081060c378f63977cb5))
* add Terms of Service and Privacy Policy pages, update sitemap and footer links ([958d75d](https://github.com/ayato-labs/ayato-studio-portal/commit/958d75db24dcbd396bfa296b1adef615ed37c533))
* Add Vitest configuration ([0b9300e](https://github.com/ayato-labs/ayato-studio-portal/commit/0b9300e76305d72b3cecf3c2f67cff6776a583bd))
* configure automated semantic-release workflow and dependencies ([62b89d9](https://github.com/ayato-labs/ayato-studio-portal/commit/62b89d9e237d00688e26191724afb8812efdce67))
* create useVQE hook for Value Quantification Engine event tracking ([40b1c37](https://github.com/ayato-labs/ayato-studio-portal/commit/40b1c37f806df122e79f7846052ba9c2aa7af866))
* direct supabase integration and remove portal manager client ([a44dda1](https://github.com/ayato-labs/ayato-studio-portal/commit/a44dda1ee42eb70fb7d40c0b9ef0ec598b6d188f))
* enhance Portal for Energy category styling ([bdcf5c0](https://github.com/ayato-labs/ayato-studio-portal/commit/bdcf5c00d67df9f82753cb4fbb681b00b2cfb921))
* establish Academy section and move math articles ([6cd4cac](https://github.com/ayato-labs/ayato-studio-portal/commit/6cd4cacd9ce7f159399353e9f1d4d75bfed60f2a))
* implement analytics integration, report value tracking, and user feedback components ([77f9c63](https://github.com/ayato-labs/ayato-studio-portal/commit/77f9c63e1c44d890d096a17f92d3071775773352))
* implement automated quality gate with ruff and github actions ([b0b7ab1](https://github.com/ayato-labs/ayato-studio-portal/commit/b0b7ab127f74814001a22522adf6f5c1a0f6c6e3))
* implement Google Analytics integration with pageview and event tracking utilities ([d9fceab](https://github.com/ayato-labs/ayato-studio-portal/commit/d9fceab86126917f3a5c03fb432c57b49f29d9a9))
* implement hybrid navigation rescue for ssg ([17caab8](https://github.com/ayato-labs/ayato-studio-portal/commit/17caab8335e82c27e088ab78107519b70d55ca21))
* implement initial web portal structure for Ayato Studio with app ecosystem and documentation navigation ([8ef6271](https://github.com/ayato-labs/ayato-studio-portal/commit/8ef6271c1ff179f26479bf2f09e436f8b1c841bf))
* implement local content engine and adopt AGPL-3.0 with dual-licensing structure ([a865eb9](https://github.com/ayato-labs/ayato-studio-portal/commit/a865eb9e27aa90ac87fb201143cc8456fc02dbcf))
* implement local filesystem content management and add applications ecosystem portal page ([c9ace59](https://github.com/ayato-labs/ayato-studio-portal/commit/c9ace59efed7f34398092fb37aab39419c0c5550))
* implement report detail page and navigation from intelligence stream ([fc05c8f](https://github.com/ayato-labs/ayato-studio-portal/commit/fc05c8f9a6ddd34606672b35d93b941630421583))
* implement sector-based UI separation (Tech, Finance, Energy) and bug fix ([8636877](https://github.com/ayato-labs/ayato-studio-portal/commit/8636877555094b3fa8d258cd443fe87481319650))
* implement site-downloader app documentation portal with dynamic routing and sitemap integration ([d27eea0](https://github.com/ayato-labs/ayato-studio-portal/commit/d27eea066fe63055b2215709e738e8591922b7bc))
* initialize Ayato Studio portal with core layout, navigation, analytics integration, and VQE engagement tracking components ([8565a53](https://github.com/ayato-labs/ayato-studio-portal/commit/8565a53849d65879a9125fe0bcdd5d70030ed8b0))
* Integrate Google AdSense and add ads.txt ([fd4fed1](https://github.com/ayato-labs/ayato-studio-portal/commit/fd4fed188122e8465866fbbbdf7ab259a0632853))
* integrate Google AdSense script in root layout ([9e10d96](https://github.com/ayato-labs/ayato-studio-portal/commit/9e10d96f7c89e858d1807df7ce39205152a8dfef))
* integrate LogicHive landing page and project hub ([ef4aa4a](https://github.com/ayato-labs/ayato-studio-portal/commit/ef4aa4a6c66d9bd91958ce18ee7279bd92ebf7a3))
* integrate note.com feed into homepage and footer ([8e9b3a6](https://github.com/ayato-labs/ayato-studio-portal/commit/8e9b3a62195df2296da43740e4471aa6362234a9))
* integrate Stripe checkout, Google Analytics, Note RSS fetching, and report detail page rendering ([902853e](https://github.com/ayato-labs/ayato-studio-portal/commit/902853e44b6414f512f16f19674f7fa1fd9bd60a))
* Integrate Supabase Email/Password Auth and shared client ([53e23cf](https://github.com/ayato-labs/ayato-studio-portal/commit/53e23cffe80d03a4c7fb70249b49bcc0cdfa811d))
* link LogicHive download buttons to GitHub Release v2.2.4 ([40b074b](https://github.com/ayato-labs/ayato-studio-portal/commit/40b074b75632af8d6a001d058b3f80a64cc4f357))
* modernize portal with SSG for AdBlocker immunity ([f7e8871](https://github.com/ayato-labs/ayato-studio-portal/commit/f7e8871154e618f577613d09641ee48d5048afd1))
* optimize UI for mobile-first experience ([0972cd2](https://github.com/ayato-labs/ayato-studio-portal/commit/0972cd272de3bc21b65792f967b01b811515fcb5))
* pivot support model to OFUSE & archive Stripe prototype due to privacy/legal constraints ([d748d12](https://github.com/ayato-labs/ayato-studio-portal/commit/d748d123884a4be752e4093794bdd97613a42b07))
* restore Ultimate Reborn design with Glassmorphism and Tailwind v4 ([2fb1906](https://github.com/ayato-labs/ayato-studio-portal/commit/2fb1906f742a87358d940f5e387dc2b39bb99aff))
* set ISR revalidation to 60s for home, reports list, and report details ([4d9a18e](https://github.com/ayato-labs/ayato-studio-portal/commit/4d9a18e8fed036817e8a28c9fe0212d7b35ab6c9))
* transition intelligence stream to client-side fetching for real-time updates ([6244396](https://github.com/ayato-labs/ayato-studio-portal/commit/6244396d49bc2a52758b7213f7804f453e5cf3a6))
* upgrade mission statement to Mission 2.0 using PREP method ([ccb732c](https://github.com/ayato-labs/ayato-studio-portal/commit/ccb732c720da75ee98818b0229d6f822a985ed14))


### Performance Improvements

* Add Next.js cache to deployment workflow to reduce CI build minutes ([f1d46f0](https://github.com/ayato-labs/ayato-studio-portal/commit/f1d46f0a2925cf13e74f2e78b0484297506a78aa))
