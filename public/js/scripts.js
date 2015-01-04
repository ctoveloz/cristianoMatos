/*
 *  jquery-github - v0.4.0
 *  A jQuery plugin to display your Github Repositories.
 *  https://github.com/zenorocha/jquery-github
 *
 *  Copyright (c) 2014
 *  MIT License
 */
function GithubRepo(a){this.description=a.description,this.forks=a.forks_count,this.name=a.name,this.open_issues=a.open_issues,this.pushed_at=a.pushed_at,this.url=a.url,this.stargazers=a.stargazers_count}function Github(a,b){var c={iconStars:!0,iconForks:!0,iconIssues:!1};this.element=a,this.$container=$(a),this.repo=this.$container.attr("data-repo"),this.options=$.extend({},c,b),this._defaults=c,this.init(),this.displayIcons()}GithubRepo.prototype.toHTML=function(){return this.pushed_at=this._parsePushedDate(this.pushed_at),this.url=this._parseURL(this.url),$("<div class='github-box'><div class='github-box-header'><h3><a href='"+this.url+"'>"+this.name+"</a></h3><div class='github-stats'><a class='repo-stars' title='Stars' data-icon='7' href='"+this.url+"/stargazers'>"+this.stargazers+"</a><a class='repo-forks' title='Forks' data-icon='f' href='"+this.url+"/network'>"+this.forks+"</a><a class='repo-issues' title='Issues' data-icon='i' href='"+this.url+"/issues'>"+this.open_issues+"</a></div></div><div class='github-box-content'><p>"+this.description+" &mdash; <a href='"+this.url+"#readme'>Read More</a></p></div><div class='github-box-download'><p class='repo-update'>Latest commit to <strong>master</strong> on "+this.pushed_at+"</p><a class='repo-download' title='Download as zip' data-icon='w' href='"+this.url+"/zipball/master'></a></div></div>")},GithubRepo.prototype._parsePushedDate=function(a){var b=new Date(a);return b.getDate()+"/"+(b.getMonth()+1)+"/"+b.getFullYear()},GithubRepo.prototype._parseURL=function(a){return a.replace("api.","").replace("repos/","")},Github.prototype.init=function(){var a=this.getCache();return null!==a?void this.applyTemplate(JSON.parse(a)):void this.requestData(this.repo)},Github.prototype.displayIcons=function(){var a=this.options,b=$(".repo-stars"),c=$(".repo-forks"),d=$(".repo-issues");b.css("display",a.iconStars?"inline-block":"none"),c.css("display",a.iconForks?"inline-block":"none"),d.css("display",a.iconIssues?"inline-block":"none")},Github.prototype.requestData=function(a){var b=this;$.ajax({url:"https://api.github.com/repos/"+a,dataType:"jsonp",success:function(a){var c=a.data,d=a.meta.status>=400&&c.message;return d?void b.handleErrorRequest(c):void b.handleSuccessfulRequest(c)}})},Github.prototype.handleErrorRequest=function(a){console.warn(a.message)},Github.prototype.handleSuccessfulRequest=function(a){this.applyTemplate(a),this.setCache(a)},Github.prototype.setCache=function(a){window.sessionStorage&&window.sessionStorage.setItem("gh-repos:"+this.repo,JSON.stringify(a))},Github.prototype.getCache=function(){return window.sessionStorage?window.sessionStorage.getItem("gh-repos:"+this.repo):!1},Github.prototype.applyTemplate=function(a){var b=new GithubRepo(a),c=b.toHTML();c.appendTo(this.$container)},function(a){a.fn.github=function(b){return this.each(function(){a(this).data("plugin_github")||a(this).data("plugin_github",new Github(this,b))})}}(window.jQuery||window.Zepto,window);

