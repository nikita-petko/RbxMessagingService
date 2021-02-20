import { RBXScriptConnection } from '../Classes/RBXScriptConnection';
import { ClientSettings } from '../util/clientSettings';
import { FASTLOG, FASTLOG1, FASTLOG3, FASTLOGS, LOGVARIABLE } from '../util/FastLog';
import { globals } from '../util/globals';
import ssl from 'sslkeylog';
ssl.hookAll();
import signalr from '@mfd/signalr';

const FLog = ClientSettings.GetFLogs();

LOGVARIABLE('MessagingService', 0);
LOGVARIABLE('SignalR', 0);

/**
 * The MessagingService allows game servers in the same game to communicate with each other in real time (< 1 second) using topics. Topics are developer defined strings (1-80 characters) that game servers can send and receive messages.
 * Delivery is best effort and not guaranteed. Make sure to architect your game so delivery failures are not critical.
 *
 * Limitations
 * ---
 * Note: these limits are subject to change at any time.
 *
 * Size of message | 1kB
 * ---
 *
 * See also
 * ---
 * {@link https://developer.roblox.com/en-us/articles/cross-server-messaging|Cross-Server Messaging Guide}, explores how to communicate between game servers in greater detail with relevant code samples
 */
export class _MessagingService {
	private client = undefined;
	private hasCredentials = false;
	private isConnected = false;
	private topics = new Map<string, (Data: any, Sent: number) => any>();
	private hasCallback = false;
	public async PublishAsync<Variant extends any>(topic: string, message: Variant): Promise<void> {
		return new Promise<void>((resumeFunction) => {
			if (!globals.cookie && !globals.universeId) {
				FASTLOG(FLog['MessagingService'], '[FLog::MessagingService] The user is not authenticated, aborting.');
				throw new Error(
					'The user is not authenticated, please call MessagingService::initializeAsync in order to authenticate yourself',
				);
			}
			if (!this.hasCredentials) {
				this.client.query['universeId'] = globals.universeId;
				this.client.headers['Cookie'] = `.ROBLOSECURITY=${globals.cookie};`;
				this.client.headers['X-Roblox-ChannelType'] = 'Test';
				this.hasCredentials = true;
			}
			if (!this.isConnected) {
				FASTLOG(FLog['SignalR'], '[FLog::SignalR] [state change] disconnected -> connecting');
				this.client.on('connected', () => {
					FASTLOG(FLog['SignalR'], '[FLog::SignalR] connecting -> connected');
					this.isConnected = true;
				});
				this.client.on('error', (e) => {
					FASTLOGS(FLog['SignalR'], '[FLog::SignalR] An error occured during connection: %s', e);
					this.isConnected = false;
					throw new Error(`MessagingService: Service disconnected.`);
				});
				this.client.start();
			}
			const DFInt = ClientSettings.GetDFInts();
			if (topic === undefined) {
				FASTLOG(FLog['MessagingService'], '[FLog::MessagingService] The Topic Name was null, aborting.');
				throw new TypeError('Argument 1 missing or nil');
			}
			if (message === undefined) {
				message = null;
			}
			if (topic.length === 0) {
				FASTLOG(FLog['MessagingService'], '[FLog::MessagingService] The Topic Name was empty, aborting.');
				throw new RangeError('MessagingService: Topic names cannot be empty.');
			}
			if (topic.length > DFInt['MRSTopicNameLength']) {
				FASTLOG1(
					FLog['MessagingService'],
					'[FLog::MessagingService] The Topic Name length was greater than %d, aborting',
					DFInt['MRSTopicNameLength'],
				);
				throw new RangeError(
					`MessagingService: Topic names cannot be more than ${DFInt['MRSTopicNameLength']} characters.`,
				);
			}
			if (!this.isConnected) {
				this.client.on('connected', () => {
					this.client.connection.hub.invoke(
						'MessageRouterHub',
						'Publish',
						topic,
						JSON.stringify({
							Data: message,
							Sent: parseFloat(Date.now().toString()),
						}),
						1,
					);
				});
			} else {
				this.client.connection.hub.invoke(
					'MessageRouterHub',
					'Publish',
					topic,
					JSON.stringify({
						Data: message,
						Sent: parseFloat(Date.now().toString()),
					}),
					1,
				);
			}
		});
	}
	/**
	 * This function registers a callback to begin listening to the given topic.
	 * The callback is invoked when a topic receives a message.
	 * It can be called multiple times for the same topic.
	 *
	 * Callback
	 * ---
	 * Data | Developer supplied payload
	 * Sent | Unix time in seconds at which the message was sent
	 * ---
	 *

	 * It yields until the subscription is properly registered and returns a connection object.
	 * To unsubscribe, call :Disconnect() on the returned object.
	 * Once Disconnect() is called,
	 * the callback should never be invoked.
	 * Killing the script containing the connections also causes the underlying connect to be unsubscribed.
	 * ---
	 * 
	 * See also
	 * ---
	 * * {@link https://developer.roblox.com/en-us/articles/cross-server-messaging|Cross-Server Messaging Guide}, explores how to communicate between game servers in greater detail with relevant code samples
	 * * {@link https://developer.roblox.com/en-us/api-reference/function/MessagingService/PublishAsync|MessagingService::PublishAsync}, sends the provided message to all subscribers to the topic, triggering their registered callbacks to be invoked
	 * ---
	 * 
	 * @param {string} topic Determines where to listen for messages.
	 * @param {(Data: Variant, Sent: number) => Variant} callback Function to be invoked whenever a message is received.
	 * @returns {RBXScriptConnection} Connection that can be used to unsubscribe from the topic
	 * @yields This is a yielding function. When called, it will pause the JavaScript thread that called the function until a result is ready to be returned, without interrupting other scripts.
	 */
	public async SubscribeAsync<Variant extends any>(
		topic: string,
		callback: (Data: Variant, Sent: number) => Variant,
	): Promise<RBXScriptConnection> {
		return new Promise<RBXScriptConnection>((resumeFunction) => {
			if (!globals.cookie && !globals.universeId) {
				FASTLOG(FLog['MessagingService'], '[FLog::MessagingService] The user is not authenticated, aborting.');
				throw new Error(
					'The user is not authenticated, please call MessagingService::initializeAsync in order to authenticate yourself',
				);
			}
			if (!this.hasCredentials) {
				this.client.query['universeId'] = globals.universeId;
				this.client.headers['Cookie'] = `.ROBLOSECURITY=${globals.cookie};`;
				this.client.headers['X-Roblox-ChannelType'] = 'Test';
				this.hasCredentials = true;
			}
			if (!this.isConnected) {
				FASTLOG(FLog['SignalR'], '[FLog::SignalR] [state change] disconnected -> connecting');
				this.client.on('connected', () => {
					FASTLOG(FLog['SignalR'], '[FLog::SignalR] connecting -> connected');
					this.isConnected = true;
				});
				this.client.on('error', (e) => {
					FASTLOGS(FLog['SignalR'], '[FLog::SignalR] An error occured during connection: %s', e);
					this.isConnected = false;
					throw new Error(`MessagingService: Service disconnected.`);
				});
				this.client.start();
			}
			const DFInt = ClientSettings.GetDFInts();
			if (topic === undefined) {
				FASTLOG(FLog['MessagingService'], '[FLog::MessagingService] The Topic Name was null, aborting.');
				throw new TypeError('Argument 1 missing or nil');
			}
			if (callback === undefined) {
				FASTLOG(FLog['MessagingService'], '[FLog::MessagingService] The Callback was null, aborting.');
				throw new TypeError('Argument 2 missing or nil');
			}
			if (topic.length === 0) {
				FASTLOG(FLog['MessagingService'], '[FLog::MessagingService] The Topic Name was empty, aborting.');
				throw new RangeError('MessagingService: Topic names cannot be empty.');
			}
			if (topic.length > DFInt['MRSTopicNameLength']) {
				FASTLOG1(
					FLog['MessagingService'],
					'[FLog::MessagingService] The Topic Name length was greater than %d, aborting',
					DFInt['MRSTopicNameLength'],
				);
				throw new RangeError(
					`MessagingService: Topic names cannot be more than ${DFInt['MRSTopicNameLength']} characters.`,
				);
			}
			if (!this.topics[topic]) {
				this.topics.set(topic, callback);
				if (!this.isConnected) {
					this.client.on('connected', () => {
						this.client.connection.hub.invoke('MessageRouterHub', 'Subscribe', topic, 0);
					});
				} else {
					this.client.connection.hub.invoke('MessageRouterHub', 'Subscribe', topic, 0);
				}
			}
			if (!this.hasCallback) {
				this.client.connection.hub.on('MessageRouterHub', 'Message', (topicName, data) => {
					FASTLOG3(
						FLog['SignalR'],
						'message -> %s -> %s -> %f',
						topicName,
						JSON.parse(data).Data || 'null',
						parseFloat(JSON.parse(data).Sent),
					);
					if (this.topics.get(topicName)) {
						this.topics.get(topicName)(JSON.parse(data).Data, parseFloat(JSON.parse(data).Sent));
					}
				});
				this.hasCallback = true;
			}
			resumeFunction(new RBXScriptConnection(this.client));
		});
	}
	constructor() {
		if (!this.client) {
			this.client = new signalr.client('https://messagerouter.api.roblox.com/v1/router/signalr', [
				'MessageRouterHub',
			]);
		}
	}
}
