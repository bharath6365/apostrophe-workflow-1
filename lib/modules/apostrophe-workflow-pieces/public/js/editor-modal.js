// Extend the pieces editor modal to implement workflow

apos.define('apostrophe-pieces-editor-modal', {
  construct: function(self, options) {
    var superBeforeShow = self.beforeShow;
    self.beforeShow = function(callback) {
      self.link('apos-workflow-submit', function() {
        return self.save(function(err) {
          if (err) {
            return;
          }
          return apos.modules['apostrophe-workflow'].submit([ self.savedPiece._id ]);
        });
      });
      self.link('apos-workflow-commit', function() {
        return self.save(function(err) {
          if (err) {
            return;
          }
          return apos.modules['apostrophe-workflow'].commit([ self.savedPiece._id ]);
        });
      });
      self.link('apos-workflow-history', function() {
        if (!self._id) {
          return;
        }
        return apos.modules['apostrophe-workflow'].history(self._id);
      });
      self.link('apos-workflow-force-export', function() {
        return self.save(function(err) {
          if (err) {
            return;
          }
          return apos.modules['apostrophe-workflow'].forceExport(self.savedPiece._id);
        });
      });
      self.workflowControlsVisibility();
      return superBeforeShow(callback);
    };
    self.workflowControlsVisibility = function() {
      var workflow = apos.modules['apostrophe-workflow'];
      return workflow.api('committable', { type: self.name, id: self._id }, function(results) {
        if (results.status === 'ok') {
          self.$el.addClass('apos-workflow-committable');
        }
      });
    };
  }
});