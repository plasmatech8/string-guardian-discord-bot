import { InteractionResponseType } from 'discord-interactions';

export async function handleStringModalSubmit({ interaction, db }: { interaction: any; db: D1Database }) {
	// Insert into database
	const stringContent = interaction.data.components[0].components[0].value ?? 'No content';
	const userId = interaction.member.user.id;
	const guildId = interaction.guild_id;
	const channelId = interaction.channel_id;
	const response = await db
		.prepare('INSERT INTO protected_strings (string, created_by, guild_id, channel_id) VALUES (?, ?, ?, ?);')
		.bind(stringContent, userId, guildId, channelId)
		.run();
	const id = response.meta.last_row_id;

	return Response.json({
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			content: '🔐 A protected message was created.',
			components: [
				{
					type: 1, // action row
					components: [
						{
							type: 2, // button
							style: 1,
							label: 'Reveal String',
							custom_id: `reveal_string#${id}`,
						},
						{
							type: 2, // button
							style: 1,
							label: 'View Logs',
							custom_id: `view_logs#${id}`,
						},
					],
				},
			],
		},
	});
}
