var audio = require("play-audio");
var dom = require('domquery');
var request = require('jsonp');
var format = require("new-format");
var padDate = require('pad-date');
var player;

updateView();

dom('.toggle').on('click', toggle);
dom('ul').on('click', 'li span', playPodcast);

function toggle () {
  if (!player) return;

  if (player.element().paused) return play();
  pause();
}

function playPodcast (event) {
  var el = event.target;
  var url = el.parentNode.getAttribute('data-url');
  play(url);
  dom('h1 .date').html(el.innerHTML);
}

function play (url) {
  dom('h1').addClass('playing');
  dom('h1 .toggle').html('❚❚ Durdur');

  if (!url) return player.play();

  if (player) {
    return player.src(url);
  }

  player = audio(url).autoplay();
}

function pause () {
  player.pause();
  dom('h1 .toggle').html('&#9658; Oynat');
}

function updateView () {
  request('http://modernsabahlar.herokuapp.com', function (error, response) {
    var html;

    html = response.result.map(function (podcast) {
      return format('<li data-url="{0}"><span>{1}</span></li>',
                    podcast.source, prettyDate(podcast.ts));
    }).join('\n');

    dom('.now-playing div').html(html);
  });
}

function prettyDate (ts) {
  return format('{day}/{month}/{year}', padDate(new Date(ts)));
}
