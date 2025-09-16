# LinkedIn Profile Scraper

A Chrome extension designed to scrape and display LinkedIn profile and job listing information in a clean, user-friendly popup. Extract key details like name, headline, skills, education, and job data, with features like theme persistence, profile summary generation, and easy data copying.

## Features
- **Profile Scraping**: Extracts details from LinkedIn profiles, including name, headline, location, about, skills, education, projects, services, and recent posts.
- **Job Scraping**: Pulls job title, company, location, and description from LinkedIn job listings.
- **Theme Persistence**: Supports light and dark modes, with user preferences saved across sessions using `chrome.storage`.
- **Summary Generation**: Adds a dynamic summary section to LinkedIn profile pages, preventing duplicates.
- **Data Copying**: Copy profile or job data to the clipboard in a formatted string.
- **Responsive UI**: Built with React and Tailwind CSS for a modern, responsive popup interface.
- **Error Handling**: Displays clear error messages for failed scrapes or missing data.

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AhmadAbdul-Rehman/linkedin-profile-scraper.git
   ```
2. **Load the Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** (top-right toggle).
   - Click **Load unpacked** and select the cloned repository folder.
3. **Verify Installation**:
   - The extension should appear in your Chrome extensions list.
   - Pin the extension to the toolbar for easy access.

## Usage
1. **Open the Popup**:
   - Click the extension icon in the Chrome toolbar while on a LinkedIn profile (`https://www.linkedin.com/in/*`), job listing (`https://www.linkedin.com/jobs/collections/recommended/*`), or any other webpage.
2. **View Scraped Data**:
   - **Profile Page**: See name, headline, location, about, skills, education, projects, services, and posts.
   - **Job Page**: View job title, company, location, and description.
   - **Other Pages**: Extract and display page text content.
3. **Generate Summary**:
   - On a profile page, click **Generate Summary** to add a summary section to the LinkedIn sidebar. The extension prevents duplicate sections.
4. **Copy Data**:
   - Click **Copy** to copy profile or job data to the clipboard in a formatted string.
5. **Toggle Theme**:
   - Click the sun/moon icon to switch between light and dark modes. Your preference is saved automatically.
6. **Proceed**:
   - Click **Proceed** to open the extension’s options page (if implemented).

## Screenshots
*(Add screenshots to your repository in a `/screenshots` folder and update the links below)*

- **Profile View**: ![Profile View](screenshots/profile-view.png)
- **Job View**: ![Job View](screenshots/job-view.png)
- **Dark Mode**: ![Dark Mode](screenshots/dark-mode.png)
- **Summary Section**: ![Summary Section](screenshots/summary-section.png)

## Permissions
The extension requires the following permissions (defined in `manifest.json`):
- `activeTab`: Access the active tab for scraping.
- `scripting`: Inject `content.js` to scrape page data.
- `tabs`: Query tab URLs to determine page type.
- `storage`: Save theme preferences.

## Development
### Prerequisites
- Node.js and npm (for React development).
- Chrome browser.

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the React app:
   ```bash
   npm run build
   ```
3. Load the `build` folder as an unpacked extension in Chrome.

### File Structure
- `src/Popup.jsx`: React component for the popup UI.
- `src/content.js`: Content script for scraping LinkedIn and other pages.
- `manifest.json`: Extension configuration.
- `public/`: Static assets and HTML template.
- `build/`: Compiled extension files.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## Issues
Report bugs or suggest features by opening an issue on the [GitHub Issues page](https://github.com/your-username/linkedin-profile-scraper/issues).

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Built with [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), and [React Icons](https://react-icons.github.io/react-icons/).
- Inspired by the need for efficient LinkedIn data extraction.

---
