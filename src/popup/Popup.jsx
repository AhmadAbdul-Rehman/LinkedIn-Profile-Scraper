import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaBriefcase,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaList,
  FaStar,
  FaGraduationCap,
  FaProjectDiagram,
  FaComment,
  FaCopy,
  FaBuilding,
  FaFileAlt,
  FaLinkedin,
  FaSun,
  FaMoon,
  FaArrowRight,
  FaRobot,
} from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Popup = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [pageType, setPageType] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  // Load theme from chrome.storage.local when component mounts
  useEffect(() => {
    chrome.storage.local.get(["theme"], (result) => {
      if (result.theme) {
        setDarkMode(result.theme === "dark");
      }
      // If no theme is saved, default to light (darkMode remains false)
    });
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    // Save the new theme preference to chrome.storage.local
    chrome.storage.local.set({ theme: newMode ? "dark" : "light" });
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) {
        setError("No active tab found.");
        return;
      }

      if (tab.url?.includes("https://www.linkedin.com/in/")) {
        setPageType("profile");
        chrome.scripting.executeScript(
          { target: { tabId: tab.id }, files: ["content.js"] },
          () => {
            chrome.tabs.sendMessage(
              tab.id,
              { action: "scrapeLinkedIn" },
              (response) => {
                if (chrome.runtime.lastError || !response) {
                  setError("Could not connect to content script.");
                  return;
                }
                setData(response);
              }
            );
          }
        );
      } else if (
        tab.url?.includes("https://www.linkedin.com/jobs/collections/recommended/")
      ) {
        setPageType("jobs");
        chrome.scripting.executeScript(
          { target: { tabId: tab.id }, files: ["content.js"] },
          () => {
            chrome.tabs.sendMessage(
              tab.id,
              { action: "scrapeLinkedInJobsRecommendedPage" },
              (response) => {
                if (chrome.runtime.lastError || !response) {
                  setError("Could not connect to content script.");
                  return;
                }
                setData(response);
              }
            );
          }
        );
      } else {
        setPageType("other");
        chrome.scripting.executeScript(
          { target: { tabId: tab.id }, files: ["content.js"] },
          () => {
            chrome.tabs.sendMessage(
              tab.id,
              { action: "scrapePageText" },
              (response) => {
                if (chrome.runtime.lastError || !response) {
                  setError("Could not connect to content script.");
                  return;
                }
                setData(response);
              }
            );
          }
        );
      }
    });
  }, []);

  const showToast = (message) => {
    toast(message, {
      autoClose: 3000,
      style: { width: 'auto', marginTop: '20px', textWrap: 'nowrap' },
      progressStyle: { backgroundColor: '#007bff' },
      position: "top-center"
    });
  };

  const copyProfileData = () => {
    if (!data) return;
    const keyValueString = `
Name: ${data.name || "N/A"}
Headline: ${data.headline || "N/A"}
Location: ${data.location || "N/A"}
About: ${data.about || "N/A"}
Services: ${data.services || "N/A"}
Services List: ${data.servicesList?.join(", ") || "N/A"}
Top Skills: ${data.topSkillList || "N/A"}
Education: ${data.education?.join("; ") || "N/A"}
Projects: ${data.projects?.join("; ") || "N/A"}
Posts: ${data.posts?.map((p) => p.text).join("; ") || "N/A"}
Profile Link: ${data.postLink || "N/A"}
    `.trim();
    navigator.clipboard.writeText(keyValueString);
    showToast("Profile data copied to clipboard!");
  };


  const generateSummary = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) {
        showToast("No active tab found.");
        return;
      }
      chrome.tabs.sendMessage(
        tab.id,
        { action: "addSummarySection", profileData: data },
        (response) => {
          if (chrome.runtime.lastError || !response) {
            showToast("Failed to generate summary. Please try again.");
            console.error("Could not connect to content script.");
            return;
          }
          showToast("Summary section added successfully!");
        }
      );
    });
  };

  const containerClass = darkMode
    ? "min-w-[320px] max-w-[400px] p-6 bg-gray-800 text-white rounded-lg shadow-md space-y-4"
    : "min-w-[320px] max-w-[400px] p-6 bg-gray-50 text-gray-800 rounded-lg shadow-md space-y-4";

  if (error) {
    return (
      <div className={`${containerClass} bg-red-50 text-red-600`}>
        <div className="flex items-center gap-2">
          <FaInfoCircle className="text-lg" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`${containerClass} bg-gray-50 text-gray-600`}>
        <div className="flex items-center gap-2">
          <FiLoader className="text-lg animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <ToastContainer />
      {pageType === "profile" && (
        <>
          <section
            className={`sticky top-0 py-3 border-b border-gray-200 ${
              darkMode ? "bg-gray-800" : "bg-[#f9fafb]"
            } left-0 right-0 z-10`}
          >
            <h2 className="text-2xl mb-4 font-semibold text-center text-blue-600 flex items-center justify-start gap-2">
              <FaLinkedin className="text-blue-600" />
              LinkedIn Profile Info
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={generateSummary}
                className="flex-1 h-9 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
              >
                <FaRobot />
                Generate Summary
              </button>
              <button
                className="h-9 py-2 px-4 text-nowrap border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors"
                onClick={copyProfileData}
              >
                <FaCopy />
                Copy
              </button>
              <button
                onClick={toggleDarkMode}
                className={`h-9 py-2 px-4 rounded-md border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center`}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
            </div>
          </section>
          <div className="space-y-3">
            <p className="flex items-center gap-2">
              <FaUser className="text-blue-500" />
              <strong>Name:</strong> {data?.name || "N/A"}
            </p>
            <p className="flex items-center gap-2 text-xs">
              <FaInfoCircle className="text-blue-500" />
              <strong className="text-gray-600 text-xs text-nowrap">
                Profile Link:
              </strong>
              <a
                href={data?.postLink}
                className="text-blue-500 hover:underline truncate"
                target="_blank"
                rel="noopener noreferrer"
              >
                {data?.postLink || "N/A"}
              </a>
            </p>
            <div className="flex items-center gap-2">
              <FaBriefcase className="text-blue-500" />
              <strong>Headline:</strong>
            </div>
            <p
              className={`mt-1 p-3 rounded-md shadow-sm text-xs max-h-28 overflow-y-auto ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            >
              {data?.headline || "N/A"}
            </p>
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-500" />
              <strong>Location:</strong> {data?.location || "N/A"}
            </p>
            <div>
              <div className="flex items-center gap-2">
                <FaInfoCircle className="text-blue-500" />
                <strong>About:</strong>
              </div>
              <p
                className={`mt-1 p-3 rounded-md shadow-sm text-xs max-h-28 overflow-y-auto ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              >
                {data?.about || "About content not found"}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <FaList className="text-blue-500" />
                <strong>Services:</strong>
              </div>
              <p
                className={`mt-1 p-3 rounded-md shadow-sm text-xs max-h-28 overflow-y-auto ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              >
                {data?.services || "Services content not found"}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <FaList className="text-blue-500" />
                <strong>Services List:</strong>
              </div>
              <p
                className={`mt-1 p-3 rounded-md shadow-sm text-xs max-h-28 overflow-y-auto ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              >
                {data?.servicesList?.join(", ") || "Services list not found"}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <FaStar className="text-blue-500" />
                <strong>Top Skills:</strong>
              </div>
              <p
                className={`mt-1 p-3 rounded-md shadow-sm text-xs max-h-28 overflow-y-auto ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              >
                {data?.topSkillList || "Top Skills content not found"}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <FaGraduationCap className="text-blue-500" />
                <strong>Education:</strong>
              </div>
              {data?.education?.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {data?.education?.map((edu, i) => (
                    <li
                      key={i}
                      className={`p-3 rounded-md shadow-sm text-xs ${
                        darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                      }`}
                    >
                      <h3 className="font-semibold">Education #{i + 1}</h3>
                      <p className="mt-1">{edu}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  className={`mt-1 p-3 rounded-md shadow-sm text-xs ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                  }`}
                >
                  No education found.
                </p>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <FaProjectDiagram className="text-blue-500" />
                <strong>Projects:</strong>
              </div>
              {data?.education?.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {data?.projects?.map((project, i) => (
                    <li
                      key={i}
                      className={`p-3 rounded-md shadow-sm text-xs ${
                        darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                      }`}
                    >
                      <h3 className="font-semibold">Project #{i + 1}</h3>
                      <p className="mt-1">{project}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  className={`mt-1 p-3 rounded-md shadow-sm text-xs ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                  }`}
                >
                  No projects found.
                </p>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <FaComment className="text-blue-500" />
                <strong>Recent Posts:</strong>
              </div>
              {data?.posts?.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {data?.posts?.map((post, i) => (
                    <li
                      key={i}
                      className={`p-3 rounded-md shadow-sm text-xs ${
                        darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                      }`}
                    >
                      <h3 className="font-semibold">Post #{i + 1}</h3>
                      <p className="mt-1">{post?.text}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  className={`mt-1 p-3 rounded-md shadow-sm text-xs ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                  }`}
                >
                  No posts found.
                </p>
              )}
            </div>
          </div>
          <section
            className={`sticky bottom-0 border-t border-gray-200 py-3 ${
              darkMode ? "bg-gray-800" : "bg-[#f9fafb]"
            } left-0 right-0 z-10`}
          >
            <button
              onClick={() => {
                chrome.runtime.openOptionsPage();
              }}
              className="w-full h-9 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
            >
              Proceed
              <FaArrowRight />
            </button>
          </section>
        </>
      )}

      {pageType === "jobs" && (
        <>
          <h2 className="text-xl font-semibold text-center text-blue-700 flex items-center justify-center gap-2">
            <FaBriefcase className="text-blue-700" />
            LinkedIn Job Info
          </h2>
          <button
            onClick={() => {
              const jobDataString = `
Job Title: ${data.job_title || "N/A"}
Company: ${data.job_company || "N/A"}
Location: ${data.job_location || "N/A"}
Job Info: ${data.job_info || "N/A"}
About Job: ${data.about_job || "No job description available"}
                            `.trim();
              navigator.clipboard.writeText(jobDataString);
              showToast("Job data copied to clipboard!");
            }}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
          >
            <FaCopy />
            Copy Job Data
          </button>
          <div className="space-y-3">
            <p className="flex items-center gap-2">
              <FaBriefcase className="text-blue-500" />
              <strong className="text-xs text-nowrap">Job Title:</strong>{" "}
              <span className="text-xs text-nowrap truncate">{data.job_title || "N/A"}</span>
            </p>
            <p className="flex items-center gap-2">
              <FaBuilding className="text-blue-500" />
              <strong className="text-xs text-nowrap">Company:</strong>{" "}
              <span className="text-xs text-nowrap truncate">{data.job_company || "N/A"}</span>
            </p>
            <div>
              <div className="flex items-center gap-2">
                <FaInfoCircle className="text-blue-500" />
                <strong className="text-xs text-nowrap">Job Info:</strong>
              </div>
              <p
                className={`mt-1 p-3 rounded-md shadow-sm text-xs max-h-28 overflow-y-auto ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              >
                {data.job_info || "N/A"}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <FaInfoCircle className="text-blue-500" />
                <strong>About Job:</strong>
              </div>
              <p
                className={`mt-1 p-3 rounded-md shadow-sm text-xs max-h-48 overflow-y-auto ${
                  darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              >
                {data.about_job || "No job description available"}
              </p>
            </div>
          </div>
        </>
      )}

      {pageType === "other" && (
        <>
          <h2 className="text-xl font-semibold text-center text-blue-700 flex items-center justify-center gap-2">
            <FaFileAlt className="text-blue-700" />
            Page Content
          </h2>
          <button
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(data?.text || "No text content found.");
              showToast("Content copied to clipboard!");
            }}
          >
            <FaCopy />
            Copy Content
          </button>
          <div
            className={`p-4 rounded-md shadow-sm text-xs max-h-[400px] overflow-y-auto ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
          >
            {data?.text || "No text content found."}
          </div>
        </>
      )}
    </div>
  );
};

export default Popup;