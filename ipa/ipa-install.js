/**
 * @description [支持ios16的本地安装ipa脚本]
 */

let requestURL = $request.url;

let re = /plist\/(.*)\.plist$/;
let bundleIdentifier = re.exec(requestURL)[1]

let html = `
	<?xml version="1.0" encoding="UTF-8"?>
	<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
	<plist version="1.0">
	    <dict>
	        <key>items</key>
	        <array>
	            <dict>
	                <key>assets</key>
	                <array>
	                    <dict>
	                        <key>kind</key>
	                        <string>software-package</string>
	                        <key>url</key>
	                        <string>https://app.bilibili.com/install/ipa/file</string>
	                    </dict>
	                </array>
	                <key>metadata</key>
	                <dict>
	                    <key>bundle-identifier</key>
	                    <string>${ bundleIdentifier }</string>
	                    <key>kind</key>
	                    <string>software</string>
	                    <key>title</key>
	                    <string>App Name</string>
	                </dict>
	            </dict>
	        </array>
	    </dict>
	</plist>
`

$done({
	status: 'HTTP/1.1 200 OK',
	headers: {},
	body: html
});
