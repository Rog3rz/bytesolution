var hbs = require('hbs');


hbs.registerHelper("metodoPago", function(dato){
    let a={}
    dato.forEach(element => {
        
        if(element.id==="oxxo" || element.id ==="paycash"){
            a[element.id] = element.name
        }
    });
    return a
})

module.exports = hbs