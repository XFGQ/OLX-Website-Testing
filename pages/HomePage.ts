import { Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly acceptCookiesBtn: Locator;
    readonly searchInput: Locator;
    readonly loginBtn: Locator;
    readonly categoriesBtn: Locator;
    readonly footer: Locator;

    constructor(page: Page) {
        this.page = page;
        this.acceptCookiesBtn = page.locator('#accept-btn');
        // HTML'deki name niteliğini kullanarak daha stabil bir seçim yapıyoruz
        this.searchInput = page.locator('input[name="notASearchField"]');
        this.loginBtn = page.locator('a[aria-label="prijava"]');
        this.categoriesBtn = page.locator('a[href="/kategorije"]');
        this.footer = page.locator('footer'); // Sayfanın en altındaki ana footer elementi
    }

    async navigate(): Promise<void> {
        await this.page.goto('https://olx.ba');
    }

    // Çerez ekranını geçmek için her testte kullanılacak olan zorunlu metod
    async handleCookies(): Promise<void> {
        try {
            await this.acceptCookiesBtn.waitFor({ state: 'visible', timeout: 5000 });
            await this.acceptCookiesBtn.click();
            // Çerez panelinin tamamen kapandığından emin olana kadar bekle
            await this.acceptCookiesBtn.waitFor({ state: 'hidden', timeout: 5000 });
        } catch (error) {
            console.log("Cookie consent modal did not appear.");
        }
    }
}