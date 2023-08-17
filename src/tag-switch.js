/**
 * WonderPush Web SDK plugin to present the user with a switch she can use to tag herself, like subscribing to a category of push notifications.
 *
 * When loaded, the plugin looks for placeholder elements like the following, and fleshes them out to beautiful switches:
 *
 * ```xml
 * <!-- For manipulating tags -->
 * <div class="wonderpush-tag-switch" data-tag="sports" data-label="#sports"></div>
 * <!-- For manipulating properties -->
 * <div class="wonderpush-tag-switch" data-field="string_follow" data-value="sports" data-label="#sports"></div>
 * ```
 *
 * Either the `data-tag` or the `data-field` together with `data-value` attributes are mandatory, they define what tag is manipulated,
 * or what value is to be put or removed and into what field, when the switch is flipped.
 *
 * The `data-label` attribute is highly recommended to signify to the user the meaning of the switch, otherwise ON/OFF are used.
 * You can also use `data-sentence` to prepend a text on the switch label.
 *
 * In addition to being customizable using the plugin options, the switch can easily be customized using `data-` attributes.
 * Here is an example:
 *
 * ```xml
 * <div class="wonderpush-tag-switch"
 *   data-field="string_follow"
 *   data-value="sports"
 *   data-prepend="<div class=&amp;quot;some-wrapper&amp;quot;>"
 *   data-append="</div>"
 *   data-sentence="Receive the latest news by push notifications: "
 *   data-class="some-stylish-class"
 *   data-color-off="red"
 *   data-color-on="green"
 *   data-off="NO"
 *   data-on="YES"
 *   >
 *     <!-- Any content will be replaced with the switch, if push notifications are supported. -->
 *     Sorry, push notifications are not supported by your browser.
 * </div>
 * ```
 *
 * @class TagSwitch
 * @param {external:WonderPushPluginSDK} WonderPushSDK - The WonderPush SDK instance provided automatically on intanciation.
 * @param {TagSwitch.Options} options - The plugin options.
 */
/**
 * @typedef {Object} TagSwitch.Options
 *
 * Almost all options given here can be controlled from the placeholder element included in the page.
 *
 * @property {string} [switchElementClass="wonderpush-tag-switch"]
 *   The id of the placeholder element this the SDK will use to flesh out a tag switch.
 *
 *   This option cannot be overridden the placeholder element unlike other options,
 *   moreover the element id must match the given value.
 *
 * @property {string} [classPrefix="wp-tag-"]
 *   The prefix to prepend to all the CSS classes names used.
 *   If the default style does not suit you, you can either override some rules,
 *   or use a whole new ruleset by changing this prefix.
 *
 *   You can override it from the placeholder element using the `data-class-prefix` attribute.
 *
 * @property {string} [includeUnsupported="true"]
 *   By default, tag switches only appear for browsers that support web push notifications,
 *   which excludes Safari. Setting this to `true` will let safari users enjoy tag switches you can
 *   use for in-app messaging segmentation.
 *
 * @property {string} [prepend]
 *   Optional HTML code to inject before the actual switch element.
 *   Escape your double quotes properly, and pay extra attention not to create syntax errors or malformed HTML!
 *
 *   You can override it from the placeholder element using the `data-prepend` attribute.
 *
 * @property {string} [append]
 *   Optional HTML code to inject after the actual switch element.
 *   Escape your double quotes properly, and pay extra attention not to create syntax errors or malformed HTML!
 *
 *   You can override it from the placeholder element using the `data-append` attribute.
 *
 * @property {string} [sentence]
 *   HTML snippet to inject in a SPAN tag right before the switch.
 *   You likely want to include a final space character for proper display.
 *
 *   You can override it from the placeholder element using the `data-sentence` attribute.
 *
 * @property {string} [cssClass]
 *   CSS class to add to the switch element.
 *
 *   You can override it from the placeholder element using the `data-class` attribute.
 *
 * @property {string} [label]
 *   Label of the switch in both the ON and OFF states.
 *   It overrides the `on` and `off` options.
 *
 *   You should override it from the placeholder element using the `data-label` attribute.
 *
 * @property {string} [on="ON"]
 *   Label of the switch in the ON state.
 *
 *   You can override it from the placeholder element using the `data-on` attribute.
 *
 * @property {string} [off="OFF"]
 *   Label of the switch in the OFF state.
 *
 *   You can override it from the placeholder element using the `data-off` attribute.
 *
 * @property {string} [colorOn]
 *   Name of a predefined color to use for the ON state.
 *
 *   You can override it from the placeholder element using the `data-color-on` attribute.
 *
 *   Available colors:
 *
 *   * `grey` or `gray` - the default.
 *   * `red`
 *
 * @property {string} [colorOff]
 *   Name of a predefined color to use for the OFF state.
 *
 *   You can override it from the placeholder element using the `data-color-off` attribute.
 *
 *   Available colors:
 *
 *   * `blue` - the default.
 *   * `green`
 */
