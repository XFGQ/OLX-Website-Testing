import { Page, Locator } from '@playwright/test';

export class SearchPage {
    readonly page: Page;
    
    // Filtering Locators
    readonly priceMinInput: Locator;
    readonly priceMaxInput: Locator;
    readonly buttonNovo: Locator;
    readonly buttonUsed: Locator;
    readonly locationSelect: Locator;
    readonly nextBtn: Locator;
    readonly sortMenuTrigger: Locator;

    // Result Locators
    readonly productHeading: Locator;
    readonly productPrice: Locator;
    readonly noResultsMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Price inputs located by placeholders
        this.priceMinInput = page.locator('input[placeholder="od"]');
        this.priceMaxInput = page.locator('input[placeholder="do"]');
        
        // Item condition buttons
        this.buttonNovo = page.locator('#buttonNovo');
        this.buttonUsed = page.locator('#buttonKorišteno');
        
        // Selection and Navigation
        this.locationSelect = page.locator('.cities select');
        this.sortMenuTrigger = page.locator('div:has-text("Sortiraj")').first();
        this.nextBtn = page.locator('button:has(img[src*="chevron-right"])');

        // Result display and validation
        this.productHeading = page.locator('.main-heading');
        this.productPrice = page.locator('.smaller');
        this.noResultsMessage = page.locator('text=Nema rezultata');
    }

    /**
     * Helper to simulate random human waiting times.
     */
    async humanDelay(): Promise<void> {
        const delay = Math.floor(Math.random() * 800) + 400;
        await this.page.waitForTimeout(delay);
    }

    /**
     * Filters results by price range using sequential typing to bypass bot detection.
     */
    async setPriceRange(min: string, max: string): Promise<void> {
        await this.priceMinInput.click();
        await this.priceMinInput.pressSequentially(min, { delay: 100 });
        await this.humanDelay();

        await this.priceMaxInput.click();
        await this.priceMaxInput.pressSequentially(max, { delay: 100 });
        
        await this.humanDelay();
        await this.page.keyboard.press('Enter');
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Selects a location from the dropdown menu.
     */
    async selectLocation(value: string): Promise<void> {
        await this.locationSelect.selectOption(value);
        await this.humanDelay();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Clicks the 'Novo' (New) condition filter.
     */
    async filterByNew(): Promise<void> {
        await this.buttonNovo.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Clicks the 'Korišteno' (Used) condition filter.
     */
    async filterByUsed(): Promise<void> {
        await this.buttonUsed.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Navigates to the product details of the first search result.
     */
    async clickFirstProduct(): Promise<void> {
        await this.productHeading.first().hover();
        await this.humanDelay();
        await this.productHeading.first().click();
    }
}