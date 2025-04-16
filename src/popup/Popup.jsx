import React, { useEffect, useState } from "react";

const Popup = () => {
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
                        { action: "scrapeLinkedIn" },
                        (response) => {
                            if (chrome.runtime.lastError || !response) {
                                setError(
                                    "Could not connect to content script."
                                );
                                return;
                            }

                            setData(response);
                        }
                    );
                }
            );
        });
    }, []);

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    if (!data) {
        return <div className="p-4 text-gray-600"> Loading profile...</div>;
    }

    return (
        <div className="min-w-[320px] p-4 space-y-3 text-sm text-black bg-white">
            <h2 className="text-lg font-bold text-center">
                LinkedIn Profile Info
            </h2>

            <p>
                <strong>Name:</strong> {data?.name}
            </p>
            <p className="text-xs inline-flex gap-1 items-center">
                <strong className="text-gray-600 text-nowrap">
                    Profile Link:
                </strong>{" "}
                <a
                    href={data?.postLink}
                    className="text-blue-500 hover:underline line-clamp-1 truncate"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {data?.postLink}
                </a>
            </p>
            <p>
                <strong>Headline:</strong> {data?.headline}
            </p>
            <p>
                <strong>Location:</strong> {data?.location}
            </p>
            <div>
                <strong>About:</strong>
                <p className="mt-1 whitespace-pre-wrap bg-gray-100 p-2 rounded text-xs max-h-28 overflow-y-auto">
                    {data?.about}
                </p>
            </div>
            <div>
                <strong>Services:</strong>
                <p className="mt-1 whitespace-pre-wrap bg-gray-100 p-2 rounded text-xs max-h-28 overflow-y-auto">
                    {data?.services || "Services content not found"}
                </p>
            </div>
            <div>
                <strong>Services List:</strong>
                <p className="mt-1 whitespace-pre-wrap bg-gray-100 p-2 rounded text-xs max-h-28 overflow-y-auto">
                    {data?.servicesList?.join(", ") || "Services list not found"}
                </p>
            </div>
            <div>
                <strong>Top Skills:</strong>
                <p className="mt-1 whitespace-pre-wrap bg-gray-100 p-2 rounded text-xs max-h-28 overflow-y-auto">
                    {data?.topSkillList || "Top Skills content not found"}
                </p>
            </div>
            <div>
                <strong>Education:</strong>
                {data?.education?.length > 0 ? (
                    <ul className="mt-1 space-y-2">
                        {data?.education?.map((edu, i) => (
                            <li
                                className="border p-2 rounded bg-gray-50 max-h-28 overflow-y-auto"
                                key={i}
                            >
                                <h1 className="text-xs font-bold mb-1">
                                    Education #{i + 1}
                                </h1>
                                <p className="whitespace-pre-wrap text-xs">
                                    {edu}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No education found.</p>
                )}
            </div>
            <div>
                <strong>Projects:</strong>
                {data?.projects?.length > 0 ? (
                    <ul className="mt-1 space-y-2">
                        {data?.projects?.map((project, i) => (
                            <li
                                className="border p-2 rounded bg-gray-50 max-h-28 overflow-y-auto"
                                key={i}
                            >
                                <h1 className="text-xs font-bold mb-1">
                                    Project #{i + 1}
                                </h1>
                                <p className="whitespace-pre-wrap text-xs">
                                    {project}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No projects found.</p>
                )}
            </div>

            <div>
                <strong>Recent Posts:</strong>
                {data?.posts?.length > 0 ? (
                    <ul className="mt-1 space-y-2">
                        {data?.posts?.map((post, i) => (
                            <li
                                key={i}
                                className="border p-2 rounded bg-gray-50"
                            >
                                <h1 className="text-xs font-bold mb-1">
                                    Post #{i + 1}
                                </h1>
                                <p className="whitespace-pre-wrap text-xs">
                                    {post?.text}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No posts found.</p>
                )}
            </div>
        </div>
    );
};

export default Popup;
