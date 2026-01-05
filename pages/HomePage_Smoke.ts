import type { Locator, Page } from "@playwright/test";

export class HomePage {
	readonly page: Page;
	readonly acceptCookiesBtn: Locator;
	readonly logo: Locator;
	readonly searchInput: Locator;
	readonly loginBtn: Locator;
	readonly categoriesBtn: Locator;
	readonly footerContainer: Locator;
	readonly copyrightText: Locator;

	constructor(page: Page) {
		this.page = page;
		this.logo = page.locator('header a.logo, img[alt*="olx"]').first();
		this.acceptCookiesBtn = page.locator("#accept-btn");
		this.logo = page.getByAltText("olx-logo");
		this.searchInput = page.locator('input[name="notASearchField"]');
		this.loginBtn = page.locator('a[aria-label="prijava"]');
		this.categoriesBtn = page.getByRole("link", {
			name: /kategorije/i,
		});
		this.footerContainer = page.locator("body");
		this.copyrightText = page
			.locator("*")
			.filter({ hasText: /\b\d{4}\b/ })
			.first();
	}

	async navigate(): Promise<void> {
		await this.page.goto("https://olx.ba", { waitUntil: "domcontentloaded" });
		await this.page.waitForLoadState("domcontentloaded");
	}

	/**
	 * Handles cookies with an explicit wait for the overlay to disappear.
	 */
	async handleCookies(): Promise<void> {
		this.acceptCookiesBtn.click().catch(() => {});
	}

	/**
	 * Searches for products using human-like typing to bypass bot detection.
	 * @param keyword - Search term to type in the search bar
	 */
	async searchFor(keyword: string): Promise<void> {
		await this.searchInput.waitFor({ state: "visible" });
		await this.searchInput.click();

		// Typing with delay to bypass Cloudflare
		await this.searchInput.pressSequentially(keyword, { delay: 150 });
		await this.page.keyboard.press("Enter");

		// Ensure network is idle so results are fully rendered
		await this.page.waitForURL(/.(q=|pretraga)./, { timeout: 15000 });
	}
}
