import { checkCookieAndUniverseIdInternalAsync } from './Internal/checkCookieAndPlaceIdInternalAsync';
import { globals } from '../util/globals';

export const init = async (cookie: string, universeId: number) => {
	await checkCookieAndUniverseIdInternalAsync(cookie, universeId);
	globals.cookie = cookie;
	globals.universeId = universeId;
};
