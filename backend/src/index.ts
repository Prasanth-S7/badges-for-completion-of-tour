import { postRequestHandler } from './routes/postRequestHandler';
import { issueBadge } from './issueBadges/issueBadges';
import { sendSlackNotification } from './sendSlackNotification/sendSlackNotification';

export interface Env {
	BINDING_NAME: KVNamespace;
	DB: D1Database;
	BADGR_USERNAME: string;
	BADGR_PASSWORD: string;
	SLACK_WEBHOOK_URL: string;
}

export const corsHeaders = {
	'Access-Control-Allow-Headers': '*',
	'Access-Control-Allow-Methods': 'GET POST OPTIONS',
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Max-Age': '86400',
};

export default {
	async scheduled(event, env, ctx) {
		try {
			const { results } = await env.DB.prepare('SELECT * FROM users WHERE certificate_received = ?')
				.bind(false)
				.all<{ id: number; email: string; name: string; certificate_received: number }>();
				console.log(results)

			if (results.length > 0) {
				const batchSize = 10;
				let allFailedUsers: Array<any> = [];

				for (let i = 0; i < results.length; i += batchSize) {
					const batch = results.slice(i, i + batchSize);
					const batchResponses: any = await Promise.all(batch.map((user) => issueBadge(user.email, user.name, env)));

					const successfulUsers = batch.filter((user, index) => batchResponses[index].status.success);
					const failedUsers = batch.filter((user, index) => !batchResponses[index].status.success);

					const failedUsersWithErrors = failedUsers.map((user) => {
						return {
							...user,
							error: batchResponses[batch.indexOf(user)].statusText,
						};
					});

					allFailedUsers = [...allFailedUsers, ...failedUsersWithErrors];

					if (successfulUsers.length > 0) {
						await env.DB.prepare(
							'UPDATE users SET certificate_received = ? WHERE id IN (' + successfulUsers.map((user) => '?').join(',') + ')'
						)
							.bind(true, ...successfulUsers.map((user) => user.id))
							.run();
					}

					failedUsers.forEach((user) => {
						console.error(`Failed to issue badge to ${user.email}: ${batchResponses[batch.indexOf(user)].statusText}`);
					});
				}

				if (allFailedUsers.length > 0) {
					await sendSlackNotification(allFailedUsers, env.SLACK_WEBHOOK_URL);
				}
			}
		} catch (error:any) {
			console.error('Error in scheduled function:', error);
			await sendSlackNotification([], `Overall badge issuance process failed: ${error.message}`);
		}
	},

	async fetch(request, env, ctx): Promise<Response> {
		const { method } = request;
		switch (method) {
			case 'OPTIONS':
				return new Response(null, {
					status: 204,
					headers: corsHeaders
				});
			case 'GET':
				return new Response('Hello, world!');
			case 'POST':
				return await postRequestHandler(request, env);
			default:
				return new Response('Method not allowed', { status: 405 });
		}
	},
} satisfies ExportedHandler<Env>;
