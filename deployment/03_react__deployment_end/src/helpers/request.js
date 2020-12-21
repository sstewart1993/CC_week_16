class Request {

  constructor(){
    this.base = "https://allyspirates.herokuapp.com"
  }

    get(url) {
      return fetch(this.base + url)
      .then((res) => res.json());
    }

    delete(url) {
      return fetch(this.base + url, {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'}
      })
    }

    post(url, payload){
      return fetch(this.base + url, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      })
    }

    patch(url, payload){
      return fetch(this.base + url, {
        method: "PATCH",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      })
    }

}

export default Request;
