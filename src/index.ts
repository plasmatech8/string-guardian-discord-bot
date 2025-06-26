import { InteractionType, InteractionResponseType, verifyKey } from 'discord-interactions';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const signature = request.headers.get('x-signature-ed25519');
		const timestamp = request.headers.get('x-signature-timestamp');
		const rawBody = await request.text();

		// Verify the request
		const PUBLIC_KEY = env.PUBLIC_KEY;
		const isValidRequest = verifyKey(rawBody, signature!, timestamp!, PUBLIC_KEY);

		if (!isValidRequest) {
			return new Response('Invalid request signature', { status: 401 });
		}

		const interaction = JSON.parse(rawBody);

		// 1. Ping check
		if (interaction.type === InteractionType.PING) {
			return Response.json({ type: InteractionResponseType.PONG });
		}

		// 2. Slash command: /stringprotect
		if (interaction.type === InteractionType.APPLICATION_COMMAND) {
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
									label: 'Reveal Info',
									custom_id: customId,
								},
							],
						},
					],
				},
			});
		}

		// 3. Button interaction (MESSAGE_COMPONENT)
		if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
			const userId = interaction.member.user.id;
			const customId = interaction.data.custom_id;

			// Normally you'd fetch the real protected string using the `customId`
			const protectedString = 'Server IP: 1.2.3.4, Password: swordfish';

			// Log to the channel
			const logMessage = `👁️ <@${userId}> has viewed the protected message.`;

			return Response.json({
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
				data: {
					content: logMessage,
					flags: 64, // ephemeral message (only user sees it)
				},
			});
		}

		return new Response('Unhandled interaction type', { status: 400 });
	},
} satisfies ExportedHandler<Env>;
