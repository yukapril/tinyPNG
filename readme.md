# tinyPNG 工具

## 说明

tinyPNG本身自带nodejs工具，可以见此：[tinify-github](https://github.com/tinify/tinify-nodejs)

本工具基于web API编写，并不依赖原tinify工具。API文档[见此](https://tinypng.com/developers/reference)

本工具基于 [electron](http://electron.atom.io/) 构建。

## 运行

首先要 `npm install` 安装依赖

之后可以：

* `npm start` 直接进行调试运行
* `npm run pack:mac` 打包为mac版本（pack目录下）
* `npm run pack:win` 打包为win版本（pack目录下）

## 配置和使用

#### 官网申请API key

首先要到tinyPNG网站注册，只需要邮箱和用户名即可，每次通过邮箱链接登录。

登陆后可以看到自己的 API key。

每个月处理的图片上限是500次。

#### 使用

打包后的程序，同级目录下可以存在`config.json`文件，可以存放key数据，防止每次都要粘贴

```json
{
    "key": "your tinyPNG key"
}
```

当然也可以在程序内直接粘贴使用（此方法不会自动生成`config.json`文件）。

直接拖拽png或jpg图片即可，拖拽错误的图片可以移除。点击tinyPNG会自动处理，最终保存在相应文件目录下，加入`tiny`标志。

如：

> 图片为：/Users/yukapril/img/aa.png 
>
> 压缩到：/Users/yukapril/img/aa<span style="color:#c00;font-weight:900;">.tiny</span>.png
