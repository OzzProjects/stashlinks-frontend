document.addEventListener('DOMContentLoaded', function(){

    getData();


});

function getData(){
    fetch("/script")
    .then(res=>res.json())
    .then(function(response){
        //if (response.ok) {//} //   throw new Error('Request failed.');
        console.log('response: ', response.data);
        
    })
    .catch(function(error) {
        console.log(error);
    });

};


