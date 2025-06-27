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
	const logMessage = '```\nconnect ip-address; password my-password;\n```';

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
	const viewers = { '745555053435158619': 1751006870, '1200672915574751313': 1751007071, '555279627749294080': 1751006972 };

	const logMessage = Object.entries(viewers)
		.sort(([_1, t1], [_2, t2]) => (t1 > t2 ? 1 : -1))
		.map(([userId, timestamp]) => `- <@${userId}> viewed the string on <t:${timestamp}:F>`)
		.join('\n');
	console.log(logMessage);

	return Response.json({
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			content: logMessage,
			flags: 64, // ephemeral message (only user sees it)
		},
	});
}
