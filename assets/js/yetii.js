/*
 * Yetii - Yet (E)Another Tab Interface Implementation
 * version 1.5
 * http://www.kminek.pl/lab/yetii/
 * Copyright (c) 2007-2008 Grzegorz Wojcik
 * Code licensed under the BSD License: http://www.kminek.pl/bsdlicense.txt
 */

function Yetii() {
    this.defaults = {
      id: null,
      active: 1,
      interval: null,
      wait: null,
      persist: null,
      tabclass: 'tab',
      activeclass: 'active',
      callback: null,
      leavecallback: null
    };
    
    this.activebackup = null;
    
    for (var n in arguments[0]) {
      this.defaults[n] = arguments[0][n];
    }
    
    this.getTabs = function() {
      var a = [];
      var b = document.getElementById(this.defaults.id).getElementsByTagName('*');
      var c = new RegExp("(^|\\s)" + this.defaults.tabclass.replace(/\-/g, "\\-") + "(\\s|$)");
      
      for (var i = 0; i < b.length; i++) {
        if (c.test(b[i].className)) {
          a.push(b[i]);
        }
      }
      
      return a;
    };
    
    this.links = document.getElementById(this.defaults.id + '-nav').getElementsByTagName('a');
    this.listitems = document.getElementById(this.defaults.id + '-nav').getElementsByTagName('li');
    
    this.show = function(a) {
      for (var i = 0; i < this.tabs.length; i++) {
        this.tabs[i].style.display = ((i + 1) == a) ? 'block' : 'none';
        
        if ((i + 1) == a) {
          this.addClass(this.links[i], this.defaults.activeclass);
          this.addClass(this.listitems[i], this.defaults.activeclass);
        } else {
          this.removeClass(this.links[i], this.defaults.activeclass);
          this.removeClass(this.listitems[i], this.defaults.activeclass);
        }
      }
      
      if (this.defaults.leavecallback && (a != this.activebackup)) {
        this.defaults.leavecallback(this.defaults.active);
      }
      
      this.activebackup = a;
      this.defaults.active = a;
      
      if (this.defaults.callback) {
        this.defaults.callback(a);
      }
    };
    
    this.rotate = function(a) {
      this.show(this.defaults.active);
      this.defaults.active++;
      
      if (this.defaults.active > this.tabs.length) {
        this.defaults.active = 1;
      }
      
      var b = this;
      
      if (this.defaults.wait) {
        clearTimeout(this.timer2);
      }
      
      this.timer1 = setTimeout(function() {
        b.rotate(a);
      }, a * 1000);
    };
    
    this.next = function() {
      this.defaults.active++;
      if (this.defaults.active > this.tabs.length) {
        this.defaults.active = 1;
      }
      
      this.show(this.defaults.active);
    };
    
    this.previous = function() {
      this.defaults.active--;
      
      if (!this.defaults.active) {
        this.defaults.active = this.tabs.length;
      }
      
      this.show(this.defaults.active);
    };
    
    this.gup = function(a) {
      a = a.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var b = "[\\?&]" + a + "=([^&#]*)";
      var c = new RegExp(b);
      var d = c.exec(window.location.href);
      
      if (d == null) {
        return null;
      } else {
        return d[1];
      }
    };
    
    this.parseurl = function(a) {
      var b = this.gup(a);
      
      if (b == null) {
        return null;
      }
      
      if (parseInt(b)) {
        return parseInt(b);
      }
      
      if (document.getElementById(b)) {
        for (var i = 0; i < this.tabs.length; i++) {
          if (this.tabs[i].id == b) {
            return (i + 1);
          }
        }
      }
      
      return null;
    };
    
    this.createCookie = function(a, b, c) {
      if (c) {
        var d = new Date();
        d.setTime(d.getTime() + (c * 24 * 60 * 60 * 1000));
        var e = "; expires=" + d.toGMTString();
      } else {
        var e = "";
      }
      
      document.cookie = a + "=" + b + e + "; path=/";
    };
    
    this.readCookie = function(a) {
      var b = a + "=";
      var d = document.cookie.split(';');
      
      for (var i = 0; i < d.length; i++) {
        var c = d[i];
        
        while (c.charAt(0) == ' ') {
          c = c.substring(1, c.length);
        }
        
        if (c.indexOf(b) == 0) {
          return c.substring(b.length, c.length);
        }
      }
      
      return null;
    };
    
    this.contains = function(a, b, c) {
      return a.indexOf(b, c) != -1;
    };
    
    this.hasClass = function(a, b) {
      return this.contains(a.className, b, ' ');
    };
    
    this.addClass = function(a, b) {
    if (!this.hasClass(a, b)) {
        a.className = (a.className + ' ' + b).replace(/\s{2,}/g, ' ').replace(/^\s+|\s+$/g, '');
    }
    };
    
    this.removeClass = function(a, b) {
    a.className = a.className.replace(new RegExp('(^|\\s)' + b + '(?:\\s|$)'), '$1');
    a.className = a.className.replace(/\s{2,}/g, ' ').replace(/^\s+|\s+$/g, '');
    };
    
    this.tabs = this.getTabs();
    this.defaults.active = (this.parseurl(this.defaults.id)) ? this.parseurl(this.defaults.id) : this.defaults.active;
    
    if (this.defaults.persist && this.readCookie(this.defaults.id)) {
    this.defaults.active = this.readCookie(this.defaults.id);
    }
    
    this.activebackup = this.defaults.active;
    this.show(this.defaults.active);
    
    var f = this;
    
    for (var i = 0; i < this.links.length; i++) {
    this.links[i].customindex = i + 1;
    this.links[i].onclick = function() {
        if (f.timer1) {
        clearTimeout(f.timer1);
        }
        
        if (f.timer2) {
            clearTimeout(f.timer2);
        }
        
        f.show(this.customindex);
        
        if (f.defaults.persist) {
            f.createCookie(f.defaults.id, this.customindex, 0);
        }
        
        if (f.defaults.wait) {
            f.timer2 = setTimeout(function() {
            f.rotate(f.defaults.interval);
          }, f.defaults.wait * 1000);
        }
        
        return false;
    };
}
    
if (this.defaults.interval) {
    this.rotate(this.defaults.interval);
    }
}