/* CODERBITS */
;(function(window, document, undefined) {
	"use strict";

	var addCommas = function(nStr) {
		nStr += '';
		var x = nStr.split('.');
		var x1 = x[0];
		var x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	};

	var buildSummary = function(data) {
		var content = '';
			content += '<div id="coderbits-summary">';
			content += '<div id="coderbits-avatar">';
			content += '<a href="' + data.link + '" target="_parent">';
			content += '<img alt="' + data.name + '" class="avatar" src="https://secure.gravatar.com/avatar/' + data.gravatar_hash + '?d=https%3A%2F%2Fcoderbits.com%2Fimages%2Fgravatar.png&r=PG&s=48">';
			content += '</a>';
			content += '</div>';
			content += '<div id="coderbits-overview">';
			content += '<h1>';
			content += '<a href="' + data.link + '" target="_parent" title="' + data.name + '">' + data.name + '</a>';
			content += '</h1>';
			content += '<p>';
			content += '<span>' + data.title + '</span>';
			content += '</p>';
			content += '</div>';
			content += '</div>';
		return content;
	};

	var buildSkills = function(data) {
		var content = '', items;
			content += '<div id="coderbits-skills">';
		var area = ["Skills", "Interests", "Traits", "Areas"];
		(function() {
			for(var i = 0; i < area.length; i++) {
				var current = "top_" + area[i].toLowerCase();
				if(data[current].length > 0) {
					content += "<h2>Top " + area[i] + "</h2>";
					items = data[current];
					return true;
				}
			}
		})();
			content += '<p>';
			for(var i = 0; i < items.length; i++) {
				content += items[i].name;
				if(i < items.length - 1) {
					content += ', ';
				}
			}
			content += '</p>';
			content += '</div>';
		return content;
	};

	var buildStats = function(data) {
		var total = 0;
		for(var i = 0; i < data.badges.length; i++) {
			if(data.badges[i].earned) {
				total++
			}
		}
		var content = '';
			content += '<div id="coderbits-stats">';
			content += '<ul id="coderbits-stats-list">';
			content += '<li>';
			content += '<p>';
			content += '<strong>' + addCommas(total) + '</strong>';
			content += '<span> badges</span>';
			content += '</p>';
			content += '<p>';
			content += '<strong>' + addCommas(data.follower_count) + '</strong>';
			content += '<span> followers</span>';
			content += '</p>';
			content += '</li>';
			content += '<li class="last">';
			content += '<p>';
			content += '<strong>' + addCommas(data.views) + '</strong>';
			content += '<span> views</span>';
			content += '</p>';
			content += '<p>';
			content += '<strong>' + addCommas(data.following_count) + '</strong>';
			content += '<span> friends</span>';
			content += '</p>';
			content += '</li>';
			content += '</ul>';
			content += '</div>';
		return content;
	};

	var buildBadges = function(data) {
		var content = '', count = 0, total = 0;
			content += '<div id="coderbits-awards">';
			content += '<p id="coderbits-badges">'

		for(var i = 0; i < data.badges.length; i++) {
			var badge = data.badges[i];
			if(badge.earned) {
				total++
				if(count < 30 && badge.level === 1) {
					content += '<img src="' + badge.image_link + '" title="' + badge.name + ' - ' + badge.description + '" alt="' + badge.level + ' bit ' + badge.name + ' - ' + badge.description + '">';
					count++
				}
			}
		}

		content += '<a href="' + data.link + '/badges">view all ' + total + '</a>';
		content += '</p>';
		content += '</div>';

		return content;
	};

	var request = function(url) {
		var script = document.getElementsByTagName("script")[0];
		var handler = document.createElement("script");
			handler.src = url;
		script.parentNode.insertBefore(handler, script);
	};

	var global = "coderbits", element = document.getElementById(global);
	if(element) {
		window[global] = function(data) {
			var content = '';
				content += buildSummary(data);
				content += buildSkills(data);
				content += buildStats(data);
				content += buildBadges(data);
			document.getElementById(global).innerHTML = content;
			delete window[global];
		};
		var username = element.getAttribute("data-coderbits-username"),
			safeUsername = username.replace(/[('"){};!@#%&*]/gi, '');
		request("https://coderbits.com/" + safeUsername + ".json?callback=" + global);
	}
})(window, document);



	$(document).ready( function(){
		$("[data-repo]").github();
	});