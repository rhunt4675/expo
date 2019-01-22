import uuidv4 from 'uuid/v4';
import UAParser from 'ua-parser-js';
import { DeviceUUID } from 'device-uuid';
const ExpoPackageJson = require('expo/package.json');
const parser = new UAParser();
const deviceId = new DeviceUUID().get();
export default {
    _sessionId: uuidv4(),
    get appOwnership() {
        return 'expo';
    },
    get installationId() {
        return deviceId;
    },
    get name() {
        return 'ExponentConstants';
    },
    get sessionId() {
        return this._sessionId;
    },
    get platform() {
        return { web: UAParser(navigator.userAgent) };
    },
    get isDevice() {
        // TODO: Bacon: Possibly want to add information regarding simulators
        return true;
    },
    get expoVersion() {
        return ExpoPackageJson.version;
    },
    get linkingUri() {
        return location.origin + location.pathname;
    },
    get expoRuntimeVersion() {
        return null;
    },
    get deviceName() {
        const { browser, engine, os: OS } = parser.getResult();
        return `${browser.name || engine.name || OS.name}`;
    },
    get systemFonts() {
        // TODO: Bacon: Maybe possible.
        return [];
    },
    get statusBarHeight() {
        return 0;
    },
    get deviceYearClass() {
        // TODO: Bacon: The android version isn't very accurate either, maybe we could try and guess this value.
        console.log(`ExponentConstants.deviceYearClass: is unimplemented on web.`);
        return null;
    },
    get manifest() {
        let manifest;
        // Bacon: Get manifest from webpack.config.js
        if (process) {
            manifest = process.env.APP_MANIFEST;
        }
        return manifest || {};
    },
    async getWebViewUserAgentAsync() {
        return navigator.userAgent;
    },
};
//# sourceMappingURL=ExponentConstants.web.js.map