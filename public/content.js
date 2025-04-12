function scrapeGitHubProfile() {
  const username = window.location.pathname.split("/")[1];
  return { platform: "github", username };
}

function scrapeLinkedInProfile() {
  const name = document.querySelector(".top-card-layout__title")?.innerText || "";
  const headline = document.querySelector(".top-card-layout__headline")?.innerText || "";
  return { platform: "linkedin", name, headline };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    const hostname = window.location.hostname;

    if (hostname.includes("github.com")) {
      sendResponse(scrapeGitHubProfile());
    } else if (hostname.includes("linkedin.com")) {
      sendResponse(scrapeLinkedInProfile());
    } else {
      sendResponse({ platform: "unsupported" });
    }
  }
});
