import { corsHeaders } from "..";

export const postRequestHandler = async (request: Request, env: Env) => {
	const body: any = await request.json();

	if (!body.email || !body.name) {
		return Response.json({
				msg: "Missing required fields: 'email' or 'name'",
			}, {
				status: 400, headers: corsHeaders
			});
	}

	const { pathname } = new URL(request.url);
	console.log(body);

	if (pathname === '/api/v1/submitcertificate') {
		try{
			const users = (await env.DB.prepare(`SELECT * FROM users WHERE email = ?`).bind(body.email).all()).results;

		if (users.length > 0) {
			return Response.json({
					msg: "Can't request for badge twice",
				}, {
					status: 400, headers: corsHeaders
				});
		}

		console.log("reaches after this")

		await env.DB.prepare(`INSERT INTO users (email, name) VALUES (?, ?)`).bind(body.email, body.name).run();

		console.log("inserted")

		return Response.json({
				msg: 'Your request has been received',
				status: 'success'
			}, {
				status: 200, headers: corsHeaders
			});
		}
		catch(error){
			console.log(error)
			return Response.json({
				msg: "Internal server error"
			}, {
				status: 500, headers:corsHeaders
			})
		}
	}

	return new Response('Invalid endpoint', { status: 404, headers: corsHeaders});
};
