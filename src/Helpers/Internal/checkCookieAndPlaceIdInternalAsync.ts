//C:\buildAgent\671a0da0ba061c98de801409dbc57d7e\Packages\NodeJS\RbxMessagingService\src\Helpers\Internal\checkCookieAndPlaceIdInternalAsync.ts
//C:\buildAgent\671a0da0ba061c98de801409dbc57d7e\Packages\NodeJS\RbxMessagingService\src\Helpers\InitAuthenticatedUser.ts
import { cookieWarningCapture } from '../../util/constants';
import Http from 'axios';

export const checkCookieAndUniverseIdInternalAsync = (cookie: string, universeId: number): Promise<void> => {
	return new Promise((resolve: (value: PromiseLike<void> | void) => void, reject: (reason?: any) => void) => {
		if (cookie.length === 0) return reject("Cookie name can't be empty");
		if (universeId < 1) return reject('The placeId is required to at least be >1');
		if (!cookie.match(cookieWarningCapture))
			return reject("Cookie isn't valid, it requires the warning text to persistent");
		Http('https://users.roblox.com/v1/users/authenticated', {
			method: 'GET',
			headers: { Cookie: '.ROBLOSECURITY=' + cookie },
		})
			.catch((err) => {
				if (err.statusCode === 401) return reject("Cookie isn't valid, it threw a 401");
				else return reject(err.message);
			})
			.then(() => resolve());
	});
};
