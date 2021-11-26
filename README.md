# Emby Plugin

可在ios/mac客户端中调用第三方播放器：Infuse、nPlayer、VLC、IINA、Movist Pro

## 已知问题

- ~~某些公益服 QX抓取该请求响应体乱码导致失效(已反馈，不知道会不会修)。花钱没反应，通过别的方式解决了此问题。~~

## 使用方法 (QX)

1. 引用资源
   - 打开 Quantumult X ，点击右下角的圆形按钮；
   - 打开 __重写__ 开关，并点击重写的 __引用__ 按钮；
   - __标签__ 任意，__资源路径__ 填  ```https://raw.githubusercontent.com/ZhipengRen/Quantumult/dev/emby/emby-plugin.conf```
     ，然后右上角保存；
2. 自行添加自己使用的公益服主机名
   - 打开 Quantumult X ，点击右下角的圆形按钮；
   - 找到 __MitM__ 模块点击 __添加主机名__
3. 配置好 MitM 证书并系统信任，打开 __MitM__ 开关；
4. 打开Emby客户端，选择剧集，链接中显示如下即成功
   <div align="left"><img src="https://raw.githubusercontent.com/ZhipengRen/Quantumult/dev/ScreenShots/Emby%20Link.jpeg" alt="Emby Link" width="300"/></div>

## 关于下载

- __严禁将下载链接用于多线程下载工具使用__ 造成封号概不负责
- 如果下载视频包含字幕，则下载全部字幕文件

## 特别感谢

- 此拓展诸多方法来源于 [@rartv](https://github.com/rartv/EmbyPublic/tree/test) 在此表示感谢
  
