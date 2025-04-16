function scrapeLinkedInProfile() {
    // Main Container
    const main = document?.getElementsByTagName("main")[0];
    
    // --- Name ---
    const name = document?.getElementById("ember38")?.innerText || 
                 document?.getElementById("ember37")?.innerText || 
                 document.querySelector('a.ember-view[href*="/overlay/about-this-profile/"] h1')?.innerText || 
                 "Can't find name";
    
    // --- Headline ---
    const headline = document?.querySelectorAll(".SrNMImTCbBPBwFOOiWhprUNPxktTZlGU")[0]?.querySelector(".text-body-medium")?.innerText || 
                    main?.childNodes[9]?.querySelector(".text-body-medium")?.innerText || 
                    "Can't find headline";
    
    // --- Location ---
    const location = main?.childNodes[9]?.querySelector("span.text-body-small.inline.t-black--light.break-words")?.innerText || 
                    "Location Not Found";
    
    // --- Next Button ---
    const nextBtn = document?.querySelector("#ember3764");
    
    // --- Post Link ---
    const postLink = window.location.href;
    
    // --- Posts Url ---
    const postsUrl = window.location.href + "recent-activity/all/";

    console.log(name, headline, location);

    // --- Dynamic About Section Search ---
    let about = "About content not found";
    let topSkillList = "Top Skills content not found";
    const mainChildren = main?.childNodes;
    
    if (mainChildren) {
        for (const child of mainChildren) {
            // Only process Element nodes (nodeType === 1)
            if (child.nodeType === 1) {
                const header = child.querySelector('h2.pvs-header__title')?.innerText;
                if (header?.toLowerCase().includes("about")) {
                    topSkillList = child.querySelector("[data-view-name='profile-component-entity']")?.querySelectorAll("span.visually-hidden")[1]?.innerText;
                    about = child.querySelector('.guoMOndwQfrqcNISpQhIvArpasFrRno')?.querySelector("span.visually-hidden")?.innerText ||
                            child.querySelector(".inline-show-more-text--is-collapsed")?.querySelector("span.visually-hidden")?.innerText ||
                            child.querySelector("div.full-width.t-14.t-normal.t-black.display-flex.align-items-center")?.querySelector("span.visually-hidden")?.innerText ||
                            "About content not found";
                    break;
                }
            }
        }
    }

    // --- Dynamic Services Section Search ---
    let services = "Services content not found";
    let servicesList = [];

    if (mainChildren) {
        for (const child of mainChildren) {
            // Only process Element nodes (nodeType === 1)
            if (child.nodeType === 1) {
                const header = child.querySelector('h2.pvs-header__title')?.innerText;
                if (header?.toLowerCase().includes("services")) {
                    const serviceElements = child.querySelectorAll("span.visually-hidden");
                    if (serviceElements.length > 0) {
                        services = serviceElements[1].innerText;
                        if (serviceElements.length > 2) {
                            servicesList = Array.from(serviceElements)
                                .slice(2)
                                .map(el => el.innerText);
                        }
                    } else {
                        services = "Services content not found";
                    }
                    break;
                }
            }
        }
    }

    // --- Dynamic Projects Section Search ---
    let projects = [];
    
    if (mainChildren) {
        for (const child of mainChildren) {
            // Only process Element nodes (nodeType === 1)
            if (child.nodeType === 1) {
                const header = child.querySelector('h2.pvs-header__title')?.innerText;
                if (header?.toLowerCase().includes("projects")) {
                    const projectList = child.querySelector('ul');
                    if (projectList) {
                        projects = Array.from(projectList.querySelectorAll('li')).map(li => li.innerText);
                    }
                    break;
                }
            }
        }
    }

    console.log("Projects: ", projects);

    // --- Dynamic Education Section Search ---
    let education = [];

    if (mainChildren) {
        for (const child of mainChildren) {
            // Only process Element nodes (nodeType === 1)
            if (child.nodeType === 1) {
                const header = child.querySelector('h2.pvs-header__title')?.innerText;
                if (header?.toLowerCase().includes("education")) {
                    const ulElement = child.querySelector("ul");
                    if (ulElement) {
                        const directChildren = Array.from(ulElement.children);
                        education = directChildren.map(child => child.querySelector("span.visually-hidden")?.innerText);
                    }
                    console.log("Education: ", education);
                    break;
                }
            }
        }
    }

    // --- Dynamic Activity Section Search for Posts ---
    let postElements = document.getElementById("ember3753")?.querySelectorAll("li.artdeco-carousel__item");
    
    if (!postElements || postElements.length === 0) {
        if (mainChildren) {
            for (const child of mainChildren) {
                // Only process Element nodes (nodeType === 1)
                if (child.nodeType === 1) {
                    const header = child.querySelector('h2.pvs-header__title')?.innerText;
                    if (header?.toLowerCase().includes("activity")) {
                        postElements = child.querySelectorAll("li.artdeco-carousel__item");
                        break;
                    }
                }
            }
        }
    }
    
    const posts = postElements ? Array.from(postElements).map((post) => {
        const text = post?.querySelector(".tvm-parent-container")?.innerText;
        nextBtn?.click();
        nextBtn?.click();

        return {
            text,
        };
    }) : [];

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

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.action === "scrapeLinkedIn") {
        sendResponse(scrapeLinkedInProfile());
    }
});