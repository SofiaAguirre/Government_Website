var app = new Vue({
    el: '#app',
    data: { 
        members: [],
        statistics: {
        
    },
  }
});

fetch("https://api.propublica.org/congress/v1/113/senate/members.json", {
        method: "GET",
        headers: new Headers({
            "X-API-Key": "k7kbJUh781C1GBn15StFETE1rkl361X08G3srXrI"
        })
    })
    .then(function (response) {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
    })
    .then(function (json) {
        console.log(json);
        app.members = json.results[0].members;

    });


