

Template.tenor.onRendered(function () {

    var self = this;
    if (self.view.isRendered) {

        
        $(function() {
    		$(window).bind("load resize", function() {
        		topOffset = 50;
        		height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        		height = height - topOffset;
        		if (height < 1) height = 1;
        		if (height > topOffset) {
			   height = height - 100;
         		   $("#tenor").css("min-height", (height) + "px");
         		   //$("#page-wrapper iframe").css("min-height", (height) + "px");
        		}
    		});
		});
      
    }
});
