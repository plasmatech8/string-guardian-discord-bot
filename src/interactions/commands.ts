import { InteractionResponseType } from 'discord-interactions';

export async function handleStringCommand() {
	return Response.json({
		type: InteractionResponseType.MODAL,
		data: {
			custom_id: 'string_modal',
			title: 'Create Protected String',
			components: [
				{
					type: 1, // Action Row
					components: [
						{
							type: 4, // Text Input
							custom_id: 'string_content',
							label: 'Your String',
							style: 1,
							min_length: 1,
							max_length: 800,
							placeholder: 'String to protect...',
							required: true,
						},
					],
				},
			],
		},
	});
}

export async function handleConfigureCommand({ interaction, db }: { interaction: any; db: D1Database }) {
	// Get config changes from parameters
	const options: { name: string; type: number; value: any }[] = interaction.data.options ?? [];
	const configChanges = options.reduce((agg, next) => {
		return { ...agg, [next.name]: next.value };
	}, {});
	console.log({ configChanges });

	// Send database query
	const channelId = interaction.channel_id;
	const guildId = interaction.guild_id;
	const res = await db
		.prepare(
			`INSERT INTO channel_settings (channel_id, guild_id, config) VALUES (?, ?, ?)
			ON CONFLICT(channel_id) DO UPDATE SET config = json_patch(config, ?)
			RETURNING *;`
		)
		.bind(channelId, guildId, JSON.stringify(configChanges), JSON.stringify(configChanges))
		.run();

	// Get message to return using result
	const result = res.results[0];
	console.log({ result });
	const newConfig = JSON.parse(result.config as string) as Record<string, any>;
	const newConfigFormatted = Object.entries(newConfig)
		.map(([key, value]) => `${key.padEnd(16)}: ${JSON.stringify(value)}`)
		.join('\n');
	const returningMessage = `✅ Channel settings configured!\n\`\`\`txt\n${newConfigFormatted}\n\`\`\``;

	return Response.json({
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			content: returningMessage,
			flags: 64, // ephemeral
		},
	});
}
