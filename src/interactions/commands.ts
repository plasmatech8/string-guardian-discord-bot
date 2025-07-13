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
	const roleId = interaction.data.options?.[0]?.value;
	console.log(roleId);
	db;
	// await db.prepare('UPDATE settings SET ping_role = ?').bind(roleId).run();

	return Response.json({
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			content: `✅ Ping role set to <@&${roleId}>.`,
			flags: 64, // ephemeral
		},
	});
}
