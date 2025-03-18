interface AccessTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	scope: string;
	refresh_token: string;
}
const getAccessToken = async (env: Env) => {
	const response = await fetch('https://api.badgr.io/o/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			username: env.BADGR_USERNAME,
			password: env.BADGR_PASSWORD,
		}),
	});
	const data: AccessTokenResponse = await response.json();
	return data.access_token;
};

const getBadgeClassId = async (accessToken: string) => {
	const response = await fetch('https://api.badgr.io/v2/badgeclasses?include_archived=false', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const data = await response.json();
	return data.result[0].entityId;
};

export const issueBadge = async (email: string, name: string, env: Env) => {
	const accessToken = await getAccessToken(env);
	const badgeClassId = await getBadgeClassId(accessToken);

	const badgeData = {
		recipient: {
			identity: email,
			hashed: true,
			type: 'email',
			plaintextIdentity: name,
		},
		issuedOn: new Date().toISOString(),
		notify: true,
		extensions: {
			'extensions:recipientProfile': {
				'@context': 'https://openbadgespec.org/extensions/recipientProfile/context.json',
				type: ['Extension', 'extensions:RecipientProfile'],
				name: name,
			},
		},
	};

	const response = await fetch(`https://api.badgr.io/v2/badgeclasses/${badgeClassId}/assertions`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(badgeData),
	});

    const data = await response.json();

	return data;
};
