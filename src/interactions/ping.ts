import { InteractionResponseType } from 'discord-interactions';

export function handlePing() {
	return Response.json({ type: InteractionResponseType.PONG });
}
