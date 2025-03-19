async function sendSlackNotification(failedUsers: Array<any>, SlackWebhookUrl: string, customMessage?: string) {
	const webhookUrl = SlackWebhookUrl;

	let message = '';

	if (customMessage) {
		message = customMessage;
	} else {
		message = `:warning: *Badge Issuance Failed for ${failedUsers.length} User${failedUsers.length > 1 ? 's' : ''}*\n\n`;
		failedUsers.forEach((user, index) => {
			message += `${index + 1}. *${user.name}* (${user.email}): ${user.error || 'Unknown error'}\n`;
		});
		message += `\nPlease check the system and resolve these issues.`;
	}

	const payload = {
		text: message,
	};

	try {
		const response = await fetch(webhookUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			console.error(`Failed to send Slack notification: ${response.statusText}`);
		}
	} catch (error) {
		console.error('Error sending Slack notification:', error);
	}
}
