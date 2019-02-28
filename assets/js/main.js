class GithubUser {
  constructor(name, repositories) {
    this.githubName = name;
    this._repos = repositories;
    this.id = "3a6a22eb32c03ecfd02b";
    this.secret = "6c1e72cc2af26bdab69798e0ce85f86fb00c3584";
    this.data = null;
    this.viewData = null;
    this._page = null;
    this._pages = null;
    this.updateInfo();
    this.addEventListeners();
  }
  addEventListeners() {
    const searchbutton = document.querySelector("#searchbutton");
    const searchfield = document.querySelector("#searchfield");
    const sortdropdown = document.querySelector("#sort");
    const filterfield = document.querySelector("#filterfield");
    const prev = document.querySelector("#prev");
    const next = document.querySelector("#next");
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
    sortdropdown.addEventListener("input", event => {
      const sortValue = event.target.value;
      switch (sortValue) {
        case "name-asc":
          this.sortItems("name", +1);
          break;
        case "name-desc":
          this.sortItems("name", -1);
          break;
        case "create-asc":
          this.sortItems("created_at", +1);
          break;
        case "create-desc":
          this.sortItems("created_at", -1);
          break;
        case "push-asc":
          this.sortItems("pushed_at", +1);
          break;
        case "push-desc":
          this.sortItems("pushed_at", -1);
          break;
        default:
          this.sortItems("name", +1);
      }
    });
    filterfield.addEventListener("input", event => {
      const filterValue = event.target.value;
      if (filterValue != "") {
        this.filterRepos(filterValue);
      } else {
        this.printRepos(this.data);
      }
    });
    prev.addEventListener("click", () => {
      if (this.page > 1) {
        this.page = this.page - 1;
        this.updateRepos();
      }
    });
    next.addEventListener("click", () => {
      if (this.page < this.pages) {
        this.page = this.page + 1;
        this.updateRepos();
      }
    });
  }
  filterRepos(filterValue) {
    const filtered = this.data.filter(repo => repo.name.includes(filterValue));
    this.printRepos(filtered);
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

  get page() {
    return this._page;
  }

  set page(newPage) {
    this._page = newPage;
  }

  get pages() {
    return this._pages;
  }

  set pages(numPages) {
    this._pages = numPages;
  }

  printRepos(repos) {
    const repoContainer = document.querySelector("#repos");
    const pageInfo = document.querySelector("#page-info");
    this.viewData = repos;
    let html = repos
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
      ${language != null ? `<li>main language: ${language}</li>` : ""}
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
    pageInfo.value = `page ${this.page} of ${this.pages}`;
  }
  printUserInfo(info) {
    const header = document.querySelector("h1");
    const image = document.querySelector("#user_avatar");
    const description = document.querySelector("#user_description");
    document.title = `${this.name} - Github Search`;
    const {
      name,
      login,
      bio,
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
    const insertName =
      name == null
        ? `<span class="sk-italic">no real name available</span>`
        : name;
    const insertBio =
      bio == null
        ? `<span class="sk-italic">no biography available</span>`
        : bio;
    const insertLocation =
      location == null
        ? `<span class="sk-italic">no location available</span>`
        : location;
    const insertCompany =
      company == null
        ? `<span class="sk-italic">no company available</span>`
        : company;
    this.repos = public_repos;
    const insertEmail =
      email == null
        ? `<span class="sk-italic">no email address available</span>`
        : `<a href="mailto:${email}">${email}</a>`;
    const insertBlog =
      blog == null
        ? `<span class="sk-italic">no website available</span>`
        : `<a href="${blog}" target=_blank>${blog}</a>`;
    const username = `${login}`;
    header.innerHTML = username;
    image.src = avatar_url;
    const html = `
      <div class="sk-desc-row">
        <div class="sk-bold sk-left-align">Real name:</div> <div class="sk-right-align">${insertName}</div>
        <div class="sk-bold sk-left-align">Biography:</div> <div class="sk-right-align">${insertBio}</div>
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
  sortItems(property, direction) {
    const mapped = this.data.map(function(repo, i) {
      return { index: i, value: repo[property] };
    });
    let nameA, nameB;
    mapped.sort((a, b) => {
      nameA = a.value.toLowerCase();
      nameB = b.value.toLowerCase();
      if (nameA < nameB) {
        return -1 * direction;
      } else if (nameB < nameA) {
        return 1 * direction;
      } else {
        return 0;
      }
    });
    const sortedRepos = mapped.map(el => this.data[el.index]);
    this.printRepos(sortedRepos);
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
    let currentRepos;
    if (this.page == null && numberRepos > 99) {
      currentRepos = 99;
      this.page = 1;
      this.pages = Math.ceil(numberRepos / 99);
    } else if (numberRepos > 99) {
      currentRepos = 99;
      this.pages = Math.ceil(numberRepos / 99);
    } else {
      currentRepos = numberRepos;
      this.page = 1;
      this.pages = 1;
    }
    const reposUrl = `https://api.github.com/users/${
      this.githubName
    }/repos?page=${this.page}&per_page=${currentRepos}&client_id=${
      this.id
    }&client_secret=${this.secret}`;
    fetch(reposUrl)
      .then(response => response.json())
      .then(repos => {
        this.data = repos;
        this.printRepos(repos);
      })
      .catch(error => console.log(`Oops, an error again: ${error}`));
  }
}

const user = new GithubUser("sklinkusch", null);
