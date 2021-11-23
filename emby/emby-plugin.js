/**
 * @description [emby调用第三方播放器播放 支持：Infuse、nPlayer、VLC 、IINA、Movist Pro]
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
        let iinaPlay = []
        let movistproPlay = []

	obj.MediaSources.forEach((item, index) => {
		let Name = ''
		item['MediaStreams'].forEach((t, i) => {
			if(t['Type'] === 'Video'){
				Name = t['DisplayTitle']
			}
		})

		infusePlay.push({
			Url: 'https://app.bilibili.com/empy/plugin/infuse://x-callback-url/play?url='+ encodeURIComponent(host + '/videos/'+ obj.Id +'/stream.mp4?DeviceId='+ query['X-Emby-Device-Id'] +'&MediaSourceId='+ item.Id +'&Static=true&api_key='+ query['X-Emby-Token']),
			Name: 'Infuse - '+ Name
		})

		nplayerPlay.push({
			Url: 'https://app.bilibili.com/empy/plugin/nplayer-'+ host + '/videos/'+ obj.Id +'/stream.mp4?DeviceId='+ query['X-Emby-Device-Id'] +'&MediaSourceId='+ item.Id +'&Static=true&api_key='+ query['X-Emby-Token'],
			Name: 'nPlayer - '+ Name
		})

		vlcPlay.push({
			Url: 'https://app.bilibili.com/empy/plugin/vlc-x-callback://x-callback-url/stream?url='+ encodeURIComponent(host + '/videos/'+ obj.Id +'/stream.mp4?DeviceId='+ query['X-Emby-Device-Id'] +'&MediaSourceId='+ item.Id +'&Static=true&api_key='+ query['X-Emby-Token']),
			Name: 'VLC - '+ Name
		})

                iinaPlay.push({
			Url: 'https://app.bilibili.com/empy/plugin/iina://weblink?url='+ encodeURIComponent(host + '/videos/'+ obj.Id +'/stream.mp4?DeviceId='+ query['X-Emby-Device-Id'] +'&MediaSourceId='+ item.Id +'&Static=true&api_key='+ query['X-Emby-Token']),
			Name: 'IINA - '+ Name
		})

                let movistproInfo = {
                        "url": host + '/videos/'+ obj.Id +'/stream.mp4?DeviceId='+ query['X-Emby-Device-Id'] +'&MediaSourceId='+ item.Id +'&Static=true&api_key='+ query['X-Emby-Token'],
                        "title": obj.Name
                }
                movistproPlay.push({
			Url: 'https://app.bilibili.com/empy/plugin/movistpro:'+ encodeURIComponent(JSON.stringify(movistproInfo)),
			Name: 'Movist Pro - '+ Name
		})
	})

	obj.ExternalUrls = [...obj.ExternalUrls, ...infusePlay, ...nplayerPlay, ...vlcPlay, ...iinaPlay, ...movistproPlay]

	$done({
		body: JSON.stringify(obj)
	});
}else if(requestURL.indexOf(embyPlguin) != -1){
	let modifiedHeaders = $response.headers;
	let LocationURL = requestURL.split('empy/plugin/')[1]

	modifiedHeaders['Location'] = LocationURL;

	let modifiedStatus = 'HTTP/1.1 302 Found';

	let isSurge = typeof $httpClient != "undefined"

	let data = {
		status: modifiedStatus,
		headers: modifiedHeaders
	}

	if(isSurge){
		data = {
			status: 302, 
			headers: { Location: LocationURL }, 
			body: ""
		}
	}

	$done(data);
}else {
	$done({});
}

