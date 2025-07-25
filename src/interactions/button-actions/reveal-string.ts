import { InteractionResponseType } from 'discord-interactions';

export async function handleRevealStringAction({ interaction, db, id }: { interaction: any; db: D1Database; id: string }) {
	// Query database
	const result = await db.prepare('SELECT * FROM protected_strings WHERE id = ?').bind(id).first();
	if (!result) throw new Error('Error retrieving record from database');
	console.log(result);

	// Add user to viewers if have not already seen the string
	const viewers = JSON.parse(result.viewers as string);
	const userId = interaction.member.user.id;
	if (!(userId in viewers)) {
		console.log(`${userId} IS NOT IN ${viewers}`);
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
