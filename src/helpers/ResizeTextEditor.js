
// Terminal Version - used to resize all of them on terminal resize

resizeTextEditor = () => {
    const term = document.getElementById('terminal')

    if(!term)
        return
    
    const termHeight = term.clientHeight

    const entirePageHeightMinusTabsAndTermHeight = document.querySelector("#root > section > section").clientHeight - 40 - termHeight

    const textEditors = document.getElementsByClassName('text-editor-wrappers')
    var i = 0;
    for(const textEditor of textEditors) {
        textEditor.setAttribute("style", "height: " + entirePageHeightMinusTabsAndTermHeight.toString() + "px; position: relative;")
    }
}


// Tabs version

resizeTextEditor = (activeTab) => {
    const term = document.getElementById('terminal')

    if(!term)
        return
    
    const termHeight = term.clientHeight

    const entirePageHeightMinusTabsAndTermHeight = document.querySelector("body").clientHeight - 40 - termHeight

    const textEditor = document.getElementsByClassName('text-editor-wrappers')[activeTab]

    textEditor.setAttribute("style", "height: " + entirePageHeightMinusTabsAndTermHeight.toString() + "px; position: relative;")
}


// App.js Version

resizeTextEditor = (termHeight) => {

    const term = document.getElementById('terminal')

    if(!term)
        return
    
    const termHeight = termHeight

    const entirePageHeightMinusTabsAndTermHeight = document.querySelector("body").clientHeight - 40 - termHeight

    const textEditors = document.getElementsByClassName('text-editor-wrappers')

    for(const textEditor of textEditors) {
        textEditor.setAttribute("style", "height: " + entirePageHeightMinusTabsAndTermHeight.toString() + "px;  position: relative;")
    }
  }