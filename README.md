
# 🛡️ String Guardian Discord Bot

<p align="center">
  <img src="assets/string_guardian_logo.png" alt="String Guardian Logo" width="200"/>
</p>

> **Helps moderators find trolls while keeping connection info or passwords public.**

**String Guardian** is a serverless Discord bot that protects sensitive messages (like game server connection strings or passwords) behind a reveal button. It also logs which users accessed the message.

This bot is ideal for **pickup game (PUG) servers** or any community where:
- You want to post connection info in a public channel
- You need to track which Discord members viewed it
- You want to take action against trolls, harassers, or DDoSers

## 🎥 Demo

<img src="assets/string_guardian_demo.gif" alt="Demo GIF"/>

## 📌 Usage

Create a protected string message using the slash command:

```bash
/string "connect ip-address; password my-password;"
```

This will send a message to the channel.

![Protected string create message](assets/demo_screenshot_string_created.png)

### 🔓 Reveal Button

When a user clicks the **Reveal String** button:
- Logs the user's ID + timestamp
- Sends the string to the user as an **ephemeral message** (only the user can view)

![The ephemeral message sent after clicking the reveal string button](assets/demo_screenshot_reveal_string.png)

### 📜 View Logs Button

When a user clicks the **View Logs** button:
- Sends the user an **ephemeral message** listing everyone who viewed the string and when

![The ephemeral message sent after clicking the view logs button](assets/demo_screenshot_view_logs.png)

## 🚀 Installation (for server admins)

To add **String Guardian** to your Discord server:

👉 [**Click here to invite the bot**](https://discord.com/oauth2/authorize?client_id=1387414117106581625)

*Disclaimer: This bot stores data such as Discord user/guild/channel ID and timestamps. Data will not be shared unless required for legal compliance. Data may be deleted at any time at the discretion of the bot owner.*


## 🛠️ Development Setup

<details>
<summary>Local Development</summary>

Ensure that the Discord bot is created on the Discord developer portal.

Create `.dev.vars` and fill the variables as per `.dev.vars.example` using
information from the Discord developer portal.

Install NPM dependencies:
```bash
npm install
```

Register the Discord commands using the registration script:
```bash
npm run register
```

Install and run local development server:
```bash
npm run dev
```

Reset (& run migrations) for the local D1 development database:
```bash
npm run db:reset
```

Ensure Ngrok is installed and run it to provide a reverse proxy to access your
locally-running bot:
```bash
ngrok http 8787
```

Copy the global URL from the Ngrok console and paste it into the
"Interactions URL" input field for your App in the Discord developer portal.

You can now install the bot onto a Discord server and test your locally-running code.

</details>

<details>
<summary>Deployment</summary>

To ensure that the CICD deployment pipeline work, ensure that the following secrets are
configured under **Settings > Secrets and variables > Actions**:
settings are configured:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

To ensure that the deployed Cloudflare Worker has the environment variables required for operation,
ensure that the following secrets are configured under **Settings > Variables and Secrets**:
- `APP_ID`
- `BOT_TOKEN`
- `PUBLIC_KEY`


</details>

## License

MIT
