import { postRequestHandler } from './routes/postRequestHandler';

export interface Env {
    BINDING_NAME: KVNamespace;
    DB: D1Database;
}

export default {
    async scheduled(event, env, ctx) {
        try {
            await env.DB.prepare(`DELETE FROM users`).run();
            console.log('Database cleanup successful');
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