(function(root,factory){

   //AMD
   if(typeof define=="function" && define.amd)
        define(['jquery'],function($){
            factory($);
        });
    else if(typeof module=="object" && module.exports){
        module.exports = factory(require('jquery'));
    } else{
        root.zoomImage = factory(root.jQuery);
    }    
        
})(this,function($){



var ImageZoom = function(target,options){


    this.$target = $(target);
    this.$zoomType = options.zoomType || $(target).data('zoom-type') || 'overlay' ;
    
;
    this.$zoomImageSrc = options.imageZoom || $(target).data('image-zoom');

    this.init();
}


ImageZoom.prototype.init = function(){

    var self = this;
    if(this.$target.hasClass('zoom-image__thumbnails')){
       this.$thumbnails = this.$target.parent().find('.thumbnails li');
       this.$thumbnails.each(function(){

            $(this).on('click','a',function(e){
                e.preventDefault();
                self.loadThumbnail(event);
            })
       });
     
    }
    this.$target.on('click',function(e){
        e.preventDefault();
    })  
    
    if(this.$zoomType=="adjacent"){
        this.$zoomImageCont = $('<div class="zoom-type__adjacent"></div>');
        // this.$target.after(self.$zoomImageCont);
    }
        
    if(this.$zoomType=="overlay"){
        this.$zoomImageCont = $('<div class="zoom-type__overlay"></div>');
        // this.$target.append(self.$zoomImageCont);
    }

   
    this.$target.on({
        'mouseenter':$.proxy(this.show,this),
        'mouseleave':$.proxy(this.hide,this),
        'mousemove' : $.proxy(this.move,this)
    })  

   
}


ImageZoom.prototype.loadThumbnail = function(event){
    
    var standardImage = new Image;
    var zoomImageSrc =  $(event.currentTarget).data('image-zoom');
    var self = this;

    standardImage.onload = function(){
    
      self.$target.attr('data-image-zoom',zoomImageSrc);
      self.$target.data('image-zoom',zoomImageSrc);
      self.$target.find('a').attr('href',zoomImageSrc);
      self.$target.find('a').html(standardImage);
      self.$zoomImageSrc =  zoomImageSrc;
  
        
    };
    standardImage.src = $(event.currentTarget).find('a').attr('href') ;
}

ImageZoom.prototype.show = function(){

    if(!this._open){
         this.$zoomImageCont.show();
    }
    var theight = this.$target.height();
    var twidth = this.$target.width();
    var pos = this.$target.offset();

    this.$zoomImageCont.css('height',theight);
    this.$zoomImageCont.css('width',twidth);

    if(this.$zoomType=="adjacent"){
        this.$zoomImageCont.css('top',pos.top);
        this.$zoomImageCont.css('left',pos.left+twidth+10);
    }

    this.loadImage();
    
    this._open = true;
   
}

ImageZoom.prototype.hide = function(){

    this._open = false;
    this.$zoomImageCont.hide();
    this.$target.find('a img').css('visibility','visible');
}


ImageZoom.prototype.loadImage = function(){

    var zoomImage = new Image;
    var self = this;
    zoomImage.onload = function(){
    
        self.$zoomImageCont.html(zoomImage);

        if(self.$zoomType=="adjacent")
             self.$target.after(self.$zoomImageCont);
        else if(self.$zoomType=="overlay"){
             self.$target.append(self.$zoomImageCont);
             self.$target.find('a img').css('visibility','hidden');
        }
      
        
    };
    zoomImage.src = this.$zoomImageSrc ;
    zoomImage.style = "position:absolute";

    this.$zoom  = $(zoomImage);

  
}

ImageZoom.prototype.move = function(event){
        var cx = event.pageX;
        var cy = event.pageY;

        var ot = this.$target.offset().top;
        var ol = this.$target.offset().left;

        var px = cx-ol;
        var py = cy-ot;
        this.$zoom.css({
            left: -px + "px",
            top : -py + "px"
        })

}

$.fn.imageZoom = function(options){
     options = options || {};
    this.each(function(){
        new ImageZoom(this,options);
    })
}


 
});