class APIFeatures {
    //query = Tour.find() is a query
    //queryString = Object parsed from req.query
  
    constructor(query, queryObj) {
      this.query = query;
      this.queryObj = queryObj;
    }
  
    filterQueryObj() {
      // directly assignment gives reference to same object
      //let queryObj = { ...req.query };
      let queryObj = { ...this.queryObj };
  
      let excludeObj = ["sort", "page", "limit", "fields"];
      excludeObj.forEach((el) => {
        delete queryObj[el];
      });
  
      let queryString = JSON.stringify(queryObj);
      //simple regex exp to replace gte/lt/lte etc with $gte/$lt etc
      queryString = queryString.replace(
        /\b(gte|gt|lt|lte)\b/g,
        (match) => `$${match}`
      );
  
      this.query = this.query.find(JSON.parse(queryString));
  
      return this; // causes chaining of methods;
    }
  
    sort() {
      let sortBy;
      if (this.queryObj.sort) {
        sortBy = this.queryObj.sort.split(",").join(" ");
      } else {
        //adding a default sort
        sortBy = "-createdAt";
      }
  
      this.query = this.query.sort(sortBy);
  
      return this; // for chaining
    }
  
    fieldLimiting() {
      //fields will be supplied by command, field=name,duration,price,ratings
      //need to do : query = query.select("name duration price ratings")
      //prameters are seperated by space
  
      if (this.queryObj.fields) {
        const fields = this.queryObj.fields.split(",").join(" "); //string
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select("-__v"); // excluding __v field from document
      }
  
      return this; // return this classs instance for chaining
    }
  
    pagination() {
      let page = this.queryObj.page * 1 || 1; // * 1 changes string to number
      let limit = this.queryObj.limit * 1 || 2;
      const skip = (page - 1) * limit;
      this.query =  this.query.skip(skip).limit(limit);
  
      return this;
    }
}

module.exports = APIFeatures;