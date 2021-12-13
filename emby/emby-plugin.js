/**
 * @description [emby调用第三方播放器播放 支持：Infuse、nPlayer、VLC 、IINA、Movist Pro]
 */

let requestURL = $request.url;
let emby = '/emby/Users';
let embyPlguin = '/emby/plugin';

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

if(requestURL.indexOf(emby) != -1){
	function getHost(url) {
	  return url.toLowerCase().match(/^(https?:\/\/.*?)\//)[1];
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
			let originalVideoUrl = host + '/videos/'+ obj.Id +'/stream.mp4?DeviceId='+ query['X-Emby-Device-Id'] +'&MediaSourceId='+ item.Id +'&Static=true&api_key='+ query['X-Emby-Token']
			let originalFileName = (obj.SeriesName ? obj.SeriesName+ '-' : '') + (obj.SeasonName ? obj.SeasonName+ '-' : '') + (obj.IndexNumber ? obj.IndexNumber+ '-' : '') + obj.Name
			let fileName = item['Path'].substring(item['Path'].lastIndexOf('/') + 1);
            let videoUrl = host + '/Videos/' + obj.Id + '/stream/' + encodeURIComponent(fileName) + '?MediaSourceId=' + item.Id + '&Static=true&api_key=' + query['X-Emby-Token'] + '&filename=' + encodeURIComponent(fileName);

			let vlcSubtitleInfo = []
			let vlcSubtitle = ''	

			let shuInfo = [{
				'header': {
					'User-Agent': 'Download',
				},
				'url': originalVideoUrl +'&filename='+ encodeURI(originalFileName + '.' + item['Container']),
				'name': originalFileName + '.' + item['Container'],
				'suspend': false,
			}]

			let Name = ''
			item['MediaStreams'].forEach((t, i) => {
				if(t['Type'] === 'Video'){
					Name = t['DisplayTitle']
				}

				if(t['Type'] === 'Subtitle' && t['IsExternal'] && t['Path']){
					let language = t['DisplayTitle'].toLowerCase()
					let subUrl = host + '/Videos/'+ obj.Id +'/' + item.Id + '/Subtitles/' + t['Index'] + '/Stream.' + t['Codec'] + '?api_key=' + query['X-Emby-Token']

					if(language.indexOf('chinese') != -1 || language.indexOf('und') != -1 || language.indexOf('chi') != -1){
						vlcSubtitleInfo.push(subUrl)
					}

					shuInfo.push({
						'header': {
							'User-Agent': 'Download',
						},
						'url': subUrl,
						'name': originalFileName,
						'suspend': false,
					})
				}
			})

			if(vlcSubtitleInfo.length > 0){
				vlcSubtitle = '&sub=' + encodeURIComponent(vlcSubtitleInfo[0])
			}

			infusePlay.push({
				Url: host + '/emby/plugin/scheme/infuse://x-callback-url/play?url='+ encodeURIComponent(videoUrl),
				Name: 'Infuse - '+ Name
			})

			nplayerPlay.push({
				Url: host + '/emby/plugin/scheme/nplayer-'+ videoUrl,
				Name: 'nPlayer - '+ Name
			})

			vlcPlay.push({
				Url: host + '/emby/plugin/scheme/vlc-x-callback://x-callback-url/stream?url='+ encodeURIComponent(videoUrl) + vlcSubtitle,
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
	
	obj.ExternalUrls = obj.ExternalUrls.filter((item) => {
		return (item.Name.indexOf('Infuse') === -1 && item.Name.indexOf('nPlayer') === -1 && item.Name.indexOf('VLC') === -1 && item.Name.indexOf('Movist') === -1)
	})
	obj.ExternalUrls = [...obj.ExternalUrls, ...infusePlay, ...nplayerPlay, ...vlcPlay, ...iinaPlay, ...movistproPlay, ...shuDownload]

	$done({
		body: JSON.stringify(obj)
	});
}else if(requestURL.indexOf(embyPlguin) != -1){
	let isSurge = typeof $httpClient != "undefined"

	let LocationURL = requestURL.split('emby/plugin/scheme/')[1]
	let modifiedStatus = 'HTTP/1.1 302 Found';
	
	if(isSurge){
		modifiedStatus = 302
	}

	$done({
		status: modifiedStatus, 
		headers: { Location: LocationURL }, 
		body: ""
	});
}else if(requestURL.indexOf('/Videos/') != -1 && (requestURL.indexOf('/stream/') != -1 || requestURL.indexOf('/Subtitles/') != -1)) { // 资源路径伪静态
    let query = getQueryVariable(requestURL);
    if (typeof(query['filename']) == "undefined" || query['filename'] == "") {
        $done({});
    }
    let isSurge = typeof $httpClient != "undefined";
    if (isSurge) {
        requestURL = $request.url.replace('/' + query['filename'], '');
        $done({
            url: requestURL,
            headers: $request.headers
        });
    } else {
        requestURL = $request.path.replace('/' + query['filename'], '');
        $done({
            path: requestURL,
            headers: $request.headers
        });
    }
}else {
	$done({});
}

