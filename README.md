
# SoundCloud Discord Bot / No Longer Works!

## Overview
The **SoundCloud Discord Bot** is a custom-built bot designed to integrate SoundCloud functionality directly into your Discord server. It allows users to search, play, stop, and disconnect from SoundCloud tracks via simple slash commands. This bot is perfect for Discord communities that want seamless access to SoundCloud music without switching platforms.

### Key Features
- **Play Command**: Search and play SoundCloud tracks from within Discord.
- **Stop Command**: Stop the currently playing track.
- **Disconnect Command**: Disconnect the bot from the voice channel.

---

## Prerequisites
1. **Discord Bot Token**: You will need a valid Discord bot token to run this bot.
2. **SoundCloud API Key**: Obtain a SoundCloud API client ID, which is used for accessing the SoundCloud API for track searching and streaming.
3. **Node.js**: Ensure you have Node.js installed (`v14.x` or higher).

---

## Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/soundcloud-discord-bot.git
   cd soundcloud-discord-bot
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Create a Discord Bot**:
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications).
   - Create a new application and bot.
   - Copy the bot token from the **Bot** section.
   
4. **Configure SoundCloud API**:
   - Visit [SoundCloud Developer](https://developers.soundcloud.com) and create an application.
   - Generate an API client ID.

5. **Set Environment Variables**:
   Create a `.env` file in the root of the project and add your bot token and SoundCloud client ID:
   ```env
   BOT_TOKEN=your_discord_bot_token
   SOUNDCLOUD_CLIENT_ID=your_soundcloud_client_id
   ```

---

## Usage
1. **Deploy the Bot**:
   ```bash
   node index.js
   ```

2. **Slash Commands**:
   - Once the bot is running, you need to register the slash commands.
   ```bash
   node index.js setup
   ```
   This will register the following commands:
   - `/play <query>`: Search and play SoundCloud tracks.
   - `/stop`: Stops the current track.
   - `/disconnect`: Disconnects the bot from the voice channel.

3. **Interact with the Bot**:
   - Use `/play` to search for a track on SoundCloud and play it.
   - Use `/stop` to stop the current playback.
   - Use `/disconnect` to disconnect the bot from the voice channel.

---

## Contributing
1. Fork this repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Make your changes and commit them: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-branch`.
5. Submit a pull request.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments
- [discord.js](https://discord.js.org) for simplifying bot interaction with Discord.
- [SoundCloud Downloader](https://www.npmjs.com/package/soundcloud-downloader) for fetching and streaming SoundCloud tracks.
