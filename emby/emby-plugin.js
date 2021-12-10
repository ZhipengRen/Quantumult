/**
 * @description [emby调用第三方播放器播放 支持：Infuse、nPlayer、VLC 、IINA、Movist Pro]
 */

let requestURL = $request.url;
let emby = '/emby/Users';
let embyPlguin = '/emby/plugin';

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
	let shuDownload = []

	if(obj.MediaSources){
		obj.MediaSources.forEach((item, index) => {
			let videoUrl = host + '/videos/'+ obj.Id +'/stream.mp4?DeviceId='+ query['X-Emby-Device-Id'] +'&MediaSourceId='+ item.Id +'&Static=true&api_key='+ query['X-Emby-Token']
			let fileName = (obj.SeriesName ? obj.SeriesName+ '-' : '') + (obj.SeasonName ? obj.SeasonName+ '-' : '') + (obj.IndexNumber ? obj.IndexNumber+ '-' : '') + obj.Name
			let shuInfo = [{
				'header': {
					'User-Agent': 'Download',
				},
				'url': videoUrl +'&filename='+ encodeURI(fileName + '.' + item['Container']),
				'name': fileName + '.' + item['Container'],
				'suspend': false,
			}]

			let Name = ''
			item['MediaStreams'].forEach((t, i) => {
				if(t['Type'] === 'Video'){
					Name = t['DisplayTitle']
				}

				if(t['Type'] === 'Subtitle' && t['IsExternal'] && t['Path']){
					shuInfo.push({
						'header': {
							'User-Agent': 'Download',
						},
						'url': host + '/Videos/'+ obj.Id +'/' + item.Id + '/Subtitles/' + t['Index'] + '/Stream.' + t['Codec'] + '?api_key=' + query['X-Emby-Token'],
						'name': fileName,
						'suspend': false,
					})
				}
			})

			infusePlay.push({
				Url: host + '/emby/plugin/scheme/infuse://x-callback-url/play?url='+ encodeURIComponent(videoUrl),
				Name: 'Infuse - '+ Name
			})

			nplayerPlay.push({
				Url: host + '/emby/plugin/scheme/nplayer-'+ videoUrl,
				Name: 'nPlayer - '+ Name
			})

			vlcPlay.push({
				Url: host + '/emby/plugin/scheme/vlc-x-callback://x-callback-url/stream?url='+ encodeURIComponent(videoUrl),
				Name: 'VLC - '+ Name
			})

	        iinaPlay.push({
				Url: host + '/emby/plugin/scheme/iina://weblink?url='+ encodeURIComponent(videoUrl),
				Name: 'IINA - '+ Name
			})

			let movistproInfo = {
				"url": videoUrl,
				"title": fileName
			}
			movistproPlay.push({
				Url: host + '/emby/plugin/scheme/movistpro:' + encodeURIComponent(JSON.stringify(movistproInfo)),
				Name: 'Movist Pro - ' + Name
			})

			shuDownload.push({
				Url: host + '/emby/plugin/scheme/shu://gui.download.http?urls='+ encodeURIComponent(JSON.stringify(shuInfo)),
				Name: 'Shu - '+ Name
			})
		})
	}

	obj.ExternalUrls = [...obj.ExternalUrls, ...infusePlay, ...nplayerPlay, ...vlcPlay, ...iinaPlay, ...movistproPlay, ...shuDownload]

	$done({
		body: JSON.stringify(obj)
	});
}else if(requestURL.indexOf(embyPlguin) != -1){
	let modifiedHeaders = $response.headers;
	let LocationURL = requestURL.split('emby/plugin/scheme/')[1]

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

