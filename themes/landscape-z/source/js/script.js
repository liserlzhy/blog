// import { domainToASCII } from "url";

(function($){
  // Search
  var $searchWrap = $('#search-form-wrap'),
    isSearchAnim = false,
    searchAnimDuration = 200;

  var startSearchAnim = function(){
    isSearchAnim = true;
  };

  var stopSearchAnim = function(callback){
    setTimeout(function(){
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  $('#nav-search-btn').on('click', function(){
    if (isSearchAnim) return;

    startSearchAnim();
    $searchWrap.addClass('on');
    stopSearchAnim(function(){
      $('.search-form-input').focus();
    });
  });

  $('.search-form-input').on('blur', function(){
    startSearchAnim();
    $searchWrap.removeClass('on');
    stopSearchAnim();
  });

  // Share
  $('body').on('click', function(){
    $('.article-share-box.on').removeClass('on');
  }).on('click', '.article-share-link', function(e){
    e.stopPropagation();

    var $this = $(this),
      url = $this.attr('data-url'),
      encodedUrl = encodeURIComponent(url),
      id = 'article-share-box-' + $this.attr('data-id'),
      offset = $this.offset();

    if ($('#' + id).length){
      var box = $('#' + id);

      if (box.hasClass('on')){
        box.removeClass('on');
        return;
      }
    } else {
      var html = [
        '<div id="' + id + '" class="article-share-box">',
          '<input class="article-share-input" value="' + url + '">',
          '<div class="article-share-links">',
            '<a href="https://twitter.com/intent/tweet?url=' + encodedUrl + '" class="article-share-twitter" target="_blank" title="Twitter"></a>',
            '<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="article-share-facebook" target="_blank" title="Facebook"></a>',
            '<a href="http://pinterest.com/pin/create/button/?url=' + encodedUrl + '" class="article-share-pinterest" target="_blank" title="Pinterest"></a>',
            '<a href="https://plus.google.com/share?url=' + encodedUrl + '" class="article-share-google" target="_blank" title="Google+"></a>',
          '</div>',
        '</div>'
      ].join('');

      var box = $(html);

      $('body').append(box);
    }

    $('.article-share-box.on').hide();

    box.css({
      top: offset.top + 25,
      left: offset.left
    }).addClass('on');
  }).on('click', '.article-share-box', function(e){
    e.stopPropagation();
  }).on('click', '.article-share-box-input', function(){
    $(this).select();
  }).on('click', '.article-share-box-link', function(e){
    e.preventDefault();
    e.stopPropagation();

    $(window).open(this.href, 'article-share-box-$(window)-' + Date.now(), 'width=500,height=450');
  });

  // Caption
  $('.article-entry').each(function(i){
    $(this).find('img').each(function(){
      if ($(this).parent().hasClass('fancybox')) return;

      var alt = this.alt;

      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
    });

    $(this).find('.fancybox').each(function(){
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox){
    $('.fancybox').fancybox();
  }

  // Mobile nav
  var $container = $('#container'),
    isMobileNavAnim = false,
    mobileNavAnimDuration = 200;

  var startMobileNavAnim = function(){
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function(){
    setTimeout(function(){
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  }

  $('#main-nav-toggle').on('click', function(){
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    $container.toggleClass('mobile-nav-on');
    stopMobileNavAnim();
  });

  $('#wrap').on('click', function(){
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;

    $container.removeClass('mobile-nav-on');
  });

  // headerjs
  const menuIcon = $('#menu-icon')
  const slideoutMenu = $('#slideout-menu')
  const searchIcon = $('#search-icon')
  const headerNavSearch = $('#header>.site_search') 
  
  searchIcon.on('click', function (e) {
    e.stopPropagation()
    if (headerNavSearch.css('right') === '0px') {
      headerNavSearch.css({'opacity':'0', 'right':'-500px', 'pointerEvents':'none'})
    } else {
      $("#nav-search-input").val("")
      $("#nav-search-result").html("")
      headerNavSearch.css({'opacity':'1', 'right':'0px', 'pointerEvents':'auto'})
    }
  })

  menuIcon.on('click', function () {
    if (slideoutMenu.css('opacity') === '1') {
      slideoutMenu.css({'opacity':'0', 'pointerEvents':'none'})
    } else {
      $("#slidedown-search-input").val("")
      $("#slidedown-search-result").html("")
      slideoutMenu.css({'opacity':'1', 'pointerEvents':'auto'})
    }
  })
 
  $(document).on('click', function(e) {
    var e = e || window.event
    if ($(e.target).closest('#header').length == 0) {
      if (headerNavSearch.css('right') === '0px') {
        headerNavSearch.css({'opacity':'0', 'right':'-500px', 'pointerEvents':'none'})
      } else if (slideoutMenu.css('opacity') === '1') {
        slideoutMenu.css({'opacity':'0', 'pointerEvents':'none'})
      }
      return 
    }
  })
// tocs
  const tocs = $('.toc-item .toc-link')
  tocs.eq(0).css('color', '#258fb8')
  tocs.each(function(){
    $(this).on('click', function(e){
      tocs.each(function() {
        $(this).css('color', '#777')
      })
      e.preventDefault()
      var item = $($(this).attr('href'))
      $(document).scrollTop(item.offset().top - 72)
      $(this).css('color','#258fb8')
    })
  })

  const tocIcon = $('#toc-icon')
  const article = $('.toc-post article')
  const comments = $('#comments')
  const $toc = $('#toc')
  const tocBox = $('#toc-box')
  const toTopBtn = $('#toTopBtn')

  if ($toc.length != 0) {
    var tocHeight = $('.toc').height() > ($(window).height() - 150) ? ($(window).height() - 150)  : $('.toc').height() + 50
    $toc.height(tocHeight)
    tocIcon.on('click', function() {
      if ($(this).hasClass('icon-chevron-right')) {
        $(this).removeClass('icon-chevron-right')
        $(this).addClass('icon-chevron-left')
        tocBox.css("visibility", "hidden")
        article.css({'left':'0', 'padding-right':'0'})
      } else {
        $(this).removeClass('icon-chevron-left')
        $(this).addClass('icon-chevron-right')
        article.css({'left':'200px', 'padding-right':'200px'})
        tocBox.css("visibility", "visible")
      } 
    })
  }
  $(window).on('scroll', function () {


    // go to top
    if ($(window).scrollTop() > $(window).outerHeight()) {
      toTopBtn.css('opacity', '0.7')
    } else {
      toTopBtn.css('opacity', '0')
    }

    // toc
    if (tocs.length != 0) {

      var tocBottom = $toc.offset().top - $(window).scrollTop() + $toc.height()
      var comtTop = comments.offset().top - $(window).scrollTop()
      if ($toc.length > 0 && $toc.css('opacity') !== '0' && comments.length !==0) {
        if (tocBottom > comtTop) {
          $toc.css("visibility", "hidden")
          tocBox.css("visibility", "inherit")
        } else {
          $toc.css("visibility", "visible")
          if (tocIcon.hasClass('icon-chevron-right')) {
            tocBox.css("visibility", "inherit")
          } else {
            tocBox.css("visibility", "hidden")
          }
        }
      }

      // toc title change color
      var scrollTop = $(document).scrollTop()
      var nextElementTop
    
      tocs.each(function(index) {
        var curElementTop =  $($(this).attr('href')).offset().top - 100
        if (index < tocs.length - 1) {
          nextElementTop = $(tocs.eq(index+1).attr('href')).offset().top
        }else {
          nextElementTop = $(tocs.eq(index).attr('href')).offset().top + 100
        }
        if (scrollTop >= curElementTop && scrollTop < nextElementTop) {
          tocs.each(function() {
            $(this).css('color', '#777')
          })
          $(this).css('color','#258fb8')
        }
      })
    }
  })
  var temp = true
  toTopBtn.on('click', function () {
    var b = $(window).scrollTop()
    if (temp) {
      var token = setInterval(function () {
        temp = false
        b -= 200
        $(window).scrollTop(b)
        if (b <= 0) {
          clearInterval(token)
          token = null
          temp = true
        }
      }, 10)
    }
  })

  ;(function(){
    var isTouch = false //var to indicate current input type (is touch versus no touch) 
    var isTouchTimer 
    var curRootClass = '' //var indicating current document root class ("can-touch" or "")
     
    function addtouchclass(e){
        clearTimeout(isTouchTimer)
        isTouch = true
        if (curRootClass != 'can-touch'){ //add "can-touch' class if it's not already present
            curRootClass = 'can-touch'
            document.documentElement.classList.add(curRootClass)
        }
        isTouchTimer = setTimeout(function(){isTouch = false}, 500) //maintain "istouch" state for 500ms so removetouchclass doesn't get fired immediately following a touch event
    }
     
    function removetouchclass(e){
        if (!isTouch && curRootClass == 'can-touch'){ //remove 'can-touch' class if not triggered by a touch event and class is present
            isTouch = false
            curRootClass = ''
            document.documentElement.classList.remove('can-touch')
        }
    }
     
    document.addEventListener('touchstart', addtouchclass, false) //this event only gets called when input type is touch
    document.addEventListener('mouseover', removetouchclass, false) //this event gets called when input type is everything from touch to mouse/ trackpad
})();
})(jQuery);

