let pagination = class Pagination {
  constructor(total, page, limit) {
  	this.total = total
  	this.page = page == 0 
  		? 1 
  		: page

		this.limit = limit
  	this.last_page =  parseInt((total/(page*limit)) - 1)
  	
  	this.last_page = this.last_page == 0  
  		? null
  		: this.last_page
		this.data = ''
  }
}

module.exports = pagination;