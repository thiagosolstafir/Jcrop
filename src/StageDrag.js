  /**
   * StageDrag
   * Facilitates dragging
   */
  var StageDrag = function(manager,opt){
    $.extend(this,StageDrag.defaults,opt || {});
    this.manager = manager;
    this.core = manager.core;
  };
  
  StageDrag.defaults = {
    offset: [ -8, -8 ],
    active: true,
    minsize: [ 20, 20 ]
  };

  $.extend(StageDrag.prototype,{
    start: function(e){
      var c = this.core;

      // Do nothing if allowSelect is off
      if (!c.opt.allowSelect) return false;

      // Also do nothing if we can't draw any more selections
      if (c.opt.multi && c.opt.multiMax && (c.ui.multi.length >= c.opt.multiMax)) return false;

      // calculate a few variables for this drag operation
      var o = $(e.currentTarget).offset();
      var origx = e.pageX - o.left + this.offset[0];
      var origy = e.pageY - o.top + this.offset[1];
      var m = c.ui.multi;

      // Determinenewly dragged crop behavior if multi disabled
      if (!c.opt.multi) {
        // For multiCleaanup true, remove all existing selections
        if (c.opt.multiCleanup){
          for(var i=0;i<m.length;i++) m[i].remove();
          c.ui.multi = [];
        }
        // If not, only remove the currently active selection
        else {
          c.removeSelection(c.ui.selection);
        }
      }

      // Create the new selection
      var sel = c.newSelection()
        // and position it
        .updateRaw(Jcrop.wrapFromXywh([origx,origy,1,1]));

      sel.element.trigger('cropstart',[sel,this.core.unscale(sel.get())]);
      
      return sel.startDrag(e,'se');
    },
    end: function(x,y){
      this.drag(x,y);
      var b = this.sel.get();

      if ((b.w < this.minsize[0]) || (b.h < this.minsize[1]))
        this.core.requestDelete();

        else this.sel.focus();
    }
  });