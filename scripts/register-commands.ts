require('dotenv').config({ path: '.dev.vars' });

const APP_ID = process.env.APP_ID!;
const BOT_TOKEN = process.env.BOT_TOKEN!;

const commands = [
	{
		name: 'string',
		description: 'Protect a message behind a reveal button',
		options: [],
	},
	{
		name: 'set-ping-role',
		description: 'Set the role to @ ping when a string is created in this channel',
		default_member_permissions: 0x0000000000000010, // MANAGE_CHANNELS permission
		options: [
			{
				name: 'role',
				description: 'The role to set as the ping role',
				type: 8, // ROLE type
				required: false,
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
	.then(async (res) => {
		if (!res.ok) {
			const errorJson = await res.json();
			throw new Error(`Failed to register commands: ${res.status} ${res.statusText} - ${JSON.stringify(errorJson)}`);
		}
		return res.json();
	})
	.then((json) => {
		console.log('✅ Commands registered:', JSON.stringify(json, null, 2));
	})
	.catch((err) => {
		console.error('❌ Error registering commands:', err);
		process.exit(1);
	});
