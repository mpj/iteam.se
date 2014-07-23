'use strict';

/**
 * Social is a superclass that should be extended.
 * @param {string} type  twitter, instagram and github is used at the moment
 * @param {number} count defines how many elements that should be saved
 */
function Social(type, count) {
  this.storageName = function () {
    return type + '.' + this.handle;
  };
  this.type = type.toLowerCase();
  this.count = count || 3;

  this.handle = '';
  this.container = null;

  this.url = '';
}
/**
 * Extend:
 * This should return a string of where the
 * content should be fetched from.
 *
 * @return {string}
 */
Social.prototype.URL = function () {
  return this.url;
};

Social.prototype.getLocal = function () {
  var local = window.localStorage.getItem(this.storageName());
  if (local === null) {
    return null;
  }
  return JSON.parse(local);
};

Social.prototype.save = function (array) {
  var data = array[0];
  var latest = array[1];
  if (array instanceof Array === false || latest === undefined) {
    return;
  }

  var local = this.getLocal();
  data.splice(this.count);
  var ignoreSave = (local !== null && (local.data && local.latest) && (data.length === local.data.length && local.latest <= latest));

  if (ignoreSave) {
    console.error('ignoring save');
    return;
  }

  window.localStorage.setItem(this.storageName(), JSON.stringify({
    'data': data,
    'latest': latest
  }));

  this.render(data);
};

Social.prototype.updateNode = function (newElement) {
  this.container.parentNode.replaceChild(newElement, this.container);
  this.container = newElement;
};

Social.prototype.draw = function (html) {
  this.updateNode(this.container, html);
};

/**
 * Extend:
 * This should return a valid htmlekement that will be printed
 * to the page.
 *
 * @param  {array}       array
 * @return {HTMLElement}
 */
Social.prototype.prerender = function (array) {};

Social.prototype.render = function (array) {
  if (!array ||
      !array.length) {
    return;
  }
  var newElement = this.prerender(array);
  if (newElement instanceof window.HTMLElement) {
    this.updateNode(newElement);
  }
};

/**
 * This should return an array of data and the latest timestamp
 *
 * @param  {object} response    a response from the httpRequest
 * @return {[array, timestamp]}
 */
Social.prototype.handleResponse = function (response) {};

Social.prototype.getContent = function () {
  var self = this;
  var xhr = new window.XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.statusText !== 'OK') {
      return;
    }
    self.save(self.handleResponse(xhr.responseText));
  };
  xhr.onerror = function () {
    console.error(xhr.responseText);
  };
  xhr.open('GET', this.URL());
  xhr.send(null, true);
};

Social.prototype.init = function (container, handle) {
  if (!handle.length || !(container instanceof window.HTMLElement)) {
    return;
  }
  this.handle = handle;
  this.container = container;
  var local = this.getLocal();
  if (local) {
    this.render(local.data);
  }
  this.getContent();
};