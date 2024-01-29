// import puppeteer from 'puppeteer';

// Trenger følgende devDeps for å kjøre
// "@types/expect-puppeteer": "^5.0.1",
// "@types/jest-environment-puppeteer": "^5.0.2",
// "@types/puppeteer": "^7.0.4",
// "jest-puppeteer": "^6.2.0",
// "expect-puppeteer": "^6.1.1",
// "puppeteer": "^19.5.2"

// let browser;
// let page;

describe.skip('Sykdom visual test', () => {
  test.skip('skip', () => undefined);
  //     beforeAll(async () => {
  //         browser = await puppeteer.launch({ headless: true, args: ['--font-render-hinting=none'] });
  //         page = await browser.newPage();
  //         const response = await page.goto('http://localhost:8081/');
  //         await page.setViewport({
  //             width: 1440,
  //             height: 900,
  //         });
  //         expect(response.status()).toBe(200);
  //     });
  //     it('ingen visuelle regresjoner dokumentasjon', async () => {
  //         try {
  //             await page.waitForSelector('#medisinskVilkår', { timeout: 5_000 });
  //             await expect(page).toMatch('Dokumenter til behandling', { timeout: 5_000 });
  //             const dokumentasjonFørInput = await page.screenshot({ fullPage: true });
  //             expect(dokumentasjonFørInput).toMatchImageSnapshot();
  //             await expect(page).toClick('label', { text: 'Ja, legeerklæring fra sykehus/spesialisthelsetjenesten' });
  //             await expect(page).toFill('input[id="datertField"]', '101021');
  //             await expect(page).toClick('button', { text: 'Bekreft' });
  //             await page.waitForSelector('div[data-testid="dokumentasjon-ferdig"]', { timeout: 5_000 });
  //             const dokumentasjonEtterInput = await page.screenshot({ fullPage: true });
  //             expect(dokumentasjonEtterInput).toMatchImageSnapshot();
  //             await expect(page).toClick('button', { text: 'Fortsett' });
  //         } catch (e) {
  //             console.log(e);
  //             await browser.close();
  //         }
  //     });
  //     it('ingen visuelle regresjoner tilsyn og pleie', async () => {
  //         try {
  //             await expect(page).toMatch('Vurdering av tilsyn og pleie', { timeout: 5_000 });
  //             await expect(page).toMatch('Bekreft', { timeout: 5_000 });
  //             const tilsynOgPleieFørInput = await page.screenshot({ fullPage: true });
  //             expect(tilsynOgPleieFørInput).toMatchImageSnapshot();
  //             await expect(page).toClick('input[type="checkbox"]');
  //             await expect(page).toFill('textarea[name="vurderingAvKontinuerligTilsynOgPleie"]', 'test');
  //             await expect(page).toClick('input[id="harBehovForKontinuerligTilsynOgPleieYES"]');
  //             await expect(page).toClick('button', { text: 'Bekreft' });
  //             const tilsynOgPleieModal = await page.screenshot({ fullPage: true });
  //             expect(tilsynOgPleieModal).toMatchImageSnapshot();
  //             await expect(page).toClick('button[data-testid="modal-confirm-button"]');
  //             await expect(page).toMatch('Alle perioder', { timeout: 5_000 });
  //             const tilsynOgPleieEtterInput = await page.screenshot({ fullPage: true });
  //             expect(tilsynOgPleieEtterInput).toMatchImageSnapshot();
  //             await expect(page).toClick('button', { text: 'Eventuelle endringer er registrert' });
  //         } catch (e) {
  //             console.log(e);
  //             await browser.close();
  //         }
  //     });
  //     it('ingen visuelle regresjoner i to omsorgspersoner', async () => {
  //         try {
  //             await expect(page).toMatch('Vurdering av to omsorgspersoner', { timeout: 5_000 });
  //             await expect(page).toMatch('Bekreft', { timeout: 5_000 });
  //             const tomOmsorgspersonerFørInput = await page.screenshot({ fullPage: true });
  //             expect(tomOmsorgspersonerFørInput).toMatchImageSnapshot();
  //         } catch (e) {
  //             console.log(e);
  //         } finally {
  //             await browser.close();
  //         }
  //     });
});
