function shape(copy,canvas,cobj,xp,select){
	//获取参数
	this.canvas=canvas;
	this.cobj=cobj;
	this.copy=copy;
	this.width=canvas.width;
	this.height=canvas.height;
	this.type="line";  //变量初始值，定义成对象的属性
	this.style="stroke";
	this.strokeStyle="#000";
	this.fillStyle="#000";
	this.lineWidth=1;
	this.history=[];
	this.bnum="5";
	this.jnum="5";
	this.xp=xp;
	this.select=select;
	this.xpsize=10;
	this.falg1=true;
	this.selectImg;
}
shape.prototype={
	init:function(){
		this.cobj.lineWidth=this.lineWidth;  //初始化2D对象里面的值。
		this.cobj.strokeStyle=this.strokeStyle;
		this.cobj.fillStyle=this.fillStyle;
	},
	draw:function(){
		var that=this;
		that.copy.onmousedown=function(e){
			that.init();
			var sx=e.offsetX;
			var sy=e.offsetY;
			that.copy.onmousemove=function(e){
				that.init();
				var mx=e.offsetX;
				var my=e.offsetY;
				that.cobj.clearRect(0,0,that.width,that.height);
				if(that.history.length>0){
					that.cobj.putImageData(that.history[that.history.length-1],0,0);
				}
				that.cobj.beginPath();
				that[that.type](sx,sy,mx,my);
			}
			that.copy.onmouseup=function(){
				that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
				that.copy.onmousemove=null;
				that.copy.onmouseup=null;
			}
		}
	},
	line:function(x1,y1,x2,y2){
		this.cobj.beginPath();
		this.cobj.moveTo(x1,y1);
		this.cobj.lineTo(x2,y2);
		this.cobj.stroke();
	},
	rect:function(x1,y1,x2,y2){
		this.cobj.beginPath();
		this.cobj.rect(x1,y1,x2-x1,y2-y1);
		this.cobj[this.style]();
	},
	arc:function(x1,y1,x2,y2){
		var r=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
		this.cobj.arc(x1,y1,r,0,2*Math.PI);
		this.cobj[this.style]();
	},
	moreb:function(x1,y1,x2,y2){
		var angle=360/this.bnum*Math.PI/180;//弧度
		var r=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
		for(var i=0;i<this.bnum;i++){
			this.cobj.lineTo(Math.cos(angle*i)*r+x1,Math.sin(angle*i)*r+y1);
		}
		this.cobj.closePath();
		this.cobj[this.style]();
	},
	morej:function(x1,y1,x2,y2){
		var angle=360/(this.jnum*2)*Math.PI/180;
		var r1=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
		var r2=r1/3;
		for(var i=0;i<this.jnum*2;i++){
			if(i%2==0){
				this.cobj.lineTo(Math.cos(angle*i)*r1+x1,Math.sin(angle*i)*r1+y1);
			}else{
				this.cobj.lineTo(Math.cos(angle*i)*r2+x1,Math.sin(angle*i)*r2+y1);	
			}
		}
		this.cobj.closePath();
		this.cobj[this.style]();
	},
	pen:function(){
		var that=this;
        that.copy.onmousedown=function(e){
            that.init();
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.cobj.beginPath();
            that.cobj.moveTo(startx,starty)
            that.copy.onmousemove=function(e){
                var movex= e.offsetX;
                var movey= e.offsetY;
                that.cobj.lineTo(movex,movey);
                that.cobj.stroke();
            }
            that.copy.onmouseup=function(){
				that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            }

        }
	},
	clear:function(){
		var that=this;
		that.copy.onmousemove=function(e){
			var movex= e.offsetX;
            var movey= e.offsetY;
            var left=movex-that.xpsize/2;
            var top=movey-that.xpsize/2;
            if(left<0){
            	left=0;
            }
            if(left>that.width-that.xpsize){
            	left=that.width-that.xpsize;
            }
            if(top<0){
            	top=0;
            }
            if(top>that.height-that.xpsize){
            	top=that.height-that.xpsize;
            }
            that.xp.style.cssText="display:block;left:"+left+"px;top:"+top+"px;width:"+that.xpsize+"px;height:"+that.xpsize+"px;";
		}
		that.copy.onmousedown=function(e){
			that.copy.onmousemove=function(e){
				var movex= e.offsetX;
                var movey= e.offsetY;
                var left=movex-that.xpsize/2;
                var top=movey-that.xpsize/2;
                 if(left<0){
            		left=0;
	            }
	            if(left>that.width-that.xpsize){
	            	left=that.width-that.xpsize;
	            }
	            if(top<0){
	            	top=0;
	            }
	            if(top>that.height-that.xpsize){
	            	top=that.height-that.xpsize;
	            }
                that.xp.style.cssText="display:block;left:"+left+"px;top:"+top+"px;width:"+that.xpsize+"px;height:"+that.xpsize+"px";
                that.cobj.clearRect(left,top,that.xpsize,that.xpsize);
			}
			that.copy.onmouseup=function(){
				that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.clear();
			}
		}
	},
	selects:function(){
		this.init();
		var that=this;
		var width=0;height=0;
		if(this.history.length>0){
			that.copy.onmousedown=function(e){
				var e=window.event||e;
				var tops=e.offsetY;
				var lefts=e.offsetX;
				if(that.falg1){
					that.copy.onmousemove=function(e){
						var e=window.event||e;
						that.select.style.display="block";
						that.select.style.top=tops+"px";
						that.select.style.left=lefts+"px";
						width=e.offsetX-lefts;
						height=e.offsetY-tops;
						that.select.style.width=width+"px";
						that.select.style.height=height+"px";
					};
					that.copy.onmouseup=function(){
						that.selectImg=that.cobj.getImageData(lefts,tops,width,height);
						that.cobj.clearRect(lefts,tops,width,height);
						that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
						that.cobj.putImageData(that.history[that.history.length-2],0,0);
						that.copy.onmousemove=null;
						that.copy.onmouseup=null;
						that.falg1=false;
					}
				}else{
					that.copy.onmousemove=function(e){
						var e=event.window||e;
						var left1 = e.offsetX-width/2;
                        var top1 = e.offsetY-height/2;
                        that.cobj.clearRect(0,0,that.width,that.height);
                        that.cobj.putImageData(that.history[that.history.length-1],0,0);
                        if(left1>=that.width-width){
                            left1=that.width-width;
                        }
                        if(left1<0){
                            left1=0;
                        }
                        if(top1>that.height-height){
                            top1=that.height-height;
                        }
                        if(top1<0){
                            top1=0;
                        }
                        that.cobj.putImageData(that.selectImg,left1,top1);
                        that.select.style.top = top1+"px";
                        that.select.style.left = left1+"px";
					}
					that.copy.onmouseup=function(){
                        that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                        that.selectImg="";
                        that.copy.onmousemove=null;
                        that.copy.onmouseup=null;
                        that.falg1=true;
                        that.select.style.display="none";
                        that.select.style.width=0;
                        that.select.style.height=0;
                    }	
				}
			}
		}
	},
	choose:function(){
		this.init();
		var that=this;
		var width=0;height=0;
		that.copy.onmousedown=function(e){
			var e=window.event||e;
			var tops=e.offsetY;
			var lefts=e.offsetX;
			that.copy.onmousemove=function(e){
				var e=window.event||e;
				that.select.style.display="block";
				that.select.style.top=tops+"px";
				that.select.style.left=lefts+"px";
				width=e.offsetX-lefts;
				height=e.offsetY-tops;
				that.select.style.width=width+"px";
				that.select.style.height=height+"px";
			}
			that.copy.onmouseup=function(){
				that.selectImg=that.cobj.getImageData(lefts,tops,width,height);
				// that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
				that.cobj.clearRect(0,0,that.width,that.height);
				that.cobj.putImageData(that.selectImg,lefts,tops);
				that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
				that.copy.onmousemove=null;
				that.copy.onmouseup=null;
				that.falg1=false;
				that.select.style.display="none";
                that.select.style.width=0;
                that.select.style.height=0;
			}
		}
	}
}
