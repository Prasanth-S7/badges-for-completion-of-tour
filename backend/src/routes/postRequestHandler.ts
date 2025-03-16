export const postRequestHandler = async (request: Request, env: Env) => {
	const body: any = await request.json();

	if (!body.email || !body.name) {
		return Response.json(
			{
				msg: "Missing required fields: 'email' or 'name'",
			},
			{
				status: 400,
			}
		);
	}

	const { pathname } = new URL(request.url);
	console.log(body);

	if (pathname === '/api/v1/submitcertificate') {
		const users = (await env.DB.prepare(`SELECT * FROM users WHERE email = ?`).bind(body.email).all()).results;

		console.log(users);

		if (users.length > 0) {
			return Response.json(
				{
					msg: "Can't request for certificate twice",
				},
				{
					status: 400,
				}
			);
		}

		await env.DB.prepare(`INSERT INTO users (email, name) VALUES (?, ?)`).bind(body.email, body.name).run();

		return Response.json(
			{
				msg: 'Certificate submitted successfully',
			},
			{
				status: 200,
			}
		);
	}

	return new Response('Invalid endpoint', { status: 404 });
};
