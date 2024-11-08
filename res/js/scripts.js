+function ($) {
  
	/**
	 * Fake console
	 */
	if (!window.console)
		window.console = {log:function(){},dir:function(){}};
	
	/**
	 * FUI
	 */
	FUI = new function() 
	{
		this.plugins = {};
		this.mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
		this.thresholdSpy = null;
		
		this.init =  function()
		{	
			// register plugins
			for (var w in FUI.plugins)
				$.fn["bh_" + w] = FUI.plugins[w];
			
			var ht = 
				'<div class="bh-threshold-spy" style="position:absolute; top:0; left:-500px; width:1px; height:1px">' +
				'<div class="visible-xs"></div>' +
				'<div class="visible-sm"></div>' +
				'<div class="visible-md"></div>' +
				'<div class="visible-lg"></div>' +
				'</div>';
			$("body").append(ht);
			FUI.thresholdSpy = $(".bh-threshold-spy");
			
			FUI.enhance($("body"));
		};
		
		this.getThreshold = function()
		{
			var s = 0;
			if (FUI.thresholdSpy.find(".visible-xs").is(":visible"))
				s = 1;
			if (FUI.thresholdSpy.find(".visible-sm").is(":visible"))
				s = 2;
			if (FUI.thresholdSpy.find(".visible-md").is(":visible"))
				s = 3;
			if (FUI.thresholdSpy.find(".visible-lg").is(":visible"))
				s = 4;
			return s;
		}
		
		this.enhance = function(el)
		{
			el.bh_enhance();
		};

		this.getLayout = function()
		{
			var LAYOUT = {
				mobile: "Mobile",
				desktop: "Desktop",
				app: "App",
				tablet:"Tablet"
			};
			
			!function(a){var b=/iPhone/i,c=/iPod/i,d=/iPad/i,e=/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,f=/Android/i,g=/(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,h=/(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,i=/IEMobile/i,j=/(?=.*\bWindows\b)(?=.*\bARM\b)/i,k=/BlackBerry/i,l=/BB10/i,m=/Opera Mini/i,n=/(CriOS|Chrome)(?=.*\bMobile\b)/i,o=/(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,p=new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)","i"),q=function(a,b){return a.test(b)},r=function(a){var r=a||navigator.userAgent,s=r.split("[FBAN");return"undefined"!=typeof s[1]&&(r=s[0]),s=r.split("Twitter"),"undefined"!=typeof s[1]&&(r=s[0]),this.apple={phone:q(b,r),ipod:q(c,r),tablet:!q(b,r)&&q(d,r),device:q(b,r)||q(c,r)||q(d,r)},this.amazon={phone:q(g,r),tablet:!q(g,r)&&q(h,r),device:q(g,r)||q(h,r)},this.android={phone:q(g,r)||q(e,r),tablet:!q(g,r)&&!q(e,r)&&(q(h,r)||q(f,r)),device:q(g,r)||q(h,r)||q(e,r)||q(f,r)},this.windows={phone:q(i,r),tablet:q(j,r),device:q(i,r)||q(j,r)},this.other={blackberry:q(k,r),blackberry10:q(l,r),opera:q(m,r),firefox:q(o,r),chrome:q(n,r),device:q(k,r)||q(l,r)||q(m,r)||q(o,r)||q(n,r)},this.seven_inch=q(p,r),this.any=this.apple.device||this.android.device||this.windows.device||this.other.device||this.seven_inch,this.phone=this.apple.phone||this.android.phone||this.windows.phone,this.tablet=this.apple.tablet||this.android.tablet||this.windows.tablet,"undefined"==typeof window?this:void 0},s=function(){var a=new r;return a.Class=r,a};"undefined"!=typeof module&&module.exports&&"undefined"==typeof window?module.exports=r:"undefined"!=typeof module&&module.exports&&"undefined"!=typeof window?module.exports=s():"function"==typeof define&&define.amd?define("isMobile",[],a.isMobile=s()):a.isMobile=s()}(this);
			
			if (this.isMobile.phone)
				return LAYOUT.mobile;
			else if (this.isMobile.tablet)
				return LAYOUT.tablet;
			else
				return LAYOUT.desktop;
		};		
		
	};
	
	/**
	 * Enhance
	 */
	FUI.plugins.enhance = function()
	{
		// apply plugins
		var m_this = $(this);
		for (var w in FUI.plugins)
		{
			m_this.find(".bh-" + w).each(function()
			{
				var el = $(this);
				if (el.data("defer"))
				{
					if (el.data(w + "-deferred"))
						el["bh_" + w]();
					else
						el.data(w + "-deferred", true);
				}
				else
					el["bh_" + w]();
			});
		}
		
		return this;
	};

	FUI.plugins.trackEvetCustom = function ()
	{
		var m_this = $(this);
		var m_event = m_this.data("event");
		var m_trackEvent = m_this.data("track-event");
		var m_digitalData = m_this.data("digital-data");
		var m_virtualPageName = m_this.data("virtualpagename");

		function setup()
		{
			m_this.bind(m_event, function (evt)
			{
				if (m_trackEvent=="virtual_pageview" && m_virtualPageName)
				{
					FDTracker.trackVirtualPageView(m_virtualPageName);
				}
			});
		}

		if (!m_this.data("__ui_trackEvetCustom_setup"))
		{
			m_this.data("__ui_trackEvetCustom_setup", true);
			setup();
		}

		return this;
	}

	/**
	 * Header
	 */
	FUI.plugins.header = function()
	{
		var m_this = $(this);
		var m_hd_default = m_this.find(".bh-header-default");
		var m_hd_switch = m_this.find(".bh-header-switch");
		var m_hd_flip = m_this.find(".bh-header-flip");
		var m_link_hd_flip_show = m_this.find(".bh-link-header-flip-show");
		var m_productCard = $(".bh-content").find(".bh-productCard");
		var m_ctaOpenModal = m_productCard.find(".bh-openModalHD");
		var m_ctaCqsSimulator = m_productCard.find(".bh-cqssimulator");
		var m_ctaPPSimulator = m_productCard.find(".bh-siffpanel");
		if (m_ctaPPSimulator.length==0)
		{
			m_ctaPPSimulator = m_productCard.find(".bh-anticipocontanti");
		}

		var m_elHeight			= 0;
		var m_elTop				= 0;
		var m_dHeight			= 0;
		var m_wHeight			= 0;
		var m_wScrollCurrent	= 0;
		var m_wScrollBefore		= 0;
		var m_wScrollDiff		= 0;
		var m_lastTop = 0;

		var m_data_hdSwitch = $(".bh-data-header-switch");
		var m_data_hdSwitchVisibility = m_data_hdSwitch.data("visibility");
		var m_data_hdSwitchTitle = m_data_hdSwitch.data("title");
		var m_data_hdSwitchText = m_data_hdSwitch.data("text");

		var m_data_hdSwitchLabelCta = m_data_hdSwitch.data("label-cta");
		var m_data_hdSwitchCta = m_data_hdSwitch.data("cta");

		var m_data_hdSwitchLabelCtaMobile = m_data_hdSwitch.data("label-cta-mobile");
		var m_data_hdSwitchCtaMobile = m_data_hdSwitch.data("cta-mobile");

		var m_data_hdSwitchCtaTarget = m_data_hdSwitch.data("cta-target");

		var m_hdSwitchTitle = m_hd_switch.find(".bh-hdSwitchTitle");
		var m_hdSwitchText = m_hd_switch.find(".bh-hdSwitchText");
		var m_hdSwitchLabelCta = m_hd_switch.find(".bh-hdSwitchLabelCta");

		var m_data_hdFlip = $(".bh-data-header-flip");
		var m_data_hdFlipLabelCta = m_data_hdFlip.data("label-cta");
		var m_data_hdFlipVisibility = m_data_hdFlip.data("visibility");

		var m_simulatorPanel = m_this.find(".bh-simulatorPanel");

		var m_data_rating = m_data_hdSwitch.data("visibility-rating");
		var m_intro_prod = m_this.find(".bh-intro-prod");
		var m_rating = m_this.find(".bh-rating");
					
		function setPositions()
		{	
			if(FUI.getThreshold() <  4)
			{
				// var scrollable = $('.bh-assistedscroll').length>0 ? $('.bh-content') : $(document);
				var scrollable = $(document);

				var $element = m_hd_default;

				m_elHeight		=  $element.outerHeight();
				m_dHeight			= scrollable.prop('scrollHeight');
				m_wHeight			= $(window).height();
				m_wScrollCurrent	= scrollable.scrollTop();
				m_wScrollDiff		= m_wScrollBefore - m_wScrollCurrent;
				m_elTop			= m_lastTop + m_wScrollDiff;

				m_wScrollDiff = m_wScrollDiff > 0 ? 1 : -1;

				var newTop = 0;
				if( m_wScrollCurrent <= 0 ) // scrolled to the very top; element sticks to the top
				{
					newTop = 0;
				}
				else if( m_wScrollDiff > 0 ) // scrolled up; element slides in
				{
					newTop = m_elTop > 0 ? 0 : m_elTop;
				}
				else if( m_wScrollDiff < 0 ) // scrolled down
				{
					if( m_wScrollCurrent + m_wHeight >= m_dHeight - m_elHeight	 )  // scrolled to the very bottom; element slides in
					{
						newTop = ( m_elTop = m_wScrollCurrent + m_wHeight - m_dHeight ) < 0 ? m_elTop : 0;
					}
					else // scrolled down; element slides out
					{
						newTop = Math.abs( m_elTop ) > m_elHeight	 ? -m_elHeight	 : m_elTop;
					}
				}

				$element.css({transform: "translateY(" + newTop + "px)", transition:"transform 300ms ease-in-out"});

				m_lastTop = newTop;
				m_wScrollBefore = m_wScrollCurrent;
			}
			else 
			{
				m_hd_default.css({transform: "translateY(" + 0 + "px)", transition:"transform 300ms ease-in-out"});
			}
		}

		
		function headerSwitch()
		{	
			m_hd_switch.show();
			m_hdSwitchTitle.html(m_data_hdSwitchTitle);
			m_hdSwitchText.html(m_data_hdSwitchText);
			
			if((m_data_hdSwitchVisibility == true) && (m_ctaPPSimulator.length > 0) && (!m_data_hdSwitchLabelCta)) {
				m_hdSwitchLabelCta.html(m_data_hdFlipLabelCta);
			}
			else {
				if(FUI.getThreshold() <=  2 && m_data_hdSwitchCtaMobile.length > 0) {
					m_hdSwitchLabelCta.html(m_data_hdSwitchLabelCtaMobile);
					m_hdSwitchLabelCta.attr("href",m_data_hdSwitchCtaMobile);
				}
				else {
					m_hdSwitchLabelCta.html(m_data_hdSwitchLabelCta);
					m_hdSwitchLabelCta.attr("href",m_data_hdSwitchCta);
				}
			}

			m_hdSwitchLabelCta.attr("target", "_"+m_data_hdSwitchCtaTarget);

			if(m_data_rating == true){
				m_rating.show();
				m_intro_prod.remove();
			}
			
			var scrollHdSwitch = 0;
			if(m_productCard.length > 0) {
				scrollHdSwitch = ($(m_productCard.get(0)).offset().top) - (m_this.outerHeight()) + (m_productCard.height()) -70;
			}
			else {
				scrollHdSwitch = m_this.outerHeight();
			}
		
			if($(window).scrollTop() >= scrollHdSwitch)
			{
				m_hd_default.css({transform: "translateY(-" + m_hd_default.outerHeight() + "px)", transition:"transform 500ms ease-in-out"});
				m_hd_switch.css({transform: "translateY(" + m_hd_default.outerHeight() + "px)", transition:"transform 500ms ease-in-out"});
			}
			else  {
				m_hd_switch.css({transform: "translateY(-" + m_hd_default.outerHeight() + "px)", transition:"transform 500ms ease-in-out"});
				m_hd_default.css({transform: "translateY(" + 0 + "px)", transition:"transform 500ms ease-in-out"});
				if(m_hd_flip.length>0){
					m_hd_flip.removeClass("is-flipped");
				}
			}
		}

		function setLinkHd(){

			var currentUrl = document.location.href;
			var m_links = m_this.find(".top-bar").find(".menu").find("a");
		
			for( var i=0; i<m_links.length; i++)
			{
				var $this = $(m_links[i]);
				var href = $this.attr("href");

				if(currentUrl.indexOf(href)!=-1)
				{
					$this.addClass("current");
				}
			}
		}

		function setup()
		{
			setPositions();

			if((m_data_hdSwitchVisibility == true) && (m_ctaOpenModal.length > 0)){
				m_hdSwitchLabelCta.removeAttr("target");
				m_hdSwitchLabelCta.click(function(){
					m_ctaOpenModal.trigger("click");
					return false;
				});
			}

			if((m_data_hdSwitchVisibility == true) && (m_ctaCqsSimulator.length > 0)){
				m_hdSwitchLabelCta.removeAttr("target");
				m_hdSwitchLabelCta.click(function(){
					m_ctaCqsSimulator.trigger("click");
					return false;
				});
			}

			if((m_data_hdSwitchVisibility == true) && (m_ctaPPSimulator.length > 0)){
				m_hdSwitchLabelCta.removeAttr("target");
				m_hdSwitchLabelCta.click(function(){
					m_ctaPPSimulator.trigger("click");
					return false;
				});
			}

			// var scrollable = $('.bh-assistedscroll').length>0 ? $('.bh-content') : $(window);
			var scrollable = $(window);
			
			scrollable.scroll(function() {

				if((m_data_hdSwitch.length > 0) && (m_data_hdSwitchVisibility == true)) {
					headerSwitch();
				}
				else {
					setPositions();
				}
				
			});

			$(window).resize(function() {
				if((m_data_hdSwitch.length > 0) && (m_data_hdSwitchVisibility == true)) {
					headerSwitch();
				}
				else {
					setPositions();
				}
			});

			setLinkHd();
		}

		if (!m_this.data("__bh__header__init"))
		{	
			m_this.data("__bh__header__init", true);
			setup();
		}
		return this;
	};


	/**
	 * Set Link Menu
	 */
	FUI.menuUtils = {};
	FUI.menuUtils.setCurrent = function($menuElement, openSubMenus)
	{
		var m_this = $menuElement;
		var currentUrl = document.location.href;

		var m_links = m_this.find("a");
		var found = [];
		for( var i=0; i<m_links.length; i++)
		{
			var $this = $(m_links[i]);
			var href = $this.attr("href");
			if(currentUrl.indexOf(href)!=-1)
			{
				$this.addClass("current");
						
                if( found.indexOf(href) != -1 )
                {
                    continue;
                }
                else
                {
                    found.push(href);
                }
				
				if($this.hasClass("bh-label"))
				{
					$this.prev().addClass("current");
				}
				else
				{
					$parents = $this.parents(".bh-submenu");
					if( $parents.length > 0 )
					{
						$($parents[0]).siblings(".bh-label, .bh-submenu-label").addClass("active");
						$($parents[0]).siblings(".bh-label").prev().addClass("active");
						if( openSubMenus === true)
						{
							$($parents[0]).siblings(".bh-link-subitems").click();
						}
						$parents = $($parents[0]).parents(".bh-submenu");
						if( $parents.length > 0 )
						{
							$($parents[0]).siblings(".bh-label, .bh-submenu-label").addClass("active");
							$($parents[0]).siblings(".bh-label").prev().addClass("active");
							if( openSubMenus === true)
							{
								$($parents[0]).siblings(".bh-link-subitems").click();
							}
						}
					}
					if(!$this.is(":visible"))
                    {
					    $this.closest(".bh-menu-level").find(".bh-link-level-open").trigger("click");
                    }
				}
				$this.addClass("current");
				$this.siblings(".bh-link-subitems").click();
			}
		};
	}
	FUI.menuUtils.closeSubMenus = function($menuElement)
	{
		var m_this = $menuElement;
		var currentUrl = document.location.href;

		m_this.find(".bh-link-subitems.active").click();
	}

	/**
	 * Menu
	 */
	FUI.plugins.menu = function()
	{
		var m_this = $(this);
		var m_toggle_menu =  m_this.find(".bh-toggle-menu");
		var m_link_submenu = m_this.find(".bh-link-subitems");
		var m_icon_label =  m_this.find(".bh-icon-label");
		var m_label =  m_this.find(".bh-label");
		var m_toggle_menu_hd = $(".bh-toggle-menu-hd");
		var m_height = $(window).height();
		var m_link_level = m_this.find(".bh-submenu").find(".bh-link-level-open");
		var m_link_level_close = m_this.find(".bh-submenu").find(".bh-link-level-close");
		var m_menu_level = m_this.find(".bh-submenu").find(".bh-menu-level");
		var m_content = $(".bh-content");
		var m_firstOpen = true;
		var m_leaveTimeout = null;
		var m_t = false;
		var m_window_width = null;
		
		function setHeight(){
			var m_height = $(window).height();
			m_this.height(m_height - m_this.position().top);
		}

		function setup()
		{	
			FUI.menuUtils.setCurrent(m_this);

			m_window_width = $(window).width();

			m_toggle_menu_hd.removeClass("visible"); 

			m_toggle_menu.each(function() {

				$(this).unbind("click").click(function(e)
				{
					e.preventDefault();

					if(m_toggle_menu_hd.hasClass("visible"))
                    {
                        return false;
                    }

					var ndx = m_toggle_menu.index(this);
					
					$("body").find(".bh-info-clone").remove();

					if(FUI.getThreshold() >=  4)
					{
						if(m_t){
							return;
						}
						m_t = true;

						var close = !m_this.hasClass("open");
						
						if (close)
						{
							m_icon_label.fadeOut(400);
							m_label.fadeIn(400);
							m_this.addClass("open");
							$(this).addClass("active"); 
							m_this.css("width", "85px");

							var $this = $(this);
							var $subUl = $($(this).siblings(".bh-submenu")[0]);
							var $subLiActive = $($subUl.find(".label.active")[0]);
							if($subLiActive.length > 0)
							{
								$($subLiActive.siblings(".bh-link-subitems")[0]).click();
							}
							$($this.siblings(".bh-link-subitems")[0]).click();

							m_this.animate({"width":"320px"}, 400, 'swing',function(){
								m_t = false;
							});
						}
						else
						{
							m_icon_label.fadeIn(400);
							m_label.fadeOut(400);
							m_this.css("width", "320px");
							
							$("html, body").css("height","auto").css("overflow","auto");
							m_this.animate({"width":"85px"}, 400, 'swing', function() {
								m_toggle_menu.removeClass("active"); 
								m_this.removeClass("open"); 
								m_this.css("overflow","hidden");
								
								m_t = false;
							});
							FUI.menuUtils.closeSubMenus(m_this);
							
						}
					}
					else {
		
						m_this.parent().animate({"left":"-330px"}, 400, 'swing',function(){
							$("html, body").css("height","auto").css("overflow","auto");
							m_toggle_menu_hd.removeClass("visible"); 
							m_this.css("overflow","hidden");
							m_t = false;
						});
					}
					return false;
				});
				//FUI.menuUtils.setCurrent(m_this);
			});
			
			m_this.mouseenter(function(){
				if( m_leaveTimeout != null && m_t == false )
				{
					window.clearTimeout(m_leaveTimeout);
					m_leaveTimeout = null;
					m_t = false;
				}
			});

			m_this.mouseleave(function() {
				
				if(m_t){
					return;
				}
				
				if(FUI.getThreshold() >=  4){
					
					var open = m_this.hasClass("open");
					
					if (open)
					{	
						if( m_leaveTimeout != null )
						{
							window.clearTimeout(m_leaveTimeout);
							m_leaveTimeout = null;
						}
						
						m_leaveTimeout = window.setTimeout(function(){
							m_t = true;
							m_icon_label.fadeIn(400);
							m_label.fadeOut(400);
							m_this.css("width", "320px");
							
							$("html, body").css("height","auto").css("overflow","auto");
							m_this.animate({"width":"85px"}, 400, 'swing', function() {
								m_toggle_menu.removeClass("active"); 
								m_this.removeClass("open"); 
								m_this.css("overflow","hidden");
								m_t = false;
							});
							FUI.menuUtils.closeSubMenus(m_this);
						}, 500);
					}
					else {
						m_t = false;
					}
				}
				else {
					m_t = false;
				}
			});
			
			setHeight();

			if(FUI.getThreshold() <  4){
				m_this.parent().css("left","-330px");
			}

			m_toggle_menu_hd.click(function()
			{
				if(m_t){
					return;
				}
				
				m_t = true;

				$("body").find(".bh-info-clone").remove();

				if(FUI.getThreshold() <  4){
					m_icon_label.hide();
					m_label.show();
					m_this.addClass("open");
					var visible = !$(this).hasClass("visible");
					
					if (visible)
					{
						$(this).addClass("visible"); 
						
						m_this.css("width", "320px");

						m_this.parent().animate({"left":"0"}, 400, 'swing', function(){
							$("html, body").css("height", m_height).css("overflow","hidden");
							$(".bh-content").unbind('touchstart').bind('touchstart', function() {
								m_toggle_menu_hd.click();
							});
							m_t = false;
						});

						FUI.menuUtils.setCurrent(m_this, true);
					}
					else
					{
						m_this.parent().animate({"left":"-330px"}, 400, 'swing',function(){
							$("html, body").css("height","auto").css("overflow","auto");

							$(".bh-content").unbind('touchstart');
							FUI.menuUtils.closeSubMenus(m_this);
							m_t = false;
						});
						$(this).removeClass("visible"); 
						
						m_this.css("overflow","hidden");
					}
				}
				else {
					var close = !m_this.hasClass("open");
					
					if (close)
					{
						m_icon_label.fadeOut(400);
						m_label.fadeIn(400);
						m_this.addClass("open");
						$(this).addClass("active"); 
						m_this.css("width", "85px");

						var $this = $(this);
						var $subUl = $($(this).siblings(".bh-submenu")[0]);
						var $subLiActive = $($subUl.find(".label.active")[0]);
						if($subLiActive.length > 0)
						{
							$($subLiActive.siblings(".bh-link-subitems")[0]).click();
						}
						$($this.siblings(".bh-link-subitems")[0]).click();

						m_this.animate({"width":"320px"}, 400, 'swing',function(){
							m_t = false;
						});
					}
					else
					{
						m_icon_label.fadeIn(400);
						m_label.fadeOut(400);
						m_this.css("width", "320px");
						
						$("html, body").css("height","auto").css("overflow","auto");
						m_this.animate({"width":"85px"}, 400, 'swing', function() {
							m_toggle_menu.removeClass("active"); 
							m_this.removeClass("open"); 
							m_this.css("overflow","hidden");
							
							m_t = false;
						});
						FUI.menuUtils.closeSubMenus(m_this);
						
					}
				}
				return false;
			});

			m_link_submenu.unbind("click").click(function()
			{
				var visible = !$(this).hasClass("active");
				if (visible)
				{
					$(this).addClass("active"); 
					$(this).next(".bh-submenu").find("a").hide();
					$(this).next(".bh-submenu").find("a").fadeIn(400);
					$(this).parent("li").find(".bh-submenu:first").slideDown({
						duration: 300,
						easing: "swing"
					});
					$(this).find("span").html("&#xE316;");
					if(($(this).closest("li").find(".current").length > 0) && (!$(this).closest("li").find(".current").is(":visible")))
                    {
                        $(this).closest("li").find(".bh-link-level-open").click();
                    }
				}
				else
				{
					$(this).removeClass("active"); 
					$(this).parent("li").find(".bh-submenu:first").slideUp({
						duration: 300,
						easing: "swing"
					});
					$(this).next(".bh-submenu").find("a").fadeOut(300);
					$(this).find("span").html("&#xE313;");


					if(m_link_level_close.is(":visible")){
						m_link_level_close.click();
					}
					else {
						return;
					}
				}
				return false;
			});

			m_link_level.unbind("click").click(function()
			{
				m_menu_level.find("li").fadeIn();
				m_menu_level.find("ul").addClass("separator");
				$(this).removeClass("show").addClass("hide");
				m_link_level_close.removeAttr("style").removeClass("hide").addClass("show");
				return false;
			});

			m_link_level_close.unbind("click").click(function()
			{
				m_menu_level.find("li").hide();
				m_menu_level.find("ul").removeClass("separator");
				m_menu_level.find("ul").find("li:first-child").fadeIn();
				$(this).removeClass("show").addClass("hide");
				m_link_level.removeAttr("style").removeClass("hide").addClass("show");
				return false;
			});

			$(window).resize(function() {
				if(m_window_width == $(window).width()){
					return;
				}
				m_window_width = $(window).width();

				setHeight();
				m_toggle_menu_hd.removeClass("visible"); 
				m_this.removeClass("open"); 
				m_this.css("overflow","hidden");
				$("html, body").css("height","auto").css("overflow","auto");

				if(FUI.getThreshold() >=  4){
					m_this.parent().css("left","0");
					m_this.css("width", "85px");
					m_icon_label.show();
					m_label.hide();
				}
				else {
					m_this.css("width", "0");
					m_this.parent().css("left","-100%");
					m_icon_label.hide();
					m_label.show();
				}
				m_firstOpen = true;
				FUI.menuUtils.setCurrent(m_this, true);
			});
		}
		
		if (!m_this.data("__bh_menu_init"))
		{
			m_this.data("__bh_menu_init", true);
			setup();
		}
		return this;
	};

	/**
	 * Menu mobile
	 */
	FUI.plugins.menumob = function()
	{

		var m_this = $(this);
		var m_toggle_menu =  m_this.find(".bh-toggle-menumob");
		var m_link_submenu = m_this.find(".bh-link-subitems");
		var m_link_level = m_this.find(".bh-submenu").find(".bh-link-level-open");
		var m_link_level_close = m_this.find(".bh-submenu").find(".bh-link-level-close");
		var m_menu_level = m_this.find(".bh-submenu").find(".bh-menu-level");
		var m_content = $(".bh-content");

		function setup()
		{	
			m_toggle_menu.click(function()
			{
				var m_height = $(window).height()-61;
				var visible = !$(this).hasClass("visible");
				
				if (visible)
				{
					$(this).addClass("visible"); 
					m_this.find(".bh-ctn-menu").height(m_height).css("overflow","auto");
					FUI.menuUtils.setCurrent(m_this, true);
					m_this.find(".bh-ctn-menu").animate({"left":"-1px"}, 400, 'swing', function(){
						m_content.hide();
					});
				}
				else
				{
					$(this).removeClass("visible"); 
					m_this.find(".bh-ctn-menu").animate({"left":"-105%"}, 400, 'swing', function(){
						FUI.menuUtils.closeSubMenus(m_this);
					});
					//m_this.find(".bh-link-subitems").find("span").html("&#xE313;");
					//m_link_submenu.removeClass("active");
					m_this.find(".bh-ctn-menu").height("auto").css("overflow","hidden");

					m_content.show();
				}
				
				return false;
			});
			
			m_link_submenu.click(function()
			{
				var visible = !$(this).hasClass("active");

				if (visible)
				{
					$(this).addClass("active"); 
					$(this).next(".bh-submenu").find("a").hide();
					$(this).next(".bh-submenu").find("a").fadeIn(400);
					$(this).parent("li").find(".bh-submenu:first").slideDown({
						duration: 300,
						easing: "swing"
					});
					$(this).find("span").html("&#xE316;");
				}
				else
				{
					$(this).removeClass("active"); 
					$(this).parent("li").find(".bh-submenu:first").slideUp({
						duration: 300,
						easing: "swing"
					});
					$(this).next(".bh-submenu").find("a").fadeOut(300);
					$(this).find("span").html("&#xE313;");

					if(m_link_level_close.is(":visible")){
						m_link_level_close.click();
					}
					else {
						return;
					}
				}
				
				return false;
			});

			m_link_level.click(function()
			{
				m_menu_level.find("li").fadeIn();
				m_menu_level.find("ul").addClass("separator");
				$(this).removeClass("show").addClass("hide");
				m_link_level_close.removeAttr("style").removeClass("hide").addClass("show");
				return false;
			});

			m_link_level_close.click(function()
			{
				m_menu_level.find("li").hide();
				m_menu_level.find("ul").removeClass("separator");
				m_menu_level.find("ul").find("li:first-child").fadeIn();
				$(this).removeClass("show").addClass("hide");
				m_link_level.removeAttr("style").removeClass("hide").addClass("show");
				return false;
			});

			$(window).resize(function() {
				m_toggle_menu.removeClass("visible"); 
				m_this.find(".bh-ctn-menu").height("auto").css("left","-105%");
				m_content.show();
			});
		}
		
		if (!m_this.data("__bh_menumob_init"))
		{
			m_this.data("__bh_menumob_init", true);
			setup();
		}
		return this;
	};

	/**
	 * BgStripe
	*/
	FUI.plugins.bgStripe = function()
	{
		var m_this = $(this);
		var m_bg;
		var m_wrapper;
		var m_offset = 100;

		function setBg(){
			var height = m_this.height() + m_offset;
			m_bg.width($(window).width());
			m_bg.css("left", -(m_this.offset().left));
			m_bg.css("top", -(m_offset/100*75));
			m_bg.css("height", height);

			var el = m_this.prev().attr("class");
			if(el == "panel-default"){
				m_bg.css("top", -(m_offset/100*75));
			}
			else {
				m_bg.css("top", "-20px");
				$(".bh-bg").css("height", height-55);
			}
		}

		function loadImages()
		{
			var $images = m_this.find("img");
			for(var i=0; i<$images.length; i++ )
			{
				$img = $($images[i]);
				var domImage = new Image();
				domImage.src = $img.attr("src");
				domImage.onload = setBg;
			}
		}
		
		function setup()
		{	
			m_wrapper = $("<div></div>");
			m_wrapper.css("z-index","5").css("position","relative");
			m_this.children().wrapAll(m_wrapper);

			m_bg = $('<div class=\"bg-stripe bh-bg\"></div>');
			m_this.first().prepend(m_bg);

			m_this.css("z-index","2");

			m_this.prev().css("z-index","3");
			m_this.next().css("z-index","3");

			setBg();
			loadImages();


			m_this.closest(".bh-sliderTabs").bind("tabshow", function()
			{
				setBg();
			});
			m_this.bind("resetBg", setBg);

			$(window).resize(function() {
				setBg();
			});
		}
		
		if (!m_this.data("__bh_bgStripe_init"))
		{
			m_this.data("__bh_bgStripe_init", true);
			setup();
		}
		return this;
	};

	/**
	 * Modal
	*/
	FUI.plugins.modal = function()
	{
		var m_this = $(this);
		var m_modalUrl = null;
		var m_modal = null;
		var m_bgHtml = "<div class=\"bg-modal\"></div>";
		var m_bg = null;
		var m_height;
		var m_modalType = null;
		var m_video = null;
		var m_window_width = null;
		var m_window_top = null;
		var m_foreground = null;

		function setModal()
		{
			
			m_modal.css({"top":$(window).height()});
			m_height = m_modal.find(".bh-modal-main").height();
			var height = m_modal.find(".bh-content").height();

			if( height > m_height)
			{
				m_modal.addClass("foreground");
				
				m_foreground = m_modal.hasClass("foreground");
				if(m_foreground){
					m_modal.addClass("fullScreenMobile");
					if(FUI.getThreshold() <= 2){
						m_modal.find(".bh-content").css("padding-bottom","70px").css("padding-top","70px");
					}
				}
			}

			var posLR = (($(window).width()) - (m_modal.width()))/2;
			if(FUI.getThreshold() >  2){
				m_modal.css("left",posLR).css("right",posLR);
			}
		}
		
		function showModal()
		{
			//m_window_top = $(window).scrollTop();
			//$("html, body").css("height",$(window).height()).css("overflow","hidden");
			setModal();
			m_bg = $(m_bgHtml).hide();
			$("body").append(m_bg);
			m_bg.show();

			//if(m_foreground){
				m_modal.css({"top":$(window).height()});
				m_modal.animate({top:0, opacity: 1}, 200);
				
			/*}
			else {
				m_modal.css({"top":0});
				m_modal.css("opacity",1);
			}*/

			m_bg.unbind("click").click(function(e)
			{
				e.preventDefault();
				closeModal();
			});
		}

		function closeModal()
		{
			if( m_modal == null )
				return;
			
			/*if(m_modal.css("opacity") != 0){
				$("html, body").css("height","auto").css("overflow","auto");
				window.scrollTo(0, m_window_top);
			}*/

			//if(m_foreground){
				m_modal.animate({
				top:$(window).height(), opacity:0
				}, 200, function() {
					m_modal.removeClass("fullScreenMobile");
					m_modal.removeClass("foreground");
				});
			/*}
			else {
				m_modal.css("top",$(window).height()).css("opacity",0);
			}*/

			if(m_bg){
				m_bg.fadeOut(function(){
					m_bg.remove();
				});
			}

			m_video = m_modal.find("iframe").attr("src");
			if(m_video){
				$("iframe").attr("src","");
				$("iframe").attr("src", m_video);
			}
		}

		function loadContent()
		{
			if(m_modal != null && m_modal.length > 0 )
			{
				showModal();
				return;
			}
		
			printModal();
			m_modal.find(".bh-modal-content").load(m_modalUrl+' .bh-content',function()
			{
				var m_urlFix = "/testtm2016";
				var currentUrl = document.location.href;
				var title = m_modal.find(".bh-modal-content").find("h1").html();
				m_modal.find(".bh-modal-title").html(title);
				m_modal.find(".bh-modal-content").find("h1").remove();
				m_modal.find(".content-trustpilot-ft").remove();
				m_modal.find(".footer").remove();
				m_modal.find(".path").remove();
				m_modal.find(".bh-content").css("float","left").css("width","100%");

				if (OneTrust && $("#ot-sdk-cookie-policy").length>0)
				{
					OneTrust.LoadBanner();
					m_modal.find(".ot-sdk-show-settings").click(function()
					{
						OneTrust.ToggleInfoDisplay();
					});
				}
				
				FUI.enhance(m_modal.parent());

				m_modal.find(".bh-modal-main").scroll(function() {
					var scroll = $(this).scrollTop();
					if(scroll >= 1)
						m_modal.find(".bh-modal-hd").addClass("shadow-bottom");
					else 
						m_modal.find(".bh-modal-hd").removeClass("shadow-bottom");
				});
					
				showModal();

				$(".bh-lazyload").bh_lazyload(true);

				
			});
		}

		function printModal()
		{
			m_modal = $("<div class=\"modal\">" +
				"<div class=\"modal-container\">" +
					"<div class=\"modal-content bh-scrollbar\">" +
						"<div class=\"modal-header bh-modal-hd\">" +
							"<div class=\"middle\">" +
								"<a href=\"javascript:void(0);\" class=\"close bh-modal-close\"><span class=\"material-icons\">&#xE14C;</span></a>" +
								"<header><h1 class=\"bh-modal-title\">Titolo</h1></header>" +
							"</div>" + 
						"</div>" + 
						"<div class=\"modal-main bh-modal-main\">" +
							"<div class=\"bh-modal-content\">" +
							"</div>" + 	
						"</div>" + 
					"</div>" + 
				"</div>" + 
			"</div>");
			$("body").append(m_modal);
			setModalEvents();
		}

		function setModalEvents()
		{
			m_modal.find(".bh-modal-close").unbind("click").click(function(e)
			{
				e.preventDefault();
				closeModal();
			});

			m_modal.on("click", function (e)
			{
				if (!$(e.target).closest(".modal-content").length) {
					e.preventDefault();
					closeModal();
				}
			});
		}

		function setup()
		{	
			
			m_window_width = $(window).width();

			m_modalType = "internal";
			m_modalUrl = m_this.attr('href');
			var modalSelector = m_modalUrl.split("../").join("");
			modalSelector = modalSelector.split("/").join("");
			if (modalSelector.indexOf("javascript:")!=-1)
				return;
			m_modal = $(modalSelector);
			if(m_modal.length == 0 )
			{
				m_modalType = "external";
				m_modal = null;
			}

			m_this.click(function(e)
			{
				var txt = $(this).text();
				txt = txt.split("\n").join(" ");
				txt = txt.split("\r").join(" ");
				txt = txt.split("\t").join(" ");
				while(txt.indexOf("  ")!=-1)
				{
					txt = txt.split("  ").join(" ");
				}
				txt = $.trim(txt);
				FDTracker.trackVirtualPageView(txt);

				m_modalUrl = m_this.attr('href');
				
				e.preventDefault();
				if( m_modalType == "internal")
				{
					showModal();
					setModalEvents();
				}
				else
				{
					loadContent();
				}
			});


			$(window).resize(function() {
				if(m_window_width == $(window).width()){
					return;
				}
				m_window_width = $(window).width();

				closeModal();
			});
		}
		
		if (!m_this.data("__bh_modal_init"))
		{
			m_this.data("__bh_modal_init", true);
			setup();
		}
		return this;
	};
	
	/**
	 * Slide Card
	*/
	FUI.plugins.slideCard = function()
	{
		var m_this = $(this);
		var m_container = m_this.find(".bh-cards-container");
		var m_container_int = m_this.find(".bh-cards-int-container");
		var m_cards_links = m_this.find(".bh-cards-links");
		var m_cards_item = m_this.find(".bh-cards-item");
		var m_link_item_open = m_this.find(".bh-cards-links-item");
		var m_link_item_close = m_this.find(".bh-cards-links-item-close");
		var m_link_item_int_close = m_this.find(".bh-cards-links-item-int-close");
		var m_window_width = null;
	
		var m_data_set = m_this.data("set");
		var m_ctnTabs = m_this.find(".bh-tabs");
		var m_bxSlider = null;
		var hViewport = null;


		function resetAll(){
			m_container.height("auto");
			m_cards_links.removeClass("disappears");
			m_cards_item.removeClass("view");
			m_cards_item.width("100%");
		}
		

		function sliderTabs(){
			
			m_bxSlider = m_this.find(".bh-ctnTabs").bxSlider({
				auto: false,
				controls: false,
				adaptiveHeight:true,
				infiniteLoop: false,
				speed: 220,
				hideControlOnEnd: true,
				useCSS: false,
				pagerCustom: m_ctnTabs,
				onSlideBefore: function($slideElement, oldIndex, newIndex)
				{
					m_this.trigger("slider.slideTo", {"toIndex":newIndex});	
					m_link_item_close.trigger("click");
				},
				touchEnabled:false, 
				swipeThreshold: 25,
				oneToOneTouch: false,
				startSlide: 0
			});
		}
		
		function setup()
		{

			if(m_data_set == 'tabs'){
				sliderTabs();
			}
			
			m_window_width = $(window).width();
			
			m_link_item_open.click(function()
			{				
				var h = $(this).next(".bh-cards-item").height();
				$(this).parents(".bh-cards-links").addClass("disappears");
				$(this).next(".bh-cards-item").css("opacity","1").addClass("view");
				$(this).parents(".bh-cards-container").height(h);

				var view = m_this.data("view");
				var scrollTo = $(this).parents(".bh-cards-container").offset().top;
				
				if (view == 'scroll-top')
				{
					$("html, body").animate({scrollTop: scrollTo-150 }, '500');
				}

				if (m_data_set == 'tabs')
				{
					hViewport = m_this.find(".bx-viewport").height();
					m_this.find(".bx-viewport").height(h);
				}

				if(m_container_int.length > 0){
					w = m_container_int.width();
					$(this).next(".bh-cards-item").css("width",w);
				}

				var txt = $(this).text();
				txt = txt.split("\n").join(" ");
				txt = txt.split("\r").join(" ");
				txt = txt.split("\t").join(" ");
				while(txt.indexOf("  ")!=-1)
				{
					txt = txt.split("  ").join(" ");
				}
				txt = $.trim(txt);

				FDTracker.trackCustomEvent("apertura_accordion", {dettaglio_pagina:txt});

				return false;
			});


			m_link_item_close.click(function()
			{
				$(this).parents(".bh-cards-links").removeClass("disappears");
				$(this).parents(".bh-cards-item").removeClass("view").stop().animate({
					"opacity": 0
				}, 310);
				$(this).parents(".bh-cards-container").height("auto");

				if (m_data_set == 'tabs')
				{
					m_this.find(".bx-viewport").height(hViewport);
				}

				return false;
			});

			m_link_item_int_close.click(function()
			{
				var h = $(this).parents(".bh-cards-int-container").find(".bh-cards-links").height();
				$(this).parents(".bh-cards-int-container").find(".bh-cards-links").removeClass("disappears");
				$(this).parents(".bh-cards-int-container").find(".bh-cards-item").removeClass("view").stop().animate({
					"opacity": 0
				}, 320);
				m_container.height(h+2);
				return false;
			});

			resetAll();

			$(window).resize(function() {
				if(m_window_width == $(window).width()){
					return;
				}
				m_window_width = $(window).width();
				
				resetAll();
			});

		}
	
		if (!m_this.data("__bh__slideCard__init"))
		{	
			m_this.data("__bh__slideCard__init", true);
			setup();
		}
		return this;
	};

	/**
	 * Slider Customer
	*/
	FUI.plugins.sliderCustomer = function()
	{
		var m_this = $(this);
        var m_slider = null;
        var m_sliderContent = null;
        var m_configDesktop = null;
        var m_configSmartphone = null;
		var m_window_width = null;
		
		function setup()
		{
			m_sliderContent = m_this.clone();

            m_configSmartphone = {
                "container": '.container-box-custoner',
				"gutter": 10,
				"fixedWidth": 235,
				"swipeAngle": false,
				"controls": false,
				"speed": 600,
				"swipeAngle": false,
				"navAsThumbnails": true,
				"touch": true,
                "mouseDrag": true,
				"responsive": {
                    320: {
                        "fixedWidth": 220,
                        "edgePadding": 50
                    },
					360: {
                        "fixedWidth": 235,
                        "edgePadding": 60
                    },
                    375: {
                        "fixedWidth": 235,
                        "edgePadding": 70
                    },
                    390: {
                        "fixedWidth": 235,
                        "edgePadding": 75
                    },
					412: {
                        "fixedWidth": 235,
                        "edgePadding": 90
                    }
                },
				onInit: function (info)
                {
					$(info.slideItems[info.index]).addClass("current");
                }
            }
			m_configDesktop = {
				"container": '.container-box-custoner',
				"items": 4,
				"loop": true,
				"controls": false,
				"swipeAngle": false,
				"speed": 600,
				"swipeAngle": false,
				"navAsThumbnails": true,
				"touch": true,
                "mouseDrag": true
			}

			m_window_width = $(window).width();

			$(window).resize(function() {
				if(m_window_width == $(window).width()){
					return;
				}
				m_window_width = $(window).width();
				
				setSlider();
			});

			setSlider();
		}

		function setSlider()
		{
			var config;

			if (FUI.getThreshold() < 3)
			{
				config = m_configSmartphone
			}
			else
			{
				config = m_configDesktop;;

			}

			if (m_slider && m_slider.destroy)
			{
				m_slider.destroy();
			}

			m_this.empty();
			m_this.html(m_sliderContent.html());

			if (config != null)
			{
				m_slider = tns(config);
				m_slider.events.on('indexChanged', function(info, eventName){
					m_this.find(".item").removeClass("current");
					$(info.slideItems[info.index]).addClass("current");
				});
			}
			
		}

	
		if (!m_this.data("__bh__sliderCustomer__init"))
		{	
			m_this.data("__bh__sliderCustomer__init", true);
			setup();
		}
		return this;
	};

	/**
	 * Slider Customer Opinions
	*/
	FUI.plugins.sliderCustomerOpinions = function()
	{
		var m_this = $(this);
        var m_slider = null;
        var m_sliderContent = null;
        var m_configDesktop = null;
        var m_configSmartphone = null;
		var m_window_width = null;
		
		function setup()
		{
			m_sliderContent = m_this.clone();

            m_configSmartphone = {
                "container": '.container-box-custoner',
				"gutter": 10,
				"fixedWidth": 235,
				"swipeAngle": false,
				"controls": false,
				"speed": 600,
				"swipeAngle": false,
				"navAsThumbnails": true,
				"touch": true,
                "mouseDrag": true,
				"responsive": {
                    320: {
                        "fixedWidth": 220,
                        "edgePadding": 50
                    },
					360: {
                        "fixedWidth": 235,
                        "edgePadding": 60
                    },
                    375: {
                        "fixedWidth": 235,
                        "edgePadding": 70
                    },
                    390: {
                        "fixedWidth": 235,
                        "edgePadding": 75
                    },
					412: {
                        "fixedWidth": 235,
                        "edgePadding": 90
                    }
                },
				onInit: function (info)
                {
					$(info.slideItems[info.index]).addClass("current");
                }
            }
			m_configDesktop = {
				"container": '.container-box-custoner',
				"items": 3,
				"gutter": 30,
				"loop": true,
				"controls": false,
				"swipeAngle": false,
				"speed": 600,
				"swipeAngle": false,
				"navAsThumbnails": true,
				"touch": true,
                "mouseDrag": true
			}

			m_window_width = $(window).width();

			$(window).resize(function() {
				if(m_window_width == $(window).width()){
					return;
				}
				m_window_width = $(window).width();
				
				setSlider();
			});

			setSlider();
		}

		function setSlider()
		{
			var config;

			if (FUI.getThreshold() < 2)
			{
				config = m_configSmartphone
			}
			else
			{
				config = m_configDesktop;;

			}

			if (m_slider && m_slider.destroy)
			{
				m_slider.destroy();
			}

			m_this.empty();
			m_this.html(m_sliderContent.html());

			if (config != null)
			{
				m_slider = tns(config);
				m_slider.events.on('indexChanged', function(info, eventName){
					m_this.find(".item").removeClass("current");
					$(info.slideItems[info.index]).addClass("current");
				});
			}
			
		}

	
		if (!m_this.data("__bh__sliderCustomerOpinions__init"))
		{	
			m_this.data("__bh__sliderCustomerOpinions__init", true);
			setup();
		}
		return this;
	};


	/**
	 * Slider Solutions 
	*/
	FUI.plugins.sliderSolutions = function()
	{
		var m_this = $(this);
        var m_slider = null;
        var m_sliderContent = null;
        var m_configDesktop = null;
        var m_configSmartphone = null;
		var m_window_width = null;
		
		function setup()
		{
			m_sliderContent = m_this.clone();

            m_configSmartphone = {
                "container": '.container-box-solution',
				"gutter": 30,
				"fixedWidth": 303,
				"swipeAngle": false,
				"controls": false,
				"speed": 600,
				"swipeAngle": false,
				"navAsThumbnails": true,
				"touch": true,
                "mouseDrag": true,
				"responsive": {
                    320: {
                        "fixedWidth": 270,
						"gutter": 20,
                        "edgePadding": 20
                    },
					360: {
                        "fixedWidth": 303,
						"gutter": 20
                    },
                    375: {
                        "fixedWidth": 303,
						"gutter": 30
                    }
                },
				onInit: function (info)
                {
					$(info.slideItems[info.index]).addClass("current");
                }
            }
			m_configDesktop = {
				"container": '.container-box-solution',
				"items": 3,
				"gutter": 10,
				"loop": true,
				"controls": false,
				"swipeAngle": false,
				"speed": 600,
				"swipeAngle": false,
				"navAsThumbnails": true,
				"touch": true,
                "mouseDrag": true,
				"responsive": {
					1200: {
                        "gutter": 30
                    }
                },
			}

			m_window_width = $(window).width();

			$(window).resize(function() {
				if(m_window_width == $(window).width()){
					return;
				}
				m_window_width = $(window).width();
				
				setSlider();
			});

			setSlider();
		}

		function setSlider()
		{
			var config;

			if (FUI.getThreshold() <= 1)
			{
				config = m_configSmartphone
			}
			else
			{
				config = m_configDesktop;;

			}

			if (m_slider && m_slider.destroy)
			{
				m_slider.destroy();
			}

			m_this.empty();
			m_this.html(m_sliderContent.html());

			if (config != null)
			{
				m_slider = tns(config);
				m_slider.events.on('indexChanged', function(info, eventName){
					m_this.find(".item").removeClass("current");
					$(info.slideItems[info.index]).addClass("current");
				});
			}
			
		}

	
		if (!m_this.data("__bh__sliderCustomerOpinions__init"))
		{	
			m_this.data("__bh__sliderCustomerOpinions__init", true);
			setup();
		}
		return this;
	};
	
	/**
	 * Tabs
	*/
	FUI.plugins.tabset = function()
	{
		var m_this = $(this);
		var m_controls = m_this.find(".bh-tabcontrol");
		var m_contents = m_this.find(".bh-tabpanel");
		
		function setup()
		{
			m_controls.each(function(idx)
			{
				$(this).data("position", idx);
				$(this).click(function()
				{
					m_controls.removeClass("active");
					$(this).addClass("active");
					m_contents.hide();
					$(m_contents.get($(this).data("position"))).fadeIn("slow");
					$(m_contents.get($(this).data("position"))).trigger("tabshow");
					$("body").find(".bh-view-detail").remove();
					var newIndex = m_controls.index($(this)[0]);
					m_this.trigger("tabset.tabTo", {"toIndex":newIndex});
					return false;
				});
			});
			
			var el = m_controls.filter(".active");
			if (el.length>0){
				el.click();
			}
			else {
				$(m_controls.get(0)).click();
			}
		}
	
		if (!m_this.data("__bh__tabset__init"))
		{	
			m_this.data("__bh__tabset__init", true);
			setup();
		}
		return this;
	};

	/**
	 * Slider Tabs
	*/
	FUI.plugins.sliderTabs = function()
	{
		var m_this = $(this);
		var m_controls = m_this.find(".bh-tabcontrol");
		var m_contents = m_this.find(".bh-tabpanel");
		
		function setup()
		{
			m_bxSlider = m_this.find(".bh-viewport").bxSlider(
			{
				pager: false,
				auto: false,
				minSlides: 3,
				maxSlides: 15,
				slideWidth: "225",
				moveSlides: 1,
				slideMargin: 0,
				infiniteLoop: false,
				hideControlOnEnd: true,
				useCSS: false,
				nextSelector: '#slider-next',
				prevSelector: '#slider-prev',
				nextText: '<span class="material-icons">&#xE5CC;</span>',
				prevText: '<span class="material-icons">&#xE5CB;</span>'
			});

			m_controls.each(function(idx)
			{
				$(this).data("position", idx);
				$(this).click(function()
				{
					m_controls.removeClass("active");
					$(this).addClass("active");
					m_contents.hide();
					$(m_contents.get($(this).data("position"))).fadeIn("slow");
					$(m_contents.get($(this).data("position"))).trigger("tabshow");
					$("body").find(".bh-view-detail").remove();
					$("body").find(".bh-info-clone").remove();
					var newIndex = m_controls.index($(this)[0]);
					m_this.trigger("sliderTabs.tabTo", {"toIndex":newIndex});
					return false;
				});
			});
			
			var el = m_controls.filter(".active");
			if (el.length>0){
				el.click();
			}
			else {
				$(m_controls.get(0)).click();
			}
		}
	
		if (!m_this.data("__bh__sliderTabs__init"))
		{	
			m_this.data("__bh__sliderTabs__init", true);
			setup();
		}
		return this;
	};

	/**
	 * Slider Products
	*/
	FUI.plugins.sliderProducts = function()
	{
		var m_this = $(this);
		var m_links = null;
		var m_bg;
		var m_config = null;
		var m_bxSlider = null;
		var m_unlockTimeout = null;
		var m_isLocked = false;

		function setBg(){
			var height = m_this.find(".bh-linksProducts").innerHeight();
			m_bg.css("top", m_this.offset().top);
			m_bg.css("height", height);
		}

		function setup()
		{	
			m_links = m_this.find(".bh-linksProducts");

			m_config = {
				auto: false,
				controls: false,
				adaptiveHeight:true,
				infiniteLoop: false,
				speed: 300,
				hideControlOnEnd: true,
				useCSS: false,
				pagerCustom: m_links,
				onSlideBefore: function($slideElement, oldIndex, newIndex)
				{
					$("body").find(".bh-info-clone").remove();
					m_this.trigger("slider.slideTo", {"toIndex":newIndex});
				},
				touchEnabled:true, 
				swipeThreshold: 25,
				oneToOneTouch: false,
				startSlide: 0
			};

			m_bxSlider = m_this.find(".bh-ctnProducts").bxSlider(m_config);
			m_bg = $('<div class=\"bg-slider \"></div>');
			$("body").append(m_bg);
			window.setTimeout(setBg,1000);
			setBg();

			$(window).resize(function() {
				setBg();
			});

			$(window).scroll(function() 
			{
				lockXSwipe();
			});
		}

		function lockXSwipe()
		{
			if( m_isLocked )
			{
				return;
			}

			m_isLocked = true
			m_config.touchEnabled = false;
			m_config.startSlide =  m_bxSlider.getCurrentSlide();
			m_bxSlider.reloadSlider(m_config);
			
			if( m_unlockTimeout != null )
			{
				window.clearTimeout(m_unlockTimeout);
				m_unlockTimeout = null;
			}
			m_unlockTimeout = window.setTimeout(unlockXSwipe, 500);
		}

		function unlockXSwipe()
		{
			m_config.touchEnabled = true;
			m_config.startSlide =  m_bxSlider.getCurrentSlide();
			m_bxSlider.reloadSlider(m_config);
			m_isLocked = false;
		}
	
		if (!m_this.data("__bh__sliderProducts__init"))
		{	
			m_this.data("__bh__sliderProducts__init", true);
			setup();
		}
		return this;
	};

	/**
	 * Toggle
	*/
	FUI.plugins.toggle = function()
	{
		var m_this = $(this);
		var m_link = m_this.find(".bh-link-toggle");
		var m_ctn = m_this.find(".bh-ctn-toggle");
		
		function setup()
		{
			m_link.click(function()
			{

				var visible = !$(this).hasClass("open");
				
				if (visible)
				{
					$(this).addClass("open"); 
					m_ctn.slideDown();
				}
				else
				{
					$(this).removeClass("open"); 
					m_ctn.slideUp(); 
				}
				
				return false;
			});
		}
	
		if (!m_this.data("__bh__toggle__init"))
		{	
			m_this.data("__bh__toggle__init", true);
			setup();
		}
		return this;
	};

	/**
	 * More
	*/
	FUI.plugins.more = function()
	{
		var m_this = $(this);
		var m_link_more = m_this.find(".bh-link-more");
		var m_link_less = m_this.find(".bh-link-less");
		var m_hidden = m_this.find(".bh-element-hide");
		
		function setup()
		{
			m_hidden.css("display","none");
			m_link_less.css("display","none");

			m_link_more.click(function()
			{
				$(this).css("display","none"); 
				m_link_less.show();
				m_hidden.slideDown();
				return false;
			});

			m_link_less.click(function()
			{
				m_hidden.slideUp();
				m_link_more.show();
				m_link_less.css("display","none"); 
				return false;
			});
		}
	
		if (!m_this.data("__bh__more__init"))
		{	
			m_this.data("__bh__more__init", true);
			setup();
		}
		return this;
	};

	/**
	 * Info Box
	*/
	FUI.plugins.infoBox = function()
	{

		var m_this = $(this);
		var m_open = m_this.find(".bh-open");
		var m_close = m_this.find(".bh-close");
		var m_content = m_this.find(".bh-ctn");
		var m_window_width = null;

		var m_modal = null;
		var m_imInModal = m_this.parents(".modal");
		var m_modalLayout = m_this.data("modalLayout");
		var m_modalTitle =  m_this.data("modalTitle");
		var m_forceTab =  m_this.data("forceTab") === true;

	
		function openMeOverlay()
		{
			if(m_modal == null)
			{
				if(m_this.find(".bh-ctn").length > 1 || m_forceTab)
				{
					var mainHtmlTitle = m_this.find(".bh-open").html();
					if(m_this.find(".bh-open span").length > 0)
					{
						mainHtmlTitle = m_this.find(".bh-open span.label").html();
					}
					
					var contentList = [];
					m_this.find(".bh-ctn").each(function(ndx,val){
						var $this = $(this); 
						var htmlTitle = $this.find("h3").html();
						var $boxContent = $("<div></div>");
						$this.children().not("header").not(".link-close").each(function(ndx, element){
							$boxContent.append($(this));
						});
						var htmlContent = $boxContent.html();
						
						contentList.push({
							title:htmlTitle,
							content:htmlContent,
						});
						
					});
					
					var modalConfig = {
						title: m_modalTitle ? m_modalTitle : mainHtmlTitle,
						content: contentList,
						onShow: function($modalElement){
							$modalElement.find('[data-defer]').removeAttr("data-defer");
							FUI.enhance($modalElement);
						},
						layout:m_modalLayout,
						forceTab:m_forceTab
					};
					m_modal = new FDModal(modalConfig);
				}
				else
				{
					var htmlTitle = m_this.find(".bh-ctn h3").html();
					var $boxContent = $("<div></div>");
					var $boxContentList = m_this.find(".bh-ctn").children().not("header").not(".link-close").each(function(ndx, element){
						$boxContent.append($(this));
					});
					var htmlContent = $boxContent.html();
					
					var modalConfig = {
							title: m_modalTitle ? m_modalTitle : htmlTitle,
							content: htmlContent,
							onShow: function($modalElement){
								$modalElement.find('[data-defer]').removeAttr("data-defer");
								FUI.enhance($modalElement);
							},
							layout:m_modalLayout,
							forceTab:m_forceTab
					};
					m_modal = new FDModal(modalConfig);
				}
			}
			m_modal.show();
		}


		function openMeToggle()
		{
			m_content.slideDown(300, function(){
				m_open.hide();
			 });        
			m_open.hide();
			m_close.click(function()
			{
				m_content.slideUp(300, function(){
					m_open.show();
				 });        
				return false;
			});
			return false;
		}
		

		function setup()
		{

			m_window_width = $(window).width();
			
			m_open.on("click", function(e){

				var virtualpagename = $(this).data("virtualpagename");
				if (virtualpagename)
				{
					FDTracker.trackVirtualPageView((virtualpagename+"").split(" ").join("-").toLowerCase());
				}

				e.preventDefault();
				if(!m_imInModal.length >= 1){
					openMeOverlay();
				}
				else {
					openMeToggle();
				}
				
			});
		}
	
		if (!m_this.data("__bh__infoBox__init"))
		{	
			m_this.data("__bh__infoBox__init", true);
			setup();
		}
		return this;
	};

	/**
	 * Accordion
	*/
	FUI.plugins.accordion = function()
	{
		var m_this = $(this);
		var m_link = m_this.find(".bh-link-accordion");
		//var m_ctn = m_this.find(".bh-ctn-accordion");
		
		function setup()
		{
			m_link.click(function(){
			
				var active = !$(this).hasClass("active");

				if (active)
				{
					//m_ctn.slideUp(300);
					//m_link.removeClass("active");
					m_this.addClass("spacer-element");
					$(this).parents(".bh-panel-accordion").find(".bh-ctn-accordion").slideDown(300);
					$(this).addClass("active");

					var txt = $(this).text();
					txt = txt.split("\n").join(" ");
					txt = txt.split("\r").join(" ");
					txt = txt.split("\t").join(" ");
					while(txt.indexOf("  ")!=-1)
					{
						txt = txt.split("  ").join(" ");
					}
					txt = $.trim(txt);

					FDTracker.trackCustomEvent("apertura_accordion", {dettaglio_pagina:txt});
				}
				else
				{
					$(this).parents(".bh-panel-accordion").find(".bh-ctn-accordion").slideUp(300);
					$(this).removeClass("active");
					m_this.removeClass("spacer-element");
				}
				
				return false;
			});

			

		}
	
		if (!m_this.data("__bh__accordion__init"))
		{	
			m_this.data("__bh__accordion__init", true);
			setup();
		}
		return this;
	};

	/**
	 * Input focus
	*/
	FUI.plugins.inputFocus = function()
	{
		var m_this = $(this);
		var m_label = m_this.prev();
		
		function setup()
		{
			m_this.focus(function() {
				m_label.addClass("focus");
			});

			m_this.blur(function() {
				m_label.removeClass("focus");
			});
		}
	
		if (!m_this.data("__bh__inputFocus__init"))
		{	
			m_this.data("__bh__inputFocus__init", true);
			setup();
		}
		return this;
	};


	/**
	 * Select default
	*/
	FUI.plugins.selectDefault = function()
	{
		var m_this = $(this);
		var m_select = null;
		var m_wrapper;
				
		function setup()
		{
			m_select = m_this.find("select");
			var selectedValue = m_select.val();
			var selectedLabel = "";
			
			var m_options_list = "<ul class=\"select-list bh-options_list\">";
			
			var elements = m_select.children();


			for(var i=0; i<elements.length; i++ )
			{
				var children = $(elements[i]);

				if(children.is("option")){
					var optVal = children.val();
					var optLabel = $.trim(children.html());
					if (selectedValue==optVal)
						selectedLabel = optLabel;
					var options = "<li><a href=\"javascript:void(0);\" rel=\"" + optVal + "\"" + ((selectedValue==optVal) ? "class=\"active\"" : "") + ">" + optLabel + "</a></li>";
					m_options_list = m_options_list + options;
				}

				if(children.is("optgroup")){
					var optgrLabel = $.trim(children.attr("label"));
					var optgr = "<li><span>" + optgrLabel + "</span></li>";
					m_options_list = m_options_list + optgr;
					var optiongroupOptions = children.find("option");
					for(var ii=0; ii<optiongroupOptions.length; ii++ )
					{
						var optVal = $(optiongroupOptions[ii]).val();
						var optLabel = $(optiongroupOptions[ii]).html();
						if (selectedValue == optVal)
							selectedLabel = optLabel;
						var options = "<li><a href=\"javascript:void(0);\" rel=\"" + optVal + "\"" + ((selectedValue==optVal) ? "class=\"active\"" : "") + ">" + optLabel + "</a></li>";

						m_options_list = m_options_list + options;
					}
				}
			}
			
			$optFirst = selectedLabel=="" ? $(m_select.find("option")[0]).html() : selectedLabel;
			
			var m_link = "<a href=\"javascript:void(0);\" class=\"select bh-option\"><span class=\"val\">" + $optFirst + "</span> <span class=\"material-icons\">&#xE5C5;</span></a>";

			m_options_list = m_options_list + "</ul>";

			m_wrapper = $("<div class=\"select-deafult\"></div>");
			m_select.wrap(m_wrapper);
			m_select.after(m_link);
			m_select.after(m_options_list);

			var list = m_this.find(".bh-options_list");
			var link = m_this.find(".bh-option");

			link.click(function()
			{
				list.css("top", -(m_select.height()));
				list.slideDown("fast");
			});

			list.find("a").click(function()
			{
				list.find("a").removeClass("active");
				var val = $(this).html();
				list.hide();
				link.find(".val").html(val);
				$(this).addClass("active");

				var el = $(this).attr("rel");
				m_select.val(el).trigger('change');

			});	

			list.mouseleave(function(){
				$(this).css("display", "none");
			});

		}
	
		if (!m_this.data("__bh__selectDefault__init"))
		{	
			m_this.data("__bh__selectDefault__init", true);

			setup();
		}
		return this;
	};

	/**
	 * Select zoom
	*/
	FUI.plugins.selectRegion = function()
	{
		var m_this = $(this);
		var m_select = null;
		var m_preventChange = false;

		function setup()
		{
			m_select = m_this.find("select");
			var m_options_list = "<ul class=\"select-list bh-options_list\">";
			var elements = m_select.children();

			for(var i=0; i<elements.length; i++ )
			{
				var children = $(elements[i]);

				if(children.is("option")){
					var optVal = children.val();
					var optLabel = children.html();
					var options = "<li><a href=\"javascript:void(0);\" rel=\"" + optVal + "\">" + optLabel + "</a></li>";
					m_options_list = m_options_list + options;
				}

				if(children.is("optgroup")){
					var optgrLabel = children.attr("label");
					var optgr = "<li><span>" + optgrLabel + "</span></li>";
					m_options_list = m_options_list + optgr;
					var optiongroupOptions = children.find("option");
					for(var ii=0; ii<optiongroupOptions.length; ii++ )
					{
						var optVal = $(optiongroupOptions[ii]).val();
						var optLabel = $(optiongroupOptions[ii]).html();
						var options = "<li><a href=\"javascript:void(0);\" rel=\"" + optVal + "\">" + optLabel + "</a></li>";
						m_options_list = m_options_list + options;
					}
				}
			}
			
			var m_link = "<a href=\"javascript:void(0);\" class=\"select bh-option\"><span class=\"val\">quale regione?</span></a>";

			m_options_list = m_options_list + "</ul>";

			m_wrapper = $("<div class=\"select-zoom\"></div>");
			m_select.wrap(m_wrapper);
			m_select.after(m_link);
			m_select.after(m_options_list);
			

			var list = m_this.find(".bh-options_list");
			var link = m_this.find(".bh-option");
			var layer = "<div style=\"background-color:#324346;height: 100%;left: 0; opacity: 0.9; position: fixed; top: 0;width: 100%; z-index:100;\" class=\"bh-bg\"></div>";

			link.click(function()
			{
				list.css("top", -(m_select.height()));
				list.addClass("view");
				m_select.after(layer);
			});

			list.find("a").click(function()
			{
				list.find("a").removeClass("active");
				list.find("a").find(".icon").remove();
				var val = $(this).html();
				list.removeClass("view");
				link.find(".val").html(val);
				$(this).addClass("active");
				$(this).append("<span class=\"icon material-icons\">&#xE876;</span>");
				
				var el = $(this).attr("rel");
				m_select.val(el);
				$(".bh-bg").remove();
				m_select.trigger("customChange");
			});	

			m_select.bind("change", function(e){
				var value = $(this).val();
				list.find("a[rel='" + value + "']").click();
			});
		}
	
		if (!m_this.data("__bh__selectRegion__init"))
		{	
			m_this.data("__bh__selectRegion__init", true);

			setup();
		}
		return this;
	};

	/**
	 * List contents
	*/
	FUI.plugins.listContents = function()
	{
		var m_this = $(this);
		var m_link = null;
		var m_content = null;
		var m_window_width = null;

		function setup()
		{
			m_window_width = $(window).width();
			m_link = m_this.find(".bh-link");
			m_content = m_this.find(".bh-detail");
			

			if(FUI.getThreshold() >  1){
				m_link.first().addClass("active");	
				m_this.find(".bh-view-content").append(m_content.first().html()).hide().fadeIn("slow");
			}

			m_link.click(function(e){
				e.preventDefault();
				m_link.removeClass("active");
				m_this.find(".bh-view-content").empty();
				$(this).addClass("active");
				var txt = $(this).parent().find(".bh-detail").html();
				m_this.find(".bh-view-content").hide().append(txt).css("opacity",0).show();
				m_this.closest(".bh-bgStripe").trigger("resetBg");
				m_this.find(".bh-view-content").animate({opacity:'1'}, 600);

				if(FUI.getThreshold() <=  1){
					var top = $(this).offset().top;
					var title = $(this).html();

					$("body").find(".bh-view-detail").hide().remove();
					m_link.removeClass("active");

					var detail = $("<div class=\"box-detail bh-view-detail pos-fix\" style=\"top:" + top + "px;\">" +
					 	"<div class=\"int bh-view-int\">" +
							"<a href=\"javascript:void(0);\" class=\"close bh-close-detail\"><span class=\"material-icons\">&#xE14C;</span></a>" +
							"<div class=\"title\">" + title + "</div>" +
							"<div class=\"description bh-scrollbar\">" + txt + "</div>" +
						"</div>"+
						"</div>");

					$("body").append(detail);
					var h = detail.find(".bh-view-int").height()+30;
					detail.append("<div style=\"width:100%;background-color:#324346;position:relative;height:" + h + "px;\"></div>");
					FUI.enhance(detail);

					detail.find(".bh-close-detail").click(function(){
						detail.hide().remove();
						m_link.removeClass("active");
						return false;
					});
				}
				else {
					var scrollTo = m_this.offset().top;
					$("html, body").animate({scrollTop: scrollTo-150 }, '500', 'swing');
				}
				return false;
			});

			$(window).resize(function() {
				if(m_window_width == $(window).width()){
					return;
				}
				m_window_width = $(window).width();

				if(FUI.getThreshold() <=  1){
					$("body").find(".bh-view-detail").remove();
					m_link.removeClass("active");
				}
				else {
					var visible = !m_link.first().hasClass("active");
					if (visible)
					{
						m_link.removeClass("active");
						m_this.find(".bh-view-content").empty();
						m_link.first().addClass("active");	
						m_this.find(".bh-view-content").append(m_content.first().html()).hide().fadeIn("slow");
					}
					return;
				}
			});
		}
	
		if (!m_this.data("__bh__listContents__init"))
		{	
			m_this.data("__bh__listContents__init", true);
			setup();
		}
		return this;
	};

	/**
	 * Btn
	*/
	FUI.plugins.btn = function()
	{
		var m_this = $(this);

		function setup()
		{
			m_this.materialripple();
		}
	
		if (!m_this.data("__bh__btn__init"))
		{	
			m_this.data("__bh__btn__init", true);
			setup();
		}
		return this;
	};

	/**
	 * Switch View Listing
	*/
	FUI.plugins.switchViewList = function()
	{
		var m_this = $(this);
		var m_link = m_this.find(".bh-link");
		var m_content = m_this.find(".bh-content-view");
		
		function setup()
		{
			
			m_link.click(function(){

				var className = $(this).attr("data-view");
				var typeHorizontal = "horizontal";
				var typeVertical = "vertical";

				m_link.removeClass("active");
				m_content.find("ul").show();

				if (className == typeVertical)
				{
					$(this).addClass("active");
					m_content.removeClass(typeHorizontal);
					m_content.addClass(className);
				}
				else
				{
					$(this).addClass("active");
					m_content.removeClass(typeVertical);
					m_content.addClass(className);
				}
				
				return false;	
			});
		}
	
		if (!m_this.data("__bh__switchViewList__init"))
		{	
			m_this.data("__bh__switchViewList__init", true);
			setup();
		}
		return this;
	};

	/**
	 * Magic line
	*/
	FUI.plugins.magicline = function()
	{
		var m_this = $(this);
		var m_magicLine = null;
		var m_mainNav = null;
		var m_activeClassName = "magicLineSelected";
		var m_startActiveIndex = null;
		var m_relatedSliderProducts = null;
		var m_relatedSliderTabs = null;
		var m_relatedTabset = null;
		var m_timer = null;

		function initBar()
		{
			if( m_magicLine )
			{
				m_magicLine.remove();
			}

			m_magicLine = $("<li class='magic-line' style='display:none;'></li>");
			$selectedItem = m_this.find("." + m_activeClassName);
			if( $selectedItem.length != 0 )
			{
				m_magicLine.width($selectedItem.width())
        		m_magicLine.css("left", $selectedItem.position().left);
				m_magicLine.show();
			}
			m_this.append(m_magicLine);
		}

		function animateBar()
		{
			m_magicLine.show();
			$selectedItem = m_this.find("." + m_activeClassName);
			var leftPos = $selectedItem.position().left;
				var newWidth = $selectedItem.width();
				m_magicLine.stop().animate({
			 		left: leftPos,
			 		width: newWidth
			 	});
		}

		function moveBarTo(ndx)
		{
			m_this.find("li").removeClass(m_activeClassName);
			$(m_this.find("li").get(ndx)).addClass(m_activeClassName);
			animateBar();
		}

		function setup()
		{	
			m_startActiveIndex = m_this.data("activendx") ? m_this.data("activendx") : 0;
			$(m_this.find("li").get(m_startActiveIndex)).addClass(m_activeClassName);
			initBar();
			m_relatedSliderTabs = m_this.closest(".bh-sliderTabs");
			m_relatedSliderProducts = m_this.closest(".bh-sliderProducts");
			m_relatedTabset = m_this.closest(".bh-tabset");
			if( m_relatedSliderProducts || m_relatedSliderTabs || m_relatedTabset )
			{
				m_relatedSliderTabs.on("sliderTabs.tabTo", function(event, params)
				{
					moveBarTo(params.toIndex);
				});

				m_relatedSliderProducts.on("slider.slideTo", function(event, params)
				{
					moveBarTo(params.toIndex);
				});

				m_relatedTabset.on("tabset.tabTo", function(event, params)
				{
					moveBarTo(params.toIndex);
				});
				
			}
			else
			{
				m_this.find("li a").click(function(e) {
					$el = $(this);
					m_this.find("li").removeClass(m_activeClassName);
					$el.parent().addClass(m_activeClassName);
					animateBar();
				});
			}

			$(window).on("load", function() {
				initBar();
			});

			$(window).resize(function() {
				if(m_timer != null){
					window.clearTimeout(m_timer);
					m_timer = null;
				}
				m_timer = window.setTimeout(initBar, 100);
				
			});
		}
	
		if (!m_this.data("__bh__magicline__init"))
		{	
			m_this.data("__bh__magicline__init", true);
			setup();
		}
		return this;
	};

	/**
	 * Glossary
	 */
	FUI.plugins.glossary = function()
	{
		var m_this = $(this);
		var m_data = null;
		var m_filters = null;

		function matchFilter($item)
		{
			var itemFilter = $item.data("filter");
			for(var i=0; i<m_filters.length; i++)
			{
				var filter = m_filters[i];
				var element = filter.filterElement;
				var filters = filter.filterData;
				if( filters.indexOf(itemFilter) != -1)
				{
					$newItem = $item.clone();
					element.append($newItem);
					$item.remove();
					break;
				}
			}
		}

		function enhanceMe()
		{
			FUI.enhance(m_this.find(".bh-dataGlosaryDbTabs"));
		}
		
		function setup()
		{			
			var $filters = m_this.find(".bh-dataGlosaryDbFilter");
			m_filters = [];
			for( var i=0; i<$filters.length; i++)
			{
				var $filter = $($filters[i]).empty();
				var filterData = $filter.data("filter");
				if( filterData )
				{
					filterData = filterData.split(",");
					m_filters.push({filterElement:$filter, filterData:filterData});
				}
			} 

			m_data = m_this.find(".bh-glossaryDb").find(".bh-glossaryDbItem");
			for(var i=0; i<m_data.length; i++)
			{
				var $item = $(m_data[i]);
				matchFilter($item);
			}

			m_data.remove();
			enhanceMe();
		}
	
		if (!m_this.data("__bh__glossary__init"))
		{	
			m_this.data("__bh__glossary__init", true);
			setup();
		}
		return this;
	};

	/**
	 * Scrollbar
	*/
	FUI.plugins.scrollbar = function()
	{
		var m_this = $(this);
		
		function setup()
		{	
			try
			{
				/*
				if (FUI.getThreshold() >=2)
				{
					SimpleScrollbar.initEl(m_this.get(0));
					m_this.find(".ss-content").scroll(function()
					{
						m_this.trigger("customscroll");
					});
				}
				else
				{
					m_this.css("overflow", "auto");
					m_this.scroll(function()
					{
						m_this.trigger("customscroll");
					});
				}*/

				if (FUI.getThreshold() > 2)
					SimpleScrollbar.initEl(m_this.get(0));
				else
					m_this.css("overflow", "auto");
			}
			catch(e)
			{
				
			}
		}
		
		if (!m_this.data("__bh_scrollbar_init"))
		{
			m_this.data("__bh_scrollbar_init", true);
			setup();
		}
		return this;
	};

	/**
	 * Img Square
	*/
	FUI.plugins.imgSquares = function()
	{
		var m_this = $(this);
		
		function setup()
		{	
			m_this.find("li").each(function()
			{
				var a = $(this).find("a");
				if (a.length>0)
				{
					href = a.attr("href").split("../").join("");
					if ((document.location.href+"").indexOf(href)!=-1)
						$(this).remove();
				}
			});
		}
		
		if (!m_this.data("__bh_imgSquares_init"))
		{
			m_this.data("__bh_imgSquares_init", true);
			setup();
		}
		return this;
	};

	/**
	 * Filters Listing Solutions
	*/
	FUI.plugins.filterCategorySolutions = function()
	{
		var m_this = $(this);
		var m_categoryList = m_this.find(".bh-listingCategorySolutions");
		
	
		function setup()
		{

			m_categoryList.find("a").each(function()
			{
				$(this).click(function(){
				
					m_categoryList.find("a").removeClass("active");
					m_this.find(".bh-articleSolutions").hide();
	
					var cat = $(this).data("category");
	
					$(this).addClass("active");


					if(cat == "all"){
						m_this.find(".bh-articleSolutions").show();
					}
	
					m_this.find(".bh-articleSolutions").each(function()
					{
						var catArticle = $(this).data("category");
						if (catArticle == cat)
						{
							$(this).show();
						}
					});
				});
			});
		}
	
		if (!m_this.data("__bh__filterCategorySolutions__init"))
		{	
			m_this.data("__bh__filterCategorySolutions__init", true);
			setup();
		}
		return this;
	};

	/**
	 * Siff
	*/
	FUI.plugins.siffenhance = function()
	{
		var m_this = $(this);
		var TIMEOUT = 200;

		function setupFinalitaSelect()
        {
            m_this.bh_selectDefault();
        }

        function setupImportoInput()
        {
            var el = m_this.find("#findomestic_simulatore_javascript_importo");
            el.css("background-color", "transparent");
			el.attr("type", "tel");
            el.blur(setupImportoInput);
        }

        function setupCacolaButton()
        {
            var el = m_this.find("#findomestic_simulatore_javascript_calcola");
            el.attr("type", "submit").attr("value", "Calcola il prestito");
            el.addClass("btn bh-btn");
            el.click(setupImportoInput);
        }

        function setupFinalitaSelectError()
        {
            var el = m_this.find("#findomestic_simulatore_javascript_finalita_error");
            el.addClass("siff-sel-error");
        }

        function setupImportoInputError()
        {
            var el = m_this.find("#findomestic_simulatore_javascript_importo_error");
            el.addClass("siff-input-error");
        }
		
		function waitElement(selector, callback)
		{
			if (m_this.find(selector).length>0)
				callback(m_this.find(selector))
			else
				setTimeout(function(){waitElement(selector, callback)}, TIMEOUT);
		}

		function setup()
		{
			m_this.append("<style>#findomestic_simulatore_javascript_finalita{visibility:hidden}</style>");
			waitElement("#findomestic_simulatore_javascript_finalita", setupFinalitaSelect);
			waitElement("#findomestic_simulatore_javascript_importo", setupImportoInput);
			waitElement("#findomestic_simulatore_javascript_calcola", setupCacolaButton);
			waitElement("#findomestic_simulatore_javascript_finalita_error", setupFinalitaSelectError);
			waitElement("#findomestic_simulatore_javascript_importo_error", setupImportoInputError);
		}

		if (!m_this.data("__ui_siffenhance_setup"))
		{
			m_this.data("__ui_siffenhance_setup", true);
			setup();
		}	
		
		return this;
	}

	/**
	 * Count Down
	 */
	FUI.plugins.countdown = function()
	{	
		var CONFIG_DATA_SEPARATOR = ".";
		var REMAIN_DATA_SELECTOR_PREFIX = ".bh-timer-";
		var REFRESH_PERIOD = 1000;
		
		var m_this = $(this);
		var m_startDate = new Date().getTime();
		var m_endDate = new Date().getTime();
		var m_timeout = null;
		var m_runningPanel = null;
		var m_expiredPanel = null;
		var m_firstLoop = true;
		var m_dataAnimation = null;
		
		function configDateToDate(sDate)
		{
			var date = new Date();
			try
			{
				var particel = sDate.split(CONFIG_DATA_SEPARATOR);
				return new Date(
					parseInt(particel[0], 10), 
					parseInt(particel[1], 10) - 1, 
					parseInt(particel[2], 10), 
					parseInt(particel[3], 10), 
					parseInt(particel[4], 10), 
					parseInt(particel[5], 10)
				);
			}
			catch(e)
			{
				return date;
			}
		}
		
		function padNumber(str, padStr, length)
		{
			var nStr = str+"";
			while(nStr.length < length)
			{
				nStr = padStr + nStr;
			}
			return nStr;
		}
		
		function getRemains()
		{
			var startDate = new Date();
			var endDate = m_endDate;
			
			var today = new Date();

			if(m_firstLoop && m_dataAnimation){
				today.setMinutes(today.getMinutes() - 1);
			}

			var diffSeconds = Math.floor((endDate.getTime() - today.getTime())/1000);
			var diffMinutes = Math.floor(diffSeconds/60);
			var diffHours = Math.floor(diffMinutes/60);
			var diffDays = Math.floor(diffHours/24)
			
			var days = diffDays;
			var hours = diffHours-(days*24);
			var fullHours = diffHours;
			var minutes = diffMinutes-(days*24*60)-(hours*60);
			var seconds = diffSeconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
			
			var d = padNumber(days, "0", 2);
			var d1 = d[0];
			var d2 = d[1];

			var h = padNumber(hours, "0", 2);
			var h1 = h[0];
			var h2 = h[1];

			var full_h = padNumber(fullHours, "0", 2);
			var full_h1 = full_h[0];
			var full_h2 = full_h[1];

			var m = padNumber(minutes, "0", 2);
			var m1 = m[0];
			var m2 = m[1];

			return {
				days:padNumber(days, "0", 2),
				hours:padNumber(hours, "0", 2),
				minutes:padNumber(minutes, "0", 2),
				seconds:padNumber(seconds, "0", 2),
				fullHours:padNumber(fullHours, "0", 2),
				d1: d1,
				d2: d2,
				h1: h1,
				h2: h2,
				m1: m1,
				m2: m2,
				full_h1: full_h1,
				full_h2: full_h2,
			};
		}
		
		function getDelta()
		{
			var now = new Date().getTime();
			return m_endDate.getTime() - now;
		}
		
		function updateTimer() 
		{
			var delta = getDelta();
			if( delta<=0 )
			{
				stop();
				return;
			}
			var remains = getRemains();
			for(k in remains)
			{
				var valuePh = m_this.find(REMAIN_DATA_SELECTOR_PREFIX + k);
				var oldValue = valuePh.html();
				var newValue = remains[k];
				if( newValue != oldValue)
				{
					valuePh.html(newValue);
				}
			}

			var refreshPeriod = REFRESH_PERIOD;
			if(m_firstLoop && m_dataAnimation){
				refreshPeriod = REFRESH_PERIOD*3;
				m_firstLoop = false;
			}
			
			m_timeout = window.setTimeout(updateTimer, refreshPeriod);
		}
		
		function start()
		{
			updateTimer();
			m_runningPanel.show();
			m_expiredPanel.hide();
		}
		
		function stop()
		{
			if( m_timeout != null )
			{
				window.clearTimeout(m_timeout);
				m_timeout = null;
			}
			m_runningPanel.hide();
			m_expiredPanel.show();
		}
		
		
		function setup()
		{
			m_runningPanel = m_this.find(".bh-runningPanel").hide();
			m_expiredPanel = m_this.find(".bh-expiredPanel").hide();
			var sStartDate = m_this.data("startdate");
			var sEndDate = m_this.data("enddate");
			m_startDate = configDateToDate(sStartDate);
			m_endDate = configDateToDate(sEndDate);
			m_dataAnimation = m_this.data("animation");
			
			if( getDelta() <=0 )
			{
				stop();
			}
			else
			{
				start();
			}
		}
		
		if (!m_this.data("__ui_countdown_setup"))
		{
			m_this.data("__ui_countdown_setup", true);
			setup();
		}	
		
		return this;
	};

	/**
	 * layer Cookie Law
	 */
	FUI.plugins.layerCookieLaw = function()
	{
		var m_this = $(this);
		var m_status = false;
		var m_bg = "";
		var m_domain = document.domain+"";
		if (m_domain.indexOf("findomestic.it")!=-1)
			m_domain = "findomestic.it";
		
		function showLayer()
		{
			if (m_bg != "")
			{
				$("div.layer-cookie-law").addClass(m_bg);
			}
			
			$("div.layer-cookie-law").show();
		};
		
		function writeCookie()
		{
			$.cookie('findo-cookie-law','ok',{expires:365,path:"/",domain:m_domain});
			$(window).trigger("cookiesAccepted");
		};
		
		function setup()
		{	
			var src = m_this.attr("data-src");
			m_this.html("");
			m_this.addClass("layer-cookie-law");
			
			var doLoad = !m_this.data("__loaded");
			doLoad = doLoad && $.cookie('findo-cookie-law') != 'ok';
			doLoad = doLoad && ((document.location.href+"").indexOf("/cookie-policy.shtml")==-1);
				
			if (doLoad)
			{
				$.get(src, function(data)
				{	
					m_this.data("__loaded", true);

					if( data.indexOf("<html") != -1 )
					{
						$data = $('<div></div>').append($.parseHTML(data));
						if ($data.find(">div").length==0)
							return;
						data = $data.find(">div")[0].outerHTML;
					}
					
					var el = $(data);						
					
					m_status=true;
					
					if(!m_status){
						m_this.remove();
						return;	
					}
					
					m_bg = el.attr("data-bg");
					m_this.html(el.html());
					
					function onUserAction(e)
					{
						if ($.cookie('findo-cookie-law') == 'ok')
							return;
						
						var $target = $(e.target);
						var isBannerElement = ($target.parents().filter(m_this[0]).length > 0) || $target.is(m_this);
						var isCloseButton = isBannerElement && $target.hasClass("bh-close");
						if( !isBannerElement || isCloseButton )
						{
							writeCookie();
							m_this.hide();
							
							// track opt-in
							try
							{
								_satellite.track("profilazioneall");
								console.log("2.1 Opt-in informativa breve");
							}
							catch(e)
							{
							}
						};
						if(isCloseButton)
						{
							return false;
						}
					}
					
					var SCROLLOFFSET = 30;
					var _cst, _tst = 0;
					function onUserScroll(e)
					{
						_cst = $(this).scrollTop();
						if (_cst != _tst)
						{	
							var samount = Math.abs(_cst-_tst);
							if (samount> SCROLLOFFSET)
							{
								$(window).unbind("scroll", "onUserScroll");
								onUserAction(e);
							}
						}
					}
					
					
					$(window).scroll(onUserScroll);
					$("body, body a").click(onUserAction);
			
					showLayer();
				});
			};
		}
			
		if (!m_this.data("__ui_layerCookieLaw_setup"))
		{
			// replaced by onetrust
			/*
			m_this.data("__ui_layerCookieLaw_setup", true);
			setup();
			*/
		}	
		
		return this;
	};


	FUI.plugins.cookiepolicyswitch = function()
	{
		var m_this = $(this);
		var m_onvalue = $(this).attr("data-onvalue");
		var m_offvalue = $(this).attr("data-offvalue");
		var m_domain = document.domain+"";
		if (m_domain.indexOf("findomestic.it")!=-1)
			m_domain = "findomestic.it";
		
		var COOKIENAME = "findo-cp-" + m_offvalue;
		var COOKIEVALUE = "ok";
		
		function setup()
		{
			
			m_this.lc_switch();
			
			// initial setup
			var inactive = $.cookie(COOKIENAME) == "ok";
			if (inactive)
				m_this.lcs_off();
			else
				m_this.lcs_on();
			
			// opt in/out
			m_this.on('lcs-on', function() {
				try
				{
					_satellite.track(m_onvalue);
					$.cookie(COOKIENAME, "", {path: '/', expires: 365, domain: m_domain}); 
					console.log("Opt-in: " + m_onvalue);
				}
				catch(e)
				{
				}
			});
			
			// triggered each time a is unchecked
			m_this.on('lcs-off', function() {
				try
				{
					_satellite.track(m_offvalue);
					$.cookie(COOKIENAME, COOKIEVALUE, {path: '/', expires: 365, domain: m_domain});  
					console.log("Opt-out: " + m_offvalue);
				}
				catch(e)
				{
				}
			});
		}
		
		if (!m_this.data("__ui_cookiePolicySwitch_setup"))
		{
			// replaced by OneTrust
			/*
			m_this.data("__ui_cookiePolicySwitch_setup", true);
			setup();
			*/
		}	
		
		return this;
	};
	
	FUI.plugins.tlscheck = function()
	{	
		var m_this = $(this);
		var m_loadingPanel = m_this.find(".bh-tlscheck-loading");
		var m_okPanel = m_this.find(".bh-tlscheck-ok");
		var m_koPanel = m_this.find(".bh-tlscheck-ko");
		var m_tls_data;
		
		function setup()
		{
			FDTracker.getTLSInfo(function(json)
			{
				m_loadingPanel.hide();
				var rt = json.tls_version.toLowerCase().split(" ").join("");
				if (rt!="tls1.0")
					m_okPanel.show();
				else
					m_koPanel.show();
				FDTracker.trackTLSInfo();
			});
		}
		
		if (!m_this.data("__ui_tlscheck_setup"))
		{
			m_this.data("__ui_tlscheck_setup", true);
			setup();
		}	
		
		return this;
	}

	/**
	 * Layer focus bottom page
	*/
	FUI.plugins.layerFocus = function()
	{
		var m_this = $(this);
		var m_scroll = "";
		var m_height = m_this.height();
		
		function setup()
		{	

			m_this.css("bottom", -m_height);

			function setViewLayer(){
				m_scroll = $(window).scrollTop();
				
				if(m_scroll>300) {
					m_this.css({transform: "translateY(-" + m_height + "px)", transition:"transform 500ms ease-in-out"});
				}
				else {
					m_this.css({transform: "translateY(" + m_height + "px)", transition:"transform 500ms ease-in-out"});
				}
			}
			
			setViewLayer();
			$(window).scroll(function() {
				setViewLayer();
			});

			$(window).resize(function() {
				setViewLayer();
			});
		}
		
		if (!m_this.data("__bh_layerFocus_init"))
		{
			m_this.data("__bh_layerFocus_init", true);
			setup();
		}
		return this;
	};

	/**
	 * Anchors
	*/
	FUI.plugins.anchors = function()
	{
		var m_this = $(this);
		var m_header_height = $(".bh-header").height();
		var m_height = m_this.height();
		
		function setup()
		{	
			m_this.click(function()
			{
				if($(this).attr("href").indexOf("#")!=-1)
				{
					var id = ($(this).attr("href")+"").split("#");
					
					var window_top = $(window).scrollTop();

					if (id.length>0)
					{
						var el = $("#" + id[1]);
						if (el.length>0)
						{
							var to = (el.offset().top) - m_header_height;
							/*if(window_top > m_header_height){
								var to = (el.offset().top) - m_height;
							}
							else {
								var to = (el.offset().top) - m_header_height - m_height;
							}*/
							$("html,body").animate({scrollTop: to}, 1000);
						}
					}
				};
				return false;
			});
		}
		
		if (!m_this.data("__bh_anchors_init"))
		{
			m_this.data("__bh_anchors_init", true);
			setup();
		}
		return this;
	};

	/**
	 * Lazy load
	*/
	FUI.plugins.lazyload = function(refresh)
	{
		var m_intervall;
		var m_images;
		var m_baseUrl = null;

		function init()
		{
			if (refresh)
				window.__image__lazyload__init = false;
			if (window.__image__lazyload__init)
				return;

			window.__image__lazyload__init = true;

			// base url
			$("link").each(function()
			{
				if ((""+$(this).attr("href")).indexOf("res/css/findomestic.css")!=-1)
				{
					m_baseUrl = $(this).attr("href").split("res/css/findomestic.css").join("");
				}
			});

			// start
			m_images = $(".bh-lazyload");
			m_interval = setInterval(check, 500);

		}

		function inView(el)
		{
			if (!el.is(":visible"))
				return false;

			var elementTop = el.offset().top;
			var elementBottom = elementTop + $(this).outerHeight();

			var viewportTop = $(window).scrollTop();
			var viewportBottom = viewportTop + $(window).height();

			return elementBottom > viewportTop && elementTop < viewportBottom;
		}

		function check()
		{
			var cnt = 0;
			m_images.each(function()
			{
				if ($(this).data("loaded"))
				{
					cnt++;
				}
				else if (inView($(this)))
				{
					// fix src
					var src = $(this).data("src");
					var needle = "media/";
					if (src.indexOf(needle)!=-1 && m_baseUrl!=null)
					{
						src = m_baseUrl + needle + src.substring(src.indexOf(needle) + needle.length);
					}

					var bg = $(this).data("mode") == "background";
					if (bg)
						$(this).css("background-image", "url('" + src + "')");
					else {
						$(this).on("error",function(){
							$(this).attr('style', 'display:none !important');
						});
						$(this).attr("src", src);
					}

					$(this).data("loaded", true)
					cnt++;
				}
			});

			if (cnt == m_images.length)
			{
				console.log("Lazy load: done");
				clearInterval(m_interval);
			}
		}

		init();
		
		return this;
	};

	FUI.plugins.alertmessage = function()
	{
		var m_this = $(this);

		var m_reasons = {
			tls: function(cb)
			{
				$.get( document.location, function(content, textStatus, jqXHR) 
				{
					var headers = jqXHR.getAllResponseHeaders().toLowerCase();

					var data = new Object();
					var aHeaders = headers.split('\n');
					var i =0;
					for (i= 0; i < aHeaders.length; i++) {
						var thisItem = aHeaders[i];
						var key = $.trim(thisItem.substring(0, thisItem.indexOf(':')));
						var value = $.trim(thisItem.substring(thisItem.indexOf(':')+1));
						data[key] = value;
					}
					var retVal = false;
					if (data.tlsversion && data.tlsversion == "tlsv1")
						retVal = true;

					cb(retVal);
				});
			}
		}

		function displayMessage()
		{
			var content = $(m_this.text());
			m_this.after(content);

			$(window).scroll(function()
			{
				if ($(window).scrollTop()>0)
					content.addClass("top");
				else
					content.removeClass("top");
			});
		}
		
		function setup()
		{	
			var reason = m_this.data("reason");

			// only hp
			var pn = document.location.pathname+"";
			if (pn=="/" || pn=="/index.shtml")
			{
				if (!reason)
					displayMessage();
				else if (m_reasons[reason])
				{
					try
					{
						m_reasons[reason](function(display)
						{
							if (display)
								displayMessage();
						});
					}
					catch(e)
					{

					}
				}
			}
		}
		
		if (!m_this.data("__bh_alertmessage_init"))
		{
			m_this.data("__bh_alertmessage_init", true);
			setup();
		}
		return this;
	}
	
	FUI.plugins.campaignvideo = function()
	{
		var m_this = $(this);
		var m_player;
		var m_videoId;
		var m_image;
		var m_videoCont;
		var m_ratio = 0;
		var m_duration = 0;
		var m_loaded = false;
		var m_fallback = false;

		var STOPPING_TRESHOLD = 1.1;
		var RESIZE_OFFSET = 8;

		function setup()
		{	
			m_fallback = /iPad|iPhone|iPod|Android/i.test(navigator.userAgent) && !window.MSStream ||
						window.__youtubeapi_error;

			m_image = m_this.data("image");
			m_videoId = m_this.data("video") + "";
			if (m_videoId.indexOf("/")>0)
			{
				var arr = m_videoId.split("/");
				m_videoId = arr[arr.length-1];
			}
			if (m_videoId.indexOf("?v=")>0)
			{
				var arr = m_videoId.split("?v=");
				m_videoId = arr[arr.length-1];
			}
			
			m_ratio = m_this.data("width") / m_this.data("height");
			
			if (m_fallback)
				loadImage();
			else
				loadVideo();
		}

		function resize()
		{
			var w = m_this.width();
			if (m_ratio!=0)
			{
				var h = m_this.width()/m_ratio;
				var fh = (w * 9 / 16);
				m_this.height(h);
				if (m_this.find("iframe").length>0)
				{
					m_this.find("iframe").width(w+RESIZE_OFFSET);
					m_this.find("iframe").height(fh).css("top", -(fh-h)/2);
					m_this.find("iframe").height(fh).css("left", -(RESIZE_OFFSET/2));
				}
			}
		}

		function loadImage()
		{
			if (m_image)
			{
				resize();
				$(window).resize(resize);
				var bg = 
				console.log(bg);
				m_this.css("background", "transparent url('" + m_image + "') center center / cover no-repeat");
			}
			else
				m_this.hide();
		}

		function loadVideo()
		{
			m_videoCont = $("<div/>");
			m_this.append(m_videoCont);

			if (window.YT && window.YT.Player)
			{
				if (m_loaded)
					return;

				m_loaded = true;
				
				m_player = new YT.Player(m_videoCont.get(0), {
					videoId: m_videoId,
					width:"100%",
					playerVars: {
						controls: 0,
						disablekb: 1,
						rel:0,
						autoplay:1,
						fs : 0,
						wmode: 'transparent',
						showinfo:0,
						autohide:1,
						mute:1
					},
					events: {
						'onReady': function() {
							m_duration = m_player.getDuration();
							console.log(m_duration);
							resize();
							$(window).resize(resize);
							setInterval(function()
							{
								var cTime = m_player.getCurrentTime();
								if (cTime>0)
								{
									if ( (m_duration - cTime) <= STOPPING_TRESHOLD )
									{
										m_player.seekTo(0);
										//if (m_player.getPlayerState()!=1)
										//	m_player.playVideo(0);
									}
								}
								else
								{
									m_player.playVideo();
								}
							}, 100);
						},
						'onStateChange': function(event)
						{
							if (event.data == YT.PlayerState.ENDED) 
							{
								m_player.playVideo()
							}
						}
					}
				});
			}
			else
				setTimeout(loadVideo, 50);
		}
		
		if (!m_this.data("__bh_campaignvideo_init"))
		{
			if (!window.__youtubeapi_loaded)
			{
				window.__youtubeapi_loaded = true;
				var tag = document.createElement('script');
				tag.src = "https://www.youtube.com/iframe_api";
				tag.onerror = function() { 
					window.__youtubeapi_error = true;
					console.log("Youtube api load error")
					loadImage();
				};
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			}

			m_this.data("__bh_campaignvideo_init", true);
			setup();
		}
	}

	/*
	 * Simulatore
	 */
	FUI.plugins.simulatore = function()
	{
		var m_this = $(this);
		var m_mobileMaxThreshold = 1;
		var m_simulatoreConfigparamPrefix = "smcfg";
		var m_modeAssicurazioneDesktop;
		var m_modeAssicurazioneMobile;
		var m_modeOverlayMobile;
		
		var m_simulatoreDesktop;
		var m_simulatoreMobile;
		
		var m_lastThreshold;
		
		var m_$panelSimulatore;
		var m_$panelOpenSimulatore;
		var m_$openSimulatoreOverlayBtn;
		var m_$modalSimulatoreOverlay;
		var m_$modalSimulatoreOverlayBg;
		
		var m_$modalAssicurazioneInfoOverlay;
		var m_$modalAssicurazioneInfoOverlayBg;
		
		var m_simulatoreHtml;
		var m_simulatoreTitleText;
		
		var m_$openSimulatoreBtn;
		var m_$assicurazioneHelpBtn;
		
		var m_overlaySimulatoreOpen;
		
		function getBaseSimulatoreConfig()
		{
			var simulatoreConfig = {};
			//get the data params for the simulatore
			$.each(m_this.data(), function(ndx, value)
			{
				if(ndx.indexOf(m_simulatoreConfigparamPrefix) == 0 )
				{
					var paramName = ndx.substr(m_simulatoreConfigparamPrefix.length);
					paramName = paramName.charAt(0).toLowerCase() + paramName.slice(1);
					simulatoreConfig[paramName] = value;
				}
			});
			return simulatoreConfig;
		}
		
		function closeSimulatorOverlay()
		{
			if(m_simulatoreOverlayModal != null)
			{
				m_simulatoreOverlayModal.close();
			}
		}
		
		var m_simulatoreOverlayModal = null;
		function openSimulatoreOverlay()
		{
			
			if(m_simulatoreOverlayModal == null)
			{
				var $content = $("<div></div>");
				$content.html(m_simulatoreHtml);
				$content.find(".bh-simulatoreHeader").remove();
				
				//$content.find(".bh-selectDefault").attr("data-defer", false);
				//$content.find(".bh-currencyInput").attr("data-defer", false);
				$content.find('[data-defer]').removeAttr("data-defer");
				
				var title = m_simulatoreTitleText;
				var content = $content.html();
				
				function onInit($modalElement)
				{
					$modalElement.off("FDSimulator.onInit").on("FDSimulator.onInit", function(){
						FUI.enhance($modalElement);
						$modalElement.find(".bh-assicurazioneHelpBtn").on("click", function(e)
						{
							e.preventDefault();
							openAssicurazioneInfoOverlay();
						});
						m_simulatoreOverlayModal.show();
					});
					var simulatoreConfig = getBaseSimulatoreConfig();
					simulatoreConfig["modeAssicurazione"] = m_modeAssicurazioneMobile;	
					m_simulatoreMobile = new FDSimulator($modalElement, simulatoreConfig);
				}
				
				var modalConfig = {
						title:title,
						content:content,
						onInit:onInit,
						noTextContent:true
				};
				
				m_simulatoreOverlayModal = new FDModal(modalConfig);
			}
			else
			{
				m_simulatoreOverlayModal.show();
			}
		}
		
		function closeAssicurazioneInfoOverlay()
		{
			if(m_assicurazioneOverlayModal != null)
			{
				m_assicurazioneOverlayModal.close();
			}
		}
		
		var m_assicurazioneOverlayModal = null;
		function openAssicurazioneInfoOverlay()
		{
			if(m_assicurazioneOverlayModal == null)
			{
				var modalConfig = {
						title: m_this.find(".bh-assicurazioneInfoTitle").html(),
						content: m_simulatoreDesktop.getAssicurazioneHelpContent(),
				};
				m_assicurazioneOverlayModal = new FDModal(modalConfig);
			}
			m_assicurazioneOverlayModal.show();
		}
		
		function initEvents()
		{
			m_this.on("FDSimulator.onInit", function(){
				FUI.enhance(m_this);
				m_this.fadeIn();
			});
			
			m_$openSimulatoreOverlayBtn.on("click", function(e){
				e.preventDefault();
				openSimulatoreOverlay();
			});
			
			m_$assicurazioneHelpBtn.on("click", function(e){
				e.preventDefault();
				openAssicurazioneInfoOverlay();
			});
			
			
			$(window).resize(function(){
				var currentUiThreshold = FUI.getThreshold();
				if(currentUiThreshold != m_lastThreshold)
				{
					resetLayout();
				}
			});
		}
		
		
		
		function initObjects()
		{
			m_$panelSimulatore = m_this.find(".bh-panelSimulatore");
			m_$panelOpenSimulatore = m_this.find(".bh-panelOpenSimulatore");
			m_$openSimulatoreBtn = m_this.find(".bh-openSimulatoreBtn");
			m_$openSimulatoreOverlayBtn = m_this.find(".bh-openSimulatoreOverlayBtn");
			m_$assicurazioneHelpBtn = m_this.find(".bh-assicurazioneHelpBtn");
			
			m_simulatoreHtml = m_$panelSimulatore.html();
			m_simulatoreTitleText = m_$panelSimulatore.find(".bh-simulatoreTitle").html();
		}
		
		function initSimulatore()
		{
			var simulatoreConfig = getBaseSimulatoreConfig();
			var currentUiThreshold = FUI.getThreshold();
			if(currentUiThreshold >m_mobileMaxThreshold)
			{
				simulatoreConfig["modeAssicurazione"] = m_modeAssicurazioneDesktop;
			}
			else
			{
				simulatoreConfig["modeAssicurazione"] = m_modeAssicurazioneMobile;
			}
			m_simulatoreDesktop = new FDSimulator(m_$panelSimulatore, simulatoreConfig);
		}
		
		function resetLayout()
		{
			var currentUiThreshold = FUI.getThreshold();
			if( m_modeAssicurazioneDesktop != m_modeAssicurazioneMobile)
			{
				if(currentUiThreshold >m_mobileMaxThreshold)
				{
					m_simulatoreDesktop.resetAssicurazioneMode(m_modeAssicurazioneDesktop);
				}
				else
				{
					m_simulatoreDesktop.resetAssicurazioneMode(m_modeAssicurazioneMobile);
				}	
			}
			m_lastThreshold = currentUiThreshold;
			
			closeSimulatorOverlay();
			closeAssicurazioneInfoOverlay();
			initLayout();
		}
		
		function initLayout()
		{
			m_$panelSimulatore.hide();
			m_$panelOpenSimulatore.hide();
			m_$openSimulatoreBtn.hide();
			
			if(!m_modeOverlayMobile)
			{
				m_$panelSimulatore.show();
			}
			else
			{
				var currentUiThreshold = FUI.getThreshold();
				if(currentUiThreshold >m_mobileMaxThreshold)
				{
					m_$panelSimulatore.show();
				}
				else
				{
					m_$panelOpenSimulatore.show();
				}
			}
		}
	
		function setup()
		{
			m_modeAssicurazioneDesktop = m_this.data("modeAssicurazioneDesktop") ? m_this.data("modeAssicurazioneDesktop") : "alwaysOff";
			m_modeAssicurazioneMobile = m_this.data("modeAssicurazioneMobile") ? m_this.data("modeAssicurazioneMobile") : "auto";
			m_modeOverlayMobile  = m_this.data("modeOverlayMobile") && m_this.data("modeOverlayMobile") == true;
			m_lastThreshold = FUI.getThreshold();
			
			initObjects();
			initEvents();
			initSimulatore();
			initLayout();
		}
		
		if (!m_this.data("__ui_simulator_setup"))
		{
			m_this.data("__ui_simulator_setup", true);
			setup();
		}	
		return this;
	}

	/*
	 * Currency input
	 */
	FUI.plugins.currencyInput = function()
	{
		var m_this = $(this);
		var m_input;
		var m_regExp = '^[0-9.]*(,[0-9]{0,2})?$';
		
		function initEvents()
		{
			m_input.on("blur", function(){
				var rx = new RegExp(m_regExp);
				var value = $(this).val();
				
				if (value.match(rx)) 
				{
			        if (value == "") 
			        {
			            return;
			        }
			        $(this).val(FDJSUtil.formatCurrency(this.value));
			    }
				else
				{
					$(this).val("");
				}
			});
			
			m_input.on("keypress", function(e){
				if (e == null) e = window.event;
			    var charCode = (e.which) ? e.which : e.keyCode;
				
				if(charCode == 13)
		    	{
			    	m_this.blur();
			    	return true;
		    	}
			    if(charCode == 32)
				{
					return false;
				}
			    if (charCode < 48) 
			    {
			        return true;
			    }
			    if (48 <= charCode && charCode <= 57) 
			    {
			        return true;
			    }
			    switch (charCode) 
			    {
			        case 44:
			        case 46:
			            return true;
			        default:
			            return false;
			    }
			});
		}
				
		function setup()
		{
			m_input = m_this;
			if(m_this.prop("tagName").toLowerCase() != "input")
			{
				m_input = $(m_this.find("input").get(0));
			}
			
			if(FDJSUtil.isMobile())
			{
				m_input.attr("type", "tel");
				m_input.attr("type", "tel");
			}
			initEvents();
		}
		
		if (!m_this.data("__ui_currency_input_setup"))
		{
			m_this.data("__ui_currency_input_setup", true);
			setup();
		}	
			
		return this;
	}

	FUI.plugins.checkSwitch = function()
	{	
		var m_this = $(this);
		var m_check = m_this.find(".bh-checkbox");
		var m_enabled = m_this.find(".bh-switch-enabled");
		var m_disbled = m_this.find(".bh-switch-disabled");
		
		function setup()
		{
			m_disbled.hide();
			m_check.on( "click", function(){
				var $check = m_check.prop("checked");
				if($check){
					m_enabled.hide();
					m_disbled.show()
				}
				else {
					m_enabled.show();
					m_disbled.hide()
				}
			});
		}
		
		if (!m_this.data("__ui_checkSwitch_setup"))
		{
			m_this.data("__ui_checkSwitch_setup", true);
			setup();
		}	
		
		return this;
	}


	FUI.plugins.track = function()
	{	
		var m_this = $(this);
		var m_event = m_this.data("event");
		var m_trackEvent = m_this.data("track-event");
		var m_digitalData = m_this.data("digital-data");
		
		function setup()
		{
			m_this.bind(m_event, function(evt)
			{
				var data = m_digitalData
				if (data == null && !$.isPlainObject(data))
					data = {};
				data = JSON.parse(JSON.stringify(data));

				// trigger from header sticky
				if (evt.isTrigger!==undefined)
				{
					for (var k in data)
					{
						data[k] = data[k] + " SH";
					}
				}
				
				FDTracker.trackEvent(m_trackEvent, data);
			});
		}
		
		if (!m_this.data("__ui_track_setup"))
		{
			m_this.data("__ui_track_setup", true);
			setup();
		}	
		
		return this;
	}

	FUI.plugins.cqssimulator = function()
	{
		var m_this = $(this);
		var TVEI_DEFAULT = "1003700994";
		var PROVENIENZA_DEFAULT = "";
		var m_baseUrl = "/";

		function loadResource(url, dataType, cb)
		{
			if (!FUI.plugins.cqssimulator.__loaded)
			{
				FUI.plugins.cqssimulator.__loaded = {};
			}

			if (!FUI.plugins.cqssimulator.__loaded[url])
			{
				FUI.plugins.cqssimulator.__loaded[url] = true;

				$.ajax({
					url: m_baseUrl + url,
					dataType: dataType,
					cache: false,
					success: function (data) {

						
						cb(data);

					},
					error: function(a,b,c)
					{
						console.log(a,b,c);
					}
				});
			};
		}

		function setup()
		{	
			var params = {
				tvei: m_this.data("tvei") ? m_this.data("tvei") : TVEI_DEFAULT,
				provenienza: m_this.data("provenienza") ? m_this.data("provenienza") : PROVENIENZA_DEFAULT,
			}

			loadResource("res/js/simulatore_cqs.js", "script", function(s)
			{
				loadResource("common/simulatore_cqs.shtml", "html", function(h)
				{
					$("body").append(h);
					FUI.enhance($(".bh-cqs-modal"));
				});
			});

			m_this.click(function()
			{
				/*
				var txt = $(this).text();
				txt = txt.split("\n").join(" ");
				txt = txt.split("\r").join(" ");
				txt = txt.split("\t").join(" ");
				while(txt.indexOf("  ")!=-1)
				{
					txt = txt.split("  ").join(" ");
				}
				txt = $.trim(txt);
				FDTracker.trackVirtualPageView(txt);
				*/
				FDTracker.trackCustomEvent("pageview", {pageName:"simulatore-richiesta-cessione-del-quinto:inizio", isVirtual:true})

				var domObj = $(".bh-cqs-modal");
				new CqsSimulator(domObj, params);
				return false;
			});
		}
		
		if (!m_this.data("__bh_cqssimulator_init"))
		{
			m_this.data("__bh_cqssimulator_init", true);
			setup();
		}

		return this;
	}

	FUI.plugins.siffpanel = function()
	{
		var m_this = $(this);

		function setup()
		{
			if ((document.location+"").indexOf("/landing_page") == -1)
			{	
				m_this.bh_siffpanel_v2();
			}
			else
			{
				m_this.bh_siffpanel_v1();
			}
		}

		if (!m_this.data("__bh_siffpanel_init"))
		{
			m_this.data("__bh_siffpanel_init", true);
			setup();
		}

		return this;
	}

	FUI.plugins.siffpanel_v2 = function()
	{
		var m_this = $(this);
		var VENDORID_DEFAULT = "3095619";
		var PROVENIENZA_DEFAULT = "";
		var m_params;

		function setup()
		{
			var tvei = m_this.data("tvei") ? (m_this.data("tvei")+"") : "";
			if (tvei=="") tvei = window.__tvei ? window.__tvei : "";

			var prf = m_this.data("prf") ? (m_this.data("prf")+"") : "";
			if (prf=="") prf = window.__prf;

			m_params = {
				vendorId: tvei!="" ? tvei.substring(3) : VENDORID_DEFAULT,
				prf: prf,
				defaultGroup:m_this.data("material") || "",
				abtest: m_this.data("abtest")
			};

			if (!FUI.plugins.siffpanel_v2.__loaded)
			{
				FUI.plugins.siffpanel_v2.__loaded = true;
				$.getScript("/res/js/simulatore_finanziario_v2.js?_=" + new Date().getTime(), init)
			}
			else
			{
				init();
			}
		}

		function  init()
		{
			m_this.click(function()
			{
				new FDSiff.App(m_params);
				return false;
			});
		}

		if (!m_this.data("__bh_siffpanel_v2_init"))
		{
			m_this.data("__bh_siffpanel_v2_init", true);
			setup();
		}

		return this;
	}

	FUI.plugins.siffpanel_v1 = function()
	{
		var m_this = $(this);
		var VENDORID_DEFAULT = "3095619";
		var PROVENIENZA_DEFAULT = "";
		var m_baseUrl = "";
		var m_html = "";

		function loadResource(url, dataType, cb)
		{
			if (!FUI.plugins.siffpanel.__loaded)
			{
				FUI.plugins.siffpanel.__loaded = {};
			}

			if (!FUI.plugins.siffpanel.__loaded[url])
			{
				$.ajax({
					url: m_baseUrl + url,
					dataType: dataType,
					cache: false,
					success: function (data) {
						
						FUI.plugins.siffpanel.__loaded[url] = data;
						cb(data);

					},
					error: function(a,b,c)
					{
						console.log(a,b,c);
					}
				});
			}
			else
			{
				cb(FUI.plugins.siffpanel.__loaded[url]);
			}
		}

		function init()
		{
			var defaultGroup = m_this.data("material") || "";

			var resources = {
				html:"/common/simulatore_finanziario_v0.shtml",
				js:"/res/js/simulatore_finanziario_v0.js",
			}

			loadResource(resources.html, "html", function(ht)
			{
				FUI.plugins.siffpanel.html = ht;
				loadResource(resources.js, "script", function(h){});
			});
		}

		function setup()
		{	
			var tvei = m_this.data("tvei") ? (m_this.data("tvei")+"") : "";
			if (tvei=="") tvei = window.__tvei ? window.__tvei : "";

			var prf = m_this.data("prf") ? (m_this.data("prf")+"") : "";
			if (prf=="") prf = window.__prf;

			var params = {
				vendorId: tvei!="" ? tvei.substring(3) : VENDORID_DEFAULT,
				prf: prf,
				defaultGroup:m_this.data("material") || "",
				abtest: m_this.data("abtest")
			}

			m_this.click(function()
			{
				if ($(".bh-siff-modal").length>0) 
				{
					$(".bh-siff-modal").remove();
				}
				$("body").append('<div class="bh-siff-modal" style="display:none">' + FUI.plugins.siffpanel.html + '</div>');
				FUI.enhance($(".bh-siff-modal"));

				var domObj = $(".bh-siff-modal");

				new SiffPanel(domObj, params);
				
				return false;
			});
		}
		
		if (!FUI.plugins.siffpanel.__init)
		{
			FUI.plugins.siffpanel.__init = true;
			init();
		}

		if (!m_this.data("__bh_siffpanel_v1_init"))
		{
			m_this.data("__bh_siffpanel_v1_init", true);
			setup();
		}

		return this;
	}

	FUI.plugins.anticipocontanti = function()
	{
		var m_this = $(this);
		var TVEI = "1008902991";
		
		function setup()
		{	
			m_params = {
				tvei: TVEI
			}

			if (!FUI.plugins.anticipocontanti.__loaded)
			{
				FUI.plugins.anticipocontanti.__loaded = true;
				$.getScript("/res/js/anticipo_contanti.js?_=" + new Date().getTime(), init)
			}
			else
			{
				init();
			}
		}

		function init()
		{
			m_this.click(function()
			{
				new FDAC.App(m_params);
				return false;
			});
		}

		if (!m_this.data("__bh_anticipocontanti_init"))
		{
			var s = "<style>body:has(#fdacapp)>.bh-content, body:has(#fdacapp)>header.header, body:has(#fdacapp)>aside { display:none }</style>";
			$("body").append(s);
			m_this.data("__bh_anticipocontanti_init", true);
			setup();
		}

		return this;
	}

	FUI.plugins.optanonconsentid = function()
	{
		var m_this = $(this);

		function writeConsentId()
		{
			var cookie = $.cookie("OptanonConsent");
			var obj = {};
			if (cookie!=null)
			{
				var v = cookie.split("&");
				for (var ii=0;ii<v.length;ii++)
				{
					cp = v[ii].split("=");
					obj[cp[0]] = decodeURIComponent(cp[1]);
				}
			}
			if (obj.consentId)
			{
				m_this.text(obj.consentId);
			}
		}
		
		function setup()
		{	
			writeConsentId();
			$("#divEventHolder").bind("OneTrustGroupsUpdated", function()
			{
				writeConsentId();
			});
		}
		
		if (!m_this.data("__bh_optanonconsentid_init"))
		{
			m_this.data("__bh_optanonconsentid_init", true);
			setup();
		}

		return this;
	}

	FUI.plugins.assistedscroll = function()
	{	
		var HEIGHT_TRESHOLD = 600;

		var m_this = $(this);
		var m_moving = false;
		// var m_container = $('.bh-content');
		var m_container = $('body');
		var m_window = $(window);
		var m_htmlbody = $("html,body");
		var m_offset = parseInt((m_this.css("padding-top")+"").split("px").join(""), 10);
		var m_oldScrollTop = 0;
		var m_scrollTop = 0;
		var m_panel = null;
		var m_arrow = m_this.find(".bh-arrow");
		var m_direction;
		var SESSIONSTORAGEKEY = "_fdhpst";

		var m_tracking = {
			position:1,
			dettaglio_pagina: ""
		}

		function setup()
		{
			// track on page change and window open - start
			m_window.on("beforeunload", function()
			{
				track();
			});

			$("a").each(function()
			{
				if ($(this).attr("target")=="_blank" ||
					(($(this).attr("onclick")+"").indexOf("window.open")!=-1))
				{
					$(this).click(track);
				}
			});
			// track on page change and window open - end

			function setTrackingData(panel)
			{
				if (panel!==null)
				{
					m_tracking.position = panel.data("index")+1;
					m_tracking.dettaglio_pagina = $.trim(panel.find(".bh-trackinglabel").text());
				}
				else
				{
					m_tracking.position = 1;
					m_tracking.dettaglio_pagina = "";
				}
			}

			function track()
			{
				if (m_tracking.dettaglio_pagina!="")
				{
					FDTracker.trackCustomEvent("panel_link", m_tracking);
				}
			}

			function saveScrolltop(scrolltop)
			{
				if (window.sessionStorage)
				{
					window.sessionStorage.setItem(SESSIONSTORAGEKEY, scrolltop);
				}
			}

			function getScrolltop()
			{
				if (window.sessionStorage)
				{
					var st = window.sessionStorage.getItem(SESSIONSTORAGEKEY);
					if (!isNaN(st))
					{
						return st;
					}
				}
				return 0;
			}

			m_htmlbody.animate({scrollTop:getScrolltop()}, 10, function()
			{
				m_this.find(".bh-assistedscroll-item").each(function(idx)
				{
					$(this).data("index", idx);
					
					if (idx!=0)
					{
						$(this).find(".animated-intro").hide();
					}

					if (idx==0)
					{
						setTrackingData($(this));
					}

					new Waypoint.Inview({
						element: $(this),
						enter: function(direction) {
							
							if (direction=="down")
							{
								if ($(this.element).data("index")!=0)
								{
									$(this.element).find(".animated-intro").show();
									$(this.element).addClass("animated-card animated-title");
								}
							}
							
						},
						// context: m_container.get(0),
						context: window,
						offset:85
					})
					

					new Waypoint.Inview({
						element: $(this),
						enter: function(direction) {
							
							m_panel = $(this.element);
							m_direction = direction;
							m_scrollTop = m_panel.offset().top + m_container.scrollTop() - m_offset;
							
						},
						exit: function(direction) {
					
							m_panel = $(this.element);
							m_direction = direction;
							m_scrollTop +=10;
						},
						// context: m_container.get(0),
						context: window,
						offset:70
					})
				});

				function doAnimate()
				{
					setTrackingData(m_panel);
					
					if (m_panel!=null)
					{
						if (FUI.mobile)
						{
							if ((m_panel.data("mobile")+"")==="false") return;
						} 
						else
						{
							if ((m_panel.data("desktop")+"")==="false") return;
						}
					}

					var cst = Math.floor(m_window.scrollTop());
					var st = Math.floor(m_scrollTop);

					var move = (
						!m_moving &&
						((m_direction=="down" && st>cst) || (m_direction=="up" && st<cst)) &&
						m_panel!=null &&
						m_window.height() > HEIGHT_TRESHOLD
					);

					if ( move )
					{
						m_moving = true;

						m_htmlbody.animate({scrollTop: m_scrollTop }, 600, function(){
							
							setTimeout(function() {
								m_oldScrollTop = m_scrollTop;
								m_moving = false;

								if (m_panel.next().length>0)
								{
									m_this.find(".bh-scrolldown").show();
								}
								else
								{
									m_this.find(".bh-scrolldown").hide();
								}

							}, 500);

						});
					};
				}

				m_window.on("scrollstop", {latency: 50}, function(e, touch) { 
					doAnimate();
					saveScrolltop(m_container.scrollTop());
				});

			});

			if (m_this.find(".bh-nexthint").length>0)
			{
				m_this.find(".bh-nexthint .panel-style").css("opacity", 0);
				m_this.find(".bh-nexthint .panel-txt").hide();
				if (getScrolltop()<= 10)
				{
					m_this.find(".bh-nexthint:eq(0) .panel-style").css("opacity", 1);
					m_this.find(".bh-nexthint:eq(0) .panel-txt").show();
				}

				m_window.scroll(function()
				{
					var OFFSET = 85;

					m_this.find(".bh-assistedscroll-item").each(function()
					{
						var element = $(this);

						var elementTop = element.offset().top;
						var scrollTop = m_window.scrollTop();
						var spaceTop = elementTop - scrollTop;
						var elementHeight = m_window.height();
						var screenHeight = m_container.height();
						var scrollBottom = scrollTop + screenHeight;
						var bottomElement = elementTop + element.height();
						var spaceBottom = bottomElement - scrollBottom;
						var heightInScreen = elementHeight - spaceBottom;
						var percentage;

						if (spaceTop < 0) {
							heightInScreen -= spaceTop * -1;
						}

						if (spaceBottom < 0) {
							heightInScreen -= spaceBottom * -1;
						}

						percentage = heightInScreen / screenHeight * 100;
						percentage = percentage < 0 ? 0 : percentage;

						var opacity = percentage;
						if (opacity >= 95) opacity = 100;
						if (opacity < 90) opacity = opacity/2;
						if (opacity < 80) opacity = 0;

						element.find(".bh-nexthint .panel-style").css("opacity", opacity/100 );
						if (percentage < 90)
							element.find(".bh-nexthint .panel-txt").stop().fadeOut(50);
						else
							element.find(".bh-nexthint .panel-txt").stop().fadeIn(50);
					});
				});
			}

		}
		
		if (!m_this.data("__ui_assistedscroll_setup"))
		{
			m_this.data("__ui_assistedscroll_setup", true);
			setup();
		}	
		
		return this;
	}
	
	FUI.plugins.assistenzasearch = function()
	{
		var m_this = $(this);

		function setup()
		{
			m_this.find(".bh-freetext").focus(function()
			{
				if (!m_this.data("__ui_assistenzasearch_setup"))
				{
					m_this.data("__ui_assistenzasearch_setup", true);
					$.getScript("/res/js/ricerca_assistenza.js", function()
					{
						new AssistenzaSearch(m_this);
					});
				}
			});
		}
		setup();
		
		return this;
	}

	FUI.plugins.rating = function()
	{
		var m_this = $(this);

		function render(data)
		{
			for (var k in data)
			{
				let el = m_this.find(".bh-rating-" + k);
				if (el.length>0)
				{
					el.text(data[k]);
				}
			}
		}
		
		function setup()
		{
			if (!FUI.plugins.rating.data)
			{
				$.get("/common/rating.json?" + new Date().getTime(), function(data)
				{
					FUI.plugins.rating.data = data;
					render(data)
				})
			}
			else
			{
				render(data)
			}
		}

		if (!m_this.data("__bh_rating_init"))
		{
			m_this.data("__bh_rating_init", true);
			setup();
		}

		return this;
	}

	FUI.plugins.trustpilot = function()
	{	
		var m_this = $(this);
		var ENDPOINT = "/b2c/trustpilot/business-units/findomestic";
		if ((document.location+"").indexOf("staging.findomestic")!=-1) ENDPOINT = "https://b2ctest.ecredit.it" + ENDPOINT;
		if ((document.location+"").indexOf("www.findomestic")!=-1) ENDPOINT = "https://secure.findomestic.it" + ENDPOINT;
		var KEY = "__fd_tp_data";

		function getData(cb)
		{
			var data = sessionStorage.getItem(KEY);
			if (data!=null)
			{
				cb(JSON.parse(data));
			}
			else
			{
				$.get(ENDPOINT, function(data)
				{
					if (data!=null)
					{
						sessionStorage.setItem(KEY, JSON.stringify(data));
						console.log(data);
						cb(data);
					}
				});
			}
		}

		function setup()
		{
			getData(function(data)
			{
				m_this.find(".bh-score").html(data.score.trustScore.toString().split(".").join(","));
				m_this.find(".bh-count").html(parseInt(data.numberOfReviews.total,10).toLocaleString('de-DE'));
				m_this.find(".bh-reviews").attr("href", "https://it.trustpilot.com/review/" + data.name.identifying).attr("target", "_blank");

				var starEl2clone = m_this.find(".bh-star");
				var starEl = starEl2clone.clone();
				starEl2clone.remove();

				for (var i=1;i<=5;i++)
				{
					var el = starEl.clone();
					if ( (i-0.5)==data.score.stars)
					{
						el.find("span").addClass("half");
					}
					else
					{
						if (i<=data.score.stars)
						{
							el.find("span").addClass("full");
						}
					}
					m_this.find(".bh-stars").append(el);
				}

				m_this.css("display", "block");
			});
		}
		
		if (!m_this.data("__ui_trustpilot_setup"))
		{
			m_this.data("__ui_trustpilot_setup", true);
			setup();
		}	
		
		return this;
	}

	FUI.plugins.tutorial = function()
	{
		var m_this = $(this);

		function setup()
		{
			if (!FUI.plugins.tutorial.__loaded)
			{
				FUI.plugins.tutorial.__loaded = true;
				$.getScript("/res/js/tutorial.js?_=" + new Date().getTime(), init)
			}
			else
			{
				init();
			}
		}

		function  init()
		{
			m_this.click(function(e)
			{
				e.preventDefault();
				new FDTutorial.App({url:m_this.attr("href")});
				return false;
			});
		}

		if (!m_this.data("__tutorial_init"))
		{
			m_this.data("__tutorial_init", true);
			setup();
		}

		return this;
	}

	FUI.plugins.datbrows = function()
	{
		var m_this = $(this);

		function setup()
		{
			datbrows = FDTracker.getSessionDatBrows();
			if (datbrows!=null)
			{
				var href = m_this.attr("href");
				if (href && href!=null && href!="")
				{
					href = href + "";
					if (href.indexOf("?")==-1)
					{
						href += "?";
					}
					else
					{
						href += "&";
					}
					href += "datbrows=" + datbrows;

					m_this.attr("href", href);
				}
			}
		}

		if (!m_this.data("__datbrows_init"))
		{
			m_this.data("__datbrows_init", true);
			setup();
		}

		return this;
	}

	$(document).ready(FUI.init);
  
}(jQuery);


$(document).ready(function(){
	var m_urlFix = "/testtm2016";
	var currentUrl = document.location.href;

	if( currentUrl.indexOf(m_urlFix) != -1 )
	{
		var $links = $("body").find("a");
		for( var i=0; i<$links.length; i++)
		{
			var $link = $($links[i]);
			var href = $link.attr("href");
			if((href+"").length > 0 && (href[0] == "/" && href.indexOf("//") != 0))
			{
				href = m_urlFix + $link.attr("href");
				$link.attr("href", href);
			}
		}
	}
});

$(document).ready(function(){
	var $anchors = $("a");
	for(var i=0; i<$anchors.length; i++)
	{
		var $a = $($anchors[i]);
		var attrOnclick = $a.attr("onclick");
		var href = $a.attr("href");

		if (href.indexOf("/tutorial/")!==-1 && attrOnclick)
		{
			$a.attr("onclick", "");
			$a.addClass("bh-tutorial");
			FUI.enhance($a.parent());
		}
		else if((attrOnclick && attrOnclick.indexOf("resizable") != -1) && (href && href.indexOf("http") != 0))
		{
			$a.attr("onclick", "");
			$a.addClass("bh-modal");
			FUI.enhance($a.parent());
		}
	}
});

$(document).ready(function(){
	var $link = $("a");
	for(var i=0; i<$link.length; i++)
	{
		var $a = $($link[i]);
		var $attrReel = $a.attr("rel");
		if($attrReel && $attrReel != "") {
			$a.attr("name",$attrReel);
		}
	}
});

// app bd dat brows
$(document).ready(function(){
	$("a").each(function(){
		var href = $(this).attr("href");
		if (href && href!=null)
		{
			if (href.indexOf("/appBD/")!=-1)
			{
				$(this).bh_datbrows();
			}
			href = $(this).attr("href");
			if ((document.location.href+"").indexOf("staging.findomestic.it")!=-1)
			{
				href = href.split("https://secure.findomestic.it/appBD/").join("https://b2ctest.ecredit.it/appBD/");
				$(this).attr("href", href);
			}
		}
	});
});

/* Tracking */
var FDTracker = new function()
{
	

	/**
	 * Constants
	 */
	var PAGENAME = {
		homepage:"homepage"
	}

	var LAYOUT = {
		mobile: "Mobile",
		desktop: "Desktop",
		app: "App",
		tablet:"Tablet"
	};

	var CONTESTO = {
		areaPubblica: "area-pubblica"
	};
	
	var SCRIPTS = {
		testTarget: "//assets.adobedtm.com/8ff8fb45d13a/c9414619bb37/launch-5d91c3323b89-development.min.js",
		staging:"//assets.adobedtm.com/8ff8fb45d13a/f3ed57de005e/launch-3f85c0b31ccd-development.min.js",
		live:"//assets.adobedtm.com/8ff8fb45d13a/f3ed57de005e/launch-7712a0ab89f4.min.js",
		target:"/res/js/adobe-target.js",
		appStaging:"//assets.adobedtm.com/8ff8fb45d13a/a0ae14298c3c/launch-2ee3fe54d27e-development.min.js",
		appLive:"//assets.adobedtm.com/8ff8fb45d13a/a0ae14298c3c/launch-028bff3adfc8.min.js"
	};
	
	var CONTEXTPATH = {
		staging:"/",
		live:"/"
	};

	var CURRENCYCODE = {
		eur: "EUR"
	};

	var PRODUCTS = {
		"prestiti-personali": "prestito-personale",
		"carte-di-credito": "carta-di-credito",
		"cessione-del-quinto": "cessione-del-quinto",
		"assicurazioni": "assicurazione",
		"conto-deposito": "conto-deposito",
		"conto-corrente": "conto-corrente"
	};

	function getUri()
	{
		var uri = document.location.pathname + "";
		uri = uri.substring(1);
		uri = uri.split("index.shtml").join("");
		uri = uri.split("index.html").join("");
		uri = uri.split(".shtml").join("");
		uri = uri.split(".html").join("");
		uri = uri.split(".html").join("");
		//if (uri.endsWith("/")) uri = uri.substring(0, uri.length-1);
		if (uri.indexOf("/", uri.length - 1) !== -1) uri = uri.substring(0, uri.length-1);
		return uri;
	}
	
	function getPageName(uri)
	{
		if (uri=="")
			return getContesto() + ":" + PAGENAME.homepage;
		else
			return getContesto() + ":" + uri.split("/").join(":");
	}
	
	/**
	 * get layout
	 */
	function getLayout()
	{	
		!function(a){var b=/iPhone/i,c=/iPod/i,d=/iPad/i,e=/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,f=/Android/i,g=/(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,h=/(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,i=/IEMobile/i,j=/(?=.*\bWindows\b)(?=.*\bARM\b)/i,k=/BlackBerry/i,l=/BB10/i,m=/Opera Mini/i,n=/(CriOS|Chrome)(?=.*\bMobile\b)/i,o=/(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,p=new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)","i"),q=function(a,b){return a.test(b)},r=function(a){var r=a||navigator.userAgent,s=r.split("[FBAN");return"undefined"!=typeof s[1]&&(r=s[0]),s=r.split("Twitter"),"undefined"!=typeof s[1]&&(r=s[0]),this.apple={phone:q(b,r),ipod:q(c,r),tablet:!q(b,r)&&q(d,r),device:q(b,r)||q(c,r)||q(d,r)},this.amazon={phone:q(g,r),tablet:!q(g,r)&&q(h,r),device:q(g,r)||q(h,r)},this.android={phone:q(g,r)||q(e,r),tablet:!q(g,r)&&!q(e,r)&&(q(h,r)||q(f,r)),device:q(g,r)||q(h,r)||q(e,r)||q(f,r)},this.windows={phone:q(i,r),tablet:q(j,r),device:q(i,r)||q(j,r)},this.other={blackberry:q(k,r),blackberry10:q(l,r),opera:q(m,r),firefox:q(o,r),chrome:q(n,r),device:q(k,r)||q(l,r)||q(m,r)||q(o,r)||q(n,r)},this.seven_inch=q(p,r),this.any=this.apple.device||this.android.device||this.windows.device||this.other.device||this.seven_inch,this.phone=this.apple.phone||this.android.phone||this.windows.phone,this.tablet=this.apple.tablet||this.android.tablet||this.windows.tablet,"undefined"==typeof window?this:void 0},s=function(){var a=new r;return a.Class=r,a};"undefined"!=typeof module&&module.exports&&"undefined"==typeof window?module.exports=r:"undefined"!=typeof module&&module.exports&&"undefined"!=typeof window?module.exports=s():"function"==typeof define&&define.amd?define("isMobile",[],a.isMobile=s()):a.isMobile=s()}(this);
		
		if (isMobile.phone)
			return LAYOUT.mobile;
		else if (isMobile.tablet)
			return LAYOUT.tablet;
		else
			return LAYOUT.desktop;
	}
	
	function getContentType(uri)
	{
		var content_type = "altro";
		var arr = uri.split("/");
		var section = arr.length>0 ? arr[0] : "";
		if (uri=="") content_type = "homepage";
		if (section == "prestiti-personali")
		{
			content_type = "hub";
			if (arr.length>1) content_type = "dettaglio_prodotto";
		}
		if (section == "carte-di-credito")
		{
			content_type = "hub";
			if (arr.length>1) content_type = "dettaglio_prodotto";
		}
		if (section == "cessione-del-quinto")
		{
			content_type = "hub";
			if (arr.length>1) content_type = "dettaglio_prodotto";
		}
		if (section == "assicurazioni")
		{
			content_type = "hub";
			if (arr.length>1) content_type = "dettaglio_prodotto";
		}
		if (section == "conto-deposito")
		{
			content_type = "hub";
		}
		if (section == "conto-corrente")
		{
			content_type = "hub";
		}
		if (section == "privacy") 
		{
			content_type = "informativa";
		}
		if (section == "soluzioni") 
		{	
			if (arr.length>2 && (document.location+"").indexOf("index")==-1) 
			{
				content_type = "articoli";
			}
		}

		return content_type;
	}
	
	function getTopic(uri)
	{
		var topic = "altro";
		var arr = uri.split("/");
		var section = arr.length>0 ? arr[0] : "";
		if (section == "prestiti-personali") topic = "prestiti";  
		if (section == "carte-di-credito") topic = "carte"; 
		if (uri=="servizi/carta-di-credito/anticipo-contanti") topic = "carte"; 
		if (section == "conto-deposito") topic = "conti"; 
		if (section == "conto-corrente") topic = "conti"; 
		if (section == "cessione-del-quinto") topic = "credito";
		if (section == "assicurazioni") topic = "assicurazioni"; 
		if (section == "privacy") topic = "info_legali"; 
		if (arr.length>1 && arr[1]=="findomestic-club") topic = "findomestic-club"; 
		
		return topic;
	}

	function getContesto(uri)
	{
		return CONTESTO.areaPubblica;
	}

	function getSiteSection(uri)
	{
		arr = uri.split("/");
		return uri!="" && arr.length>0 ? arr[0] : "";
	}

	function getSiteSubection(uri)
	{
		arr = uri.split("/");
		return uri!="" && arr.length>1 ? arr[1] : "";
	}

	function getProductName(uri)
	{
		arr = uri.split("/");
		key = arr.length>0 ? arr[0] : "";
		return PRODUCTS[key] ? PRODUCTS[key] : "";
	}


	function getCurrencyCode(uri)
	{
		return CURRENCYCODE.eur;
	}

	function getRegione(uri)
	{
		var regione = "";
		arr = uri.split("/");
		if (arr.length>=2 && arr[0]=="dove-siamo" && arr[1]!="agenzia")
		{
			regione = arr[1];
		}
		return regione;
	}

	function getProvincia(uri)
	{
		var provincia = "";
		arr = uri.split("/");
		if (arr.length==3 && arr[0]=="dove-siamo" && arr[1]!="agenzia")
		{
			provincia = arr[2];
		}
		return provincia;
	}

	function getDatBrows() 
	{
	    var KEY = "SessionDatBrows";
		var charNumber = 27;
	    var randomId = '';
	    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	    var charactersLength = characters.length;
	    for (var i = 0; i < charNumber; i++) {
	        randomId += characters.charAt(Math.floor(Math.random() * charactersLength));
   		}
		var timeStamp = (new Date()).getTime();

		if (window.sessionStorage)
		{
			var v = sessionStorage.getItem(KEY);
			if (v!=null && v!="")
			{
				randomId = v;
			}
			else
			{
				sessionStorage.setItem(KEY, randomId);
			}
		}

		return timeStamp + randomId;
	}

	function getIsApp() 
	{
		return location.href.indexOf("is_app=true") > -1 || (document.cookie+"").indexOf('x-app-version') > -1;
	}

	function getAppVersion() 
	{
		var av = $.cookie("x-app-version");
		return av && av!=null ? av : "";
	}

	function getTvei() 
	{
		// todo
	}
	
	function getDLayerData(uri)
	{
		var uri = uri || getUri();
			
		// page view data
		var pvd = new Object();
		
		pvd.pageName = getPageName(uri);
		pvd.content_type = getContentType(uri);
		pvd.topic = getTopic(uri);
		pvd.contesto = getContesto(uri);
		pvd.site_section = getSiteSection(uri);
		pvd.site_subsection = getSiteSubection(uri);
		pvd.isVirtual = false; //
		pvd.currencyCode = getCurrencyCode(uri);
		pvd.regione = getRegione(uri);
		pvd.provincia = getProvincia(uri);
		pvd.dat_brows = getDatBrows();
		pvd.cid="";
		pvd.is_app = getIsApp();
		pvd.app_version = getAppVersion();
		pvd.id_lead = "";
		pvd.id_pratica = "";
		pvd.id_piano_finanziario = "";
		pvd.tvei = "";
		pvd.product_name = getProductName(uri);
		
		return pvd;
	}

	function track(uri)
	{	
		trackCustomEvent("pageview", {}, uri);
	}
	
	function trackVirtualPageView(pageName)
	{	
		if (!pageName)
			return;
		var d = getDLayerData();
		d.isVirtual = true;
		d.pageName = d.pageName + ":" + (pageName+"").toLowerCase();
		trackCustomEvent("pageview", d);
	}

	function trackCustomEvent(evt, data, uri)
	{
		window.dLayer = getDLayerData(uri);

		var divId = 'divEventHolder';
		var trackingDomObj = document.getElementById(divId);
		if (trackingDomObj == null)
		{
			var trackingDomObj = document.createElement('div');
			trackingDomObj.setAttribute('id', divId);
			trackingDomObj.setAttribute('height', '1');
			trackingDomObj.setAttribute('width', '1');
			trackingDomObj.setAttribute('style', 'display:none');
			document.body.appendChild(trackingDomObj);
		}

		window.dLayer = window.dLayer || new Object();
		var data = data || {};
		for (var k in data) window.dLayer[k] = data[k];

		var customEvent = new CustomEvent(evt, { eventData : null });

		/*
		trackingDomObj.dispatchEvent(customEvent);
		console.log(evt, window.dLayer);
		*/

		function fireTrackEvent(evt)
		{
			if (window.AppMeasurement)
			{
				console.log("AppMeasurement loaded");
				trackingDomObj.dispatchEvent(evt);
			}
			else
			{
				console.log("Waiting AppMeasurement");
				setTimeout(function(){fireTrackEvent(evt)}, 100);
			}
		}

		fireTrackEvent(customEvent);

		console.log(evt, window.dLayer);

	}

	function loadLibraries()
	{
		var staging = (document.location+"").indexOf("//staging.")!=-1 || (document.location+"").indexOf("//dev.")!=-1;

		// write script
		if (!window.__FDTracker_init)
		{
			window.__FDTracker_init = true;

			console.log("Loading adobe tracking launcher");
			// var src = staging ? SCRIPTS.testTarget : SCRIPTS.live;
			var src = staging ? SCRIPTS.staging : SCRIPTS.live;
			if (getIsApp())
			{
				src = staging ? SCRIPTS.appStaging : SCRIPTS.appLive;
			}

			$("head").append('<script type="text/javascript" src="' + src + '" async><\/script>');
		}
	}

	function init()
	{
		window.dLayer = getDLayerData();
		loadLibraries();
		$(window).on("load", function()
		{
			track();
		});
	}

	init();
	
	// public functions

	/**
	 * getTLSInfo
	 * @param {function} callback 
	 */
	this.getTLSInfo = function(cb)
	{
		var KEY = "__tls_info";
		var m_localStorage = 'localStorage' in window && window['localStorage'] !== null ? localStorage : null;
		
		function getInfo(cb)
		{
			var v;
			if (m_localStorage)
				v = m_localStorage[KEY];
			else
				v = $.cookie(KEY);
			if (v)
			{
				try 
				{
					v = JSON.parse(v); 
				}
				catch (e)
				{
				}
			}
				
			if (!v)
			{
				window.tlsCheckDone = function(json)
				{
					storeInfo(json);
					cb(json);
					delete window.tlsCheckDone;
				}
				var script_tag = document.createElement('script');
				script_tag.setAttribute("type","text/javascript");
				script_tag.setAttribute("src","https://www.howsmyssl.com/a/check?key=A557PSKZ6STRLFDL6FWHJ6KDPI&callback=tlsCheckDone");
				(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
			}
			else
			{
				cb(v);
			}
		}
		
		function storeInfo(info)
		{
			var s = JSON.stringify(info);
			if (m_localStorage)
				m_localStorage[KEY] = s;
			else
				$.cookie(KEY,s,{expires:365,path:"/"});
		}
		
		getInfo(cb);
	}

	/**
	 * Track
	 */
	this.track = function(uri)
	{
		track(uri);
	}

	this.trackCustomEvent = function(evt, data)
	{
		trackCustomEvent(evt, data);
	}
	
	/**
	 * Track event
	 */
	this.trackEvent = function(evt, data)
	{
		trackCustomEvent(evt, data);
	}
	
	/**
	 * Track virtual page view
	 */
	this.trackVirtualPageView = function(name)
	{
		trackVirtualPageView(name);
	}

	/**
	 * Track tls info
	 */
	this.trackTLSInfo = function()
	{
		function doTrackTLSInfo(tlsData)
		{
			var trackingData = {};
			for (var i in tlsData)
			{
				var v = tlsData[i];
				if (typeof v == "object")
					v = JSON.stringify(v);
				var k = i.indexOf("tls_")==0 ? i : "tls_" + i;
				trackingData[k] = v;
			}
			
			if (typeof _satellite !== 'undefined') 
			{	
				for (var k in trackingData)
				{
					//console.log("Tracking tls variable: " + k + ": " + trackingData[k]);
					_satellite.setVar(k, trackingData[k]);
				}
				_satellite.track('tls_version');
			}
			else
			{
				setTimeout(function(){
					doTrackTLSInfo(tlsData);
				}, 500);
			}
		}

		FDTracker.getTLSInfo(function(tlsData)
		{
			doTrackTLSInfo(tlsData);
		});
	}

	this.getSessionDatBrows = function()
    {
        var KEY = "SessionDatBrows";
        var retVal = "";
        if (window.sessionStorage)
        {
            v = sessionStorage.getItem(KEY);
        };
        if ((v!==null && v!==null))
        {
            retVal = v;
        }
        return retVal;
    }
}

FDSimulator = function ($element, config)
{
	var m_findo_helpAssMessage = "" + "<div class=\"panel-default\">" + "<div class=\"txt\">" + "<p>" + "Con l'Assicurazione facoltativa sarai tutelato dagli imprevisti che possono compromettere la tua capacit&agrave; di rimborso del prestito." + "</p>" + "<p>" + "Se sei un lavoratore dipendente privato (con contratto di diritto italiano di almeno 16 ore settimanali) puoi sottoscrivere le Polizze n. 5118/01 e n. 5490/02 che ti tutelano in caso di:" + "</p>" + "<ul>" + "<li>Decesso</li>" + "<li>Invalidit&agrave; Permanente</li>" + "<li>Perdita di Impiego</li>" + "<li>Inabilit&agrave; Temporanea Totale <i>(sostituisce la garanzia Perdita di Impiego in caso di variazione dello status di Lavoratore Dipendente Privato)</i></li>" + "</ul>" + "<p>" + "Se invece sei un pensionato, un lavoratore di un'azienda pubblica, un non lavoratore o un lavoratore autonomo, potrai scegliere la Polizza n. 5098/01 che ti protegge in caso di:" + "</p>" + "<ul>" + "<li>Decesso</li>"
	        + "<li>Invalidit&agrave; Permanente</li>" + "<li>Inabilit&agrave; Temporanea Totale</li>" + "</ul>" + "<p>" + "Il pagamento dell'Assicurazione &egrave; mensile ed incluso nella rata del Finanziamento. <br/><br/> <i>Riservato a coloro che non hanno compiuto il 71&#186; anno di et&agrave;.</i>"
	"</p>" + "</div>" + "</div>";

	var m_$element = $element;
	var m_config;
	var m_params;
	var m_busy;

	// data
	var m_finalitaList;
	var m_codiceVenditore;
	var m_categoriaList;
	var m_finalitaData;
	var m_useRataPreferita = false;
	var m_useAssicurazione

	// layout elements and object
	var m_finalitaField;
	var m_finalitaSelect;
	var m_finalitaError;

	var m_importoField;
	var m_importoInput;
	var m_importoInfo;
	var m_importoInfoText;
	var m_importoError;
	var m_importoErrorText;

	var m_assicurazioneField;
	var m_assicurazioneCheck;
	var m_assicurazioneLabel;

	var m_calcolaField;
	var m_calcolaBtn;

	var m_assicurazioneMode;

	var m_form;
	var m_maxImporto = 0;
	var m_minImporto = 0;

	var m_elencoFinalitaServletUrl;
	
	var m_startFinalitaId;

	var m_trackingInit = false;

	// Constants
	var MODE_ALWAYS_ON = "alwaysOn";
	var MODE_ALWAYS_OFF = "alwaysOff";
	var MODE_AUTO = "auto"

	var SERVICE_BASE_URL = "https://secure.findomestic.it"
	var ELENCO_FINALITA_SERVLET_URL = SERVICE_BASE_URL + "/clienti/pmc/ElencoFinalitaServlet";
	var OTTIENI_REGOLE_SERVLET_URL = SERVICE_BASE_URL + "/clienti/pmc/ServletOttieniRegole";
	var SIFFCONT_URL = SERVICE_BASE_URL + "/clienti/pmcrs/${siffContextPath}vendita/pages/simulatore.html";

	// NOTE: postfix _UN means that the param name use the Ungarian Notation
	// (also first letter uppercase)
	var PN_PRF = "prf";
	var PN_TIPO_RICHIESTA = "tipoRichiesta";
	var PN_CODICE_AZIENDA = "codiceAzienda";
	var PN_CODICE_AZIENDA_UN = "CodiceAzienda";
	var PN_ORIGINE = "origine";
	var PN_PROVENIENZA = "provenienza";
	var PN_TVEI = "tvei";
	var PN_FINALITA_ID = "finalitaId";
	var PN_PROMO_ID = "promoId";
	var PN_STYLE_PROFILE = "styleProfile";
	var PN_SIFF_CONTEXT_PATH = "siffContextPath";
	var PN_PCC_VALUE = "ppcvalue";
	var PN_PCC = "ppc";
	var PN_PPCCOOKIE = "fd_ppc";
	var PN_PROGETTO = "progetto";
	var PN_IMPORTO_UN = "Importo";
	var PN_RATA_UN = "Rata";
	var PN_CODICE_FINALITA_UN = "CodiceFinalita";
	var PN_MATERIALE_UN = "Materiale";
	var PN_ASSICURAZIONE_UN = "Assicurazione";
	var PN_CODICE_PRODOTTO_UN = "CodiceProdotto";
	var PN_CODICE_TIPO_FINANZIAMENTO_UN = "CodiceTipoFinanziamento";
	var PN_CALL_BACK_UN = "CallBack";
	var PN_PURE = "pure";

	var EXTERNALCONFIG_PARAM_LIST = [
	        PN_PRF, PN_TIPO_RICHIESTA, PN_ORIGINE, PN_PROVENIENZA, PN_TVEI, PN_FINALITA_ID, PN_PROMO_ID, PN_STYLE_PROFILE, PN_SIFF_CONTEXT_PATH, PN_PCC_VALUE, PN_SIFF_CONTEXT_PATH
	];

	var PREFIX_MOBILE = "MOB";
	var PREFIX_DESKTOP = "DES";
	var PREFIX_PPC = "PPC";

	function normalizeParamNames()
	{
		// uniformparamsName
		if (FDJSUtil.isDefined(window.__tiporichiesta))
		{
			window["__" + PN_TIPO_RICHIESTA] = window.__tiporichiesta;
		}
		// uniformparamsName
		if (FDJSUtil.isDefined(window.__styleprofile))
		{
			window["__" + PN_STYLE_PROFILE] = window.__styleprofile;
		}
	}

	function trackSimulationInitEvent()
	{
		if (m_trackingInit) return;
		m_trackingInit = true;

		FDTracker.trackCustomEvent("simulazione_richiesta_prestito_inizio", {
			product_name:"prestito personale",
			service_name:"simulazione richiesta",
			step_name:"Step 1",
			step_number:1
		});
	}

	function initParams()
	{
		normalizeParamNames();

		var tempParams = [];

		function getCODICEAZIENDA()
		{
			var val = FDJSUtil.getParameter(PN_CODICE_AZIENDA, "");
			if (val != "") { return val; }
			val = FDJSUtil.getParameter(PN_PRF, "");
			if (val != "")
			{
				return val;
			}
			else
			{
				var prf = tempParams[PN_PRF];
				var codiceAzienda = tempParams[PN_CODICE_AZIENDA];
				if (prf)
				{
					return (prf && prf != "") ? prf : "";
				}
				else
				{
					return (codiceAzienda && codiceAzienda != "") ? codiceAzienda : "";
				}
			}
		}

		function getORIGINE()
		{
			var val = FDJSUtil.isMobile() ? PREFIX_MOBILE : PREFIX_DESKTOP;
			var ppc = getPPC();
			if (ppc != "")
			{
				var arr = ppc.split("_");
				if (arr.length >= 4)
				{
					return val + "_" + PREFIX_PPC + arr[1] + "_" + arr.slice(3).join("_");
				}
				else
				{
					return val + "_" + PREFIX_PPC + "_" + ppc;
				}
			}
			else
			{
				var p = FDJSUtil.getParameter(PN_ORIGINE, "");
				if (p != "")
				{
					val = val + "_" + p;
				}
				else
				{
					var origine = tempParams[PN_ORIGINE];
					val = (origine && origine != "") ? val + "_" + origine : val;
				}
			}
			return val;
		}
		
		var REFERRER_OVERRIDE_MOBILE_TVEI = "1004167979";
		var REFERRER_OVERRIDE_DESKTOP_TVEI = "1004167961";
		var REFERRER_OVERRIDE_HOST_LIST = ["google.com", "google.it", "bing.com"];
		var OVERRIDE_MOBILE_TVEI = "1003360310";
		var DEFAULT_PUBLIC_DESKTOP_TVEI = "1003095619";
		function getTVEI()
		{
			var referrerUrl = document.referrer;
			if(!FDJSUtil.isEmpty(referrerUrl))
			{
				var referrer =  referrerUrl.match(/:\/\/(.[^/]+)/)[1];
					for(var i=0; i<REFERRER_OVERRIDE_HOST_LIST.length; i++)
					{
						//ends with
						var re = new RegExp(REFERRER_OVERRIDE_HOST_LIST[i] + '$');
						if(referrer.match(re))
						{
							return (FDJSUtil.isMobile() ? REFERRER_OVERRIDE_MOBILE_TVEI : REFERRER_OVERRIDE_DESKTOP_TVEI);
						}
					}
			}
			
			if(FDJSUtil.isMobile() && document.location.href.indexOf("landing_page/") == -1)
			{
				return OVERRIDE_MOBILE_TVEI;
			}
			
			var val = FDJSUtil.getParameter(PN_TVEI, "");
			if (val != "")
			{
				return val;
			}
			else
			{
				var tvei = tempParams[PN_TVEI];
				return (tvei && tvei != "") ? tvei : DEFAULT_PUBLIC_DESKTOP_TVEI;
			}
		}

		function getTIPORICHIESTA()
		{
			var tipoRichiesta = tempParams[PN_TIPO_RICHIESTA];
			return (tipoRichiesta && tipoRichiesta != "") ? tipoRichiesta : "";
		}

		function getPROVENIENZA()
		{
			var provenienza = tempParams[PN_PROVENIENZA];
			return (provenienza && provenienza != "") ? provenienza : "";
		}

		function getPROGETTO()
		{
			var val = FDJSUtil.getParameter(PN_PROGETTO, "");
			if (val != "") { return val; }
			var finalitaId = tempParams[PN_FINALITA_ID];

			if (finalitaId)
			{
				return (finalitaId && finalitaId != "") ? finalitaId : "";
			}
			else
			{
				var progetto = tempParams[PN_PROGETTO];
				return (progetto && progetto != "") ? progetto : "";
			}
		}

		function getPROMOID()
		{
			var promoId = tempParams[PN_PROMO_ID];
			return (promoId && promoId != "") ? promoId : "";
		}

		function getSTYLEPROFILE()
		{
			var styleProfile = tempParams[PN_STYLE_PROFILE];
			return (styleProfile && styleProfile != "") ? styleProfile : "";
		}

		function getPPC()
		{
			var pccValue = tempParams[PN_PCC_VALUE];
			if (!pccValue) pccValue = FDJSUtil.getCookie(PN_PPCCOOKIE);
			if (pccValue)
			{
				return pccValue;
			}
			else
				return "";
		}

		$.each(EXTERNALCONFIG_PARAM_LIST, function (ndx, val)
		{
			var paramBaseName = val;
			var globalParamName = "__" + paramBaseName;
			if (FDJSUtil.isDefined(config[paramBaseName]))
			{
				tempParams[paramBaseName] =config[paramBaseName];
			}
			else if (FDJSUtil.isDefined($("meta[name='simulatore:" + paramBaseName + "']").attr("content")))
			{
				tempParams[paramBaseName] = $("meta[name='simulatore:" + paramBaseName + "']").attr("content");
			}
			else if (FDJSUtil.isDefined(window[globalParamName]))
			{
				tempParams[paramBaseName] = window[globalParamName];
			}
			else
			{
				tempParams[paramBaseName] = "";
			}
		});

		m_params = [];
		m_params[PN_TVEI] = getTVEI();
		m_params[PN_PRF] = getCODICEAZIENDA();
		m_params[PN_CODICE_AZIENDA] = getCODICEAZIENDA();
		m_params[PN_TIPO_RICHIESTA] = getTIPORICHIESTA();
		m_params[PN_PROVENIENZA] = getPROVENIENZA();
		m_params[PN_ORIGINE] = getORIGINE();
		m_params[PN_PROMO_ID] = getPROMOID();
		m_params[PN_STYLE_PROFILE] = getSTYLEPROFILE();
		m_params[PN_PROGETTO] = getPROGETTO();
	}

	function onGetFinalitaList(data)
	{
		m_finalitaList = data.finalitaList;
		m_codiceVenditore = data.codiceVenditore;
		m_categoriaList = data.categoriaList;

		m_finalitaSelect.empty();
		m_finalitaSelect.append("<option value=\"\"></option>");

		// fill select
		for (var i = 0; i < m_categoriaList.length; i++)
		{
			var optGroup = $("<optgroup label=\"\"></optgroup>");
			$(optGroup).attr("label", m_categoriaList[i].descrizione);

			m_finalitaList = m_finalitaList.sort(function (a, b)
			{
				return a.descrizione >= b.descrizione ? 1 : -1;
			});

			for (var j = 0; j < m_finalitaList.length; j++)
			{
				if (m_finalitaList[j].categoriaId == m_categoriaList[i].id)
				{
					var opt = $("<option value=\"\"></option>");
					opt.val(j)
					opt.html(m_finalitaList[j].descrizione);
					optGroup.append(opt);
					
					if(!FDJSUtil.isEmpty(m_params[PN_PROGETTO]) && m_finalitaList[j].id == m_params[PN_PROGETTO])
					{
						m_startFinalitaId = j;
					}
				}
			}
			m_finalitaSelect.append(optGroup);
		}
		
		//select element matching "progetto" param into querystring, if present
		if(!FDJSUtil.isEmpty(m_startFinalitaId))
		{
			m_finalitaSelect.val(m_startFinalitaId);
		}
	}

	function getFinalitaList(callback)
	{
		var callback = callback ? callback : function ()
		{
		};

		var callbackName = "___SimulatoreCallback_" + FDJSUtil.getUniqueId();

		window[callbackName] = function (data)
		{
			onGetFinalitaList(data);
			callback();
		}

		var servletUrl = ELENCO_FINALITA_SERVLET_URL;
		servletUrl = FDJSUtil.addParameter(servletUrl, PN_PURE, true);
		servletUrl = FDJSUtil.addParameter(servletUrl, PN_TVEI, m_params[PN_TVEI]);
		servletUrl = FDJSUtil.addParameter(servletUrl, PN_PRF, m_params[PN_PRF]);
		servletUrl = FDJSUtil.addParameter(servletUrl, PN_CALL_BACK_UN, callbackName);

		$.getScript(servletUrl);
	}

	function onGetFinalitaData(data, callback)
	{
		var callback = callback ? callback : function ()
		{
		};

		m_finalitaData = data;

		// IMPORTO
		m_importoInfo.html("").hide();
		m_importoError.html("").hide();

		m_minImporto = parseInt(FDJSUtil.get(m_finalitaData, "minImporto"), 10);
		m_maxImporto = parseInt(FDJSUtil.get(m_finalitaData, "maxImporto"), 10);

		m_minImporto = !isNaN(m_minImporto) ? m_minImporto : 0;
		m_maxImporto = !isNaN(m_maxImporto) ? m_maxImporto : 0;

		var infoText = m_importoInfoText;
		infoText = infoText.split("${minImporto}").join(FDJSUtil.formatCurrency((m_minImporto / 100) + ""));
		infoText = infoText.split("${maxImporto}").join(FDJSUtil.formatCurrency((m_maxImporto / 100) + ""));
		m_importoInfo.html(infoText)
		if (m_finalitaData != null)
		{
			m_importoInfo.show();
		}

		var errorText = m_importoErrorText;
		errorText = errorText.split("${minImporto}").join(FDJSUtil.formatCurrency((m_minImporto / 100)));
		errorText = errorText.split("${maxImporto}").join(FDJSUtil.formatCurrency((m_maxImporto / 100)));
		m_importoError.html(errorText);
		m_importoField.show();

		// ASSICURAZIONE
		m_assicurazioneField.hide();
		m_assicurazioneCheck.prop('checked', false);
		if ((FDJSUtil.get(m_finalitaData, "assicurazione") == true && m_assicurazioneMode != MODE_ALWAYS_OFF))
		{
			m_assicurazioneField.show();
			m_assicurazioneCheck.prop('checked', FDJSUtil.get(m_finalitaData, "assicurazione_default", false) == true);
		}

		// CALCOLO
		m_calcolaField.show();

		callback();
	}

	function getFinalitaData(finalitaNdx, callback)
	{
		var callback = callback ? callback : function ()
		{
		};

		var callbackName = "___SimulatoreCallback_" + FDJSUtil.getUniqueId();

		window[callbackName] = function (data)
		{
			resetErrors();
			onGetFinalitaData(data);
			callback();
		}

		var finalita = m_finalitaList[finalitaNdx];
		if (FDJSUtil.isEmpty(finalita))
		{
			window[callbackName](null);
			return;
		}

		var finalitaId = FDJSUtil.get(finalita, "id");
		var materiale = FDJSUtil.get(finalita, "codiceIBM");
		var codiceProdotto = 511;
		var codiceTipoFinanziamento = 2;

		var servletUrl = OTTIENI_REGOLE_SERVLET_URL;
		servletUrl = FDJSUtil.addParameter(servletUrl, PN_PURE, true);
		servletUrl = FDJSUtil.addParameter(servletUrl, PN_CODICE_AZIENDA, m_params[PN_CODICE_AZIENDA]);
		servletUrl = FDJSUtil.addParameter(servletUrl, PN_CODICE_AZIENDA_UN, m_params[PN_CODICE_AZIENDA]);
		servletUrl = FDJSUtil.addParameter(servletUrl, PN_TIPO_RICHIESTA, m_params[PN_TIPO_RICHIESTA]);
		servletUrl = FDJSUtil.addParameter(servletUrl, PN_PROVENIENZA, m_params[PN_PROVENIENZA]);
		servletUrl = FDJSUtil.addParameter(servletUrl, PN_ORIGINE, m_params[PN_ORIGINE]);
		servletUrl = FDJSUtil.addParameter(servletUrl, PN_TVEI, m_params[PN_TVEI]);
		servletUrl = FDJSUtil.addParameter(servletUrl, PN_PROMO_ID, m_params[PN_PROMO_ID]);
		servletUrl = FDJSUtil.addParameter(servletUrl, PN_STYLE_PROFILE, m_params[PN_STYLE_PROFILE]);
		servletUrl = FDJSUtil.addParameter(servletUrl, PN_CODICE_FINALITA_UN, finalitaId);
		servletUrl = FDJSUtil.addParameter(servletUrl, PN_MATERIALE_UN, materiale);
		servletUrl = FDJSUtil.addParameter(servletUrl, PN_CODICE_PRODOTTO_UN, codiceProdotto);
		servletUrl = FDJSUtil.addParameter(servletUrl, PN_CODICE_TIPO_FINANZIAMENTO_UN, codiceTipoFinanziamento);
		servletUrl = FDJSUtil.addParameter(servletUrl, PN_CALL_BACK_UN, callbackName);

		$.getScript(servletUrl);
	}

	function resetErrors()
	{
		m_finalitaField.removeClass("error");
		m_finalitaError.hide();
		m_importoField.removeClass("error");
		m_importoError.hide();
		m_importoInfo.hide();
	}

	function buildWindowUrl()
	{
		var baseUrl = SIFFCONT_URL;

		if (m_params[PN_SIFF_CONTEXT_PATH] && (m_params[PN_SIFF_CONTEXT_PATH] + "").length > 0)
			baseUrl = baseUrl.split("${siffContextPath}").join(m_params[PN_SIFF_CONTEXT_PATH] + "/");
		else
			baseUrl = baseUrl.split("${siffContextPath}").join("");

		var targetUrl = baseUrl;

		targetUrl = FDJSUtil.addParameter(targetUrl, (FDJSUtil.isMobile() ? PN_PRF : PN_CODICE_AZIENDA), m_params[PN_CODICE_AZIENDA]);
		targetUrl = FDJSUtil.addParameter(targetUrl, PN_TIPO_RICHIESTA, m_params[PN_TIPO_RICHIESTA]);
		targetUrl = FDJSUtil.addParameter(targetUrl, PN_PROVENIENZA, m_params[PN_PROVENIENZA]);
		targetUrl = FDJSUtil.addParameter(targetUrl, PN_ORIGINE, m_params[PN_ORIGINE]);
		targetUrl = FDJSUtil.addParameter(targetUrl, PN_TVEI, m_params[PN_TVEI]);
		targetUrl = FDJSUtil.addParameter(targetUrl, PN_PROGETTO, m_params[PN_PROGETTO]);
		targetUrl = FDJSUtil.addParameter(targetUrl, PN_PROMO_ID, m_params[PN_PROMO_ID]);
		targetUrl = FDJSUtil.addParameter(targetUrl, PN_STYLE_PROFILE, m_params[PN_STYLE_PROFILE]);

		return targetUrl;
	}

	function submitData()
	{
		resetErrors();
		var error = false;

		// check finalita
		var finalita = m_finalitaSelect.val();
		if (FDJSUtil.isEmpty(finalita))
		{
			m_finalitaField.addClass("error");
			m_finalitaError.show();
			error = true;
		}

		// importo
		if (!FDJSUtil.isEmpty(finalita))
		{
			var importo = FDJSUtil.currencyStringToSystemNumber(m_importoInput.val() + "");
			if (importo < m_minImporto || importo > m_maxImporto || isNaN(importo))
			{
				m_importoField.addClass("error");
				m_importoError.show();
				m_importoInfo.hide();
				error = true;
			}
		}

		if (error === false)
		{
			var importo = m_importoInput.val().replace(/[,\.]/g, "");
			var codiceFinalita = m_finalitaList[m_finalitaSelect.val()].id;
			var materiale = m_finalitaList[m_finalitaSelect.val()].codiceIBM;
			var assicurazione = m_assicurazioneCheck.get(0).checked;

			var targetUrl = buildWindowUrl();
			targetUrl = FDJSUtil.addParameter(targetUrl, PN_IMPORTO_UN, importo);
			targetUrl = FDJSUtil.addParameter(targetUrl, PN_CODICE_FINALITA_UN, codiceFinalita);
			targetUrl = FDJSUtil.addParameter(targetUrl, PN_MATERIALE_UN, materiale);
			targetUrl = FDJSUtil.addParameter(targetUrl, PN_ASSICURAZIONE_UN, assicurazione);
			document.location = targetUrl;
		}
	}

	function initEnvironment()
	{
		m_finalitaField = m_$element.find(".bh-finalitaField");
		m_finalitaSelect = m_$element.find(".bh-finalitaSelect");
		m_finalitaError = m_$element.find(".bh-finalitaError");

		m_importoField = m_$element.find(".bh-importoField");
		m_importoInput = m_$element.find(".bh-importoInput");
		m_importoInfo = m_$element.find(".bh-importoInfo");
		m_importoInfoText = FDJSUtil.isDefined(m_importoInfo.html()) ? m_importoInfo.html() : "";
		m_importoError = m_$element.find(".bh-importoError");
		m_importoErrorText = FDJSUtil.isDefined(m_importoError.html()) ? m_importoError.html() : "";

		m_assicurazioneField = m_$element.find(".bh-assicurazioneFiled");
		m_assicurazioneCheck = m_$element.find(".bh-assicurazioneCheck");
		m_assicurazioneLabel = m_$element.find(".bh-assicurazioneLabel");

		var checkId = "m_assicurazioneLabel__" + FDJSUtil.getUniqueId();
		m_assicurazioneCheck.attr("id", checkId);
		m_assicurazioneLabel.attr("for", checkId);

		m_calcolaField = m_$element.find(".bh-calcolaField");
		m_calcolaBtn = m_$element.find(".bh-calcolaBtn");

		m_form = m_$element.find(".bh-simulatoreForm");

		m_assicurazioneMode = m_config.modeAssicurazione;
	}

	function resetLayout()
	{
		var importoError = m_importoError.is(":visible");
		onGetFinalitaData(m_finalitaData, function ()
		{
			if (importoError)
			{
				m_importoInfo.hide();
				m_importoError.show();
			}
		});
	}

	function initLayout()
	{
		m_form.get(0).reset();
		m_importoField.show();
		m_calcolaField.show();

		m_importoInfo.hide();
		m_importoError.hide();

		m_assicurazioneField.hide();
		if (m_assicurazioneMode == MODE_ALWAYS_ON)
		{
			m_assicurazioneField.show();
		}
	}

	function initEvents()
	{
		m_finalitaSelect.off("change").on("change", function (e)
		{
			trackSimulationInitEvent();
			var $this = $(this);
			var ndx = $this.val();
			getFinalitaData(ndx);
		});

		m_importoInput.on("change", function (e)
		{
			trackSimulationInitEvent();
		});

		m_form.off("submit").on("submit", function (e)
		{
			e.preventDefault();
			m_importoInput.blur();
			submitData();
		});

		m_calcolaBtn.off("click").on("click", function (e)
		{
			e.preventDefault();
			m_importoInput.blur();
			submitData();
		});
	}

	function onInit()
	{
		initEvents();
		if(!FDJSUtil.isEmpty(m_startFinalitaId))
		{
			getFinalitaData(m_startFinalitaId);
		}
		m_$element.trigger("FDSimulator.onInit");
	}

	var DEFAULTS = {
		"modeAssicurazione" : MODE_ALWAYS_ON,
	}

	this.resetAssicurazioneMode = function (modeAssicurazione)
	{
		m_config.modeAssicurazione = modeAssicurazione;
		m_assicurazioneMode = m_config.modeAssicurazione;
		resetLayout();
	}

	this.getAssicurazioneHelpContent = function ()
	{
		return m_findo_helpAssMessage;
	}

	function init()
	{
		m_config = $.extend(DEFAULTS, config);
		initParams();
		initEnvironment();
		initLayout();
		getFinalitaList(onInit);
	}
	init();
};

/*
 * Manage modal show and hide
 */

FDModal = function (config)
{
	var defaults = {
	    title : "",
	    content : "",
	    onInit : function(){},
	    onShow : function(){},
	    onClose : function(){},
	    layout:"simple" //simple(default)|complex
	}

	//
	
	var m_config = $.extend(defaults, config);

	var m_baseBgHtml = '<div class="bg-modal" style=""></div>';
	var m_baseHtml = '' + 
		'<div class="modal">' + 
			'<div class="modal-container\">' + 
				'<div class="modal-content bh-scrollbar\">' + 
					'<div class="bh-modalHeader modal-header">' + 
						'<div class="middle">' +
							'<a href="javascript:void(0);" class="close bh-modalClose"><span class="material-icons">&#xE14C;</span></a>' + 
							'<header><h1 class="bh-title">Modal title...</h1></header>' + 
						'</div>' + 
					'</div>' + 
					'<div class="modal-main bh-modal-main">' + 
						'<div class="content">' + 
							'<div class="main">' + 
								'<div class="container-fluid">' +
									'<div class="intro">' +  
										'<div class="bh-content">' +
									
										'</div>' + 
									'</div>' + 
								'</div>' + 
							'</div>' + 
						'</div>' + 
					'</div>' +
				'</div>' + 
			'</div>' + 
		'</div>';

	var m_tabBaseHtml = '' +
			'<div class="modal">' + 
				'<div class="modal-container\">' + 
					'<div class="modal-content bh-scrollbar\">' + 
						'<div class="bh-modalHeader modal-header">' + 
							'<div class="middle">' +
								'<a href="javascript:void(0);" class="close bh-modalClose"><span class="material-icons">&#xE14C;</span></a>' + 
								'<header><h1 class="bh-title">Modal title...</h1></header>' + 
							'</div>' + 	
						'</div>' + 	
						'<div class="modal-main bh-modal-main">' + 
							'<div class="content">' + 
								'<div class="main">' + 
									'<div class="container-fluid">' +
										'<div class="intro">' +  
											'<div class="bh-content">' +
												'<div class="panel-default slideTabs bh-sliderTabs">' +
													'<ul class="bh-tabHeaderContainer link-tabs bh-viewport bh-magicline">' + 
														'<!-- multiple -->' + 
														'<li class="bh-tabHeaderTemplate"><a href="#1" class="bh-tabcontrol"><span class="bh-tabLabel label">CARATTERISTICHE</span></a></li>' + 
													'</ul>' + 
													'<div class="controls-direction"><span id="slider-prev"></span> <span id="slider-next"></span></div>' + 
													'<div class="bh-tabContentContainer ctn-tabs">' + 
														'<!-- multiple -->' + 
														'<div class="bh-tabContentTemplate bh-tabpanel">' + 
															'<div class="bh-tabContent panel-default" style="overflow-x:hidden;overflow-y:auto;">' + 
																
															'</div>' + 
														'</div>' + 
													'</div>' + 
												'</div>' + 
											'</div>' + 
										'</div>' + 
									'</div>' + 
								'</div>' + 
							'</div>' + 
						'</div>' +
					'</div>' +
				'</div>' +
        	'</div>'; 
	
	var m_this = this;
	var m_$body;
	var m_$bg;
	var m_$modal;
	var m_$closeBtn;
	var m_printed = false;
	var m_complexHeaderCssClassName = "bg";
	var LAYOUT_SIMPLE = "simple";
	var LAYOUT_COMPLEX = "complex";


	var m_height;
	var m_position;
	var m_window_width = null;
	var m_window_top = null;
	var m_foreground = null;

	function set()
	{
		
		m_height = m_$modal.find(".bh-modal-main").height();
		var height = m_$modal.find(".bh-content").height();

		if( height > m_height)
		{
			m_$modal.addClass("foreground");
			m_foreground = m_$modal.hasClass("foreground");

			if(m_foreground){
				m_$modal.addClass("fullScreenMobile");
				if(FUI.getThreshold() <= 2){
					m_$modal.find(".bh-content").css("padding-bottom","70px").css("padding-top","70px");
				}
			}
		}
		
		var posLR = (($(window).width()) - (m_$modal.width()))/2;
		if(FUI.getThreshold() >  2){
			m_$modal.css("left",posLR).css("right",posLR);
		}
	}

	
	this.show = function ()
	{
		if (!m_printed)
		{
			m_$body.append(m_$bg);
			m_$body.append(m_$modal);
		}
		set();
		//m_window_top = $(window).scrollTop();

		//$("html, body").css("height",$(window).height()).css("overflow","hidden");
		m_$body.append(m_$bg);
		m_$bg.show();

		if(m_foreground){
			m_$modal.css({"top":$(window).height()});
			m_$modal.animate({top:0, opacity: 1}, 200);
		}
		else {
			m_$modal.css({"top":0});
			m_$modal.css("opacity",1);
		}
		
		m_printed = true;
		m_config.onShow(m_$modal);
		

		m_$modal.find(".bh-modal-main").scroll(function() {
			var scroll = $(this).scrollTop();
			if(scroll >= 1)
				m_$modal.find(".bh-modalHeader").addClass("shadow-bottom");
			else 
				m_$modal.find(".bh-modalHeader").removeClass("shadow-bottom");
		});

		m_$bg.unbind("click").click(function(e)
		{
			e.preventDefault();
			m_this.close();
		});
	}

	this.close = function ()
	{

		m_$bg.hide();
		m_config.onClose(m_$modal);
		if( m_$modal == null )
				return;
			
		/*if(m_$modal.css("opacity") != 0){
			$("html, body").css("height","auto").css("overflow","auto");
			window.scrollTo(0, m_window_top);
		}*/

		if(m_foreground){
			m_$modal.animate({
			top:$(window).height(), opacity:0
			}, 200, function() {
				m_$modal.removeClass("fullScreenMobile");
				m_$modal.removeClass("foreground");
			});
		}
		else {
			m_$modal.css("top",$(window).height()).css("opacity",0);
		}


		if(m_$bg){
			m_$bg.fadeOut(function(){
				m_$bg.remove();
				m_$modal.removeClass("foreground");
			});
		}

	}

	function init()
	{
		// variables
		m_$body = $("body");
		m_$bg = $(m_baseBgHtml).hide();
		
		if(!$.isArray(m_config.content))
		{
			m_$modal = $(m_baseHtml);
			m_$modal.find(".bh-title").html(m_config.title);
			m_$modal.find(".bh-content").empty().html(m_config.content);
		}
		else
		{
			m_$modal = $(m_tabBaseHtml);
			m_$modal.find(".bh-title").html(m_config.title);
			
			var tabHeadTemplate = $(m_$modal.find(".bh-tabHeaderTemplate").get(0)).clone();
			m_$modal.find(".bh-tabHeaderTemplate").remove();
			
			var tabPanelContentTemplate = $(m_$modal.find(".bh-tabContentTemplate").get(0)).clone();
			m_$modal.find(".bh-tabContentTemplate").remove();
			
			$.each(m_config.content, function(ndx, val){
				var tabHead = tabHeadTemplate.clone();
				tabHead.find(".bh-tabLabel").html(val.title);
				m_$modal.find(".bh-tabHeaderContainer").append(tabHead);
				
				var tabContent = tabPanelContentTemplate.clone();
				tabContent.find(".bh-tabContent").html(val.content);
				
				m_$modal.find(".bh-tabContentContainer").append(tabContent);
			});
		}
		if(m_config.layout == LAYOUT_COMPLEX)
		{
			m_$modal.find(".bh-modalHeader").addClass(m_complexHeaderCssClassName);
		}

		// events
		m_$modal.find(".bh-modalClose").on("click", function (e)
		{
			e.preventDefault();
			m_this.close();
		});

		m_$modal.on("click", function (e)
		{
			if (!$(e.target).closest(".modal-content").length) {
				e.preventDefault();
				m_this.close();
			}
		});


		m_window_width = $(window).width();

		$(window).resize(function() {
			if(m_window_width == $(window).width()){
				return;
			}
			m_window_width = $(window).width();

			m_this.close();
		});

		m_config.onInit(m_$modal);
	}
	init();
};



FDJSUtil = new function()
{
	this.legacyBrowser = window.attachEvent && !window.addEventListener;
	
	// private
	function getPathValue(parsed, obj)
	{
		var tmp = obj;
		var res = undefined;

		for (var i = 0, l = parsed.length; i < l; i++)
		{
			var part = parsed[i];
			if (tmp) 
			{
				if (FDJSUtil.isDefined(part.p))
					tmp = tmp[part.p];
				else if (FDJSUtil.isDefined(part.i))
					tmp = tmp[part.i];
				if (i == (l - 1))
					res = tmp;
			} 
			else 
				res = undefined;
		}
		return res;
	};

	function setPathValue(parsed, val, obj) 
	{
		var tmp = obj;
		var i = 0;
		var l = parsed.length;
		var part;

		for (; i < l; i++) 
		{
			part = parsed[i];

			if (FDJSUtil.isDefined(tmp) && i == (l - 1)) 
			{
				var x = FDJSUtil.isDefined(part.p) ? part.p : part.i;
				tmp[x] = val;
			} 
			else if (FDJSUtil.isDefined(tmp)) 
			{
				if (FDJSUtil.isDefined(part.p) && tmp[part.p]) 
					tmp = tmp[part.p];
				else if  (FDJSUtil.isDefined(part.i) && tmp[part.i])
					tmp = tmp[part.i];
				else
				{
					var next = parsed[i + 1];
					var x = FDJSUtil.isDefined(part.p) ? part.p : part.i;
					var y = FDJSUtil.isDefined(next.p) ? {} : [];
					tmp[x] = y;
					tmp = tmp[x];
				}
			} 
			else
			{
				if (i == (l - 1))
					tmp = val;
				else if (FDJSUtil.isDefined(part.p))
					tmp = {};
				else if (FDJSUtil.isDefined(part.i))
					tmp = [];
			}
		}
	};
	
	function parsePath(path) 
	{
		if(!FDJSUtil.isDefined(path))
			return {};

		var str = path.replace(/\[/g, '.['), 
		parts = str.match(/(\\\.|[^.]+?)+/g);
	  
		var retVal = [];
	  
		for (var i=0;i<parts.length;i++)
		{
			var re = /\[(\d+)\]$/;
			var mArr = re.exec(parts[i]);
		if (mArr) 
			retVal[retVal.length] = {i: parseFloat(mArr[1])};
		else
			retVal[retVal.length] = { p: parts[i] };
		};
  
		return retVal;
	};
	
	// public
	this.isDefined = function(val)
   	{
   		return !(!val && 'undefined' === typeof val);
   	};
   	
   	this.isEmpty = function(s) {
		if (!FDJSUtil.isDefined(s))
			return true;
		if (s==null)
			return true;
		if ($.trim(s+"").length==0)
			return true;
		return false;
	};
	 
	/**
    * Get object property
    */
	this.get = function(obj, path, defaultValue)
	{	
		var parsed = parsePath(path);
		var val = getPathValue(parsed, obj);
		if (FDJSUtil.isDefined(val))
			return val;
		else
			return defaultValue;
	};
	
	/**
	 * Get array
	 */
	this.getArray = function(obj, path, defaultValue)
	{	
		var rv = FDJSUtil.get(obj, path, defaultValue);
		if (FDJSUtil.isDefined(rv) && rv!=null && !$.isArray(rv))
			return [rv];
		else
			return rv;
	};
	
	/**
	 * Set object property
	 */
	this.set = function(obj, path, value)
	{	
		var parsed = parsePath(path);
		setPathValue(parsed, value, obj);
	};
	
	/**
	 * Get unique id
	 */
	this.getUniqueId = function()
	{
		if (!FDJSUtil.__getUniqueIdCounter)
			FDJSUtil.__getUniqueIdCounter = 0;
		FDJSUtil.__getUniqueIdCounter++;
		return new Date().getTime() + FDJSUtil.__getUniqueIdCounter;
	}
	
	/**
	 * Slugify
	 */
	this.slugify = function(text)
	{
		if(FDJSUtil.isEmpty(text))
		{
			return "";
		}
		return text.toString().toLowerCase()
	    		.replace(/\s+/g, '-')           // Replace spaces with -
	    		.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
	    		.replace(/\-\-+/g, '-')         // Replace multiple - with single -
	    		.replace(/^-+/, '')             // Trim - from start of text
	    		.replace(/-+$/, '');            // Trim - from end of text
	}
	
	/**
	 * Format date
	 */
	this.formatDate = function(date, format)
	{
		var RAW_FORMAT = "YYYY-MM-DD[T]HH:mm:ss[Z]";
		var FORMATS = 
		{
			it:"DD/MM/YYYY HH:mm:ss",
			en:"MM/DD/YYYY HH:mm:ss"
		}
		var f = format;
		if (!f && PG.App.context.attributes.dateTimeFormat)
			f = PG.App.context.attributes.dateTimeFormat;
		if (!f)
			f = FORMATS[PG.App.language];
		if (!f)
			f = FORMATS["en"];
		
		var d = moment(date, RAW_FORMAT);
		return d.format(f);
	}
	
	/**
	 * Get cookie
	 */
	this.getCookie = function(cookiename)
	{
		var ck = null;
		if (document.cookie.length > 0)
		{
			begin = document.cookie.indexOf(cookiename+"=");
			if (begin != -1)
			{
				begin += cookiename.length+1;
				end = document.cookie.indexOf(";", begin);
				if (end == -1) end = document.cookie.length;
				ck = unescape(document.cookie.substring(begin, end));
			}
		}
		return ck;
	};
	
	/**
	 * Set cookie
	 */
	this.setCookie = function(cookiename, value)
	{
		document.cookie = cookiename + "=" + escape(value) + "; path=/;";
	};
	
	/**
	 *  Is email
	 */
	this.isEmail = function(s) {
		if (FDJSUtil.isEmpty(s))
			return false;
		var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		return pattern.test(s);
	};
	
	/**
	 * Get parameter
	 */
	this.getParameter = function(name, fallback)
	{
		var params = {};
		var paramString = window.location.search+"";
		if (paramString.split("?").length>1)
		{
			var parArr = paramString.split("?")[1].split("&");
			for(var i = 0; i < parArr.length; i++)
			{
		        parr = parArr[i].split("=");
		        if(parr[0].length>0 && parr.length==2)
		        	params[parr[0]] = decodeURIComponent(parr[1]);
			}
		}
		return FDJSUtil.get(params, name, FDJSUtil.isDefined(fallback) ? fallback : null)
	};
	
	/**
	 * Add parameter
	 */
	this.addParameter = function(url, paramName, paramValue)
	{
		var concatChar = url.indexOf("?") == -1 ? "?" : "&";
		return url += concatChar + paramName + "=" + encodeURI(paramValue);
	}
	
	/**
	 * paste html in specified element (used by emoticons editor) 
	 */
	this.pasteHtmlAtCaret = function(html, $elementWhichToPrint) 
	{
		$elementWhichToPrint.focus();
	    var sel, range;
	    if (window.getSelection) {
	        // IE9 and non-IE
	        sel = window.getSelection();
	        if (sel.getRangeAt && sel.rangeCount) {
	            range = sel.getRangeAt(0);
	            range.deleteContents();

	            // Range.createContextualFragment() would be useful here but is
	            // non-standard and not supported in all browsers (IE9, for one)
	            var el = document.createElement("div");
	            el.innerHTML = html;
	            var frag = document.createDocumentFragment(), node, lastNode;
	            while ( (node = el.firstChild) ) {
	                lastNode = frag.appendChild(node);
	            }
	            range.insertNode(frag);
	            
	            // Preserve the selection
	            if (lastNode) {
	                range = range.cloneRange();
	                range.setStartAfter(lastNode);
	                range.collapse(true);
	                sel.removeAllRanges();
	                sel.addRange(range);
	            }
	        }
	    } else if (document.selection && document.selection.type != "Control") {
	        // IE < 9
	        document.selection.createRange().pasteHTML(html);
	    }
	}

	/**
	 * capitalize a phrase or string and accept chars separator for Upprecase position 
	 */
	this.capitalize = function(str, separators)
	{
		var retVal = "";
		if (!separators)
			separators = [" "];
		for (var i=0;i<str.length;i++)
		{
			var upper = false;
			for (var ii=0;ii<separators.length; ii++)
			{
				if (i==0 || (i>0 && str.charAt(i-1)==separators[ii]))
					upper = true;
			}
			if (upper)
				retVal += str.charAt(i).toUpperCase();
			else
				retVal += str.charAt(i).toLowerCase();
		}
		return retVal;
	};
	
	/**
	 * return true if device is a mobile
	 */
	this.isMobile = function()
	{
		var MOBILE_USERAGENTS = ["nokia","symbian","iphone","blackberry","ipod","mobile","googlebot-mobile"];
		var TABLET_USERAGENTS = ["ipad"];
		
		var ua = (navigator.userAgent+"").toLowerCase();
		var pl = (navigator.platform+"").toLowerCase();
		
		var mobile = false;
		var tablet = false;
		
		for (var i=0;i<MOBILE_USERAGENTS.length;i++)
		{
			if (ua.indexOf(MOBILE_USERAGENTS[i].toLowerCase())!=-1)
			{
				mobile = true;
			}
		}
		for (var i=0;i<TABLET_USERAGENTS.length;i++)
		{
			if (ua.indexOf(TABLET_USERAGENTS[i].toLowerCase())!=-1)
			{
				tablet = true;
			}
		}
		if (tablet)
		{
			mobile = false;
		}		
		return mobile;
	}
	
	this.baseUrl = function()
	{
		var url = window.location.href;
		var arr = url.split("/");
		var baseUrl = arr[0] + "//" + arr[2];
		return baseUrl;
	}
	
	this.formatCurrency = function(currencyString, noDecimal) 
	{
		var currencyString = currencyString+"";
		var DECIMALSEPARATOR = ',';
		var GROUPINGSEPARATOR = '.';
		var FRACTIONDIGITS = 2;
		
		var valSplit = currencyString.split(",", 2);
        var intPart = valSplit[0].replace(/\./g, "");
        var decPart = valSplit.length > 1 ? valSplit[1] : "";
		
	    if (intPart == "") intPart = "0";
	    while (intPart.length > 1 && intPart[0] == "0") intPart = intPart.substring(1, intPart.length);
	    var result;
	    if (noDecimal === true) {
	        result = "";
	    } else {
	        while (decPart.length < FRACTIONDIGITS) decPart += "0";
	        result = DECIMALSEPARATOR + decPart;
	    }
	    var sep = "";
	    for (var i = intPart.length; i > 0; i -= 3) {
	        result = intPart.substring(Math.max(i - 3, 0), i) + sep + result;
	        sep = GROUPINGSEPARATOR;
	    }
	    return result;
	}
	
	this.currencyStringToSystemNumber = function(currencyString)
	{
		var currencyString = currencyString+"";
		currencyString = currencyString.split(",").join("");
		currencyString = currencyString.split(".").join("");
		return parseInt(currencyString, 10);
	}
	
	
};


FDCookieConsents = new function()
{
	var COOKIENAME = "";

	function init()
	{
		renderConsents();
		bindOneTrustEvents();
	}

	function bindOneTrustEvents()
	{
		if (window.OneTrust)
		{
			OneTrust.OnConsentChanged(renderConsents);
		}
		else
		{
			setTimeout(bindOneTrustEvents, 500);
		}
	}

	function getCookies()
	{
		var cookies = {};
		var ck = document.cookie.split(";")
		for (var i=0;i<ck.length;i++)
		{
			var key = $.trim(ck[i].substring(0, ck[i].indexOf("=")));
			var value = ck[i].substring(ck[i].indexOf("=")+1);

			if (key=="OptanonConsent")
			{
				v = value.split("&");
				value = {};
				for (var ii=0;ii<v.length;ii++)
				{
					cp = v[ii].split("=");
					value[cp[0]] = decodeURIComponent(cp[1]);
				}
			}

			cookies[key] = value;
		}

		return cookies;
	}

    function processConsents()
    {
		var retVal = "";

		var cookies = getCookies();
		if (cookies.OptanonConsent && cookies.OptanonConsent.groups && cookies.OptanonConsent.genVendors)
		{
			var groupArr = cookies.OptanonConsent.groups.split(",");
			var groups = {};
			for (var i=0;i<groupArr.length;i++)
			{
				var el = groupArr[i].split(":");
				groups[el[0]] = el[1];
			}

			var genVendorsArr = cookies.OptanonConsent.genVendors.split(",");
			var genVendors = {};
			for (var i=0;i<genVendorsArr.length;i++)
			{
				var el = genVendorsArr[i].split(":");
				if (el[0]!="")
					genVendors[el[0]] = el[1];
			}

			// 1. se ITA01 ha valore A1 e tutti gli altri hanno valore A0 (quindi non ÃƒÂ¨ presente nessun altro A1) --> "Preferenze Cookie: solo necessari"
			if (groups["ITA01"] == "1")
			{
				var match = true;
				for (var k in groups)
				{
					if (k.indexOf("ITA")==0 && k!="ITA01" && groups[k]=="1")
					{
						match = false;
					}
				}
				if (match)
				{
					retVal = "solo necessari";

					/*
					se tutte le categorie ITAXX (diverse da ITA01) hanno valore A0, allora si va a verificare 
					se sono presenti variabili "VXXX" (diverse da V99 e V104 che di default sono a A1) con valore A1 
					ed in questo caso riportare l'etichetta "Preferenze cookie: personalizzati".
					*/
					for (var k in genVendors)
					{
						if (k!="V99" && k!="V104")
						{
							if (genVendors[k]=="1")
							{
								retVal = "personalizzati";
							}
						}
					}
			
				}
			}
			// 2. se tutte le categorie hanno valore A1 (non esiste nessun A0) --> "Preferenze Cookie: tutti attivi"
			if (retVal=="")
			{
				var count = 0;
				for (var k in groups)
				{
					if (groups[k]=="1")
					{
						count++;
					}
				}
				if (groupArr.length>0 && count==groupArr.length)
				{
					retVal = "tutti attivi";
				}
			}

			/*

			ITA01:1,ITA02:0,ITA03:0,ITA04:0&hosts=H361:0&genVendors=V106:0,V109:0,V102:0,V99:1,V101:1,V100:0,V104:1,V105:0,V103:0,V107:0,V108:0,
			
			se tutte le categorie ITAXX (diverse da ITA01) hanno valore A0, allora si va a verificare se sono presenti variabili "VXXX" 
			(diverse da V99 e V104 che di default sono a A1) con valore A1 ed in questo caso riportare l'etichetta "Preferenze cookie: personalizzati".
			
			*/

			// 3. se oltre ad ITA01=A1 esistono valorizzazioni sia con A1 (oltre che ITA01) che con A0 --> "Preferenze Cookie: personalizzati"
			if (retVal=="")
			{
				retVal = "personalizzati";
			}

			
		}

        return retVal;
    }

    function renderConsents()
    {
		var cs = processConsents();
		$("footer .bh-consents").remove();
		if (cs!="")
		{
        	var consents = $('<a class="bh-consents" href="javascript:if (window.OneTrust) { OneTrust.ToggleInfoDisplay(); };"> | Preferenze Cookie: ' + cs + "</a>");
 		    $("footer .social").prev().append(consents);
		}
    }

    $(document).ready(init);
}