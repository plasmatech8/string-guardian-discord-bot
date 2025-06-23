# string-guardian-discord-bot

## Usage

Create a protected string message by using the `/string <my-protected-string>` command. 

```
/string "connect ip-address; password my-password;"
```

This will push a message to the chat:

```
🔐 A protected string was created by @Plasma

[ Reveal String ] [ View Log ]
```

The "Reveal String" button will log the user ID to the database and 
then send an ephemeral message to the user who clicked on the button.
The message will contain the string inside I code block (which has a 
copy button for ease of use). 

```
connect ip-address; password my-password;
```

The "View Log" button will send an ephemeral message to the user
containing a list of users who have accessed the string.

```
| user     | first accessed at     |
|----------|-----------------------|
| @Plasma  | 2025-06-23 14:03:00   |
| @Nova    | 2025-06-22 10:45:12   |
| @Echo    | 2025-06-21 19:20:47   |
| @Blitz   | 2025-06-20 08:33:29   |
| @Orbit   | 2025-06-19 16:18:55   |
```
