import { InteractionResponseType } from 'discord-interactions';
import { ChannelSettingsConfig } from '../types';

export async function handleConfigureCommand({ interaction, db }: { interaction: any; db: D1Database }) {
	// Get config changes from parameters
	const options: { name: string; type: number; value: any }[] = interaction.data.options ?? [];
	const configChanges: ChannelSettingsConfig = options.reduce((agg, next) => {
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
