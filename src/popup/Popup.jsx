import React, { useEffect, useState } from "react";

const Popup = () => {
    const [platform, setPlatform] = useState(null);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tab = tabs[0];
  
          if (!tab?.id) {
              setError("No active tab found.");
              return;
          }
  
          chrome.scripting.executeScript(
              {
                  target: { tabId: tab.id },
                  files: ["content.js"],
              },
              () => {
                  chrome.tabs.sendMessage(
                      tab.id,
                      { action: "scrape" },
                      async (response) => {
                          if (chrome.runtime.lastError || !response) {
                              setError("Could not connect to content script.");
                              return;
                          }
  
                          const platform = response?.platform;
                          setPlatform(platform);
  
                          if (platform === "github") {
                              const username = response.username;
                              if (!username) {
                                  setError("No GitHub username detected.");
                                  return;
                              }
  
                              try {
                                  const [userRes, reposRes, readmeRes] =
                                      await Promise.all([
                                          fetch(`https://api.github.com/users/${username}`),
                                          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=4`),
                                          fetch(`https://api.github.com/repos/${username}/${username}/readme`),
                                      ]);
  
                                  const user = await userRes.json();
                                  const repos = await reposRes.json();
  
                                  let readme = "No README found.";
                                  if (readmeRes.ok) {
                                      const readmeData = await readmeRes.json();
                                      const content = atob(readmeData.content);
                                      readme = content.slice(0, 500);
                                  }
  
                                  setData({
                                      name: user.name || username,
                                      bio: user.bio || "No bio available",
                                      repos: repos.map((r) => ({
                                          name: r.name,
                                          url: r.html_url,
                                      })),
                                      readme,
                                  });
                              } catch (err) {
                                  setError("Error fetching GitHub data.");
                              }
                          } else if (platform === "linkedin") {
                              setData({
                                  name: response.name || "No name found",
                                  headline: response.headline || "No headline found",
                              });
                          } else {
                              setError("Unsupported platform. Try GitHub or LinkedIn.");
                          }
                      }
                  );
              }
          );
      });
  }, []);
  
    return (
        <div className="min-w-[300px] p-6 bg-white text-black text-sm space-y-4">
            <h1 className="text-xl font-bold text-center">
                {platform === "github"
                    ? "GitHub Info"
                    : platform === "linkedin"
                    ? "LinkedIn Info"
                    : "Info"}
            </h1>
            {error && <p className="text-red-500 text-center">{error}</p>}

            {data ? (
                <>
                    <p>
                        <strong>Name:</strong> {data.name}
                    </p>
                    {platform === "github" ? (
                        <>
                            <p>
                                <strong>Bio:</strong> {data.bio}
                            </p>
                            <div>
                                <strong>Top Repositories:</strong>
                                <ul className="list-disc ml-5">
                                    {data.repos.map((repo) => (
                                        <li key={repo.url}>
                                            <a
                                                href={repo.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                {repo.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <strong>README Preview:</strong>
                                <pre className="bg-gray-100 p-2 mt-2 max-w-[300px] max-h-[200px] overflow-auto whitespace-pre-wrap">
                                    {data.readme}
                                </pre>
                            </div>
                        </>
                    ) : (
                        <p>
                            <strong>Headline:</strong> {data.headline}
                        </p>
                    )}
                </>
            ) : (
                !error && <p className="text-center">Loading...</p>
            )}
        </div>
    );
};

export default Popup;
