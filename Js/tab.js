(function($){

	var Tab=function(tab){
		var _this_=this;//保存this
		this.tab=tab;
		//默认config配置
		this.config={
					"triggerType":"onmouseover",//事件
					"effect":"default",//滚动效果
					"invoke":"1",//默认选中
					"auto":false//是否自动播放
					}; 

		if(this.getConfig()){//若有传入config，则将内容赋给config，没有则读取默认
			$.extend(this.config,this.getConfig())
		}


		//保存tab标签列表，对应的内容列表
		this.tabItems=this.tab.find('.tab_Ul li');
		this.contentItems=this.tab.find('.content_item')
		//保存配置参数
		var config=this.config 
		//绑定click事件
		if('click'===config.triggerType){
			this.tabItems.bind('click',function(){
				_this_.invoke($(this))
			})
		}else if('mouseover'===config.triggerType||'click'!=config.triggerType){//若传递参数有误，默认执行mouseover
			this.tabItems.bind('mouseover',function(){
				_this_.invoke($(this))
			})
		}
		

		//自动切换，若设置了则根据时间间隔自动切换
		if(config.auto){
			this.timer = null;
			this.loop = 0;
			this.autoPlay();    
			
			this.tab.mouseover(function(event) {
				window.clearInterval(_this_.timer)
			});
			this.tab.mouseout(function(event) {
				/* Act on the event */
				_this_.autoPlay();   
			});
		}; 
		if (config.invoke>1) {
			this.invoke(this.tabItems.eq(config.invoke-1))
		}

	}
	Tab.prototype={
		///自动播放
		autoPlay:function(){
			var _this_ = this,
			  config = _this_.config,
			  tabSize = _this_.tabItems.length,
			  tabItem = _this_.tabItems;

			this.timer=setInterval(function(){
				_this_.loop++;
				if(_this_.loop>=tabSize){
					_this_.loop=0;
				}
				tabItem.eq(_this_.loop).triggerHandler(config.triggerType);

			},config.auto)
		},
		//执行操作
		invoke:function(currnetTab){
			/**
				执行tab选中状态，当前选中的加上active
				切换对应tab内容，根据配置参数设置对应效果
			**/
			var _this_ = this; 
			var config=_this_.config;
			var index=currnetTab.index();
			currnetTab.addClass('active').siblings().removeClass('active')//设置选项卡
			var contItems =this.contentItems;
		 
			if('default'===config.effect||'fade'!=config.effect){//设置对应内容
				contItems.eq(index).addClass('current').siblings().removeClass('current')
			}else if('fade'==config.effect){
				contItems.eq(index).fadeIn().siblings().fadeOut();
			}
		 	//同步计数器
			if(config.auto){
				this.loop=index;
			} 
		},
		//获取配置内容
		getConfig:function(){
			 var config=this.tab.attr("data-config");
			 if(config&&config!=""){//判断是否存在
			 	return $.parseJSON(config);//json化配置数据返回
			 }else{
			 	return null;
			 }
		}//获取配置内容END

	};
	//初始化tab
	Tab.init=function(tabs){
		var _this_=this;
		tabs.each(function(){
			new _this_($(this));
		});
	}
	//注册到jquery
	$.fn.extend({
		tab:function(){
			this.each(function(index, el) {
				new Tab($(this))
			});
			return this;
		}

	});
	
	window.Tab=Tab; 
})(jQuery)