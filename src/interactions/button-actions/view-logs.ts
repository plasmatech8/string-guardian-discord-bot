import { InteractionResponseType } from 'discord-interactions';

export async function handleViewLogsAction({ db, id }: { db: D1Database; id: string }) {
	// Query database
	const result = await db.prepare('SELECT * FROM protected_strings WHERE id = ?').bind(id).first();
	if (!result) throw new Error('Error retrieving record from database');
	console.log(result);

	// Return information as ephemeral message
	const viewers = JSON.parse(result.viewers as string) as Record<string, number>;
	const viewersCount = Object.keys(viewers).length;
	const maxViewersShown = 80;

	const sortedViewers = Object.entries(viewers).sort(([_1, t1], [_2, t2]) => t1 - t2);
	const latestViewers = sortedViewers.slice(-maxViewersShown);

	const omittedViewersCount = viewersCount - latestViewers.length;
	const omittedViewersLine = omittedViewersCount > 0 ? `- + ${omittedViewersCount} earlier viewer(s)...\n` : '';

	const viewerLines = latestViewers.map(([userId, timestamp]) => `- <t:${timestamp}> <@${userId}>`).join('\n');
	const logsMessage = viewerLines ? `${omittedViewersLine}${viewerLines}` : '👻 This string has not been viewed by anyone yet.';
	console.log({ viewers, logsMessage });

	const viewerLogsEmbed = {
		title: `📜 Viewers Log - (total ${viewersCount})`,
		description: logsMessage,
	};

	return Response.json({
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			flags: 64, // ephemeral message (only user sees it)
			embeds: [viewerLogsEmbed],
		},
	});
}
