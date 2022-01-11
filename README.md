<h1>Closed until further notice.</h1>
<br/>
<h4 align="center">A Node.js wrapper for interacting with the Roblox Message Router API.</h4>
<br>
<p align="center">
    <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-blue.svg?style=flat-square" alt="JavaScript Style Guide"/></a>
    <a href="https://npmjs.org/@mfd/rbxmessagingservice"><img src="https://img.shields.io/npm/v/@mfd/rbxmessagingservice.svg?style=flat-square" alt="NPM package"/></a>
	<a href="https://npmjs.org/@mfd/rbxmessagingservice"><img src="https://img.shields.io/npm/dm/@mfd/rbxmessagingservice.svg?style=flat-square" alt="downloads"/></a>
</p>
<p align="center">
  <a href="#about">About</a> •
  <a href="#installation">Installation</a> •
  <a href="#documentation">Docs</a> •
  <a href="#credits">Credits</a>
</p>

## About

RbxMessagingService is a node module that That allows you to use MessagingService outside of Roblox.
This project was created because people outside ROBLOX always want to use MessagingService outside ROBLOX.

RbxMessagingService allows you to do things you would normally do on the [Roblox](https://www.roblox.com) MessagingService through a Node.js interface.

## Installation

With node.js installed simply run:

```bash
# Run this to install RbxMessagingService locally to your repository.
$ npm install @mfd/rbxmessagingservice --save

# Run this instead to install RbxMessagingService globally so you can use it anywhere.
$ npm install @mfd/rbxmessagingservice -g
```

That's it!

## Documentation

You can find the current RbxMessagingService documentation [here (Roblox Wiki)](https://developer.roblox.com/en-us/api-reference/class/MessagingService) or [here (API Reference)](https://robloxapi.github.io/ref/class/MessagingService.html)

### Initial setup

1. Run `RbxMessagingService.InitializeAsync` with the parameters of `Cookie` and `PlaceId`. This will store your cookie internally and validate it, but will perform **no** cookie refresh automatically, it also requires that your cookie have the warning and be valid.
2. While this works, Roblox `.ROBLOSECURITY` cookies expire after 30 years of first authenticating them.
3. You need to store this new cookie somewhere - whether it be in a database, or a JSON file.

> Note: By default, InitializeAsync will validate the cookie you provide by making a HTTP request.

### Example

This example makes use of the new async-await syntax.

```js
const { MessagingService, InitializeAsync } = require('@mfd/rbxmessagingservice');
async function startApp() {
	await InitializeAsync(
		'_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_...',
		123,
	);
	// Do everything else, calling functions and the like.
	await MessagingService.SubscribeAsync('TopicExample', function (message, sent) {
		console.log(`Message for TopicExample: ${message}, sent at: ${sent}`);
	});
	await MessagingService.PublishAsync('TopicExample', 'Some EPIC data!');
}
```
