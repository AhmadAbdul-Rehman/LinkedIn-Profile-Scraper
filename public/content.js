// Scrape LinkedIn Profile (unchanged)
function scrapeLinkedInProfile() {
    const main = document?.getElementsByTagName("main")[0];

    const name =
        document?.getElementById("ember38")?.innerText ||
        document?.getElementById("ember37")?.innerText ||
        document.querySelector('a.ember-view[href*="/overlay/about-this-profile/"] h1')?.innerText ||
        "Can't find name";

    const headline =
        document?.querySelectorAll(".SrNMImTCbBPBwFOOiWhprUNPxktTZlGU")[0]?.querySelector(".text-body-medium")?.innerText ||
        main?.childNodes[9]?.querySelector(".text-body-medium")?.innerText ||
        "Can't find headline";

    const location =
        main?.childNodes[9]?.querySelector("span.text-body-small.inline.t-black--light.break-words")?.innerText ||
        "Location Not Found";

    const nextBtn = document?.querySelector("#ember3764");
    const postLink = window.location.href;
    const postsUrl = window.location.href + "recent-activity/all/";

    console.log(name, headline, location);

    let about = "About content not found";
    let topSkillList = "Top Skills content not found";
    const mainChildren = main?.childNodes;

    if (mainChildren) {
        for (const child of mainChildren) {
            if (child.nodeType === 1) {
                const header = child.querySelector("h2.pvs-header__title")?.innerText;
                if (header?.toLowerCase().includes("about")) {
                    topSkillList =
                        child.querySelector("[data-view-name='profile-component-entity']")?.querySelectorAll("span.visually-hidden")[1]?.innerText;
                    about =
                        child.querySelector(".guoMOndwQfrqcNISpQhIvArpasFrRno")?.querySelector("span.visually-hidden")?.innerText ||
                        child.querySelector(".inline-show-more-text--is-collapsed")?.querySelector("span.visually-hidden")?.innerText ||
                        child.querySelector("div.full-width.t-14.t-normal.t-black.display-flex.align-items-center")?.querySelector("span.visually-hidden")?.innerText ||
                        "About content not found";
                    break;
                }
            }
        }
    }

    let services = "Services content not found";
    let servicesList = [];

    if (mainChildren) {
        for (const child of mainChildren) {
            if (child.nodeType === 1) {
                const header = child.querySelector("h2.pvs-header__title")?.innerText;
                if (header?.toLowerCase().includes("services")) {
                    const serviceElements = child.querySelectorAll("span.visually-hidden");
                    if (serviceElements.length > 0) {
                        services = serviceElements[1].innerText;
                        if (serviceElements.length > 2) {
                            servicesList = Array.from(serviceElements).slice(2).map((el) => el.innerText);
                        }
                    } else {
                        services = "Services content not found";
                    }
                    break;
                }
            }
        }
    }

    let projects = [];

    if (mainChildren) {
        for (const child of mainChildren) {
            if (child.nodeType === 1) {
                const header = child.querySelector("h2.pvs-header__title")?.innerText;
                if (header?.toLowerCase().includes("projects")) {
                    const projectList = child.querySelector("ul");
                    if (projectList) {
                        projects = Array.from(projectList.querySelectorAll("li")).map((li) => li.innerText);
                    }
                    break;
                }
            }
        }
    }

    console.log("Projects: ", projects);

    let education = [];

    if (mainChildren) {
        for (const child of mainChildren) {
            if (child.nodeType === 1) {
                const header = child.querySelector("h2.pvs-header__title")?.innerText;
                if (header?.toLowerCase().includes("education")) {
                    const ulElement = child.querySelector("ul");
                    if (ulElement) {
                        const directChildren = Array.from(ulElement.children);
                        education = directChildren.map((child) => child.querySelector("span.visually-hidden")?.innerText);
                    }
                    console.log("Education: ", education);
                    break;
                }
            }
        }
    }

    let postElements = document.getElementById("ember3753")?.querySelectorAll("li.artdeco-carousel__item");

    if (!postElements || postElements.length === 0) {
        if (mainChildren) {
            for (const child of mainChildren) {
                if (child.nodeType === 1) {
                    const header = child.querySelector("h2.pvs-header__title")?.innerText;
                    if (header?.toLowerCase().includes("activity")) {
                        postElements = child.querySelectorAll("li.artdeco-carousel__item");
                        break;
                    }
                }
            }
        }
    }

    const posts = postElements
        ? Array.from(postElements).map((post) => {
            const text = post?.querySelector(".tvm-parent-container")?.innerText;
            nextBtn?.click();
            nextBtn?.click();
            return { text };
        })
        : [];

    console.log(posts);

    return {
        name,
        headline,
        location,
        about,
        services,
        projects,
        posts,
        postLink,
        servicesList,
        topSkillList,
        postsUrl,
        education,
    };
}

