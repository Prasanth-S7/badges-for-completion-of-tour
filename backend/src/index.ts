import { postRequestHandler } from './routes/postRequestHandler';
import { issueBadge } from './issueBadges/issueBadges';

export interface Env {
	BINDING_NAME: KVNamespace;
	DB: D1Database;
	BADGR_USERNAME: string;
	BADGR_PASSWORD: string;
}

export default {
	async scheduled(event, env, ctx) {
		try {
			const { results } = await env.DB.prepare('SELECT * FROM users WHERE certificate_received = ?')
				.bind(false)
				.all<{ id: number; email: string; name: string; certificate_received: number }>();

			if (results.length > 0) {
				const batchSize = 10;
				for (let i = 0; i < results.length; i += batchSize) {
					const batch = results.slice(i, i + batchSize);
					const batchResponses: any = await Promise.all(batch.map((user) => issueBadge(user.email, user.name, env)));

					const successfulUsers = batch.filter((user, index) => batchResponses[index].status.success);
					const failedUsers = batch.filter((user, index) => !batchResponses[index].status.success);

					if (successfulUsers.length > 0) {
						await env.DB.prepare(
							'UPDATE users SET certificate_received = ? WHERE id IN (' + successfulUsers.map((user) => '?').join(',') + ')'
						)
							.bind(true, ...successfulUsers.map((user) => user.id))
							.run();
					}

					if (failedUsers.length > 0) {
						failedUsers.forEach((user) => {
							console.error(`Failed to issue badge to ${user.email}: ${batchResponses[batch.indexOf(user)].statusText}`);
						});
					}
				}
			}
		} catch (error) {
			console.error('Error in scheduled function:', error);
		}
	},

	async fetch(request, env, ctx): Promise<Response> {
		const { method } = request;
		switch (method) {
			case 'GET':
				return new Response('Hello, world!');
			case 'POST':
				return await postRequestHandler(request, env);
			default:
				return new Response('Method not allowed', { status: 405 });
		}
	},
} satisfies ExportedHandler<Env>;
