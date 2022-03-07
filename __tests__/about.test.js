/* eslint-disable comma-dangle */
import puppeteer from "puppeteer";

describe("About Page content tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 250,
    });
    page = await browser.newPage();
    await page.goto("http://localhost:3000/about");
  });

  it("Contains the greeting", async () => {
    await page.waitForSelector("#greeting");
    const text = await page.$eval("#greeting", (e) => e.textContent);
    expect(text).toEqual("Hi! I am Aron Teh.");
  });

  it("Contains my self-introduction", async () => {
    await page.waitForSelector("#self-introduction");
    const text = await page.$eval("#self-introduction", (e) => e.textContent);
    expect(text).toEqual(
      "I build small projects like this in my free time to learn and explore new technologies.",
      (e) => e.textContent
    );
  });

  it("Contains the welcome greeting", async () => {
    await page.waitForSelector("#welcome-text");
    const text = await page.$eval("#welcome-text", (e) => e.textContent);
    expect(text).toEqual("Welcome", (e) => e.textContent);
  });

  it("Contains the first Turbofile description", async () => {
    await page.waitForSelector("#description-1");
    const text = await page.$eval("#description-1", (e) => e.textContent);
    expect(text).toEqual(
      "TurboFile is an app that allows you to share large files with anyone in just a few clicks.",
      (e) => e.textContent
    );
  });

  it("Contains the second Turbofile description", async () => {
    await page.waitForSelector("#description-2");
    const text = await page.$eval("#description-2", (e) => e.textContent);
    expect(text).toEqual(
      "No authentication is necessary. Drag, drop, upload and your file is ready to be shared!",
      (e) => e.textContent
    );
  });

  afterAll(() => browser.close());
});

describe("About Page navigation tests", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:3000/about");
  });

  it("Should navigate to the file sharing page from the top navbar", async () => {
    await page.waitForSelector("#app-button");
    await page.click("#app-button");
    await page.waitForSelector("#upload-file-header");
    const text = await page.$eval("#upload-file-header", (e) => e.textContent);
    expect(text).toEqual("Upload File", (e) => e.textContent);
  });

  it("Should stay on the about page", async () => {
    await page.waitForSelector("#about-button");
    await page.click("#about-button");
    await page.waitForSelector("#greeting");
    const text = await page.$eval("#greeting", (e) => e.textContent);
    expect(text).toEqual("Hi! I am Aron Teh.");
  });

  it("Should navigate to the file sharing page from the bottom left prompt", async () => {
    await page.waitForSelector("#start-sharing-button");
    await page.click("#start-sharing-button");
    await page.waitForSelector("#upload-file-header");
    const text = await page.$eval("#upload-file-header", (e) => e.textContent);
    expect(text).toEqual("Upload File", (e) => e.textContent);
  });

  afterAll(() => browser.close());
});
