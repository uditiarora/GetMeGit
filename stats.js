// Dependencies
var username = "uditiarora";
const fetch = require("node-fetch");
var repoData;
function most_starred(){
  const LIMIT = 10;
      const sortProperty = 'stargazers_count';
      const mostStarredRepos = repo_data
          .filter(repo => !repo.fork)
          .sort((a, b) => b[sortProperty] - a[sortProperty])
          .slice(0, LIMIT);
      var resp = "";
      mostStarredRepos.forEach((repo => {
          if(repo[sortProperty] !== 0){
              resp += (repo.name + ": "+ repo[sortProperty]+"\n");
          }
      }));
      return resp;
}

fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
            .then(response => {
                if (response.status === 404) {
                return setError({ active: true, type: 404 });
                }
                if (response.status === 403) {
                return setError({ active: true, type: 403 });
                }
                return response.json();
            })
            .then(json => {
                repo_data = json;
                if(repo_data != null){
                    var resp = most_starred();
                    if(resp.localeCompare("") === 0){
                        console.log("no repo");
                    }
                    else{
                        resp = "Most starred repos with number of stars: \n" + resp;
                    }
                    console.log(resp);
                }
                else{
                  console.log(resp);
                }
            })
            .catch(error => {
                console.error('Error:', error);
        });