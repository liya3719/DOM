/*
  1、DOM2级事件绑定的方法不同
  2、阻止事件传播的方法不同
  3、阻止事件默认行为的方法也不同
  4、pageX在IE里不支持的。
  5、鼠标滚轮事件不同
  6、事件源的处理属性不同
 */
var E={};
E.stopE=function(e){
	e=e||window.event;
	if(e.stopPropagation){
		e.stopPropagation();//标准浏览器中的停止事件传播	
	}else{
		e.cancelBubble=true;//IE中的取消事件冒泡	
	}
	
}

E.prevDef=function(e){//用DOM2级事件绑定的方法，必须用这个方法来取消默认行为
	e=e||window.event;
	if(e.preventDefault){
		e.preventDefault();
	}else{
		
		e.returnValue=false;
	}
	
}
E.mousePos=function(e){
	e=e||window.event;
	var x=e.pageX||(e.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft));
	var y=e.pageY||(e.clientY+(document.documentElement.scrollTop||document.body.scrollTop))
	return {x:x,y:y};
	
}

function bind(ele,eType,fn){	
	if(ele.addEventListener){
		ele.addEventListener(eType,fn,false);		
	}else if(ele.attachEvent){	
	
	var tempFn=function (){fn.call(ele);}//伪装原来的fn
	tempFn.oldFn=fn;//为了让伪装的对象可以识别
		//tempFn就是被化装之后的fn
	if(ele["a"+eType]==undefined){
		ele["a"+eType]=[];//第一次的时候先初始化一个数组
	}
	for(var i=0;i<ele["a"+eType].length;i++){
		if(ele["a"+eType][i].oldFn==fn)
			return;//如果原来被绑定过，则不需重复绑定	
	}
	ele["a"+eType].push(tempFn);
	ele.attachEvent("on"+eType,tempFn);		
	}	
}
//模拟bind
Function.prototype.bind = function(context){
	var _self = this;
	return function(){
		return _self.apply(context,arguments);
	}
}
//
Function.prototype.bind = function(){
	var _self = this,
	    context = [].shift.call(arguments),
	    args = [].slice.call(arguments);
	return function(){
		return _self.apply(context,[].concat.call(args,[].slice.call(arguments)));
	}
}
function unbind(ele,eType,fn){
	if(ele.removeEventListener){
		ele.removeEventListener(eType,fn,false);		
	}else if(ele.detachEvent){		
		var aFn=ele["a"+eType];
		for(var i=0;i<aFn.length;i++){
			if(aFn[i].oldFn==fn){
				ele.detachEvent("on"+eType,aFn[i]);
				aFn.splice(i,1);
				break;
			}
			//同一个方法，只能被绑定一			
		}		
	}		
}

