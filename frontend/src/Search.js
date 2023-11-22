export default function Search(){
    return(
      <div className="search_text">
      <h3>Search for what to download here </h3>
        <div className="search-body">
          <form action="/search" className="search_form" role="search" method="POST">
          <input type="text"  aria-label="search" id="searchinput" name="searchTerm" placeholder="Search here ..." />
          </form>
          <button type="submit">Search</button>
        </div>
        </div>
    );
}