// Scrape LinkedIn Jobs Recommended Page
function scrapeLinkedInJobsRecommendedPage() {
    const main_wrapper = document.querySelector(".jobs-search__job-details--wrapper");

    const job_title = main_wrapper?.querySelector("h1")?.innerText || "Job Title Not Found";
    const job_company = main_wrapper?.querySelectorAll("a")[1]?.innerText || "Job Company Not Found";
    const job_info = main_wrapper?.querySelector(".job-details-jobs-unified-top-card__primary-description-container")?.innerText;
    const about_job = main_wrapper?.querySelector("div.jobs-box__html-content.jobs-description-content__text--stretch")?.innerText;

    return { job_title, job_company, job_info, about_job };
}

function addSummarySection(profileData) {
    // Select the first aside.scaffold-layout__aside (typically the right sidebar on LinkedIn profiles)
    const aside = document.querySelector("aside.scaffold-layout__aside");

    if (!aside) {
        console.error("No aside.scaffold-layout__aside found.");
        return { success: false, error: "No suitable aside element found." };
    }

    // Check if a summary section already exists
    const existingSummary = aside.querySelector(".summary-section");
    if (existingSummary) {
        // Scroll to the existing summary section
        existingSummary.scrollIntoView({ behavior: "smooth" });
        return { success: true, message: "Summary section already exists." };
    }

    // Generate dynamic summary content
    const summaryContent = profileData
        ? `
        ${profileData.name || "Name not found"} is a ${profileData.headline || "professional"} based in ${profileData.location || "unknown location"}.
        ${profileData.about ? `About: ${profileData.about.substring(0, 200)}...` : "No about section available."}
        Key Skills: ${profileData.topSkillList || "None listed"}.
      `
        : "Summary content not found.";

    // Create summary section with Tailwind CSS classes
    const summarySection = document.createElement("section");
    summarySection.className = "summary-section";
    summarySection.innerHTML = `
    <section class="artdeco-card pv-profile-card break-words mt-2" style="padding: 16px;">
        <div style="display: flex; align-items: center; gap: 8px;">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 128 128">
            <path fill="#FFF" d="M94.5,112h-61c-5.5,0-10-4.5-10-10V22c0-5.5,4.5-10,10-10h61c5.5,0,10,4.5,10,10v80C104.5,107.5,100,112,94.5,112z"></path><path fill="#C7D7E2" d="M33.5 22H94.5V37H33.5zM88.5 57h-51c-1.7 0-3-1.3-3-3s1.3-3 3-3h51c1.7 0 3 1.3 3 3S90.2 57 88.5 57zM88.5 72h-51c-1.7 0-3-1.3-3-3s1.3-3 3-3h51c1.7 0 3 1.3 3 3S90.2 72 88.5 72zM64 87H37.5c-1.7 0-3-1.3-3-3s1.3-3 3-3H64c1.7 0 3 1.3 3 3S65.7 87 64 87z"></path><path fill="#454B54" d="M94.5,115h-61c-7.2,0-13-5.8-13-13V22c0-7.2,5.8-13,13-13h61c7.2,0,13,5.8,13,13v80C107.5,109.2,101.7,115,94.5,115z M33.5,15c-3.9,0-7,3.1-7,7v80c0,3.9,3.1,7,7,7h61c3.9,0,7-3.1,7-7V22c0-3.9-3.1-7-7-7H33.5z"></path>
        </svg>
            <h2 style="font-size: 25px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">
                Summary
            </h2>
         </div>
        <p style="font-size: 14px; color: #4b5563; line-height: 1.5;">${summaryContent}</p>
      </section>
    `;

    // Prepend to the aside
    aside.insertBefore(summarySection, aside.firstChild);

    // Scroll to the summary section for visibility
    summarySection.scrollIntoView({ behavior: "smooth" });

    return { success: true };
}
// Scrape Text from Non-LinkedIn Pages
function scrapePageText() {
    const body = document.body;
    const walker = document.createTreeWalker(
        body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                const parent = node.parentElement;
                if (parent.tagName === "SCRIPT" || parent.tagName === "STYLE" || parent.tagName === "NOSCRIPT") {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            },
        }
    );

    let text = "";
    let node;
    while ((node = walker.nextNode())) {
        const trimmedText = node.textContent.trim();
        if (trimmedText) {
            text += trimmedText + "\n";
        }
    }

    return { text: text || "No text content found." };
}

// Message Listener
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.action === "scrapeLinkedIn") {
        sendResponse(scrapeLinkedInProfile());
    } else if (req.action === "scrapeLinkedInJobsRecommendedPage") {
        sendResponse(scrapeLinkedInJobsRecommendedPage());
    } else if (req.action === "scrapePageText") {
        sendResponse(scrapePageText());
    } else if (req.action === "addSummarySection") {
        sendResponse(addSummarySection(req.profileData));
    }
});