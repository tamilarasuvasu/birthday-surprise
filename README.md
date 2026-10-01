# Birthday Surprise

A small, static birthday story made with HTML, CSS, and vanilla JavaScript. It moves through a mystery, birthday reveal and cake, a catch-the-hearts game, a three-song playlist, and a final celebration. No backend or personal photos are needed.

## Technologies

- HTML5, CSS3, and vanilla JavaScript
- HTML5 Audio API for the optional playlist
- Canvas API for lightweight fireworks
- Google Fonts (Great Vibes, Playfair Display, and Manrope)

## Project structure

```text
birthday-surprise/
├── index.html
├── css/
│   ├── style.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── script.js
│   ├── navigation.js
│   ├── game.js
│   ├── music.js
│   └── effects.js
└── assets/
    ├── icons/favicon.svg
    ├── music/   # Add song1.mp3, song2.mp3, and song3.mp3
    └── sounds/  # Optional click.mp3, success.mp3, cake-cut.mp3, celebration.mp3
```

## Run locally

**Open directly:** Open `index.html` in a modern browser. The scripts use classic deferred script tags, so no bundler or server is required.

**VS Code Live Server:** In VS Code, install the **Live Server** extension by Ritwick Dey. Right-click `index.html`, choose **Open with Live Server**, and the browser opens the local site. Live Server is useful for auto-refresh while editing.

## Customize

Open `js/script.js` and edit the `CONFIG` object at the top. The friend's name is already set to `Priyaharshini`:

- Set `friendName` to the birthday person's name.
- Edit `birthdayMessage`, `finalMessage`, and `finalQuote`.
- Update each song's `title`, `description`, and relative `file` path.
- Change `gameTarget` to set the number of hearts needed.
- Change the button labels in `labels`.

To add music, place your own MP3 files in `assets/music/` using the configured filenames. The browser starts audio only after a person presses Play. If a file is missing or cannot be decoded, the player displays an error and the rest of the experience continues to work. No audio tracks are bundled; use music you have permission to share.

Turn on **Sound** in the top-right corner to hear generated button clicks, heart catches, cake-cutting, and celebration sounds. These use the Web Audio API and need no audio files. To replace a generated effect with your own sound, add its relative path to the `sounds` object in `CONFIG` and place the file in `assets/sounds/`.

Change the palette in the CSS custom properties at the top of `css/style.css`. The game is responsive; change its target in `CONFIG`, not in the markup.

## Test on mobile

Open the Live Server URL on a phone connected to the same network, or use browser developer tools' responsive/device mode. Check narrow widths from 320px upward, tap hearts, use the player controls, and check that the story has no horizontal scrolling. Touch and mouse input are both supported.

## GitHub Pages

1. Create a GitHub repository for the project.
2. Upload or push the contents of this folder, keeping `index.html` at the repository root.
3. Open the repository's **Settings**, then **Pages**.
4. Under build and deployment, select **Deploy from a branch**.
5. Choose the branch containing the site (usually `main`) and the `/ (root)` folder, then save.
6. Wait for GitHub Pages to finish deployment and open the URL shown on the Pages settings screen.

All project references are relative, so the site works from a repository subpath. Google Fonts requires an internet connection; system fallbacks are included. Audio files remain optional and should be added to the repository only when you have the right to distribute them.
