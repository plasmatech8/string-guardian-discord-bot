import { InteractionResponseType } from 'discord-interactions';

export function handlePingCommand() {
	return Response.json({ type: InteractionResponseType.PONG });
}

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

export async function handleRevealStringAction({ interaction, db, id }: { interaction: any; db: D1Database; id: string }) {
	// Query database
	const result = await db.prepare('SELECT * FROM protected_strings WHERE id = ?').bind(id).first();
	if (!result) throw new Error('Error retrieving record from database');
	console.log(result);

	// Add user to viewers if have not already seen the string
	const viewers = JSON.parse(result.viewers as string);
	const userId = interaction.member.user.id;
	if (!(userId in viewers)) {
		// console.log(`${userId} IS NOT IN ${viewers}`);
		const timestamp = Math.floor(Date.now() / 1000);
		await db
			.prepare("UPDATE protected_strings SET viewers = json_set(viewers, '$.' || ?, ?) WHERE id = ?")
			.bind(userId, timestamp, id)
			.run();
	}

	// Return string as ephemeral message
	const protectedString = result.string;
	const stringMessage = `\`\`\`\n${protectedString}\n\`\`\``;

	return Response.json({
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			content: stringMessage,
			flags: 64, // ephemeral message (only user sees it)
		},
	});
}

export async function handleViewLogsAction({ db, id }: { db: D1Database; id: string }) {
	// Query database
	const result = await db.prepare('SELECT * FROM protected_strings WHERE id = ?').bind(id).first();
	if (!result) throw new Error('Error retrieving record from database');
	// console.log(result);

	// Return information as ephemeral message
	const viewers = JSON.parse(result.viewers as string) as Record<string, number>;
	const logsMessage =
		Object.entries(viewers)
			.sort(([_1, t1], [_2, t2]) => (t1 > t2 ? 1 : -1))
			.map(([userId, timestamp]) => `- <@${userId}> <t:${timestamp}:F>`)
			.join('\n') || '👻 This string has not been viewed by anyone yet.';
	// console.log(logsMessage);

	return Response.json({
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			content: logsMessage,
			flags: 64, // ephemeral message (only user sees it)
		},
	});
}
