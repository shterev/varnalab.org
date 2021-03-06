var fs = require("fs");
var md_parser = require("node-markdown").Markdown;
var $ = require("jquery");
var moment = require("moment");

var Event = module.exports =  function(){
};

Event.prototype.populate = function(filepath, callback) {
  var self = this;
  fs.readFile(filepath, function(err, md_text){
    if(err) return callback(err);
    var html = md_parser(md_text.toString());
    
    var $html = $("<html>"+html+"</html>");
    
    var titleParts = $html.find("h1").html().split("|");
    self.title = titleParts.shift().trim();
    self.date = titleParts.shift().trim();
    self.author = titleParts.shift().trim();
    self.upcoming = !moment(self.date, "YYYY-MM-DD").isBefore(moment());
    $html.find("h1").html(self.title);

    self.ingress = $html.find("p:first").html();
    $html.find("p:first").remove();
    
    self.content = $html.html();
    
    callback(null, self);
  })
}

Event.prototype.createdDate = function(){
  return moment(this.date, "YYYY-MM-DD").format("DD MMM");
}

Event.prototype.createdNameOfDay = function(){
  return moment(this.date, "YYYY-MM-DD").format("dddd");
}

Event.prototype.createdTime = function(){
  return moment(this.date, "YYYY-MM-DD HH:mm").format("HH:mm");
}
