import { InteractionResponseType } from 'discord-interactions';

export function handlePingCommand() {
	return Response.json({ type: InteractionResponseType.PONG });
}

export function handleStringCommand(interaction: any) {
	const message = interaction.data.options?.[0]?.value ?? 'No content';
	const customId = crypto.randomUUID(); // temporary ID
	// NOTE: you'd store `customId -> message` in D1 here

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
							custom_id: 'reveal_string',
						},
						{
							type: 2, // button
							style: 1,
							label: 'View Logs',
							custom_id: 'view_logs',
							name: '???',
						},
					],
				},
			],
		},
	});
}

export function handleRevealStringAction(interaction: any) {
	const userId = interaction.member.user.id;
	const messageId = interaction.message.id;

	// Log to the channel
	const logMessage = `👁️ <@${userId}> has viewed the protected string (${messageId})`;

	return Response.json({
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			content: logMessage,
			flags: 64, // ephemeral message (only user sees it)
		},
	});
}

export function handleViewLogsAction(interaction: any) {
	const userId = interaction.member.user.id;
	const messageId = interaction.message.id;

	// Log to the channel
	const logMessage = `👁️ <@${userId}> has viewed the access logs (${messageId})`;

	return Response.json({
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			content: logMessage,
			flags: 64, // ephemeral message (only user sees it)
		},
	});
}
