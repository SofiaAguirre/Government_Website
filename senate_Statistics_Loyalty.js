var app = new Vue({
  el: '#app',
  data: {
    members: [],
    statistics: {
      percentageOfTotalVotesD: 0,
      percentageOfTotalVotesA: 0,
      numberOfPartyVotes: 0,
      totalPartyVotes: 0,
      pctD: 0,
      pctR: 0,
      pctI: 0,
      numberOfMembersD: 0,
      numberOfMembersR: 0,
      numberOfMembersI: 0,
      totalMembers : 0,
    },
    Democrats: [],
    Republicans: [],
    Independents: []
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

    app.Democrats.pctD = Math.round(sumaD / app.Democrats.numberOfMembersD);

    /*Pct Republicans*/
    var sumaR = 0;
    app.Republicans.numberOfPartyVotes = app.Republicans.map(pm);

    for (var i = 0; i < app.Republicans.numberOfPartyVotes.length; i++) {
      sumaR += app.Republicans.numberOfPartyVotes[i];
    }

    app.Republicans.pctR = Math.round(sumaR / app.Republicans.numberOfMembersR);

    /*Pct Independents*/
    var sumaI = 0;
    app.Independents.numberOfPartyVotes = app.Independents.map(pm);
    for (var i = 0; i < app.Independents.numberOfPartyVotes.length; i++) {
      sumaI += app.Independents.numberOfPartyVotes[i];
    }
    app.Independents.pctI = Math.round(sumaI / app.Independents.numberOfMembersI);


    /*Least loyal, Party Loyalty*/
    app.statistics.totalPartyVotes = app.members.map(fullData2);
    app.statistics.percentageOfTotalVotesA = app.members.sort(sortByValueAL);
    var removed2 = app.statistics.percentageOfTotalVotesA.splice(11);


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
    
    app.statistics.totalPartyVotes = app.members.map(fullData2);
    
    app.statistics.percentageOfTotalVotesD = app.members.sort(sortByValueDL);
    var removed2 = app.statistics.percentageOfTotalVotesD.splice(11);
    
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


function fullData2(member) {
  return member.totalPartyVotes = parseInt(
    ((member.total_votes - member.missed_votes) * member.votes_with_party_pct) /
    100
  );
}



function sortByValueDL(x, y) {
  return x.votes_with_party_pct == y.votes_with_party_pct ? 0 : x.votes_with_party_pct < y.votes_with_party_pct ? 1 : -1;
}

function sortByValueAL(x, y) {
  if (x.total_votes != 0 && y.total_votes != 0) {
    return x.votes_with_party_pct == y.votes_with_party_pct ? 0 : x.votes_with_party_pct > y.votes_with_party_pct ? 1 : -1;
  }
}