# Smart URL Redirector 🔀

<p align="center">
  <img src="assets/logo.png" alt="Smart URL Redirector logo" width="128">
</p>

<p align="center">
  <strong>Take control of your browsing with custom URL redirects</strong><br>
  A powerful, privacy-focused Chrome extension that redirects URLs based on regex patterns you define.
</p>

---

## Features

- **Custom Regex Rules** - Match URLs with powerful regular expressions
- **Intuitive Interface** - Modern popup UI for easy rule management
- **Privacy First** - All data stored locally, nothing sent to external servers
- **Real-time Redirects** - Instant redirects with SPA navigation support
- **Sync Across Devices** - Rules sync with your Chrome account
- **Toggle Controls** - Enable/disable rules without deleting them
- **Rule Validation** - Built-in regex and URL validation

## Quick Start

### Installation

#### From Source (Development)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked** and select the extension folder
5. The extension icon will appear in your toolbar

#### From Chrome Web Store

_Coming soon_

### First Setup

1. **Click the extension icon** in your toolbar
2. **Add your first rule:**
   - Name: `Block Reddit Subreddits`
   - Pattern: `^https?://(?:www\.)?reddit\.com/r/[^/]+/?$`
   - Destination: `https://www.reddit.com`
3. **Enable the rule** and test it by visiting any subreddit

## Usage Examples

### Block Distracting Websites

**YouTube Homepage → Subscriptions Feed**

```
Pattern: ^https?://(?:www\.)?youtube\.com/?(?:\?.*)?$
Destination: https://www.youtube.com/feed/subscriptions
```

**Twitter Timeline → Notifications**

```
Pattern: ^https?://(?:www\.)?twitter\.com/home$
Destination: https://twitter.com/notifications
```

**Reddit Subreddits → Homepage**

```
Pattern: ^https?://(?:www\.)?reddit\.com/r/[^/]+/?$
Destination: https://www.reddit.com
```

### Clean Up Tracking Links

**Remove UTM Parameters**

```
Pattern: ^(https?://.*?)\?utm_.*$
Destination: $1
```

### Development Workflows

**Local Development Redirect**

```
Pattern: ^https?://production\.example\.com/(.*)$
Destination: http://localhost:3000/$1
```

## Interface Guide

### Main Popup

- **Add Rule Button** - Create new redirect rules
- **Rule Cards** - View and manage existing rules
- **Toggle Switches** - Enable/disable rules instantly
- **Delete Buttons** - Remove unwanted rules

### Rule Editor

- **Rule Name** - Descriptive name for easy identification
- **URL Pattern** - Regular expression to match URLs
- **Redirect Destination** - Where matching URLs should go
- **Validation** - Real-time validation of patterns and URLs

## Advanced Configuration

### Regex Pattern Tips

**Basic Patterns:**

- `^https?://example\.com$` - Exact domain match
- `^https?://.*\.example\.com` - Any subdomain
- `^https?://example\.com/.*` - Domain and any path

**Special Characters to Escape:**

- `.` → `\.` (literal dot)
- `?` → `\?` (literal question mark)
- `+` → `\+` (literal plus sign)

**Groups and Alternatives:**

- `(?:www\.)?` - Optional www subdomain
- `(http|https)` - Match either protocol
- `[^/]+` - One or more non-slash characters

### Testing Your Patterns

1. Use an online regex tester like [regex101.com](https://regex101.com)
2. Test with actual URLs you want to match
3. Enable developer console (F12) to see debug logs

## Privacy & Security

### Data Storage

- All rules stored locally using Chrome's `storage.sync` API
- Data syncs across your Chrome browsers when signed in
- **No external servers** - your data never leaves your devices

### Permissions Explained

- **`storage`** - Save your custom redirect rules
- **`activeTab`** - Access the current tab's URL for redirects
- **`<all_urls>`** - Monitor any website for redirect patterns

### Security Features

- Input validation prevents malicious regex patterns
- URL validation ensures safe redirect destinations
- No remote code execution or external dependencies

## Development

### Project Structure

```
smart-url-redirector/
├── manifest.json
├── content.js
├── popup.html
├── popup.js
├── assets/
│   └── icons/
└── README.md
```

### Building from Source

1. **Clone the repository**

   ```bash
   git clone https://github.com/r-shafi/redirector.git
   cd redirector
   ```

2. **Install in Chrome**

   - Open `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked" and select the project folder

3. **Make changes**
   - Edit source files
   - Reload extension in Chrome
   - Test your changes

### Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

Please ensure your contributions maintain the extension's privacy-first approach and don't introduce unnecessary dependencies.

## Troubleshooting

### Common Issues

**Rule not working:**

- Check if the rule is enabled (green toggle)
- Verify your regex pattern with a testing tool
- Open browser console (F12) to see debug logs
- Ensure destination URL includes `http://` or `https://`

**Extension not loading:**

- Make sure all required files are present
- Check Chrome's extension error console
- Try reloading the extension

**Sync issues:**

- Ensure you're signed into Chrome
- Check if storage quota is exceeded
- Try disabling and re-enabling sync

### Debug Mode

Enable detailed logging by opening the browser console (F12) on any page. You'll see:

- URLs being checked for matches
- Which rules are being tested
- Match results and redirect decisions

## Support

- **Issues**: [GitHub Issues](https://github.com/r-shafi/redirector/issues)
- **Discussions**: [GitHub Discussions](https://github.com/r-shafi/redirector/discussions)
- **Email**: rayhanshafi7@gmail.com
