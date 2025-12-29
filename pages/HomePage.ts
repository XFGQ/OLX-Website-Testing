import { Page, Locator } from '@playwright/test';

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
        // Locator for the cookie consent button using its unique ID
        this.acceptCookiesBtn = page.locator('#accept-btn');
        // Locator for the site logo using accessible alt text
        this.logo = page.getByAltText('olx-logo');
        // Main search input field
        this.searchInput = page.locator('input[name="notASearchField"]');
        // Login/Registration link
        this.loginBtn = page.locator('a[aria-label="prijava"]');
        // Categories link using role-based selection for better stability
        this.categoriesBtn = page.getByRole('link', { name: 'Kategorije', exact: true });
        // Footer locators
        this.footerContainer = page.locator('#olx-home-footer');
        this.copyrightText = page.locator('.footer-copyright p');
    }

    async navigate(): Promise<void> {
        await this.page.goto('https://olx.ba');
    }

    /**
     * Handles the mandatory cookie consent overlay.
     */
    async handleCookies(): Promise<void> {
        try {
            await this.acceptCookiesBtn.waitFor({ state: 'visible', timeout: 5000 });
            await this.acceptCookiesBtn.click();
            // Ensure the overlay is gone before proceeding
            await this.acceptCookiesBtn.waitFor({ state: 'hidden', timeout: 5000 });
        } catch (error) {
            console.log("Cookie consent modal did not appear.");
        }
    }

    async searchFor(keyword: string): Promise<void> {
        await this.searchInput.fill(keyword);
        await this.page.keyboard.press('Enter');
    }
}