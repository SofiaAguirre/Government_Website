var app = new Vue({
  el: '#app',
  data: {
    members: [],
    statistics: {
      percentageOfMissedVotesD: 0,
      percentageOfMissedVotesA: 0,
      numberOfPartyVotes: 0,
      pctD: 0,
      pctR: 0,
      pctI: 0,
      numberOfMembersD: 0,
      numberOfMembersR: 0,
      numberOfMembersI: 0,
      totalMembers: 0,
    },

    Democrats: [],
    Republicans: [],
    Independents: [],
  }
});

fetch("https://api.propublica.org/congress/v1/113/house/members.json", {
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
    app.Democrats = app.members.filter(filterDemocrats);
    app.Republicans = app.members.filter(filterRepublicans);
    app.Independents = app.members.filter(filterIndependents);

    app.Democrats.numberOfMembersD = app.Democrats.length;
    app.Republicans.numberOfMembersR = app.Republicans.length;
    app.Independents.numberOfMembersI = app.Independents.length;

    app.statistics.totalMembers = app.members.length;
    
    /*Pct Democrats*/
    
    app.Democrats.numberOfPartyVotes = app.Democrats.map(pm);
    var sumaD = 0;
    for (var i = 0; i < app.Democrats.numberOfPartyVotes.length; i++) {
    sumaD += app.Democrats.numberOfPartyVotes[i];
    }

    app.Democrats.pctD = Math.round( sumaD / app.Democrats.numberOfMembersD);

    /*Pct Republicans*/
   var sumaR = 0;
   app.Republicans.numberOfPartyVotes = app.Republicans.map(pm);
   
   for (var i = 0; i < app.Republicans.numberOfPartyVotes.length; i++) {
   sumaR += app.Republicans.numberOfPartyVotes[i];
   }

   app.Republicans.pctR = Math.round(sumaR / app.Republicans.numberOfMembersR);

    /*Pct Independents*/
    if (app.Independents.length != 0) { 
    var sumaI = 0;
   app.Independents.numberOfPartyVotes = app.Independents.map(pm);
   for (var i = 0; i < app.Independents.numberOfPartyVotes.length; i++) {
   sumaI += app.Independents.numberOfPartyVotes[i];
    }
   app.Independents.pctI = Math.round(sumaI / app.Independents.numberOfMembersI);
    }
    /*Members Who Least Often Vote with Their Party, Attendance*/

    /*Ordeno Array de mayor a menor*/
    app.statistics.percentageOfMissedVotesD = app.members.sort(sortByValueDm);
    //10%
    var tenPercent = (app.members.length / 100) * 10; // 10.5

    //Remove the useless info in the array
    var removed1 = app.statistics.percentageOfMissedVotesD.splice(11);
    
    
    
  });

  fetch("https://api.propublica.org/congress/v1/113/house/members.json", {
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
    app.statistics.percentageOfMissedVotesA = app.members.sort(sortByValueAm);
    var removed2 = app.statistics.percentageOfMissedVotesA.splice(11);
    
    
  })
  
function filterDemocrats(member) {
  return member.party == "D";
}

function filterRepublicans(member) {
  return member.party == "R";
}

function filterIndependents(member) {
  return member.party == "I";
}

function pm(member) {
  return member.votes_with_party_pct;
}


function sortByValueDm(x, y) {
  return x.missed_votes_pct == y.missed_votes_pct ? 0 : x.missed_votes_pct < y.missed_votes_pct ? 1 : -1;
}

function sortByValueAm(x, y) {
    
  return x.missed_votes_pct == y.missed_votes_pct ? 0 : x.missed_votes_pct > y.missed_votes_pct ? 1 : -1;
    
}

