// import fetch from 'node-fetch';

// const APPLICATION_ID = process.env.DISCORD_APP_ID!;
// const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;
// const GUILD_ID = process.env.DISCORD_GUILD_ID; // optional for faster local testing

// const commands = [
// 	{
// 		name: 'stringprotect',
// 		description: 'Protect a message behind a reveal button',
// 		options: [
// 			{
// 				type: 3, // STRING
// 				name: 'message',
// 				description: 'The message to protect',
// 				required: true,
// 			},
// 		],
// 	},
// ];

// const url = GUILD_ID
// 	? `https://discord.com/api/v10/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`
// 	: `https://discord.com/api/v10/applications/${APPLICATION_ID}/commands`;

// fetch(url, {
// 	method: 'PUT',
// 	headers: {
// 		Authorization: `Bot ${BOT_TOKEN}`,
// 		'Content-Type': 'application/json',
// 	},
// 	body: JSON.stringify(commands),
// })
// 	.then((res) => res.json())
// 	.then((json) => {
// 		console.log('✅ Commands registered:', JSON.stringify(json, null, 2));
// 	})
// 	.catch((err) => {
// 		console.error('❌ Error registering commands:', err);
// 		process.exit(1);
// 	});
