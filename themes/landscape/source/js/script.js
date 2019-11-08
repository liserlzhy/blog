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

    window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
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
  searchIcon.on('click', function () {
      if (headerNavSearch.css('top') === '72px') {
        headerNavSearch.fadeOut()
        headerNavSearch.css('top', '24px')
        headerNavSearch.css('pointerEvents', 'none')
      } else {
        $("#nav-search-input").val("")
        $("#nav-search-result").html("")
        headerNavSearch.show()
        headerNavSearch.css('top', '72px')
        headerNavSearch.css('pointerEvents', 'auto')
      }
  })

  menuIcon.on('click', function () {
    if (slideoutMenu.css('opacity') === '1') {
      slideoutMenu.css('opacity', '0')
      slideoutMenu.css('pointerEvents', 'none')
    } else {
      $("#slidedown-search-input").val("")
      $("#slidedown-search-result").html("")
      slideoutMenu.css('opacity', '1')
      slideoutMenu.css('pointerEvents', 'auto')
    }
  })

// tocs
  var tocs = $('.toc-item .toc-link')
  tocs.each(function(){
    $(this).on('click', function(e){
      e.preventDefault()
      var item = $($(this).attr('href'))
      $(document).scrollTop(item.offset().top - 72)
    })
  })
  var tocIcon = $('#toc-icon')
  var tocBox = $('#toc-box')
  var article = $('.toc-post #post-myblog')
  var comments = $('#comments')
  var $toc = $('#toc')
  tocIcon.on('click', function() {
    if ($(this).hasClass('icon-chevron-right')) {
      $(this).removeClass('icon-chevron-right')
      $(this).addClass('icon-chevron-left')
      article.css('left', '0')
      article.css('padding-right', '0')
    } else {
      $(this).removeClass('icon-chevron-left')
      $(this).addClass('icon-chevron-right')
      article.css('left', '200px')
      article.css('padding-right', '200px')
    } 
    tocBox.slideToggle()
  })
  $(window).on('scroll', function () {
    if ($toc.length > 0 && $("#toc").css('opacity') !== '0') {
      if ($(window).scrollTop() + 500 > comments.offset().top) {
        $toc.hide()
      } else {
        $toc.show()
      }
    }
  })

  
})(jQuery);

