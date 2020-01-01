---
title: fullscreenchange
date: 2019-12-07 12:51:50
categories: js
toc: false
---

点击一张图片使其在全屏和不全屏间切换
```html
<img id="img" src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3209370120,2008812818&fm=26&gp=0.jpg" alt="">

<script> 
$img = document.getElementById('img')
$img.addEventListener('click', function() {
  if (document.fullscreenElement) {
    // 取消全屏
    exitFullscreen()
  } else {
    // 进入全屏
    requestFullscreen(this)
  }
})

function requestFullscreen(el) {
    if (el.requestFullscreen) {
      el.requestFullscreen()
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen()
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen()
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullScreen()
    }
}
function exitFullscreen() {
  if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullScreen()
    }
}

document.addEventListener('fullscreenchange', (event) => {
  // 每次切换全屏模式都会触发fullscreenchange事件
  if (document.fullscreenElement) {
    console.log(`Element: ${document.fullscreenElement.id} entered full-screen mode.`);
  } else {
    console.log('Leaving full-screen mode.');
  }
});
</script>
```


