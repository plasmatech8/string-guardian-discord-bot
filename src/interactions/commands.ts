import { InteractionResponseType } from 'discord-interactions';

export async function handleStringCommand({ interaction }: { interaction: any }) {
	const roleToPing = interaction.data.options?.[0]?.value || '';
	return Response.json({
		type: InteractionResponseType.MODAL,
		data: {
			custom_id: `string_modal#${roleToPing}`,
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
