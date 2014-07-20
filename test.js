jspp.Script('test', function(element){
        element.toggle = !element.toggle;
        element.innerHTML = (element.toggle) ? "test worked!" : "Click me!";
        stylize('test' + ((element.toggle) ? 1 : 0));
    })
    .Script('closing', function(){
        return "Posted on " + (new Date()).toDateString();
    })
    .Script('external', 'usethis.js')
    .Event('click', '#test', function(e){
        include('test')(e.target);
        console.log(include('external').test);
    })
    .Style('test0', '#test', {
        apply: true,
        height: '100px',
        width: '100px',
        background: 'black',
        color: 'white',
        textAlign: 'center',
        border: '1px solid white'
    })
    .Style('test1','#test', {
        background: 'white',
        color: 'black',
        border: '1px solid black'
    })
    .Style('.content',{
        display: 'inline-block',
        background: 'lightgreen',
        border: '2px solid green',
        borderRadius: '5px'
    })
    .Style('.inner',{
        color: 'white',
        textAlign: 'center'
    })
    .Element('content','HTML:test.html', function(el, attr, inner){
        return {
            close: define('closing'),
            content: inner
        };
    })
    .Element('inner','HTML:inner.html', function(el, attr, inner){
        return {
            content: inner,
            date: (new Date()).toDateString()
        };
    });