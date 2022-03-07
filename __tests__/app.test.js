/* eslint-disable comma-dangle */
import puppeteer from "puppeteer";

describe("App Page content tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 250,
    });
    page = await browser.newPage();
    await page.goto("http://localhost:3000/app");
  });

  it("Contains the header for uploading a file", async () => {
    await page.waitForSelector("#upload-file-header");
    const text = await page.$eval("#upload-file-header", (e) => e.textContent);
    expect(text).toEqual("Upload File", (e) => e.textContent);
  });

  it("Contains the header for uploaded files", async () => {
    await page.waitForSelector("#drag-file-description");
    const text = await page.$eval("#drag-file-description", (e) => e.textContent);
    expect(text).toEqual("Drag'n'Drop File Here", (e) => e.textContent);
  });

  it("Contains the description for the drag and drop file section", async () => {
    await page.waitForSelector("#max-size-description");
    const text = await page.$eval("#max-size-description", (e) => e.textContent);
    expect(text).toEqual("Max Size: 100MB", (e) => e.textContent);
  });

  afterAll(() => browser.close());
});

describe("App Page navigation tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000/about");
  });

  it("Should stay on the app page", async () => {
    await page.waitForSelector("#app-button");
    await page.click("#app-button");
    await page.waitForSelector("#upload-file-header");
    const text = await page.$eval("#upload-file-header", (e) => e.textContent);
    expect(text).toEqual("Upload File", (e) => e.textContent);
  });

  it("Should navigate to the about page", async () => {
    await page.waitForSelector("#about-button");
    await page.click("#about-button");
    await page.waitForSelector("#greeting");
    const text = await page.$eval("#greeting", (e) => e.textContent);
    expect(text).toEqual("Hi! I am Aron Teh.");
  });

  afterAll(() => browser.close());
});
