export {};

browser.tabs.create({ url: browser.runtime.getURL("example.html") });
