///#source 1 1 /Content/libs/mCustomScrollbar/jquery.mCustomScrollbar.js
/*
== malihu jquery custom scrollbars plugin == 
version: 2.8.2 
author: malihu (http://manos.malihu.gr) 
plugin home: http://manos.malihu.gr/jquery-custom-content-scroller 
*/

/*
Copyright 2010-2013 Manos Malihutsakis 

This program is free software: you can redistribute it and/or modify 
it under the terms of the GNU Lesser General Public License as published by 
the Free Software Foundation, either version 3 of the License, or 
any later version. 

This program is distributed in the hope that it will be useful, 
but WITHOUT ANY WARRANTY; without even the implied warranty of 
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the 
GNU Lesser General Public License for more details. 

You should have received a copy of the GNU Lesser General Public License 
along with this program.  If not, see http://www.gnu.org/licenses/lgpl.html. 
*/
(function($){
	/*plugin script*/
	var methods={
		init:function(options){
			var defaults={ 
				set_width:false, /*optional element width: boolean, pixels, percentage*/
				set_height:false, /*optional element height: boolean, pixels, percentage*/
				horizontalScroll:false, /*scroll horizontally: boolean*/
				scrollInertia:950, /*scrolling inertia: integer (milliseconds)*/
				mouseWheel:true, /*mousewheel support: boolean*/
				mouseWheelPixels:"auto", /*mousewheel pixels amount: integer, "auto"*/
				autoDraggerLength:true, /*auto-adjust scrollbar dragger length: boolean*/
				autoHideScrollbar:false, /*auto-hide scrollbar when idle*/
				snapAmount:null, /* optional element always snaps to a multiple of this number in pixels */
				snapOffset:0, /* when snapping, snap with this number in pixels as an offset */
				scrollButtons:{ /*scroll buttons*/
					enable:false, /*scroll buttons support: boolean*/
					scrollType:"continuous", /*scroll buttons scrolling type: "continuous", "pixels"*/
					scrollSpeed:"auto", /*scroll buttons continuous scrolling speed: integer, "auto"*/
					scrollAmount:40 /*scroll buttons pixels scroll amount: integer (pixels)*/
				},
				advanced:{
					updateOnBrowserResize:true, /*update scrollbars on browser resize (for layouts based on percentages): boolean*/
					updateOnContentResize:false, /*auto-update scrollbars on content resize (for dynamic content): boolean*/
					autoExpandHorizontalScroll:false, /*auto-expand width for horizontal scrolling: boolean*/
					autoScrollOnFocus:true, /*auto-scroll on focused elements: boolean*/
					normalizeMouseWheelDelta:false /*normalize mouse-wheel delta (-1/1)*/
				},
				contentTouchScroll:true, /*scrolling by touch-swipe content: boolean*/
				callbacks:{
					onScrollStart:function(){}, /*user custom callback function on scroll start event*/
					onScroll:function(){}, /*user custom callback function on scroll event*/
					onTotalScroll:function(){}, /*user custom callback function on scroll end reached event*/
					onTotalScrollBack:function(){}, /*user custom callback function on scroll begin reached event*/
					onTotalScrollOffset:0, /*scroll end reached offset: integer (pixels)*/
					onTotalScrollBackOffset:0, /*scroll begin reached offset: integer (pixels)*/
					whileScrolling:function(){} /*user custom callback function on scrolling event*/
				},
				theme:"light" /*"light", "dark", "light-2", "dark-2", "light-thick", "dark-thick", "light-thin", "dark-thin"*/
			},
			options=$.extend(true,defaults,options);
			return this.each(function(){
				var $this=$(this);
				/*set element width/height, create markup for custom scrollbars, add classes*/
				if(options.set_width){
					$this.css("width",options.set_width);
				}
				if(options.set_height){
					$this.css("height",options.set_height);
				}
				if(!$(document).data("mCustomScrollbar-index")){
					$(document).data("mCustomScrollbar-index","1");
				}else{
					var mCustomScrollbarIndex=parseInt($(document).data("mCustomScrollbar-index"));
					$(document).data("mCustomScrollbar-index",mCustomScrollbarIndex+1);
				}
				$this.wrapInner("<div class='mCustomScrollBox"+" mCS-"+options.theme+"' id='mCSB_"+$(document).data("mCustomScrollbar-index")+"' style='position:relative; height:100%; overflow:hidden; max-width:100%;' />").addClass("mCustomScrollbar _mCS_"+$(document).data("mCustomScrollbar-index"));
				var mCustomScrollBox=$this.children(".mCustomScrollBox");
				if(options.horizontalScroll){
					mCustomScrollBox.addClass("mCSB_horizontal").wrapInner("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />");
					var mCSB_h_wrapper=mCustomScrollBox.children(".mCSB_h_wrapper");
					mCSB_h_wrapper.wrapInner("<div class='mCSB_container' style='position:absolute; left:0;' />").children(".mCSB_container").css({"width":mCSB_h_wrapper.children().outerWidth(),"position":"relative"}).unwrap();
				}else{
					mCustomScrollBox.wrapInner("<div class='mCSB_container' style='position:relative; top:0;' />");
				}
				var mCSB_container=mCustomScrollBox.children(".mCSB_container");
				if($.support.touch){
					mCSB_container.addClass("mCS_touch");
				}
				mCSB_container.after("<div class='mCSB_scrollTools' style='position:absolute;'><div class='mCSB_draggerContainer'><div class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' style='position:relative;'></div></div><div class='mCSB_draggerRail'></div></div></div>");
				var mCSB_scrollTools=mCustomScrollBox.children(".mCSB_scrollTools"),
					mCSB_draggerContainer=mCSB_scrollTools.children(".mCSB_draggerContainer"),
					mCSB_dragger=mCSB_draggerContainer.children(".mCSB_dragger");
				if(options.horizontalScroll){
					mCSB_dragger.data("minDraggerWidth",mCSB_dragger.width());
				}else{
					mCSB_dragger.data("minDraggerHeight",mCSB_dragger.height());
				}
				if(options.scrollButtons.enable){
					if(options.horizontalScroll){
						mCSB_scrollTools.prepend("<a class='mCSB_buttonLeft' oncontextmenu='return false;'></a>").append("<a class='mCSB_buttonRight' oncontextmenu='return false;'></a>");
					}else{
						mCSB_scrollTools.prepend("<a class='mCSB_buttonUp' oncontextmenu='return false;'></a>").append("<a class='mCSB_buttonDown' oncontextmenu='return false;'></a>");
					}
				}
				/*mCustomScrollBox scrollTop and scrollLeft is always 0 to prevent browser focus scrolling*/
				mCustomScrollBox.bind("scroll",function(){
					if(!$this.is(".mCS_disabled")){ /*native focus scrolling for disabled scrollbars*/
						mCustomScrollBox.scrollTop(0).scrollLeft(0);
					}
				});
				/*store options, global vars/states, intervals*/
				$this.data({
					/*init state*/
					"mCS_Init":true,
					/*instance index*/
					"mCustomScrollbarIndex":$(document).data("mCustomScrollbar-index"),
					/*option parameters*/
					"horizontalScroll":options.horizontalScroll,
					"scrollInertia":options.scrollInertia,
					"scrollEasing":"mcsEaseOut",
					"mouseWheel":options.mouseWheel,
					"mouseWheelPixels":options.mouseWheelPixels,
					"autoDraggerLength":options.autoDraggerLength,
					"autoHideScrollbar":options.autoHideScrollbar,
					"snapAmount":options.snapAmount,
					"snapOffset":options.snapOffset,
					"scrollButtons_enable":options.scrollButtons.enable,
					"scrollButtons_scrollType":options.scrollButtons.scrollType,
					"scrollButtons_scrollSpeed":options.scrollButtons.scrollSpeed,
					"scrollButtons_scrollAmount":options.scrollButtons.scrollAmount,
					"autoExpandHorizontalScroll":options.advanced.autoExpandHorizontalScroll,
					"autoScrollOnFocus":options.advanced.autoScrollOnFocus,
					"normalizeMouseWheelDelta":options.advanced.normalizeMouseWheelDelta,
					"contentTouchScroll":options.contentTouchScroll,
					"onScrollStart_Callback":options.callbacks.onScrollStart,
					"onScroll_Callback":options.callbacks.onScroll,
					"onTotalScroll_Callback":options.callbacks.onTotalScroll,
					"onTotalScrollBack_Callback":options.callbacks.onTotalScrollBack,
					"onTotalScroll_Offset":options.callbacks.onTotalScrollOffset,
					"onTotalScrollBack_Offset":options.callbacks.onTotalScrollBackOffset,
					"whileScrolling_Callback":options.callbacks.whileScrolling,
					/*events binding state*/
					"bindEvent_scrollbar_drag":false,
					"bindEvent_content_touch":false,
					"bindEvent_scrollbar_click":false,
					"bindEvent_mousewheel":false,
					"bindEvent_buttonsContinuous_y":false,
					"bindEvent_buttonsContinuous_x":false,
					"bindEvent_buttonsPixels_y":false,
					"bindEvent_buttonsPixels_x":false,
					"bindEvent_focusin":false,
					"bindEvent_autoHideScrollbar":false,
					/*buttons intervals*/
					"mCSB_buttonScrollRight":false,
					"mCSB_buttonScrollLeft":false,
					"mCSB_buttonScrollDown":false,
					"mCSB_buttonScrollUp":false
				});
				/*max-width/max-height*/
				if(options.horizontalScroll){
					if($this.css("max-width")!=="none"){
						if(!options.advanced.updateOnContentResize){ /*needs updateOnContentResize*/
							options.advanced.updateOnContentResize=true;
						}
					}
				}else{
					if($this.css("max-height")!=="none"){
						var percentage=false,maxHeight=parseInt($this.css("max-height"));
						if($this.css("max-height").indexOf("%")>=0){
							percentage=maxHeight,
							maxHeight=$this.parent().height()*percentage/100;
						}
						$this.css("overflow","hidden");
						mCustomScrollBox.css("max-height",maxHeight);
					}
				}
				$this.mCustomScrollbar("update");
				/*window resize fn (for layouts based on percentages)*/
				if(options.advanced.updateOnBrowserResize){
					var mCSB_resizeTimeout,currWinWidth=$(window).width(),currWinHeight=$(window).height();
					$(window).bind("resize."+$this.data("mCustomScrollbarIndex"),function(){
						if(mCSB_resizeTimeout){
							clearTimeout(mCSB_resizeTimeout);
						}
						mCSB_resizeTimeout=setTimeout(function(){
							if(!$this.is(".mCS_disabled") && !$this.is(".mCS_destroyed")){
								var winWidth=$(window).width(),winHeight=$(window).height();
								if(currWinWidth!==winWidth || currWinHeight!==winHeight){ /*ie8 fix*/
									if($this.css("max-height")!=="none" && percentage){
										mCustomScrollBox.css("max-height",$this.parent().height()*percentage/100);
									}
									$this.mCustomScrollbar("update");
									currWinWidth=winWidth; currWinHeight=winHeight;
								}
							}
						},150);
					});
				}
				/*content resize fn (for dynamically generated content)*/
				if(options.advanced.updateOnContentResize){
					var mCSB_onContentResize;
					if(options.horizontalScroll){
						var mCSB_containerOldSize=mCSB_container.outerWidth();
					}else{
						var mCSB_containerOldSize=mCSB_container.outerHeight();
					}
					mCSB_onContentResize=setInterval(function(){
						if(options.horizontalScroll){
							if(options.advanced.autoExpandHorizontalScroll){
								mCSB_container.css({"position":"absolute","width":"auto"}).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({"width":mCSB_container.outerWidth(),"position":"relative"}).unwrap();
							}
							var mCSB_containerNewSize=mCSB_container.outerWidth();
						}else{
							var mCSB_containerNewSize=mCSB_container.outerHeight();
						}
						if(mCSB_containerNewSize!=mCSB_containerOldSize){
							$this.mCustomScrollbar("update");
							mCSB_containerOldSize=mCSB_containerNewSize;
						}
					},300);
				}
			});
		},
		update:function(){
			var $this=$(this),
				mCustomScrollBox=$this.children(".mCustomScrollBox"),
				mCSB_container=mCustomScrollBox.children(".mCSB_container");
			mCSB_container.removeClass("mCS_no_scrollbar");
			$this.removeClass("mCS_disabled mCS_destroyed");
			mCustomScrollBox.scrollTop(0).scrollLeft(0); /*reset scrollTop/scrollLeft to prevent browser focus scrolling*/
			var mCSB_scrollTools=mCustomScrollBox.children(".mCSB_scrollTools"),
				mCSB_draggerContainer=mCSB_scrollTools.children(".mCSB_draggerContainer"),
				mCSB_dragger=mCSB_draggerContainer.children(".mCSB_dragger");
			if($this.data("horizontalScroll")){
				var mCSB_buttonLeft=mCSB_scrollTools.children(".mCSB_buttonLeft"),
					mCSB_buttonRight=mCSB_scrollTools.children(".mCSB_buttonRight"),
					mCustomScrollBoxW=mCustomScrollBox.width();
				if($this.data("autoExpandHorizontalScroll")){
					mCSB_container.css({"position":"absolute","width":"auto"}).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({"width":mCSB_container.outerWidth(),"position":"relative"}).unwrap();
				}
				var mCSB_containerW=mCSB_container.outerWidth();
			}else{
				var mCSB_buttonUp=mCSB_scrollTools.children(".mCSB_buttonUp"),
					mCSB_buttonDown=mCSB_scrollTools.children(".mCSB_buttonDown"),
					mCustomScrollBoxH=mCustomScrollBox.height(),
					mCSB_containerH=mCSB_container.outerHeight();
			}
			if(mCSB_containerH>mCustomScrollBoxH && !$this.data("horizontalScroll")){ /*content needs vertical scrolling*/
				mCSB_scrollTools.css("display","block");
				var mCSB_draggerContainerH=mCSB_draggerContainer.height();
				/*auto adjust scrollbar dragger length analogous to content*/
				if($this.data("autoDraggerLength")){
					var draggerH=Math.round(mCustomScrollBoxH/mCSB_containerH*mCSB_draggerContainerH),
						minDraggerH=mCSB_dragger.data("minDraggerHeight");
					if(draggerH<=minDraggerH){ /*min dragger height*/
						mCSB_dragger.css({"height":minDraggerH});
					}else if(draggerH>=mCSB_draggerContainerH-10){ /*max dragger height*/
						var mCSB_draggerContainerMaxH=mCSB_draggerContainerH-10;
						mCSB_dragger.css({"height":mCSB_draggerContainerMaxH});
					}else{
						mCSB_dragger.css({"height":draggerH});
					}
					mCSB_dragger.children(".mCSB_dragger_bar").css({"line-height":mCSB_dragger.height()+"px"});
				}
				var mCSB_draggerH=mCSB_dragger.height(),
				/*calculate and store scroll amount, add scrolling*/
					scrollAmount=(mCSB_containerH-mCustomScrollBoxH)/(mCSB_draggerContainerH-mCSB_draggerH);
				$this.data("scrollAmount",scrollAmount).mCustomScrollbar("scrolling",mCustomScrollBox,mCSB_container,mCSB_draggerContainer,mCSB_dragger,mCSB_buttonUp,mCSB_buttonDown,mCSB_buttonLeft,mCSB_buttonRight);
				/*scroll*/
				var mCSB_containerP=Math.abs(mCSB_container.position().top);
				$this.mCustomScrollbar("scrollTo",mCSB_containerP,{scrollInertia:0,trigger:"internal"});
			}else if(mCSB_containerW>mCustomScrollBoxW && $this.data("horizontalScroll")){ /*content needs horizontal scrolling*/
				mCSB_scrollTools.css("display","block");
				var mCSB_draggerContainerW=mCSB_draggerContainer.width();
				/*auto adjust scrollbar dragger length analogous to content*/
				if($this.data("autoDraggerLength")){
					var draggerW=Math.round(mCustomScrollBoxW/mCSB_containerW*mCSB_draggerContainerW),
						minDraggerW=mCSB_dragger.data("minDraggerWidth");
					if(draggerW<=minDraggerW){ /*min dragger height*/
						mCSB_dragger.css({"width":minDraggerW});
					}else if(draggerW>=mCSB_draggerContainerW-10){ /*max dragger height*/
						var mCSB_draggerContainerMaxW=mCSB_draggerContainerW-10;
						mCSB_dragger.css({"width":mCSB_draggerContainerMaxW});
					}else{
						mCSB_dragger.css({"width":draggerW});
					}
				}
				var mCSB_draggerW=mCSB_dragger.width(),
				/*calculate and store scroll amount, add scrolling*/
					scrollAmount=(mCSB_containerW-mCustomScrollBoxW)/(mCSB_draggerContainerW-mCSB_draggerW);
				$this.data("scrollAmount",scrollAmount).mCustomScrollbar("scrolling",mCustomScrollBox,mCSB_container,mCSB_draggerContainer,mCSB_dragger,mCSB_buttonUp,mCSB_buttonDown,mCSB_buttonLeft,mCSB_buttonRight);
				/*scroll*/
				var mCSB_containerP=Math.abs(mCSB_container.position().left);
				$this.mCustomScrollbar("scrollTo",mCSB_containerP,{scrollInertia:0,trigger:"internal"});
			}else{ /*content does not need scrolling*/
				/*unbind events, reset content position, hide scrollbars, remove classes*/
				mCustomScrollBox.unbind("mousewheel focusin");
				if($this.data("horizontalScroll")){
					mCSB_dragger.add(mCSB_container).css("left",0);
				}else{
					mCSB_dragger.add(mCSB_container).css("top",0);
				}
				mCSB_scrollTools.css("display","none");
				mCSB_container.addClass("mCS_no_scrollbar");
				$this.data({"bindEvent_mousewheel":false,"bindEvent_focusin":false});
			}
		},
		scrolling:function(mCustomScrollBox,mCSB_container,mCSB_draggerContainer,mCSB_dragger,mCSB_buttonUp,mCSB_buttonDown,mCSB_buttonLeft,mCSB_buttonRight){
			var $this=$(this);
			/*scrollbar drag scrolling*/
			if(!$this.data("bindEvent_scrollbar_drag")){
				var mCSB_draggerDragY,mCSB_draggerDragX;
				if($.support.msPointer){ /*MSPointer*/
					mCSB_dragger.bind("MSPointerDown",function(e){
						e.preventDefault();
						$this.data({"on_drag":true}); mCSB_dragger.addClass("mCSB_dragger_onDrag");
						var elem=$(this),
							elemOffset=elem.offset(),
							x=e.originalEvent.pageX-elemOffset.left,
							y=e.originalEvent.pageY-elemOffset.top;
						if(x<elem.width() && x>0 && y<elem.height() && y>0){
							mCSB_draggerDragY=y;
							mCSB_draggerDragX=x;
						}
					});
					$(document).bind("MSPointerMove."+$this.data("mCustomScrollbarIndex"),function(e){
						e.preventDefault();
						if($this.data("on_drag")){
							var elem=mCSB_dragger,
								elemOffset=elem.offset(),
								x=e.originalEvent.pageX-elemOffset.left,
								y=e.originalEvent.pageY-elemOffset.top;
							scrollbarDrag(mCSB_draggerDragY,mCSB_draggerDragX,y,x);
						}
					}).bind("MSPointerUp."+$this.data("mCustomScrollbarIndex"),function(e){
						$this.data({"on_drag":false}); mCSB_dragger.removeClass("mCSB_dragger_onDrag");
					});
				}else{ /*mouse/touch*/
					mCSB_dragger.bind("mousedown touchstart",function(e){
						e.preventDefault(); e.stopImmediatePropagation();
						var	elem=$(this),elemOffset=elem.offset(),x,y;
						if(e.type==="touchstart"){
							var touch=e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
							x=touch.pageX-elemOffset.left; y=touch.pageY-elemOffset.top;
						}else{
							$this.data({"on_drag":true}); mCSB_dragger.addClass("mCSB_dragger_onDrag");
							x=e.pageX-elemOffset.left; y=e.pageY-elemOffset.top;
						}
						if(x<elem.width() && x>0 && y<elem.height() && y>0){
							mCSB_draggerDragY=y; mCSB_draggerDragX=x;
						}
					}).bind("touchmove",function(e){
						e.preventDefault(); e.stopImmediatePropagation();
						var touch=e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
							elem=$(this),
							elemOffset=elem.offset(),
							x=touch.pageX-elemOffset.left,
							y=touch.pageY-elemOffset.top;
						scrollbarDrag(mCSB_draggerDragY,mCSB_draggerDragX,y,x);
					});
					$(document).bind("mousemove."+$this.data("mCustomScrollbarIndex"),function(e){
						if($this.data("on_drag")){
							var elem=mCSB_dragger,
								elemOffset=elem.offset(),
								x=e.pageX-elemOffset.left,
								y=e.pageY-elemOffset.top;
							scrollbarDrag(mCSB_draggerDragY,mCSB_draggerDragX,y,x);
						}
					}).bind("mouseup."+$this.data("mCustomScrollbarIndex"),function(e){
						$this.data({"on_drag":false}); mCSB_dragger.removeClass("mCSB_dragger_onDrag");
					});
				}
				$this.data({"bindEvent_scrollbar_drag":true});
			}
			function scrollbarDrag(mCSB_draggerDragY,mCSB_draggerDragX,y,x){
				if($this.data("horizontalScroll")){
					$this.mCustomScrollbar("scrollTo",(mCSB_dragger.position().left-(mCSB_draggerDragX))+x,{moveDragger:true,trigger:"internal"});
				}else{
					$this.mCustomScrollbar("scrollTo",(mCSB_dragger.position().top-(mCSB_draggerDragY))+y,{moveDragger:true,trigger:"internal"});
				}
			}
			/*content touch-drag*/
			if($.support.touch && $this.data("contentTouchScroll")){
				if(!$this.data("bindEvent_content_touch")){
					var touch,
						elem,elemOffset,y,x,mCSB_containerTouchY,mCSB_containerTouchX;
					mCSB_container.bind("touchstart",function(e){
						e.stopImmediatePropagation();
						touch=e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
						elem=$(this);
						elemOffset=elem.offset();
						x=touch.pageX-elemOffset.left;
						y=touch.pageY-elemOffset.top;
						mCSB_containerTouchY=y;
						mCSB_containerTouchX=x;
					});
					mCSB_container.bind("touchmove",function(e){
						e.preventDefault(); e.stopImmediatePropagation();
						touch=e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
						elem=$(this).parent();
						elemOffset=elem.offset();
						x=touch.pageX-elemOffset.left;
						y=touch.pageY-elemOffset.top;
						if($this.data("horizontalScroll")){
							$this.mCustomScrollbar("scrollTo",mCSB_containerTouchX-x,{trigger:"internal"});
						}else{
							$this.mCustomScrollbar("scrollTo",mCSB_containerTouchY-y,{trigger:"internal"});
						}
					});
				}
			}
			/*dragger rail click scrolling*/
			if(!$this.data("bindEvent_scrollbar_click")){
				mCSB_draggerContainer.bind("click",function(e){
					var scrollToPos=(e.pageY-mCSB_draggerContainer.offset().top)*$this.data("scrollAmount"),target=$(e.target);
					if($this.data("horizontalScroll")){
						scrollToPos=(e.pageX-mCSB_draggerContainer.offset().left)*$this.data("scrollAmount");
					}
					if(target.hasClass("mCSB_draggerContainer") || target.hasClass("mCSB_draggerRail")){
						$this.mCustomScrollbar("scrollTo",scrollToPos,{trigger:"internal",scrollEasing:"draggerRailEase"});
					}
				});
				$this.data({"bindEvent_scrollbar_click":true});
			}
			/*mousewheel scrolling*/
			if($this.data("mouseWheel")){
				if(!$this.data("bindEvent_mousewheel")){
					mCustomScrollBox.bind("mousewheel",function(e,delta){
						var scrollTo,mouseWheelPixels=$this.data("mouseWheelPixels"),absPos=Math.abs(mCSB_container.position().top),
							draggerPos=mCSB_dragger.position().top,limit=mCSB_draggerContainer.height()-mCSB_dragger.height();
						if($this.data("normalizeMouseWheelDelta")){
							if(delta<0){delta=-1;}else{delta=1;}
						}
						if(mouseWheelPixels==="auto"){
							mouseWheelPixels=100+Math.round($this.data("scrollAmount")/2);
						}
						if($this.data("horizontalScroll")){
							draggerPos=mCSB_dragger.position().left; 
							limit=mCSB_draggerContainer.width()-mCSB_dragger.width();
							absPos=Math.abs(mCSB_container.position().left);
						}
						if((delta>0 && draggerPos!==0) || (delta<0 && draggerPos!==limit)){e.preventDefault(); e.stopImmediatePropagation();}
						scrollTo=absPos-(delta*mouseWheelPixels);
						$this.mCustomScrollbar("scrollTo",scrollTo,{trigger:"internal"});
					});
					$this.data({"bindEvent_mousewheel":true});
				}
			}
			/*buttons scrolling*/
			if($this.data("scrollButtons_enable")){
				if($this.data("scrollButtons_scrollType")==="pixels"){ /*scroll by pixels*/
					if($this.data("horizontalScroll")){
						mCSB_buttonRight.add(mCSB_buttonLeft).unbind("mousedown touchstart MSPointerDown mouseup MSPointerUp mouseout MSPointerOut touchend",mCSB_buttonRight_stop,mCSB_buttonLeft_stop);
						$this.data({"bindEvent_buttonsContinuous_x":false});
						if(!$this.data("bindEvent_buttonsPixels_x")){
							/*scroll right*/
							mCSB_buttonRight.bind("click",function(e){
								e.preventDefault();
								PixelsScrollTo(Math.abs(mCSB_container.position().left)+$this.data("scrollButtons_scrollAmount"));
							});
							/*scroll left*/
							mCSB_buttonLeft.bind("click",function(e){
								e.preventDefault();
								PixelsScrollTo(Math.abs(mCSB_container.position().left)-$this.data("scrollButtons_scrollAmount"));
							});
							$this.data({"bindEvent_buttonsPixels_x":true});
						}
					}else{
						mCSB_buttonDown.add(mCSB_buttonUp).unbind("mousedown touchstart MSPointerDown mouseup MSPointerUp mouseout MSPointerOut touchend",mCSB_buttonRight_stop,mCSB_buttonLeft_stop);
						$this.data({"bindEvent_buttonsContinuous_y":false});
						if(!$this.data("bindEvent_buttonsPixels_y")){
							/*scroll down*/
							mCSB_buttonDown.bind("click",function(e){
								e.preventDefault();
								PixelsScrollTo(Math.abs(mCSB_container.position().top)+$this.data("scrollButtons_scrollAmount"));
							});
							/*scroll up*/
							mCSB_buttonUp.bind("click",function(e){
								e.preventDefault();
								PixelsScrollTo(Math.abs(mCSB_container.position().top)-$this.data("scrollButtons_scrollAmount"));
							});
							$this.data({"bindEvent_buttonsPixels_y":true});
						}
					}
					function PixelsScrollTo(to){
						if(!mCSB_dragger.data("preventAction")){
							mCSB_dragger.data("preventAction",true);
							$this.mCustomScrollbar("scrollTo",to,{trigger:"internal"});
						}
					}
				}else{ /*continuous scrolling*/
					if($this.data("horizontalScroll")){
						mCSB_buttonRight.add(mCSB_buttonLeft).unbind("click");
						$this.data({"bindEvent_buttonsPixels_x":false});
						if(!$this.data("bindEvent_buttonsContinuous_x")){
							/*scroll right*/
							mCSB_buttonRight.bind("mousedown touchstart MSPointerDown",function(e){
								e.preventDefault();
								var scrollButtonsSpeed=ScrollButtonsSpeed();
								$this.data({"mCSB_buttonScrollRight":setInterval(function(){
									$this.mCustomScrollbar("scrollTo",Math.abs(mCSB_container.position().left)+scrollButtonsSpeed,{trigger:"internal",scrollEasing:"easeOutCirc"});
								},17)});
							});
							var mCSB_buttonRight_stop=function(e){
								e.preventDefault(); clearInterval($this.data("mCSB_buttonScrollRight"));
							}
							mCSB_buttonRight.bind("mouseup touchend MSPointerUp mouseout MSPointerOut",mCSB_buttonRight_stop);
							/*scroll left*/
							mCSB_buttonLeft.bind("mousedown touchstart MSPointerDown",function(e){
								e.preventDefault();
								var scrollButtonsSpeed=ScrollButtonsSpeed();
								$this.data({"mCSB_buttonScrollLeft":setInterval(function(){
									$this.mCustomScrollbar("scrollTo",Math.abs(mCSB_container.position().left)-scrollButtonsSpeed,{trigger:"internal",scrollEasing:"easeOutCirc"});
								},17)});
							});	
							var mCSB_buttonLeft_stop=function(e){
								e.preventDefault(); clearInterval($this.data("mCSB_buttonScrollLeft"));
							}
							mCSB_buttonLeft.bind("mouseup touchend MSPointerUp mouseout MSPointerOut",mCSB_buttonLeft_stop);
							$this.data({"bindEvent_buttonsContinuous_x":true});
						}
					}else{
						mCSB_buttonDown.add(mCSB_buttonUp).unbind("click");
						$this.data({"bindEvent_buttonsPixels_y":false});
						if(!$this.data("bindEvent_buttonsContinuous_y")){
							/*scroll down*/
							mCSB_buttonDown.bind("mousedown touchstart MSPointerDown",function(e){
								e.preventDefault();
								var scrollButtonsSpeed=ScrollButtonsSpeed();
								$this.data({"mCSB_buttonScrollDown":setInterval(function(){
									$this.mCustomScrollbar("scrollTo",Math.abs(mCSB_container.position().top)+scrollButtonsSpeed,{trigger:"internal",scrollEasing:"easeOutCirc"});
								},17)});
							});
							var mCSB_buttonDown_stop=function(e){
								e.preventDefault(); clearInterval($this.data("mCSB_buttonScrollDown"));
							}
							mCSB_buttonDown.bind("mouseup touchend MSPointerUp mouseout MSPointerOut",mCSB_buttonDown_stop);
							/*scroll up*/
							mCSB_buttonUp.bind("mousedown touchstart MSPointerDown",function(e){
								e.preventDefault();
								var scrollButtonsSpeed=ScrollButtonsSpeed();
								$this.data({"mCSB_buttonScrollUp":setInterval(function(){
									$this.mCustomScrollbar("scrollTo",Math.abs(mCSB_container.position().top)-scrollButtonsSpeed,{trigger:"internal",scrollEasing:"easeOutCirc"});
								},17)});
							});	
							var mCSB_buttonUp_stop=function(e){
								e.preventDefault(); clearInterval($this.data("mCSB_buttonScrollUp"));
							}
							mCSB_buttonUp.bind("mouseup touchend MSPointerUp mouseout MSPointerOut",mCSB_buttonUp_stop);
							$this.data({"bindEvent_buttonsContinuous_y":true});
						}
					}
					function ScrollButtonsSpeed(){
						var speed=$this.data("scrollButtons_scrollSpeed");
						if($this.data("scrollButtons_scrollSpeed")==="auto"){
							speed=Math.round(($this.data("scrollInertia")+100)/40);
						}
						return speed;
					}
				}
			}
			/*scrolling on element focus (e.g. via TAB key)*/
			if($this.data("autoScrollOnFocus")){
				if(!$this.data("bindEvent_focusin")){
					mCustomScrollBox.bind("focusin",function(){
						mCustomScrollBox.scrollTop(0).scrollLeft(0);
						var focusedElem=$(document.activeElement);
						if(focusedElem.is("input,textarea,select,button,a[tabindex],area,object")){
							var mCSB_containerPos=mCSB_container.position().top,
								focusedElemPos=focusedElem.position().top,
								visibleLimit=mCustomScrollBox.height()-focusedElem.outerHeight();
							if($this.data("horizontalScroll")){
								mCSB_containerPos=mCSB_container.position().left;
								focusedElemPos=focusedElem.position().left;
								visibleLimit=mCustomScrollBox.width()-focusedElem.outerWidth();
							}
							if(mCSB_containerPos+focusedElemPos<0 || mCSB_containerPos+focusedElemPos>visibleLimit){
								$this.mCustomScrollbar("scrollTo",focusedElemPos,{trigger:"internal"});
							}
						}
					});
					$this.data({"bindEvent_focusin":true});
				}
			}
			/*auto-hide scrollbar*/
			if($this.data("autoHideScrollbar")){
				if(!$this.data("bindEvent_autoHideScrollbar")){
					mCustomScrollBox.bind("mouseenter",function(e){
						mCustomScrollBox.addClass("mCS-mouse-over");
						functions.showScrollbar.call(mCustomScrollBox.children(".mCSB_scrollTools"));
					}).bind("mouseleave touchend",function(e){
						mCustomScrollBox.removeClass("mCS-mouse-over");
						if(e.type==="mouseleave"){functions.hideScrollbar.call(mCustomScrollBox.children(".mCSB_scrollTools"));}
					});
					$this.data({"bindEvent_autoHideScrollbar":true});
				}
			}
		},
		scrollTo:function(scrollTo,options){
			var $this=$(this),
				defaults={
					moveDragger:false,
					trigger:"external",
					callbacks:true,
					scrollInertia:$this.data("scrollInertia"),
					scrollEasing:$this.data("scrollEasing")
				},
				options=$.extend(defaults,options),
				draggerScrollTo,
				mCustomScrollBox=$this.children(".mCustomScrollBox"),
				mCSB_container=mCustomScrollBox.children(".mCSB_container"),
				mCSB_scrollTools=mCustomScrollBox.children(".mCSB_scrollTools"),
				mCSB_draggerContainer=mCSB_scrollTools.children(".mCSB_draggerContainer"),
				mCSB_dragger=mCSB_draggerContainer.children(".mCSB_dragger"),
				contentSpeed=draggerSpeed=options.scrollInertia,
				scrollBeginning,scrollBeginningOffset,totalScroll,totalScrollOffset;
			if(!mCSB_container.hasClass("mCS_no_scrollbar")){
				$this.data({"mCS_trigger":options.trigger});
				if($this.data("mCS_Init")){options.callbacks=false;}
				if(scrollTo || scrollTo===0){
					if(typeof(scrollTo)==="number"){ /*if integer, scroll by number of pixels*/
						if(options.moveDragger){ /*scroll dragger*/
							draggerScrollTo=scrollTo;
							if($this.data("horizontalScroll")){
								scrollTo=mCSB_dragger.position().left*$this.data("scrollAmount");
							}else{
								scrollTo=mCSB_dragger.position().top*$this.data("scrollAmount");
							}
							draggerSpeed=0;
						}else{ /*scroll content by default*/
							draggerScrollTo=scrollTo/$this.data("scrollAmount");
						}
					}else if(typeof(scrollTo)==="string"){ /*if string, scroll by element position*/
						var target;
						if(scrollTo==="top"){ /*scroll to top*/
							target=0;
						}else if(scrollTo==="bottom" && !$this.data("horizontalScroll")){ /*scroll to bottom*/
							target=mCSB_container.outerHeight()-mCustomScrollBox.height();
						}else if(scrollTo==="left"){ /*scroll to left*/
							target=0;
						}else if(scrollTo==="right" && $this.data("horizontalScroll")){ /*scroll to right*/
							target=mCSB_container.outerWidth()-mCustomScrollBox.width();
						}else if(scrollTo==="first"){ /*scroll to first element position*/
							target=$this.find(".mCSB_container").find(":first");
						}else if(scrollTo==="last"){ /*scroll to last element position*/
							target=$this.find(".mCSB_container").find(":last");
						}else{ /*scroll to element position*/
							target=$this.find(scrollTo);
						}
						if(target.length===1){ /*if such unique element exists, scroll to it*/
							if($this.data("horizontalScroll")){
								scrollTo=target.position().left;
							}else{
								scrollTo=target.position().top;
							}
							draggerScrollTo=scrollTo/$this.data("scrollAmount");
						}else{
							draggerScrollTo=scrollTo=target;
						}
					}
					/*scroll to*/
					if($this.data("horizontalScroll")){
						if($this.data("onTotalScrollBack_Offset")){ /*scroll beginning offset*/
							scrollBeginningOffset=-$this.data("onTotalScrollBack_Offset");
						}
						if($this.data("onTotalScroll_Offset")){ /*total scroll offset*/
							totalScrollOffset=mCustomScrollBox.width()-mCSB_container.outerWidth()+$this.data("onTotalScroll_Offset");
						}
						if(draggerScrollTo<0){ /*scroll start position*/
							draggerScrollTo=scrollTo=0; clearInterval($this.data("mCSB_buttonScrollLeft"));
							if(!scrollBeginningOffset){scrollBeginning=true;}
						}else if(draggerScrollTo>=mCSB_draggerContainer.width()-mCSB_dragger.width()){ /*scroll end position*/
							draggerScrollTo=mCSB_draggerContainer.width()-mCSB_dragger.width();
							scrollTo=mCustomScrollBox.width()-mCSB_container.outerWidth(); clearInterval($this.data("mCSB_buttonScrollRight"));
							if(!totalScrollOffset){totalScroll=true;}
						}else{scrollTo=-scrollTo;}
						var snapAmount = $this.data("snapAmount");
						if (snapAmount) {
							scrollTo = Math.round(scrollTo / snapAmount) * snapAmount - $this.data("snapOffset");
						}
						/*scrolling animation*/
						functions.mTweenAxis.call(this,mCSB_dragger[0],"left",Math.round(draggerScrollTo),draggerSpeed,options.scrollEasing);
						functions.mTweenAxis.call(this,mCSB_container[0],"left",Math.round(scrollTo),contentSpeed,options.scrollEasing,{
							onStart:function(){
								if(options.callbacks && !$this.data("mCS_tweenRunning")){callbacks("onScrollStart");}
								if($this.data("autoHideScrollbar")){functions.showScrollbar.call(mCSB_scrollTools);}
							},
							onUpdate:function(){
								if(options.callbacks){callbacks("whileScrolling");}
							},
							onComplete:function(){
								if(options.callbacks){
									callbacks("onScroll");
									if(scrollBeginning || (scrollBeginningOffset && mCSB_container.position().left>=scrollBeginningOffset)){callbacks("onTotalScrollBack");}
									if(totalScroll || (totalScrollOffset && mCSB_container.position().left<=totalScrollOffset)){callbacks("onTotalScroll");}
								}
								mCSB_dragger.data("preventAction",false); $this.data("mCS_tweenRunning",false);
								if($this.data("autoHideScrollbar")){if(!mCustomScrollBox.hasClass("mCS-mouse-over")){functions.hideScrollbar.call(mCSB_scrollTools);}}
							}
						});
					}else{
						if($this.data("onTotalScrollBack_Offset")){ /*scroll beginning offset*/
							scrollBeginningOffset=-$this.data("onTotalScrollBack_Offset");
						}
						if($this.data("onTotalScroll_Offset")){ /*total scroll offset*/
							totalScrollOffset=mCustomScrollBox.height()-mCSB_container.outerHeight()+$this.data("onTotalScroll_Offset");
						}
						if(draggerScrollTo<0){ /*scroll start position*/
							draggerScrollTo=scrollTo=0; clearInterval($this.data("mCSB_buttonScrollUp"));
							if(!scrollBeginningOffset){scrollBeginning=true;}
						}else if(draggerScrollTo>=mCSB_draggerContainer.height()-mCSB_dragger.height()){ /*scroll end position*/
							draggerScrollTo=mCSB_draggerContainer.height()-mCSB_dragger.height();
							scrollTo=mCustomScrollBox.height()-mCSB_container.outerHeight(); clearInterval($this.data("mCSB_buttonScrollDown"));
							if(!totalScrollOffset){totalScroll=true;}
						}else{scrollTo=-scrollTo;}
						var snapAmount = $this.data("snapAmount");
						if (snapAmount) {
							scrollTo = Math.round(scrollTo / snapAmount) * snapAmount - $this.data("snapOffset");
						}
						/*scrolling animation*/
						functions.mTweenAxis.call(this,mCSB_dragger[0],"top",Math.round(draggerScrollTo),draggerSpeed,options.scrollEasing);
						functions.mTweenAxis.call(this,mCSB_container[0],"top",Math.round(scrollTo),contentSpeed,options.scrollEasing,{
							onStart:function(){
								if(options.callbacks && !$this.data("mCS_tweenRunning")){callbacks("onScrollStart");}
								if($this.data("autoHideScrollbar")){functions.showScrollbar.call(mCSB_scrollTools);}
							},
							onUpdate:function(){
								if(options.callbacks){callbacks("whileScrolling");}
							},
							onComplete:function(){
								if(options.callbacks){
									callbacks("onScroll");
									if(scrollBeginning || (scrollBeginningOffset && mCSB_container.position().top>=scrollBeginningOffset)){callbacks("onTotalScrollBack");}
									if(totalScroll || (totalScrollOffset && mCSB_container.position().top<=totalScrollOffset)){callbacks("onTotalScroll");}
								}
								mCSB_dragger.data("preventAction",false); $this.data("mCS_tweenRunning",false);
								if($this.data("autoHideScrollbar")){if(!mCustomScrollBox.hasClass("mCS-mouse-over")){functions.hideScrollbar.call(mCSB_scrollTools);}}
							}
						});
					}
					if($this.data("mCS_Init")){$this.data({"mCS_Init":false});}
				}
			}
			/*callbacks*/
			function callbacks(cb){
				this.mcs={
					top:mCSB_container.position().top,left:mCSB_container.position().left,
					draggerTop:mCSB_dragger.position().top,draggerLeft:mCSB_dragger.position().left,
					topPct:Math.round((100*Math.abs(mCSB_container.position().top))/Math.abs(mCSB_container.outerHeight()-mCustomScrollBox.height())),
					leftPct:Math.round((100*Math.abs(mCSB_container.position().left))/Math.abs(mCSB_container.outerWidth()-mCustomScrollBox.width()))
				};
				switch(cb){
					/*start scrolling callback*/
					case "onScrollStart":
						$this.data("mCS_tweenRunning",true).data("onScrollStart_Callback").call($this,this.mcs);
						break;
					case "whileScrolling":
						$this.data("whileScrolling_Callback").call($this,this.mcs);
						break;
					case "onScroll":
						$this.data("onScroll_Callback").call($this,this.mcs);
						break;
					case "onTotalScrollBack":
						$this.data("onTotalScrollBack_Callback").call($this,this.mcs);
						break;
					case "onTotalScroll":
						$this.data("onTotalScroll_Callback").call($this,this.mcs);
						break;
				}
			}
		},
		stop:function(){
			var $this=$(this),
				mCSB_container=$this.children().children(".mCSB_container"),
				mCSB_dragger=$this.children().children().children().children(".mCSB_dragger");
			functions.mTweenAxisStop.call(this,mCSB_container[0]);
			functions.mTweenAxisStop.call(this,mCSB_dragger[0]);
		},
		disable:function(resetScroll){
			var $this=$(this),
				mCustomScrollBox=$this.children(".mCustomScrollBox"),
				mCSB_container=mCustomScrollBox.children(".mCSB_container"),
				mCSB_scrollTools=mCustomScrollBox.children(".mCSB_scrollTools"),
				mCSB_dragger=mCSB_scrollTools.children().children(".mCSB_dragger");
			mCustomScrollBox.unbind("mousewheel focusin mouseenter mouseleave touchend");
			mCSB_container.unbind("touchstart touchmove")
			if(resetScroll){
				if($this.data("horizontalScroll")){
					mCSB_dragger.add(mCSB_container).css("left",0);
				}else{
					mCSB_dragger.add(mCSB_container).css("top",0);
				}
			}
			mCSB_scrollTools.css("display","none");
			mCSB_container.addClass("mCS_no_scrollbar");
			$this.data({"bindEvent_mousewheel":false,"bindEvent_focusin":false,"bindEvent_content_touch":false,"bindEvent_autoHideScrollbar":false}).addClass("mCS_disabled");
		},
		destroy:function(){
			var $this=$(this);
			$this.removeClass("mCustomScrollbar _mCS_"+$this.data("mCustomScrollbarIndex")).addClass("mCS_destroyed").children().children(".mCSB_container").unwrap().children().unwrap().siblings(".mCSB_scrollTools").remove();
			$(document).unbind("mousemove."+$this.data("mCustomScrollbarIndex")+" mouseup."+$this.data("mCustomScrollbarIndex")+" MSPointerMove."+$this.data("mCustomScrollbarIndex")+" MSPointerUp."+$this.data("mCustomScrollbarIndex"));
			$(window).unbind("resize."+$this.data("mCustomScrollbarIndex"));
		}
	},
	functions={
		/*hide/show scrollbar*/
		showScrollbar:function(){
			this.stop().animate({opacity:1},"fast");
		},
		hideScrollbar:function(){
			this.stop().animate({opacity:0},"fast");
		},
		/*js animation tween*/
		mTweenAxis:function(el,prop,to,duration,easing,callbacks){
			var callbacks=callbacks || {},
				onStart=callbacks.onStart || function(){},onUpdate=callbacks.onUpdate || function(){},onComplete=callbacks.onComplete || function(){};
			var startTime=_getTime(),_delay,progress=0,from=el.offsetTop,elStyle=el.style;
			if(prop==="left"){from=el.offsetLeft;}
			var diff=to-from;
			_cancelTween();
			_startTween();
			function _getTime(){
				if(window.performance && window.performance.now){
					return window.performance.now();
				}else{
					if(window.performance && window.performance.webkitNow){
						return window.performance.webkitNow();
					}else{
						if(Date.now){return Date.now();}else{return new Date().getTime();}
					}
				}
			}
			function _step(){
				if(!progress){onStart.call();}
				progress=_getTime()-startTime;
				_tween();
				if(progress>=el._time){
					el._time=(progress>el._time) ? progress+_delay-(progress- el._time) : progress+_delay-1;
					if(el._time<progress+1){el._time=progress+1;}
				}
				if(el._time<duration){el._id=_request(_step);}else{onComplete.call();}
			}
			function _tween(){
				if(duration>0){
					el.currVal=_ease(el._time,from,diff,duration,easing);
					elStyle[prop]=Math.round(el.currVal)+"px";
				}else{
					elStyle[prop]=to+"px";
				}
				onUpdate.call();
			}
			function _startTween(){
				_delay=1000/60;
				el._time=progress+_delay;
				_request=(!window.requestAnimationFrame) ? function(f){_tween(); return setTimeout(f,0.01);} : window.requestAnimationFrame;
				el._id=_request(_step);
			}
			function _cancelTween(){
				if(el._id==null){return;}
				if(!window.requestAnimationFrame){clearTimeout(el._id);
				}else{window.cancelAnimationFrame(el._id);}
				el._id=null;
			}
			function _ease(t,b,c,d,type){
				switch(type){
					case "linear":
						return c*t/d + b;
						break;
					case "easeOutQuad":
						t /= d; return -c * t*(t-2) + b;
						break;
					case "easeInOutQuad":
						t /= d/2;
						if (t < 1) return c/2*t*t + b;
						t--;
						return -c/2 * (t*(t-2) - 1) + b;
						break;
					case "easeOutCubic":
						t /= d; t--; return c*(t*t*t + 1) + b;
						break;
					case "easeOutQuart":
						t /= d; t--; return -c * (t*t*t*t - 1) + b;
						break;
					case "easeOutQuint":
						t /= d; t--; return c*(t*t*t*t*t + 1) + b;
						break;
					case "easeOutCirc":
						t /= d; t--; return c * Math.sqrt(1 - t*t) + b;
						break;
					case "easeOutSine":
						return c * Math.sin(t/d * (Math.PI/2)) + b;
						break;
					case "easeOutExpo":
						return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
						break;
					case "mcsEaseOut":
						var ts=(t/=d)*t,tc=ts*t;
						return b+c*(0.499999999999997*tc*ts + -2.5*ts*ts + 5.5*tc + -6.5*ts + 4*t);
						break;
					case "draggerRailEase":
						t /= d/2;
						if (t < 1) return c/2*t*t*t + b;
						t -= 2;
						return c/2*(t*t*t + 2) + b;
						break;
				}
			}
		},
		/*stop js animation tweens*/
		mTweenAxisStop:function(el){
			if(el._id==null){return;}
			if(!window.requestAnimationFrame){clearTimeout(el._id);
			}else{window.cancelAnimationFrame(el._id);}
			el._id=null;
		},
		/*detect requestAnimationFrame and polyfill*/
		rafPolyfill:function(){
			var pfx=["ms","moz","webkit","o"],i=pfx.length;
			while(--i > -1 && !window.requestAnimationFrame){
				window.requestAnimationFrame=window[pfx[i]+"RequestAnimationFrame"];
				window.cancelAnimationFrame=window[pfx[i]+"CancelAnimationFrame"] || window[pfx[i]+"CancelRequestAnimationFrame"];
			}
		}
	}
	/*detect features*/
	functions.rafPolyfill.call(); /*requestAnimationFrame*/
	$.support.touch=!!('ontouchstart' in window); /*touch*/
	$.support.msPointer=window.navigator.msPointerEnabled; /*MSPointer support*/
	/*plugin dependencies*/
	var _dlp=("https:"==document.location.protocol) ? "https:" : "http:";
	$.event.special.mousewheel || document.write('<script src="'+_dlp+'//cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.0.6/jquery.mousewheel.min.js"><\/script>');
	/*plugin fn*/
	$.fn.mCustomScrollbar=function(method){
		if(methods[method]){
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		}else if(typeof method==="object" || !method){
			return methods.init.apply(this,arguments);
		}else{
			$.error("Method "+method+" does not exist");
		}
	};
})(jQuery);
///#source 1 1 /Content/libs/loading-bar.min.js
!function () { "use strict"; angular.module("angular-loading-bar", ["cfp.loadingBarInterceptor"]), angular.module("chieffancypants.loadingBar", ["cfp.loadingBarInterceptor"]), angular.module("cfp.loadingBarInterceptor", ["cfp.loadingBar"]).config(["$httpProvider", function (a) { var b = ["$q", "$cacheFactory", "$timeout", "$rootScope", "cfpLoadingBar", function (b, c, d, e, f) { function g() { d.cancel(i), f.complete(), k = 0, j = 0 } function h(b) { var d, e = c.get("$http"), f = a.defaults; !b.cache && !f.cache || b.cache === !1 || "GET" !== b.method && "JSONP" !== b.method || (d = angular.isObject(b.cache) ? b.cache : angular.isObject(f.cache) ? f.cache : e); var g = void 0 !== d ? void 0 !== d.get(b.url) : !1; return void 0 !== b.cached && g !== b.cached ? b.cached : (b.cached = g, g) } var i, j = 0, k = 0, l = f.latencyThreshold; return { request: function (a) { return a.ignoreLoadingBar || h(a) || (e.$broadcast("cfpLoadingBar:loading", { url: a.url }), 0 === j && (i = d(function () { f.start() }, l)), j++, f.set(k / j)), a }, response: function (a) { return a.config.ignoreLoadingBar || h(a.config) || (k++, e.$broadcast("cfpLoadingBar:loaded", { url: a.config.url, result: a }), k >= j ? g() : f.set(k / j)), a }, responseError: function (a) { return a.config.ignoreLoadingBar || h(a.config) || (k++, e.$broadcast("cfpLoadingBar:loaded", { url: a.config.url, result: a }), k >= j ? g() : f.set(k / j)), b.reject(a) } } }]; a.interceptors.push(b) }]), angular.module("cfp.loadingBar", []).provider("cfpLoadingBar", function () { this.includeSpinner = !0, this.includeBar = !0, this.latencyThreshold = 100, this.startSize = .02, this.parentSelector = "body", this.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>', this.loadingBarTemplate = '<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>', this.$get = ["$injector", "$document", "$timeout", "$rootScope", function (a, b, c, d) { function e() { k || (k = a.get("$animate")); var e = b.find(n).eq(0); c.cancel(m), r || (d.$broadcast("cfpLoadingBar:started"), r = !0, u && k.enter(o, e), t && k.enter(q, e), f(v)) } function f(a) { if (r) { var b = 100 * a + "%"; p.css("width", b), s = a, c.cancel(l), l = c(function () { g() }, 250) } } function g() { if (!(h() >= 1)) { var a = 0, b = h(); a = b >= 0 && .25 > b ? (3 * Math.random() + 3) / 100 : b >= .25 && .65 > b ? 3 * Math.random() / 100 : b >= .65 && .9 > b ? 2 * Math.random() / 100 : b >= .9 && .99 > b ? .005 : 0; var c = h() + a; f(c) } } function h() { return s } function i() { s = 0, r = !1 } function j() { k || (k = a.get("$animate")), d.$broadcast("cfpLoadingBar:completed"), f(1), c.cancel(m), m = c(function () { var a = k.leave(o, i); a && a.then && a.then(i), k.leave(q) }, 500) } var k, l, m, n = this.parentSelector, o = angular.element(this.loadingBarTemplate), p = o.find("div").eq(0), q = angular.element(this.spinnerTemplate), r = !1, s = 0, t = this.includeSpinner, u = this.includeBar, v = this.startSize; return { start: e, set: f, status: h, inc: g, complete: j, includeSpinner: this.includeSpinner, latencyThreshold: this.latencyThreshold, parentSelector: this.parentSelector, startSize: this.startSize } }] }) }();
///#source 1 1 /Content/libs/mozaic.js
/*********************
 * Utilities (util.js)
 */
Ss = window.Ss || {};
Ss.util = {};
Ss.util.disableTextSelection = function (element) {
    element.onselectstart = function () { return false; };
    element.unselectable = "on";
    element.style.MozUserSelect = "none";
};
Ss.util.getElementText = function (element) {
    var ret = $A(element.childNodes).collect(function (c) {
        if (c.nodeType != 8) {
            return (c.nodeType != 1 ? c.nodeValue : Ss.util.getElementText(c))
        }
    }).join('');
    return ret.strip();
};
Ss.util.sum = function (list, prop) {
    return list.inject(0, function (total, item) { return total + parseInt(item[prop]); });
};
Ss.util.avg = function (list, prop) {
    return Ss.util.sum(list, prop) / list.length;
};
// --------------------------------------------------------------------------------
// global.js: end JavaScript file: '/js/util.js'
// global.js: begin JavaScript file: '/js/image/mosaic/mosaic.js'
// ================================================================================
Ss = window.Ss || {};
Ss.image = Ss.image || {};

Ss.image.mosaic = {

    options: {
        margin: 3,
        size: 150,
        border: 1
    },

    constraints: {
        minWidth: 50,
        maxWidth: 170,
        tolerance: 0.20,
        minHeight: 88
    },

    initialize: function (args) {
        this.element = args.element; //this one is changes args.element
        this.grid = new Ss.image.mosaic.Grid();

        this._events();
    },

    isActive: function () {
        return Ss.search.thumbSize && Ss.search.thumbSize == 'mosaic';
    },

    update: function (images) {
        if (!Object.isArray(images) || !images.length) {
            return;
        }
        images.each(function (image) {
            image.width = image.width || image.thumb_width;
            image.height = image.height || image.thumb_height;
        });
        this.rows = this.grid.create(images, this.options, this.constraints);
        this.element.update(this.makeHTML(this.rows));
        this.images = images;
    },

    layout: function (targetWidth) {
        var mosaic = Ss.image.mosaic;
        targetWidth = (Object.isNumber(targetWidth) ? targetWidth : mosaic.element.getWidth());
        if (!targetWidth || mosaic.grid.getWidth() == targetWidth) {
            return;
        }
        mosaic.grid.setWidth(targetWidth);
        mosaic._layout();
    },

    _layout: function () {
        var cells = this.readCells();
        var rows = this.grid.create(cells, this.options, this.constraints);

        rows.flatten().each(function (cell) {
            var top = '';
            if (cell.data.type == 'maxWidth') {
                top = Math.floor((cell.data.containerHeight - cell.data.height) / 2) + 'px';
            }
            cell.elements.clipper.setStyle({
                'width': Math.floor(cell.data.width) + 'px',
                'height': Math.floor(cell.data.height) + 'px',
                'top': top
            });
            cell.elements.anchor.setStyle({
                'width': Math.floor(cell.data.containerWidth) + 'px',
                'height': Math.floor(cell.data.containerHeight) + 'px'
            });
        });
    },

    readCells: function () {
        return this.element.select('.mosaic_cell').map(function (cell) {
            return {
                width: parseInt(cell.getAttribute('data-width')),
                height: parseInt(cell.getAttribute('data-height')),
                aspect: cell.getAttribute('data-aspect'),
                elements: {
                    anchor: cell.down('a'),
                    clipper: cell.down('.gc_clip')
                }
            };
        });
    },

    makeHTML: function (rows) {
        var html = [];

        rows.flatten().each(function (image) {
            var clipperStyles = [
				 'width:' + Math.floor(image.data.width) + 'px',
				 'height:' + Math.floor(image.data.height) + 'px'
            ];
            var containerStyles = [
				'width:' + Math.floor(image.data.containerWidth) + 'px',
				'height:' + Math.floor(image.data.containerHeight) + 'px'
            ];
            if (image.data.type == 'maxWidth') {
                var vCenter = Math.floor((image.data.containerHeight - image.data.height) / 2);
                clipperStyles.push('top:' + vCenter + 'px');
            }

            html.push('<div class="mosaic_cell" data-id="' + image.id + '" data-width="' + image.width + '" data-height="' + image.height + '" data-aspect="' + image.aspect + '">');
            html.push('    <a href="' + image.photo_detail_link + '" style="' + containerStyles.join(';') + '">');
            html.push('        <span class="gc_clip" style="' + clipperStyles.join(';') + '">')
            html.push('            <img src="' + image.thumb_url + '" alt="' + (image.full_description || '') + '" />');
            html.push('        </span>');
            //html.push('        <span class="gc_desc">' + image.display_description + '</span>');
            //html.push('        <span class="gc_btns">');
            //html.push('            <span class="lbx_btn"></span>');
            //html.push('            <span class="pic_btn"></span>');
            //html.push('        </span>');
            html.push('    </a>');
            html.push('</div>');
        });
        return html.join('');
    },

    _resize: function () {
        this.layout(this.element.getWidth());
    },

    resize: function (width) {
        this.layout(width);
    },
    _events: function () {
        var resize = this._resize.bind(this);
        //Event.observe(this.element, 'resize', resize);
        //Event.observe(window, 'focus', resize);
    }

};
// --------------------------------------------------------------------------------
// global.js: end JavaScript file: '/js/image/mosaic/mosaic.js'

// global.js: begin JavaScript file: '/js/image/mosaic/Grid.js'
// ================================================================================
Ss.image.mosaic.Grid = Class.create({

    initialize: function () {

    },

    setWidth: function (width) {
        this.width = width;
    },

    getWidth: function () {
        return this.width;
    },

    create: function (images, options, constraints) {
        var instance = this;

        this._scale(images, options.size);

        var rows = [new Ss.image.mosaic.Row(instance.width, options, constraints)];
        images.each(
            function (image, i) {
                var fits = rows.last().addImage(image);
                if (!fits) {
                    rows.push(new Ss.image.mosaic.Row(instance.width, options, constraints));
                    rows.last().addImage(image);
                }
            }
        );
        return rows.map(
            function (row) {
                return row.getImages();
            }
        );
    },





    _scale: function (images, size) {
        if (images[0].width == size || images[0].height == size) {
            return;
        }
        var scale = size / 450;
        images.each(function (image) {
            image.width *= scale;
            image.height *= scale;
        });
        return images;
    }

});
// --------------------------------------------------------------------------------
// global.js: end JavaScript file: '/js/image/mosaic/Grid.js'

// global.js: begin JavaScript file: '/js/image/mosaic/Row.js'
// ================================================================================
Ss.image.mosaic.Row = Class.create({

    initialize: function (width, options, constraints) {
        this.width = width;
        this.margin = options.margin || 5;
        this.border = options.border || 0;
        this.size = options.size;
        this.constraints = constraints;

        this.images = [];
        this.height = null;
    },

    getImages: function () {
        return this.images;
    },

    getImagesByType: function () {
        return this.images.inject({}, function (types, image) {
            if (image.data) {
                types[image.data.type] = types[image.data.type] || [];
                types[image.data.type].push(image);
            }
            return types;
        });
    },

    addImage: function (image) {


        if (!this.hasRemainingPixels()) {
            this.setWidth(this.numUsablePixels());
            return false;
        }


        this.images.push(image);


        this.setHeight(this._calculateHeight());


        this._handleMinorConstraintViolations();


        if (!this.hasRemainingPixels()) {
            this.setWidth(this.numUsablePixels());
        }
        return true;
    },

    setHeight: function (height, setContainers) {
        this.height = height;
        var constraints = this.constraints;
        var cells = this.images.map(function (image) {
            return new Ss.image.mosaic.Cell(image, constraints);
        });
        return cells.invoke('setHeight', height, setContainers);
    },


    setWidth: function (width) {


        var rowHeight = width / this.numUsedPixels() * this.height;
        this.setHeight(rowHeight, true);
        this._fixRoundingError(width);
    },

    numUsedPixels: function () {
        return Ss.util.sum(this.images.pluck('data'), 'containerWidth');
    },

    numUsablePixels: function () {
        return this.width - this.numUnusablePixels();
    },

    numUnusablePixels: function () {
        return (this.margin * 2 + this.border * 2) * this.images.length;
    },

    numRemainingPixels: function () {
        return this.numUsablePixels() - this.numUsedPixels();
    },

    hasRemainingPixels: function () {
        return this.numRemainingPixels() > 0;
    },

    _calculateHeight: function () {

        var rowHeight = Ss.util.avg(this.images, 'height');


        var types = this.getImagesByType();


        if (types.maxWidth) {
            var candidates = [];
            $H(types).each(function (type) {
                if (type.key != 'maxWidth') {
                    candidates = candidates.concat(type.value);
                }
            });
            if (candidates.length) {
                rowHeight = Ss.util.avg(candidates, 'height');
            }
        }


        if (this.constraints.minHeight) {
            return Math.max(rowHeight, this.constraints.minHeight);
        }

        return rowHeight;
    },


    _handleMinorConstraintViolations: function () {
        var types = this.getImagesByType();



        if (types.minWidthMinor) {

            var optimalHeight = types.minWidthMinor.pluck('data').pluck('optimalHeight').max();


            this.setHeight(optimalHeight);



            var newTypes = this.getImagesByType();
            if (types.maxWidth && newTypes.maxWidth && newTypes.maxWidth.length <= types.maxWidth.length) {
                this.height = optimalHeight;
                types = newTypes;
            } else {
                this.setHeight(this.height);
            }
        }



        if (types.maxWidthMinor) {
            types.maxWidthMinor.each(
                function (image) {
                    image.data.width = image.data.containerWidth = image.data.optimalWidth;
                    image.data.height = image.data.containerHeight = image.data.optimalHeight;
                }
            );
        }

    },

    _fixRoundingError: function (width) {
        var error = this.numUsedPixels() - width;
        var errorPerImage = error / this.images.length;
        var accumulatedError = 0;
        var rounded;
        if (!error) {
            return;
        }
        this.images.each(
            function (image) {
                accumulatedError += errorPerImage;
                rounded = Math.round(accumulatedError);
                image.data.containerWidth -= rounded;
                if (image.data.width > image.data.containerWidth) {
                    image.data.width = image.data.containerWidth;
                    image.data.height = image.data.width * 1 / image.aspect;
                }
                accumulatedError -= rounded;
            }
        );
    }

});
// --------------------------------------------------------------------------------
// global.js: end JavaScript file: '/js/image/mosaic/Row.js'

// global.js: begin JavaScript file: '/js/image/mosaic/Cell.js'
// ================================================================================
Ss.image.mosaic.Cell = Class.create({

    initialize: function (image, constraints) {
        this.image = image;
        this.constraints = constraints;
    },

    setHeight: function (height, setContainers) {
        var image = this.image;
        var constraints = this.constraints;
        var aspect = image.aspect;
        var newImageWidth = height * aspect;
        var newImageHeight, optimalHeight, optimalWidth, newContainerWidth;

        if (newImageWidth > constraints.maxWidth) { // too wide
            if (setContainers) {
                newContainerWidth = height * (image.data.containerWidth / image.data.containerHeight);
                image.data = {
                    type: 'maxWidth',
                    width: newContainerWidth,
                    height: newContainerWidth * 1 / aspect,
                    containerWidth: newContainerWidth,
                    containerHeight: height
                };
            } else {
                newImageWidth = constraints.maxWidth;
                newImageHeight = newImageWidth * 1 / aspect;
                error = (height - newImageHeight) / height;
                optimalHeight = height;
                optimalWidth = optimalHeight * aspect;
                image.data = {
                    type: (error < constraints.tolerance ? 'maxWidthMinor' : 'maxWidth'),
                    width: newImageWidth,
                    height: newImageHeight,
                    containerWidth: newImageWidth,
                    containerHeight: height,
                    optimalWidth: optimalWidth,
                    optimalHeight: optimalHeight
                };
            }
        } else if (newImageWidth < constraints.minWidth) { // too narrow
            error = (constraints.minWidth - newImageWidth) / constraints.minWidth;
            optimalWidth = constraints.minWidth + constraints.minWidth * error;
            optimalHeight = optimalWidth * 1 / aspect;
            image.data = {
                type: (error < constraints.tolerance ? 'minWidthMinor' : 'minWidth'),
                width: newImageWidth,
                height: height,
                containerWidth: constraints.minWidth,
                containerHeight: height,
                optimalWidth: optimalWidth,
                optimalHeight: optimalHeight
            };
        } else { // normal case
            image.data = {
                type: 'success',
                containerWidth: newImageWidth,
                containerHeight: height,
                width: newImageWidth,
                height: height
            };
        }
        return image;
    }

});
// --------------------------------------------------------------------------------
// global.js: end JavaScript file: '/js/image/mosaic/Cell.js'
///#source 1 1 /Content/widget_app.js
var widgetApp = angular.module("widgetApp", ["ngResource", "angular-loading-bar"])
                    .constant("SERVICES", "https://promote.shutterstock.com") 
                    //.constant("SERVICES", "http://contrib.sstk.alensa.com")
                    .constant("AZURE_URL", "https://sstkcbstorage.blob.core.windows.net");

widgetApp.config(["$sceDelegateProvider", "cfpLoadingBarProvider" , "AZURE_URL", function ($sceDelegateProvider, cfpLoadingBarProvider, AZURE_URL) {

    cfpLoadingBarProvider.includeSpinner = true;

    $sceDelegateProvider.resourceUrlWhitelist(['self', AZURE_URL + "/**"]);
}]);

///#source 1 1 /Content/controllers/data.service.js
widgetApp.factory('DataServices', ['$resource', "$http", "$window", 'SERVICES', "AZURE_URL",
        function ($resource, $http, $window, SERVICES, AZURE_URL) {
            return {
                Images: $resource(SERVICES + '/api/images/:id', { id: "@id", page: "@page", sort: "@sort", type: "all" }),
                Videos: $resource(SERVICES + '/api/videos/:id', { id: "@id", page: "@page", sort: "@sort" }),
                ProfilePhoto: $resource(SERVICES + "/api/contrib/:id/photo", { id: "@id" }),
                ContribStats: $resource(SERVICES + "/api/contrib/:id/stats", { id: "@id" }),
                Sets: $resource(SERVICES + "/api/contrib/:id/sets", { id: "@id" }),
                SetItems: $resource(SERVICES + "/api/contrib/:contrib_id/sets/:id", { contrib_id: "@contrib_id", id: "@id" }),
                SaveWidget: function(contrib_id, widget, callback) {
                    $http
                        .post(SERVICES + '/api/widget/save/' + contrib_id, widget)
                        .success(function(data) {
                            callback(data);
                        }).error(function (data, status, headers, config) {
                            //alert("Error has happen during saving widget. Please refresh the page.");
                            callback({ error: true, status: "SAVE_WIDGET_ERROR", description: data });
                        });
                },
                GetWidget: function(widget_id, callback) {
                    $http
                        .get(SERVICES + '/api/widget/' + widget_id)
                        .success(function(data) {
                            callback(data);
                        });
                },
                SaveCover: function(widget_id, title, photos, callback) {
                    $http
                        .post(SERVICES + '/api/widget/' + widget_id + "/cover?title=" + title, photos)
                        .error(function(data, status, headers, config) {
                            console.log(data);
                            callback({ error: true, status: "SAVE_COVER_ERROR", description: data });
                            //alert("Cover photo for widget has not been created successfully. Please refresh the page.");
                        });
                },
                //TODO: We should move this method into another file since this one is asking for cookies and we don't want to have cookies on widget preview.
                //GetLightboxList: function (callback) {
                //    $http.post(SERVICES + "/api/light_boxes/", { access_token: $cookieStore.get("token_info").access_token })
                //        .success(function (result) {
                //            callback(result);
                //        });
                //},
                AddClickStats: function(widget_id, photo_id) {
                    $http.post(SERVICES + "/api/stats/ " + widget_id + "/click/" + photo_id);
                },
                AddPost: function(post) {
                    $http.post(SERVICES + "/api/stats/social", post);
                },
                UploadProfile: function (id, file, callback) {
                    var fd = new FormData();
                    fd.append('file', file);
                    $http.post(SERVICES + "/api/contrib/" + id + "/photo", fd, {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    })
                    .success(function (result) {
                        callback(result);
                    })
                    .error(function (result) {
                        callback(result);
                    });
                },
                GenerateEmbedCode: function (widget) {

                    function addLogoIfNeeded() {
                        if (widget.customization.width <= 270) {
                            return "";
                        }

                        return _.str.sprintf('<a href="https://submit.shutterstock.com" target="_blank" style="position: absolute; bottom: -1px; right: 1px;"> <img src="%s/content/img/%s.png" style="height: 26px;"/> </a>', AZURE_URL, widget.customization.logo_type);
                    }

                    var stripped_url = SERVICES.replace("https:", "");
                    stripped_url = SERVICES.replace("http:", "");

                    var script_src = stripped_url + "/content/embed.js";
                    var result = _.str.sprintf(
                        "<div data-id='%s' class='sstk_widget' style='position: relative; width: %spx; height: %spx;'> %s" +
                        "<script type='text/javascript'>" +
                            "window._wdata = window._wdata || [];" +
                            "_wdata.push({" +
                            "server_url: '%s', " +
                            "widget_id: '%s', " +
                            "host_url: document.URL," +
                            "width: %s," +
                            "height: %s" +
                            "});" +
                            "(function(){" +
                                "if (typeof (alensa_widget) !== 'undefined' ) return;" +
                                "var alensa_js = document.createElement('script'); alensa_js.type = 'text/javascript'; alensa_js.async = true;" +
                                "alensa_js.id = 'alensa_w_script';" +
                                "alensa_js.src = '%s';" +
                                "var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(alensa_js, s);" +
                            "})();"+
                        "</script></div>",
                        widget.id,
                        widget.customization.width,
                        widget.customization.height,
                        addLogoIfNeeded(),
                        stripped_url,
                        widget.id,
                        widget.customization.width,
                        widget.customization.height,
                        script_src);

                    return result;
                }
            };
        }]);
///#source 1 1 /Content/controllers/presentation.service.js
widgetApp.factory('PresentationService', [
        function () {
            var setWidgetCssParams = function (widget_height, widget_width, type) {

                $j(".widget").outerHeight(widget_height);
                $j(".widget").outerWidth(widget_width);
                $j("body").css({ padding: 0 });

                //reset everything to begging
                $j(".widget .footer").removeClass("to-right");
                $j("#results").css("width", "auto");
                $j(".widget .user").show();
                $j(".widget .title").show();
                $j(".widget .footer").show();
                $j(".widget .footer").outerHeight(76);
                $j(".widget .logo").css({ "height": "26px" });

                var footer_height = $j(".footer").outerHeight();

                if (widget_height < 190) {
                    $j(".widget .footer").addClass("to-right");
                    $j(".widget .footer").outerHeight(widget_height);
                    $j("#results").width(widget_width - 220);
                    $j(".widget .logo").css({ "margin-top": "0" });
                    // $j(".header").hide();
                    footer_height = 0;
                }

                if (widget_width <= 270 && widget_width > 190) {
                     $j(".widget .title").hide();

                } else if (widget_width <= 190 && widget_width > 130) {
                    $j(".widget .user").hide();
                    $j(".widget .title").hide();
                    $j(".widget .username").css({ "margin-left": "0" });

                }
                else if (widget_width <= 130) {
                    $j(".widget .user").hide();
                    $j(".widget .title").hide();
                    $j(".widget .username").css({ "margin-left": "0" });
                    $j(".widget .logo").css({ "height": "17px" });
                }

                 if (widget_width < 270 && widget_height < 190) {
                     $j(".widget .footer").hide();
                     footer_height = 0;
                     $j("#results").css("width", "auto");
                 }

                $j("#results").height($j(".widget").height() - ($j("#results").innerHeight() - $j("#results").height()) - footer_height); // we use this to exclude paddings/borders and margin
                //$j(".scrollable").width($j("#results").width() + 22);
                //$j(".scrollable").width($j("#results").width());
            };

            var updateMosaic = function (value) {
                if(value != undefined)
                    Ss.image.mosaic.resize(value);
                else
                    Ss.image.mosaic.resize($j("#results").width());
            };

            var updateVideoMargins = function () {
                var margins = calculateLeftMarginForVideo();
                $j(".video").css({
                    //"margin-top": margins.top,
                    "margin-left": margins.left
                });
            }

            var getLogo = function(theme) {
                if (theme === "dark") {
                    return "red_white";
                }
                return "red_grey";
            };

            var changeTheme = function (theme) {
                $j(".widget")
                    .removeClass("white")
                    .removeClass("dark")
                    .removeClass("grey")
                    .addClass(theme);
            };

            var calculateLeftMarginForVideo = function () {
                var videoWidth = 132;
                var videoHeight = 107;

                var resultWidth = $j(".results").width();
                var resultHeight = $j(".results").height();

                var itemsPerRow = Math.floor(resultWidth / videoWidth);
                var itemsPerCol = Math.floor(resultHeight / videoHeight);

                var marginLeft = (resultWidth - videoWidth * itemsPerRow) / (itemsPerRow + 1);
                var marginTop = (resultHeight - videoHeight * itemsPerCol) / (itemsPerCol + 1) + 3;

                return {
                    left: marginLeft,
                    top: marginTop
                };
            }

            return {
                getLogo: getLogo,
                changeTheme: changeTheme,
                setWidgetCssParams: setWidgetCssParams,
                updateMosaic: updateMosaic,
                updateVideoMargins: updateVideoMargins,
                calculateLeftMarginForVideo: calculateLeftMarginForVideo
            };

        }]);
///#source 1 1 /Content/directives/mozaic.photo.directive.js
widgetApp.directive('mozaicPhoto', ['PresentationService', "AZURE_URL", function (presentationService, AZURE_URL) {
    return {
        //restrict: 'A',
        restrict: 'E',
        templateUrl: AZURE_URL + '/content/directives/mozaic.photo.html',
        replace: true,
        scope: {
            item: "=item",
            mediaClick: "&",
            large: "=",
            contribId: "=",
            webUrl: "="
        },
        link: function (scope, element, attrs, ctrlInstance) {
            scope.web_url = scope.webUrl; // "https://www.shutterstock.com/pic.mhtml?id=" + scope.item.id + "&rid=" + scope.contribId;
            scope.aspect = scope.item.aspect;
            scope.id = scope.item.id;
            if (scope.large == true) {
                scope.width = scope.item.assets.large_thumb.width;
                scope.height = scope.item.assets.large_thumb.height;
                scope.url = scope.item.assets.large_thumb.url;
            }
            else {
                scope.width = scope.item.assets.small_thumb.width;
                scope.height = scope.item.assets.small_thumb.height;
                scope.url = scope.item.assets.small_thumb.url;
            }


            $j(element).find("a, a span").css({ width: scope.item.assets.large_thumb.width, height: scope.item.assets.large_thumb.height });
        }
    };

}]);

///#source 1 1 /Content/directives/mozaic.helper.directive.js
widgetApp.directive('mozaicHelper', ["$timeout", function ($timeout) {
    return {
        restrict: 'A',

        link: function (scope, element, attrs) {
            if (scope.$last === true) {
                $timeout(function () {
                    Ss.image.mosaic.initialize({ element: $(document.getElementById("results")) });

                    Ss.image.mosaic.layout();

                    $j(".mosaic_cell").each(function () {
                        var aspect = $j(this).data("aspect");
                        if (aspect <= 1) {
                            $j(this).find("img").css({ width: "auto", height: "100%" });
                        }
                    });
                    //$j('#results').mCustomScrollbar("destroy");
                    //$j('#results').mCustomScrollbar({
                    //    theme: 'dark-thick',
                    //    scrollButtons: {
                    //        enable: false
                    //    },
                    //    contentTouchScroll: true,
                    //    autoHideScrollbar: true,
                    //    advanced: {
                    //        autoScrollOnFocus: false,
                    //        updateOnContentResize: true
                    //    }
                    //});

                });
            }
        }
    };

}]);
///#source 1 1 /Content/directives/video.directive.js
widgetApp.directive('videoItem', ['PresentationService', "AZURE_URL", function (presentationService, AZURE_URL) {

    function toMMSS(sec) {
        var sec_num = parseInt(sec, 10); // don't forget the second parm

        var minutes = Math.floor(sec_num / 60);
        var seconds = sec_num - (minutes * 60);

        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        var time    = minutes+':'+seconds;
        return time;
    };

    return {
        //restrict: 'A',
        restrict: 'E',
        templateUrl: AZURE_URL + '/content/directives/video.html',
        replace: true,
        scope: {
            item: "=item",
            mediaClick: "&",
            contribId: "=",
            webUrl: "=",
            margins: "="
        },
        link: function (scope, element, attrs, ctrlInstance) {
            scope.web_url = scope.webUrl;
            scope.margin_top = 10;// scope.margins.top;
            scope.margin_left = scope.margins.left;
            scope.url = scope.item.assets.preview_jpg.url;
            scope.duration = toMMSS(scope.item.duration);
            scope.azure_url = AZURE_URL;
        }
    };

}]);
///#source 1 1 /Content/controllers/widget.controller.js
widgetApp.controller("WidgetCtrl", [
    '$scope', '$filter', '$timeout', 'DataServices', 'PresentationService', '$sce', 'AZURE_URL', function ($scope, $filter, $timeout, dataServices, presentationService, $sce, AZURE_URL) {

        $scope.azure_url = AZURE_URL;
        $scope.photos = [];
        $scope.videos = [];
        //$scope.search_term = "";
        $scope.have_upload = window.have_upload;

        var getMediaItems = function (widget, callback) {
            if (widget.type === "Images") {
                dataServices.Images.get({ id: widget.contributor_id, page: 1, sort: widget.order }).$promise.then(function (photos) {
                    $scope.photos = photos.data;
                    if(callback != undefined)
                        callback(photos.data);
                });
            } else if(widget.type === "Sets") {
                dataServices.SetItems.get({ contrib_id: widget.contributor_id, id: widget.setid }).$promise.then(function (photos) {
                    $scope.photos = photos.data;
                    if (callback != undefined)
                        callback(photos.data);
                });
            } else {
                dataServices.Videos.get({ id: widget.contributor_id, page: 1, sort: widget.order }).$promise.then(function (videos) {
                    $scope.videos = videos.data;
                    if (callback != undefined)
                        callback(videos.data);
                });
            }
        };

        var getVideos = function (widget) {
            dataServices.Videos.get({ id: widget.contributor_id, page: 1, sort: widget.order }).$promise.then( function (videos) {
                $scope.videos = videos.data;
                //console.log(videos.data);
            });
        }


        var getWidget = function () {
            if(!widget.image_url || widget.image_url == "") {
                widget.image_url = AZURE_URL + "/content/img/user.png";
            }
            $scope.widget = widget;
            $scope.widget.title = $scope.widget.title;
            SetupTheWidgetCommon();
            

            getMediaItems($scope.widget);
        };



        //if we are in live mode
        if (window.preview == false) {
            getWidget();
            //remove logo since it will be shown from embed code. That is used for SEO purposes
            if ($scope.widget.customization.width > 270) {
                $j(".widget .logo").hide();
            }
        }
        else { //we are here in wizard mode
            $scope.init_widget = {
                type: 'Images',
                contributor_id: $scope.user.contributor_id,
                username: $scope.user.username,
                full_name: $scope.user.full_name,
                display_name: $scope.user.display_name,
                image_url: $scope.user.image_url || AZURE_URL + "/content/img/user.png",
                contrib_title: $scope.user.title || "Photographer",
                order: "popular",
                gallery_name: "Most Downloaded",
                title: "Most Downloaded",
                customization: {
                    theme: "grey",
                    logo_type: "",
                    width: 620,
                    height: 400
                }
            };

            $scope.$emit("widget_controller_loaded");

            $scope.$on("load_widget", function (event, params) {
                if (params.id) { // widget already exists
                    dataServices.GetWidget(params.id, function (widget) {
                        $scope.widget = widget;
                        SetupTheWidgetCommon();
                        $scope.$emit("update_wizard", widget);

                        getMediaItems($scope.widget);
                    });
                }
                else {
                    $scope.widget = $scope.init_widget;
                    SetupTheWidgetCommon();
                    getMediaItems($scope.widget, function (items) {
                        //If there is no images at all, it is highly propable that Contributor have Videos instead.
                        if (items.length == 0) {
                            $scope.widget.type = "Videos";
                            $scope.$emit("update_wizard", $scope.widget);

                            getMediaItems($scope.widget);
                        }
                    });
                }                
            });
        }

        function SetupTheWidgetCommon() {
            $scope.widget.customization.logo_type = presentationService.getLogo($scope.widget.customization.theme);
            presentationService.changeTheme($scope.widget.customization.theme);
            presentationService.setWidgetCssParams($scope.widget.customization.height, $scope.widget.customization.width, $scope.widget.type);
            $scope.video_margins = presentationService.calculateLeftMarginForVideo();
        }

        $scope.$on("theme_changed", function (event, theme) {
            $scope.widget.customization.theme = theme;
            $scope.widget.customization.logo_type = presentationService.getLogo(theme);
            presentationService.changeTheme(theme);           
        });

        $scope.$on("size_changed", function (event, size) {
            $scope.widget.customization.width = size.width;
            $scope.widget.customization.height = size.height;
            presentationService.setWidgetCssParams($scope.widget.customization.height, $scope.widget.customization.width, $scope.widget.type);
            if ($scope.widget.type === "Videos") {
                presentationService.updateVideoMargins();
            }
            else {
                presentationService.updateMosaic();
            }
        });

        $scope.$on("save_widget", function (event, model) {
            for (var attrname in model) {
                $scope.widget[attrname] = model[attrname];
            }

            if ($scope.widget.gallery_name == "") {
                $scope.widget.gallery_name = $scope.widget.title;
            }

            if ($scope.widget.type == "Videos" && $scope.videos.length == 0) {
                return false;
            }

            if ($scope.widget.type != "Videos" && $scope.photos.length == 0) {
                return false;
            }

            dataServices.SaveWidget($scope.widget.contributor_id, $scope.widget, function (data) {
                $scope.widget = data;
                $scope.$emit("widget_saved", data);
                createCoverIfNeeded();

            });

           
        });

        //since we only have Sets for now, we will not use this code, it might need it for version 2
        //$scope.$on("type_changed", function (event, type, set) {
        //    $scope.widget.type = type;
        //    $scope.widget.setid = set.id;
        //    $scope.widget.title = set.name;
        //    $scope.created_cover = false;
        //    if(type == "Images") {
        //        delete $scope.widget.title;
        //    }
        //    presentationService.setWidgetCssParams($scope.widget.customization.height, $scope.widget.customization.width, $scope.widget.type);
        //    getPhotos($scope.widget, function () {
        //        emitSavingWidget();
        //    });

        //});

        $scope.isLarge = function () {
            return $scope.widget.customization.width > 100 && $scope.widget.customization.height > 100;
        }

        $scope.$on("source_updated", function (event, source) {
            $scope.widget.title = source.name;
            $scope.widget.gallery_name = source.name;
            $scope.widget.type = source.type;

            if (source.type == "Sets") {
                $scope.widget.setid = source.id;
                
            } else {
                if (source.type == "Videos") {
                    $scope.photos = [];
                }
                else {
                    $scope.videos = [];
                }
                $scope.widget.order = source.id;
            }

            getMediaItems($scope.widget, function () { });

        });

        $scope.$on("name_updated", function (event, name) {
            $scope.widget.gallery_name = name;
        });

        $scope.doSearch = function (term, type) {
            $scope.search_term = term;
            $scope.widget.type = type;
            getMediaItems();
        };

        $scope.updatePageSize = function (size) {
            $scope.page_size = size;
        };

        $scope.mediaClick = function (media_id) {
            if (window.preview == false) {
                dataServices.AddClickStats($scope.widget.id, media_id);
            }
        };

        $scope.triggerFileUpload = function () {
            if(window.have_upload) {
                $j('#photo').trigger('click');
            }
            
        };

        $scope.uploadPhoto = function (element) {
            if (!window.have_upload)
                return false;

            var contrib_id = $j(element).data("contrib-id");
            dataServices.UploadProfile(contrib_id, element.files[0], function (result) {
                // Handle server response
                $j("#user_photo").attr('src', result.url);

            });
        };


        $scope.get_widget_url = function(widget) {
            if (widget.type == "Images") {
                return "https://www.shutterstock.com/cat.mhtml?gallery_id=" + widget.contributor_id + "&sort_method=" + widget.order + "&rid=" + widget.contributor_id;
            } else if (widget.type == "Sets") {
                var properSetName = widget.title.split(": ")[1].replace(new RegExp(" ", 'g'), "-");
                return "https://www.shutterstock.com/sets/" + widget.setid + "-" + properSetName + ".html?rid=" + widget.contributor_id;
            }

            return "https://www.shutterstock.com/video/gallery/" + widget.username + "-" + widget.contributor_id + "/?contributor=" + widget.username + "&sort=" + widget.order + "&rid=" + widget.contributor_id;

            
        };

        function getUserName() {
            if ($scope.user.full_name == "") {
                return $scope.user.username;
            }

            return $scope.user.full_name;
        }

        var createCoverIfNeeded = function () {
            if (window.preview == true && $scope.widget.id != undefined && ($scope.photos.length > 0 || $scope.videos.length > 0)) {
                var title = "";

                if ($scope.widget.title)
                    title = $scope.widget.title;

                if ($scope.widget.gallery_name)
                    title = $scope.widget.gallery_name;

                var imagesForCover = [];
                if ($scope.widget.type == "Videos") {
                    angular.forEach($scope.videos.slice(0, 5), function (value, key) {
                        imagesForCover.push({
                            id: value.id,
                            assets: {
                                preview: {
                                    height: 480,
                                    width: 852,
                                    url: value.assets.preview_jpg.url
                                }
                            }
                        });
                    });
                }
                else {
                    imagesForCover = $scope.photos.slice(0, 5);
                }
                dataServices.SaveCover($scope.widget.id, title, imagesForCover, function (data) {
                    if (data.error) { $scope.$emit("error", data); }
                });
                //$scope.created_cover = true;
            }
        };
    }
]);

