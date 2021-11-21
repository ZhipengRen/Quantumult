# Emby Plugin
可在ios客户端中调用第三方播放器：Infuse、nPlayer、VLC

## 已知问题
- 卷毛鼠与odyssey QX抓取该请求响应体乱码导致失效(已反馈，不知道会不会修)

## 使用方法 (QX)
1. 引用资源
	- 打开 Quantumult X ，点击右下角的圆形按钮；
	- 打开 __重写__ 开关，并点击重写的 __引用__ 按钮；
	-  __标签__ 任意，__资源路径__ 填	```https://raw.githubusercontent.com/ZhipengRen/Quantumult/dev/emby/emby-plugin.conf```
	，然后右上角保存；
2. 自行添加自己使用的公益服主机名
	-  打开 Quantumult X ，点击右下角的圆形按钮；
	-  找到 __MitM__ 模块点击 __添加主机名__
3. 配置好 MitM 证书并系统信任，打开__ MitM__ 开关；
4. 打开Emby客户端，选择剧集，链接中显示如下即成功
	![alt Emby Link](https://raw.githubusercontent.com/ZhipengRen/Quantumult/dev/ScreenShots/Emby%20Link.jpeg)
