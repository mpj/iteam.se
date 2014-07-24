'use strict';

(function () {
  var _query = 'data-{type}-query';
  var _count = 'data-{type}-count';

  ['twitter','instagram','github','blog'].forEach(function (type) {
    var query = _query.replace('{type}', type);
    var count = _count.replace('{type}', type);

    var container = document.querySelectorAll('[' + query + ']');
    if (!container.length) {
      return;
    }
    container = container[0];
    query = container.getAttribute(query);
    count = container.getAttribute(count) || 3;

    switch (type) {
    case 'twitter':
    case 'instagram':
      new SocialHub(type, count).init(container, query);
      break;
    case 'blog':
      new Blog(count)._init(container, query);
      break;
    case 'github':
      new Github(count).init(container, query);
      break;
    }
    console.log(type,query,count);
  });
})();