/**
 * The WonderPush JavaScript SDK instance.
 * @external WonderPushPluginSDK
 * @see {@link https://wonderpush.github.io/wonderpush-javascript-sdk/latest/WonderPushPluginSDK.html|WonderPush JavaScript Plugin SDK reference}
 */
/**
 * WonderPush SDK triggers configuration.
 * @typedef TriggersConfig
 * @memberof external:WonderPushPluginSDK
 * @see {@link https://wonderpush.github.io/wonderpush-javascript-sdk/latest/WonderPushPluginSDK.html#.TriggersConfig|WonderPush JavaScript Plugin SDK triggers configuration reference}
 */
WonderPush.registerPlugin('tag-switch', function(WonderPushSDK, options) {

  WonderPushSDK.loadStylesheet('style.css');

  var switchElementClass = options.switchElementClass || 'wonderpush-tag-switch';

  var init = function() {
    // Initialize switch
    if (document.readyState !== 'loading') {
      this.setupTagSwitch();
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        this.setupTagSwitch();
      }.bind(this));
    }
  }.bind(this);

  var ensureArray = function(value) {
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value)) return [value];
    return value;
  };

  /**
   * Scans the document and initializes any new switches.
   *
   * This is automatically done once during the SDK initialization.
   *
   * If developing a SPA or dynamically adding new elements to your page like with React,
   * you should call this function to make new switches active.
   *
   * ```javascript
   * WonderPush.ready(function(WonderPushSDK) {
   *   WonderPushSDK.Plugins.get('tag-switch').setupTagSwitch();
   * });
   * ```
   *
   * @alias TagSwitch#setupTagSwitch
   */
  this.setupTagSwitch = function() {
    if (options.switchElementClass === null) return;
    var switchesNodeList = document.querySelectorAll('.' + switchElementClass);
    if (!switchesNodeList.length) return;
    var unsupported = options.unsupported || ''; // this is not documented as the WonderPush SDK itself is not loaded if push notifications are not supported
    var includeUnsupportedOption = options.includeUnsupported === 'true';
    var classPrefix = options.classPrefix || 'wp-tag-';
    var prepend = options.prepend || '';
    var append = options.append || '';
    var sentence = options.sentence || '';
    var cssClass = options.cssClass || '';
    var label = options.label;
    var on = options.on || label || 'ON';
    var off = options.off || label || 'OFF';
    var colorOn = options.colorOn;
    var colorOff = options.colorOff;

    // Caching calls to getProperties and getTags for a few ms,
    // to avoid repeating the same when setupTagSwitch is called in a for loop
    if (!this.cachedPromises) {
      this.cachedPromises = [
        WonderPushSDK.getProperties(),
        WonderPushSDK.getTags(),
      ];
      setTimeout(function() { this.cachedPromises = undefined; }.bind(this), 100);
    }
    return Promise.all(this.cachedPromises).then(function(inputPromises) {
      var custom = inputPromises[0];
      var tags = inputPromises[1];
      Array.prototype.slice.call(switchesNodeList).forEach(function(switchEl) {
        if (!switchEl || switchEl.dataset.wpInitialized === 'true') return;
        switchEl.dataset.wpInitialized = 'true';
        var includeUnsupported = includeUnsupportedOption || switchEl.dataset.includeUnsupported === 'true';
        if (!includeUnsupported && !WonderPushSDK.isNativePushNotificationSupported()) {
          switchEl.innerHTML = (switchEl.dataset.unsupported || unsupported);
          return;
        }
        var hasTag = !!switchEl.dataset.tag;
        var hasProperty = !!switchEl.dataset.field && !!switchEl.dataset.value;
        if (hasTag && hasProperty) {
          WonderPushSDK.logWarn('In the presence of a tag data attribute, field and value data attributes are ignored for', switchEl);
        }
        if (!hasTag && !hasProperty) {
          WonderPushSDK.logWarn('Missing tag, or both field and value data attribute for', switchEl);
          return;
        }
        /*
          <div class="wp-tag-switch-wrapper">
            Push notifications:
            <label class="wp-tag-switch">
              <input id="wonderpush-tag-switch-input" type="checkbox" class="wp-tag-switch-input">
              <span class="wp-tag-switch-label" data-on="ON" data-off="OFF"></span>
              <span class="wp-tag-switch-handle"></span>
            </label>
          </div>
        */
        var switchClassPrefix = switchEl.dataset.classPrefix || classPrefix;
        switchEl.innerHTML = (switchEl.dataset.prepend || prepend) +
            '<div class="'+switchClassPrefix+'switch-wrapper"></div>' +
            (switchEl.dataset.append || append);
        var wrapper = switchEl.querySelector('.'+switchClassPrefix+'switch-wrapper');
        var sentenceSpan = document.createElement('SPAN');
        sentenceSpan.innerHTML = switchEl.dataset.sentence || sentence;
        var labelEl = document.createElement('LABEL');
        labelEl.classList.add(switchClassPrefix+'switch');
        labelEl.className += ' ' + (switchEl.dataset.class || cssClass);
        if (switchEl.dataset.colorOn  || colorOn ) labelEl.classList.add(switchClassPrefix+'switch-on-'  + (switchEl.dataset.colorOn  || colorOn ));
        if (switchEl.dataset.colorOff || colorOff) labelEl.classList.add(switchClassPrefix+'switch-off-' + (switchEl.dataset.colorOff || colorOff));
        var input = document.createElement('INPUT');
        input.id = switchEl.id + '-input';
        input.type = 'checkbox';
        input.classList.add(switchClassPrefix+'switch-input');
        labelEl.appendChild(input);
        var switchLabels = document.createElement('SPAN');
        switchLabels.classList.add(switchClassPrefix+'switch-label');
        switchLabels.dataset.on  = switchEl.dataset.label || switchEl.dataset.on  || label || on;
        switchLabels.dataset.off = switchEl.dataset.label || switchEl.dataset.off || label || off;
        labelEl.appendChild(switchLabels);
        var switchHandle= document.createElement('SPAN');
        switchHandle.classList.add(switchClassPrefix+'switch-handle');
        labelEl.appendChild(switchHandle);

        // Bind listeners
        input.addEventListener('click', onSwitchClicked);

        // Initialize switch state
        input.disabled = !WonderPushSDK.isNativePushNotificationSupported() && !includeUnsupported;
        if (hasTag) {
          input.checked = tags.indexOf(switchEl.dataset.tag) >= 0;
        } else {
          var values = ensureArray(custom[switchEl.dataset.field]);
          input.checked = values.indexOf(switchEl.dataset.value) >= 0;
        }

        wrapper.appendChild(sentenceSpan);
        wrapper.appendChild(labelEl);
      });
    });
  };

  // Respond to switch clicks by the user
  var onSwitchClicked = function(event) {
    var notifSwitch = event.target.closest('.' + switchElementClass);
    var newChecked = event.target.checked;
    if (newChecked && WonderPushSDK.isNativePushNotificationSupported()) {
      WonderPushSDK.subscribeToNotifications(event);
    }
    if (notifSwitch.dataset.tag) {
      if (newChecked) {
        WonderPush.addTag(notifSwitch.dataset.tag);
      } else {
        WonderPush.removeTag(notifSwitch.dataset.tag);
      }
    } else {
      if (newChecked) {
        WonderPush.addProperty(notifSwitch.dataset.field, notifSwitch.dataset.value);
      } else {
        WonderPush.removeProperty(notifSwitch.dataset.field, notifSwitch.dataset.value);
      }
    }
  };

  init();
});
