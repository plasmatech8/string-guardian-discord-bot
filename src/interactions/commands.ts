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

export async function handleSetPingRoleCommand({ interaction, db }: { interaction: any; db: D1Database }) {
	const roleId = interaction.data.options?.[0]?.value ?? '';
	const channelId = interaction.channel_id;
	const guildId = interaction.guild_id;

	await db
		.prepare(
			'INSERT INTO channel_settings (channel_id, guild_id, ping_role_id) VALUES (?, ?, ?) ON CONFLICT(channel_id) DO UPDATE SET ping_role_id = ?;'
		)
		.bind(channelId, guildId, roleId, roleId)
		.run();

	return Response.json({
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			content: roleId
				? `✅ <@&${roleId}> will be @ pinged when a string is created in this channel.`
				: '✅ No role will be @ pinged when a string is created in this channel.',
			flags: 64, // ephemeral
		},
	});
}
