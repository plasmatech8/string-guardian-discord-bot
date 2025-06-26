import 'dotenv/config';

const APP_ID = process.env.APP_ID!;
const BOT_TOKEN = process.env.BOT_TOKEN!;

const commands = [
	{
		name: 'stringprotect',
		description: 'Protect a message behind a reveal button',
		options: [
			{
				type: 3, // STRING
				name: 'message',
				description: 'The message to protect',
				required: true,
			},
		],
	},
];

const url = `https://discord.com/api/v10/applications/${APP_ID}/commands`;

fetch(url, {
	method: 'PUT',
	headers: {
		Authorization: `Bot ${BOT_TOKEN}`,
		'Content-Type': 'application/json',
	},
	body: JSON.stringify(commands),
})
	.then((res) => res.json())
	.then((json) => {
		console.log('✅ Commands registered:', JSON.stringify(json, null, 2));
	})
	.catch((err) => {
		console.error('❌ Error registering commands:', err);
		throw new Error(err);
	});
