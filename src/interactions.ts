import { InteractionResponseType } from 'discord-interactions';

export function handlePingCommand() {
	return Response.json({ type: InteractionResponseType.PONG });
}

/*
		const id = (Math.random() * 1000).toFixed();
		const {} = await env.DB.prepare('INSERT INTO protected_strings (id, created_by) VALUES (?, ?)').bind(id, '1200672915574751313').run();
		const {} = await env.DB.prepare('UPDATE protected_strings SET viewers = ? WHERE id = ?')
			.bind('{ "1200672915574751313": 1751020207 }}',id)
			.all();
		const { results } = await env.DB.prepare('SELECT * FROM protected_strings').bind().all();
		console.log(results);
		*/

export interface CommandInput {
	interaction: any;
	db: D1Database;
}

export async function handleStringCommand({ interaction, db }: CommandInput) {
	// Insert into database
	const message = interaction.data.options?.[0]?.value ?? 'No content';
	const userId = interaction.member.user.id;
	const response = await db.prepare('INSERT INTO protected_strings (string, created_by) VALUES (?, ?);').bind(message, userId).run();
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

export interface ActionInput {
	interaction: any;
	db: D1Database;
	id: string;
}

export async function handleRevealStringAction({ interaction, db, id }: ActionInput) {
	// Fetch record from database
	const messageId = interaction.message.id;
	const result = await db.prepare('SELECT * FROM protected_strings WHERE id = ?').bind(id).first();
	if (!result) throw new Error('Error retrieving record from database');

	// Add user to viewers if have not already seen the string
	const viewers = JSON.parse(result.viewers as string);
	const userId = interaction.member.user.id;
	if (!(userId in viewers)) {
		console.log(`${userId} IS NOT IN ${viewers}`);
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

export function handleViewLogsAction({ interaction, db, id }: ActionInput) {
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
