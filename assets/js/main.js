class GithubUser {
  constructor(name, repositories) {
    this.githubName = name;
    this._repos = repositories;
    this.id = "3a6a22eb32c03ecfd02b";
    this.secret = "6c1e72cc2af26bdab69798e0ce85f86fb00c3584";
    this.updateInfo();
    this.addEventListeners();
  }
  addEventListeners() {
    const searchbutton = document.querySelector("#searchbutton");
    const searchfield = document.querySelector("#searchfield");
    searchbutton.addEventListener("click", () => {
      const searchValue = searchfield.value;
      let user;
      if (searchValue == "") {
        user = "sklinkusch";
      } else {
        user = searchValue;
      }
      this.name = user;
      this.updateInfo();
    });
  }
  getDate(timestamp) {
    const dateStringArray = timestamp.substr(0, 10).split("-");
    const dateArray = dateStringArray.map(dateString => Number(dateString));
    let [year, month, day] = dateArray;
    month--;
    const date = new Date(year, month, day);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleString("en-US", options);
  }
  get name() {
    return this.githubName;
  }
  set name(newName) {
    this.githubName = newName;
  }
  printRepos(repos) {
    const repoContainer = document.querySelector("#repos");
    const html = repos
      .map(repo => {
        const {
          name,
          description,
          created_at,
          language,
          html_url,
          has_pages,
          pushed_at
        } = repo;
        let shortDescription;
        if (description != null) {
          shortDescription =
            description.length > 50
              ? `${description.substr(0, 50)}...`
              : description;
        } else {
          shortDescription = null;
        }
        const githubPages = `https://${this.name}.github.io/${name}`;
        return `
      <div class="col-md-4">
      <div class="card mb-4 shadow-sm">
      <h2>${name}</h2>
      <div class="card-body">
      <ul>
      ${shortDescription != null ? `<li>${shortDescription}</li>` : ""}
      <li>main language: ${language}</li>
      <li>created on ${this.getDate(created_at)}</li>
      <li>last push on ${this.getDate(pushed_at)}</li>
      <li>published on GitHub Pages: ${has_pages ? "yes" : "no"}</li>
      </ul>
      <div class="d-flex justify-content-between align-items-center">
      <div class="btn-group">
      <a href="${html_url}" target=_blank><button type="button" class="btn btn-sm btn-outline-secondary">repository</button></a>
      ${
        has_pages
          ? `<a href="${githubPages}" target=_blank><button type="button" class="btn btn-sm btn-outline-secondary">GitHub Pages</button></a>`
          : ""
      }
      </div>
      </div>
      </div>
      </div>
      </div>
      `;
      })
      .join("");
    repoContainer.innerHTML = html;
  }
  printUserInfo(info) {
    const header = document.querySelector("h1");
    const image = document.querySelector("#user_avatar");
    const description = document.querySelector("#user_description");
    const {
      name,
      login,
      avatar_url,
      company,
      location,
      email,
      public_repos,
      followers,
      following,
      public_gists,
      blog,
      created_at,
      html_url
    } = info;
    const insertName = name == null ? "" : name;
    const insertLocation = location == null ? "" : location;
    const insertCompany = company == null ? "" : company;
    this.repos = public_repos;
    const insertEmail =
      email == null
        ? "no email address provided"
        : `<a href="mailto:${email}">${email}</a>`;
    const insertBlog =
      blog == null
        ? "no website provided"
        : `<a href="${blog}" target=_blank>${blog}</a>`;
    const username = `${login}`;
    header.innerHTML = username;
    image.src = avatar_url;
    const html = `
      <div class="sk-desc-row">
        <div class="sk-bold sk-left-align">Real name:</div> <div class="sk-right-align">${insertName}</div>
        <div class="sk-bold sk-left-align">Location:</div> <div class="sk-right-align">${insertLocation}</div>
        <div class="sk-bold sk-left-align">Organization:</div> <div class="sk-right-align">${insertCompany}</div>
        <div class="sk-bold sk-left-align">Email:</div> <div class="sk-right-align">${insertEmail}</div>
        <div class="sk-bold sk-left-align">Number of public repositories:</div> <div class="sk-right-align">${public_repos}</div>
        <div class="sk-bold sk-left-align">Number of gists:</div> <div class="sk-right-align">${public_gists}</div>
        <div class="sk-bold sk-left-align">Followers:</div> <div class="sk-right-align">${followers}</div>
        <div class="sk-bold sk-left-align">Following:</div> <div class="sk-right-align">${following}</div>
        <div class="sk-bold sk-left-align">Created at:</div> <div class="sk-right-align">${this.getDate(
          created_at
        )}</div>
        <div class="sk-bold sk-left-align">Website:</div> <div class="sk-right-align">${insertBlog}</div>
        <div class="sk-bold sk-left-align">GitHub:</div> <div class="sk-right-align"><a href="${html_url}" target=_blank>${html_url}</a></div>
    </div>
          `;
    description.innerHTML = html;
    this.updateRepos();
  }
  get repos() {
    return this._repos;
  }
  set repos(value) {
    this._repos = value;
  }
  updateInfo() {
    const url = `https://api.github.com/users/${this.name}?client_id=${
      this.id
    }&client_secret=${this.secret}`;
    fetch(url)
      .then(response => response.json())
      .then(userinfo => this.printUserInfo(userinfo))
      .catch(error => console.log(`Oops, an error: ${error}`));
  }
  updateRepos() {
    const numberRepos = this.repos;
    const reposUrl = `https://api.github.com/users/${
      this.githubName
    }/repos?per_page=${numberRepos}&client_id=${this.id}&client_secret=${
      this.secret
    }`;
    fetch(reposUrl)
      .then(response => response.json())
      .then(repos => this.printRepos(repos))
      .catch(error => console.log(`Oops, an error again: ${error}`));
  }
}

const user = new GithubUser("sklinkusch", null);
