/**
 * @description [emby调用第三方播放器播放 支持：Infuse、nPlayer、VLC]
 */

let requestURL = $request.url;
let emby = '/emby/Users';
let embyPlguin = '/empy/plugin';

if(requestURL.indexOf(emby) != -1){
	function getHost(url) {
	  return url.toLowerCase().match(/^(https?:\/\/.*?)\//)[1];
	}

	function getQueryVariable(url) {
		let index = url.lastIndexOf('?');
		let query = url.substring(index + 1, url.length);
		let vars = query.split("&");
		let querys = new Object();
		for (let i = 0; i < vars.length; i++) {
			let pair = vars[i].split("=");
			querys[pair[0]] = pair[1]
		}
		if (Object.keys(querys).length == 0) {
			return null;
		} else {
			return querys;
		}
	}

	let host = getHost(requestURL);
	let query = getQueryVariable(requestURL);
	let obj = JSON.parse($response.body);

	let infusePlay = []
	let nplayerPlay = []
	let vlcPlay = []

	obj.MediaSources.forEach((item, index) => {
		infusePlay.push({
			Url: 'https://app.bilibili.com/empy/plugin/infuse://x-callback-url/play?url='+ encodeURIComponent(host + '/videos/'+ obj.Id +'/stream.mp4?DeviceId='+ query['X-Emby-Device-Id'] +'&MediaSourceId='+ item.Id +'&Static=true&api_key='+ query['X-Emby-Token']),
			Name: 'Infuse - '+ item.Name
		})

		nplayerPlay.push({
			Url: 'https://app.bilibili.com/empy/plugin/nplayer-'+ host + '/videos/'+ obj.Id +'/stream.mp4?DeviceId='+ query['X-Emby-Device-Id'] +'&MediaSourceId='+ item.Id +'&Static=true&api_key='+ query['X-Emby-Token'],
			Name: 'nPlayer - '+ item.Name
		})

		vlcPlay.push({
			Url: 'https://app.bilibili.com/empy/plugin/vlc-x-callback://x-callback-url/stream?url='+ encodeURIComponent(host + '/videos/'+ obj.Id +'/stream.mp4?DeviceId='+ query['X-Emby-Device-Id'] +'&MediaSourceId='+ item.Id +'&Static=true&api_key='+ query['X-Emby-Token']),
			Name: 'VLC - '+ item.Name
		})
	})

	obj.ExternalUrls = [...obj.ExternalUrls, ...infusePlay, ...nplayerPlay, ...vlcPlay]

	$done({
		body: JSON.stringify(obj)
	});
}else if(requestURL.indexOf(embyPlguin) != -1){
	let modifiedHeaders = $response.headers;
	let LocationURL = requestURL.split('empy/plugin/')[1]

	modifiedHeaders['Location'] = LocationURL;

	let modifiedStatus = 'HTTP/1.1 302 Found';

	$done({
		status: modifiedStatus,
		headers: modifiedHeaders
	});
}else {
	$done({});
}

