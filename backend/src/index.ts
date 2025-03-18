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
            const { results } = await env.DB.prepare(
                "SELECT * FROM users WHERE certificate_received = ?"
            ).bind(false).all();

            if (results.length > 0) {
                for (const user of results) {
                    const badgeResponse = await issueBadge(user.email, user.name, env);
                    if (badgeResponse.status.success) {
                        await env.DB.prepare(
                            "UPDATE users SET certificate_received = ? WHERE id = ?"
                        ).bind(true, user.id).run();
                    } else {
                        console.error(`Failed to issue badge to ${user.email}: ${badgeResponse.statusText}`);
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