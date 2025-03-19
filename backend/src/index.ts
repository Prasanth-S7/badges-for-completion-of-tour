import { postRequestHandler } from './routes/postRequestHandler';
import { cron } from './cron/cron';
import { corsHeaders } from './config/config';

export default {
	async scheduled(event, env, ctx) {
		cron(env);
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
				return new Response('Wokers is Healthy!');
			case 'POST':
				return await postRequestHandler(request, env);
			default:
				return new Response('Method not allowed', { status: 405 });
		}
	},
} satisfies ExportedHandler<Env>;
