// Channel 1: Non-chatty / important events (Game started, loaded UI script) -- more permanent messages
// Channel 2: Per frame data
// Channel 3-7: User defined / used for debugging / more temporary

// Refactor, Refator, Refactor!!

import fs from 'fs';
import { ClientSettings } from './clientSettings';
const FFLag = ClientSettings.GetFFlags();

export let FLog = {};
export let DFLog = {};
export let SFLog = {};

export const d = {
	setup: false,
};

const parameterizedString = (...args: any[]) => {
	const string = args[0];
	let i = 1;
	return string.replace(/%((%)|s|d|f|lf|i|x|X)/g, function (m) {
		// m is the matched format, e.g. %s, %d
		let val = null;
		if (m[2]) {
			val = m[2];
		} else {
			val = args[i];
			if (val !== null) {
				// A switch statement so that the formatter can be extended. Default is %s
				switch (m) {
					case '%d' || '%f' || '%lf':
						val = parseFloat(val);
						if (isNaN(val)) {
							val = 0;
						}
						break;
					case '%i':
						val = parseInt(val);
						if (isNaN(val)) {
							val = 0;
						}
						break;
					case '%x':
						val = val.toString(16).toLowerCase();
						break;
					case '%X':
						val = val.toString(16).toUpperCase();
						break;
					case '%s':
						val = val.toString();
						break;
				}
			}
			i++;
		}
		return val;
	});
};

function setUpLogLevels() {
	FLog = ClientSettings.GetFLogs();
	DFLog = ClientSettings.GetDFLogs();
	SFLog = ClientSettings.GetSFLogs();
	d.setup = true;
}

function printMessage(
	level: number,
	threadId: number,
	timeStamp: string,
	message: string,
	arg0: any,
	arg1: any,
	arg2: any,
	arg3: any,
	arg4: any,
) {
	if (FFLag['FastLogEnabled']) {
		if (!fs.existsSync(__dirname + '\\..\\..\\logs')) fs.mkdirSync(__dirname + '\\..\\..\\logs');
		const formatted = parameterizedString(message, arg0, arg1, arg2, arg3, arg4);
		const out = `${timeStamp},${process.uptime().toPrecision(6)},${threadId.toString(16)},${
			Math.floor(level) || 1
		} ${formatted}`;
		console.log(out);
		if (FFLag['LogToFile'])
			fs.appendFileSync(
				__dirname + `\\..\\..\\logs\\${FFLag['UseOneLog'] ? 'main' : process.pid.toString(16)}-log.log`,
				`${out}\n`,
				{
					encoding: 'utf-8',
				},
			);
	}
}
function FastLog(level: number, message: string, arg0: any, arg1: any, arg2: any, arg3: any, arg4: any) {
	if (level > 5) {
		printMessage(level, process.pid, new Date(Date.now()).toISOString(), message, arg0, arg1, arg2, arg3, arg4);
	}
}
export const FASTLOG = (group: number, message: string) => {
	do {
		if (group) FastLog(group, message, null, null, null, null, null);
	} while (0);
};
export const FASTLOG1 = (group: number, message: string, arg0: any) => {
	do {
		if (group) FastLog(group, message, arg0, null, null, null, null);
	} while (0);
};
export const FASTLOG2 = (group: number, message: string, arg0: any, arg1: any) => {
	do {
		if (group) FastLog(group, message, arg0, arg1, null, null, null);
	} while (0);
};
export const FASTLOG3 = (group: number, message: string, arg0: any, arg1: any, arg2: any) => {
	do {
		if (group) FastLog(group, message, arg0, arg1, arg2, null, null);
	} while (0);
};
export const FASTLOG4 = (group: number, message: string, arg0: any, arg1: any, arg2: any, arg3: any) => {
	do {
		if (group) FastLog(group, message, arg0, arg1, arg2, arg3, null);
	} while (0);
};
export const FASTLOG5 = (group: number, message: string, arg0: any, arg1: any, arg2: any, arg3: any, arg4: any) => {
	do {
		if (group) FastLog(group, message, arg0, arg1, arg2, arg3, arg4);
	} while (0);
};

export const FASTLOGS = (group: number, message: string, sarg: string) => {
	do {
		if (group) FastLog(group, message, sarg, null, null, null, null);
	} while (0);
};
export const FASTLOG1F = (group: number, message: string, arg0: number) => {
	do {
		if (group) FastLog(group, message, arg0, null, null, null, null);
	} while (0);
};
export const FASTLOG2F = (group: number, message: string, arg0: number, arg1: number) => {
	do {
		if (group) FastLog(group, message, arg0, arg1, null, null, null);
	} while (0);
};
export const FASTLOG3F = (group: number, message: string, arg0: number, arg1: number, arg2: number) => {
	do {
		if (group) FastLog(group, message, arg0, arg1, arg2, null, null);
	} while (0);
};
export const FASTLOG4F = (group: number, message: string, arg0: number, arg1: number, arg2: number, arg3: number) => {
	do {
		if (group) FastLog(group, message, arg0, arg1, arg2, arg3, null);
	} while (0);
};

export const FASTLOGNOFILTER = (group: number, message: string) => {
	FastLog(group, message, null, null, null, null, null);
};
export const FASTLOGNOFILTER2 = (group: number, message: string, arg0: any, arg1: any) => {
	FastLog(group, message, arg0, arg1, null, null, null);
};

export const LOGGROUP = (group: string) => {
	if (!d.setup) {
		setUpLogLevels();
	}
	if (FLog[group] === undefined) FLog[group] = 0;
};
export const LOGVARIABLE = (group: string, defaulton: number) => {
	if (!d.setup) {
		setUpLogLevels();
	}
	FLog[group] = FLog[group] || defaulton;
};

export const DYNAMIC_LOGGROUP = (group: string) => {
	if (!d.setup) {
		setUpLogLevels();
	}
	if (DFLog[group] === undefined) DFLog[group] = 0;
};
export const DYNAMIC_LOGVARIABLE = (group: string, defaulton: number) => {
	if (!d.setup) {
		setUpLogLevels();
	}
	DFLog[group] = DFLog[group] || defaulton;
};

export const SYNCHRONIZED_LOGGROUP = (group: string) => {
	if (!d.setup) {
		setUpLogLevels();
	}
	if (SFLog[group] === undefined) SFLog[group] = 0;
};
export const SYNCHRONIZED_LOGVARIABLE = (group: string, defaulton: number) => {
	if (!d.setup) {
		setUpLogLevels();
	}
	SFLog[group] = SFLog[group] || defaulton;
};
