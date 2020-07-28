function safelyParseJSON (json) {
      var parsed

      try {
        parsed = JSON.parse(json)
      } catch (e) {
        // Oh well, but whatever...
      }

      return parsed // Could be undefined!
    }

    function doAlotOfStuff () {
      var json = safelyParseJSON(data)
}

function Animate(classname) {
    btt = document.getElementsByClassName(classname)[0].children[0].children[0]

    $( btt ).addClass( "onclic", 250, validate() );

  function validate() {
    setTimeout(function() {
      $( btt ).removeClass( "onclic" );
      $( btt ).addClass( "validate", 450, callback() );
    }, 0 );
  }
    function callback() {
      setTimeout(function() {
        $( btt ).removeClass( "validate" );
      }, 1250 );
    }
}

function hideNotificationDisplay() {
    //document.querySelector('.note').blur()
    document.querySelector('.note').style.cssText = "  display: block; position: absolute; left: -9999px;"
}

function showNotificationDisplay() {
    //document.querySelector('.note').focus({preventScroll:true})
    document.querySelector('.note').style.cssText = "  border: 1px solid lightgrey; position:fixed; width: 100%; z-index:100; top: 100px; margin-right: 0px; animation: appear 350ms ease-in 1; max-width: 400px; display: block;"
}
