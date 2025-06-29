<p align="center">
  <img src="assets/string_guardian_logo.png" alt="String Guardian Logo" width="200"/>
</p>

# 🛡️ String Guardian Discord Bot

**String Guardian** is a serverless Discord bot that protects sensitive messages (like game server connection strings or passwords) behind a reveal button. It also logs which users accessed the message.

This bot is ideal for **pickup game (PUG) servers** or any community where:
- You want to post connection info in a public channel
- You need to track which Discord members viewed it
- You want to take action against trolls, harassers, or DDoSers

## 🎥 Demo

<p align="center">
  <video src="assets/string_guardian_demo.mp4"></video>
</p>

## 📌 Usage

Create a protected string message using the slash command:

```bash
/string "connect ip-address; password my-password;"
```

This will send a message to the channel.

```
🔐 A protected message was created.

[ Reveal String ] [ View Logs ]
```

### 🔓 Reveal Button

When a user clicks the **Reveal String** button:
- Logs the user's ID + timestamp
- Sends the string to the user as an **ephemeral message**

```
connect ip-address; password my-password;
```

### 📜 View Logs Button

When a user clicks the **View Logs** button:
- Sends the user an **ephemeral message** listing everyone who viewed the string and when

```
@Plasma viewed the string on Sunday, June 29, 2025 at 7:17 PM
@MJ123435 viewed the string on Sunday, June 29, 2025 at 11:56 PM
```

## License

MIT
