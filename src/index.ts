import { InteractionType, verifyKey } from 'discord-interactions';
import { handleRevealStringAction, handleViewLogsAction } from './interactions/button-actions';
import { handleSetPingRoleCommand, handleStringCommand } from './interactions/commands';
import { handleStringModalSubmit } from './interactions/modal-submit';
import { handlePing } from './interactions/ping';

export default {
	async fetch(request, env): Promise<Response> {
		const signature = request.headers.get('x-signature-ed25519');
		const timestamp = request.headers.get('x-signature-timestamp');
		const rawBody = await request.text();
		const interaction = JSON.parse(rawBody);
		const db = env.DB;

		// Verify the request
		const PUBLIC_KEY = env.PUBLIC_KEY;
		const isValidRequest = await verifyKey(rawBody, signature!, timestamp!, PUBLIC_KEY);
		if (!signature || !timestamp || !PUBLIC_KEY) {
			console.log(signature, timestamp, PUBLIC_KEY);
			return new Response('Missing signature, timestamp, or public key', { status: 401 });
		}
		if (!isValidRequest) {
			return new Response('Invalid request signature', { status: 401 });
		}

		// 1. Ping check
		if (interaction.type === InteractionType.PING) {
			return handlePing();
		}

		// 2. Slash commands
		if (interaction.type === InteractionType.APPLICATION_COMMAND) {
			switch (interaction.data.name) {
				case 'string':
					return handleStringCommand();
				case 'set-ping-role':
					return handleSetPingRoleCommand({ interaction, db });
				default:
					return new Response('Invalid command name', { status: 400 });
			}
		}

		// 3. Button interactions
		if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
			const [action, id] = interaction.data.custom_id.split('#');
			switch (action) {
				case 'reveal_string':
					return handleRevealStringAction({ interaction, id, db });
				case 'view_logs':
					return handleViewLogsAction({ id, db });
				default:
					return new Response('Invalid button interaction ID', { status: 400 });
			}
		}

		// 4. Modal submit
		if (interaction.type === InteractionType.MODAL_SUBMIT) {
			if (interaction.data.custom_id === 'string_modal') {
				return handleStringModalSubmit({ interaction, db });
			}
			return new Response('Invalid modal interaction ID', { status: 400 });
		}

		// 5. Unhandled
		return new Response('Unhandled interaction type', { status: 400 });
	},
} satisfies ExportedHandler<Env>;
